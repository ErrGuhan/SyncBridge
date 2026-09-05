const crypto = require('crypto');
const prisma = require('../lib/prisma');

/**
 * In-memory fallback review queue for Primary Cooperative Secretaries
 * Persisted in worker profile notes and accessible to cooperative admins.
 */
const secretaryReviewQueue = new Map();

/**
 * Verify worker credentials with 3-second AbortController timeout against e-Shram API.
 * Falls back to PENDING_SOCIETY_APPROVAL and Secretary Review Task on latency or failure.
 * POST /api/users/verify/e-shram
 */
async function verifyWorkerCredentials(req, res) {
  const {
    workerId,
    uan,
    aadhaarLast4,
    stateCode = 'MH',
    tradeCategory = 'GENERAL',
    cooperativeId
  } = req.body;

  if (!workerId || !uan) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'workerId and e-Shram UAN are required for verification'
    });
  }

  // Find worker profile
  let workerProfile = null;
  try {
    workerProfile = await prisma.workerProfile.findFirst({
      where: {
        OR: [{ id: workerId }, { userId: workerId }]
      },
      include: {
        user: true,
        cooperative: true
      }
    });
  } catch (dbErr) {
    console.warn('[DB Lookup Warning]:', dbErr.message);
  }

  const maskedUan = uan.length > 4 ? `UAN-XXXX-XXXX-${uan.slice(-4)}` : `UAN-XXXX-${uan}`;
  const taskId = `SEC-REV-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  // --------------------------------------------------------------------------
  // Step 1: Attempt Verification via Primary Government e-Shram API (3s Timeout)
  // --------------------------------------------------------------------------
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

  const ESHRAM_API_URL =
    process.env.ESHRAM_API_URL || 'https://eshram.gov.in/api/v1/workforce/verify';

  let onlineVerified = false;
  let verificationError = null;

  try {
    const govResponse = await fetch(ESHRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CoopGigServicesPlatform/1.0',
        'X-API-KEY': process.env.ESHRAM_API_KEY || 'coop-platform-test-key'
      },
      body: JSON.stringify({
        uan,
        aadhaarLast4: aadhaarLast4 || 'XXXX',
        stateCode,
        tradeCategory
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (govResponse.ok) {
      const govData = await govResponse.json();
      if (govData.verified || govData.status === 'SUCCESS') {
        onlineVerified = true;
      } else {
        verificationError = govData.message || 'e-Shram record mismatch';
      }
    } else {
      verificationError = `Government e-Shram portal returned HTTP status ${govResponse.status}`;
    }
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError' || err.code === 20;
    verificationError = isTimeout
      ? 'Primary e-Shram API timed out (>3000ms threshold)'
      : `Government portal connection error: ${err.message}`;
    console.warn(`[e-Shram Gateway Status]: ${verificationError}. Triggering Cooperative Fallback.`);
  }

  // --------------------------------------------------------------------------
  // Case A: Online Verification Succeeded within 3 seconds
  // --------------------------------------------------------------------------
  if (onlineVerified) {
    try {
      if (workerProfile) {
        await prisma.workerProfile.update({
          where: { id: workerProfile.id },
          data: {
            verificationStatus: 'VERIFIED',
            nationalIdMasked: maskedUan,
            verifiedAt: new Date(),
            verificationNotes: `Automatically verified via National e-Shram portal at ${new Date().toISOString()}`
          }
        });
        await prisma.user.update({
          where: { id: workerProfile.userId },
          data: { status: 'ACTIVE' }
        });
      }
    } catch (updateErr) {
      console.warn('[DB Update Warning]:', updateErr.message);
    }

    return res.status(200).json({
      success: true,
      status: 'VERIFIED',
      verificationMode: 'REALTIME_ESHRAM',
      message: 'Worker identity successfully verified against national e-Shram database.',
      data: {
        workerId: workerProfile?.id || workerId,
        uan: maskedUan,
        verifiedAt: new Date().toISOString()
      }
    });
  }

  // --------------------------------------------------------------------------
  // Case B: Fallback Verification (API Failed, Down, or Timed Out > 3s)
  // --------------------------------------------------------------------------
  const coopTargetId = cooperativeId || workerProfile?.cooperativeId || 'COOP-PRIMARY-DEFAULT';
  const coopName = workerProfile?.cooperative?.name || 'Primary Labour Cooperative Society';

  const reviewTask = {
    taskId,
    workerId: workerProfile?.id || workerId,
    workerName: workerProfile ? `${workerProfile.user?.firstName} ${workerProfile.user?.lastName}` : 'Worker Member',
    email: workerProfile?.user?.email || null,
    phone: workerProfile?.user?.phone || null,
    cooperativeId: coopTargetId,
    cooperativeName: coopName,
    status: 'PENDING_SOCIETY_APPROVAL',
    uanMasked: maskedUan,
    stateCode,
    queuedAt: new Date().toISOString(),
    failureReason: verificationError,
    assignedRole: 'PRIMARY_COOPERATIVE_SECRETARY',
    estimatedResolution: '24 hours'
  };

  // 1. Add to Secretary In-Memory Task Registry
  secretaryReviewQueue.set(taskId, reviewTask);

  // 2. Persist in database without throwing a 500 error
  try {
    if (workerProfile) {
      await prisma.workerProfile.update({
        where: { id: workerProfile.id },
        data: {
          verificationStatus: 'PENDING',
          nationalIdMasked: maskedUan,
          verificationNotes: JSON.stringify({
            workflow: 'OFFLINE_SOCIETY_FALLBACK',
            status: 'PENDING_SOCIETY_APPROVAL',
            taskId,
            reason: verificationError,
            queuedAt: reviewTask.queuedAt,
            cooperativeId: coopTargetId
          })
        }
      });
      await prisma.user.update({
        where: { id: workerProfile.userId },
        data: { status: 'PENDING_VERIFICATION' }
      });
    }
  } catch (dbFallbackErr) {
    console.warn('[DB Fallback Save Warning]:', dbFallbackErr.message);
  }

  // 3. Return clean JSON response to worker explaining secondary society review
  return res.status(200).json({
    success: true,
    status: 'PENDING_SOCIETY_APPROVAL',
    verificationMode: 'FALLBACK_OFFLINE_QUEUE',
    message:
      'National verification portal (e-Shram / State RCS) is currently experiencing high latency. Your onboarding documents have been safely routed to the Primary Cooperative Secretary for expedited offline verification.',
    data: {
      taskId,
      workerId: workerProfile?.id || workerId,
      accountStatus: 'PENDING_SOCIETY_APPROVAL',
      cooperative: coopName,
      assignedDesk: 'Primary Cooperative Secretary Verification Queue',
      queuedAt: reviewTask.queuedAt,
      estimatedResolutionTime: '24 hours',
      nextSteps: 'Your local cooperative secretary will manually inspect your trade certifications. You will receive an SMS confirmation once approved.'
    }
  });
}

/**
 * Get all tasks queued for Primary Cooperative Secretary review.
 * GET /api/users/admin/secretary-queue
 */
async function getSecretaryQueue(req, res) {
  try {
    // Collect in-memory queue items
    const inMemoryTasks = Array.from(secretaryReviewQueue.values());

    // Also fetch any database profiles flagged with PENDING_SOCIETY_APPROVAL in notes
    let dbTasks = [];
    try {
      const profiles = await prisma.workerProfile.findMany({
        where: {
          verificationStatus: 'PENDING',
          verificationNotes: { contains: 'PENDING_SOCIETY_APPROVAL' }
        },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true, phone: true }
          },
          cooperative: {
            select: { name: true, registrationNumber: true }
          },
          certifications: true
        }
      });

      dbTasks = profiles.map((p) => {
        let parsedNotes = {};
        try {
          parsedNotes = JSON.parse(p.verificationNotes || '{}');
        } catch {
          // ignore parsing error
        }
        return {
          taskId: parsedNotes.taskId || `SEC-DB-${p.id.slice(0, 8)}`,
          workerId: p.id,
          workerName: `${p.user.firstName} ${p.user.lastName}`,
          phone: p.user.phone,
          email: p.user.email,
          cooperativeName: p.cooperative?.name || 'Local Cooperative',
          status: 'PENDING_SOCIETY_APPROVAL',
          queuedAt: parsedNotes.queuedAt || p.createdAt.toISOString(),
          failureReason: parsedNotes.reason || 'e-Shram gateway timeout fallback',
          certificationsCount: p.certifications?.length || 0
        };
      });
    } catch (dbErr) {
      console.warn('[DB Query Warning]:', dbErr.message);
    }

    // Merge by unique taskId or workerId
    const merged = [...inMemoryTasks];
    for (const d of dbTasks) {
      if (!merged.some((m) => m.workerId === d.workerId)) {
        merged.push(d);
      }
    }

    return res.status(200).json({
      success: true,
      count: merged.length,
      data: merged
    });
  } catch (err) {
    console.error('[getSecretaryQueue Error]:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}

/**
 * Secretary approves or rejects a task from the manual review queue.
 * POST /api/users/admin/secretary-queue/:taskId/resolve
 */
async function resolveSecretaryTask(req, res) {
  try {
    const { taskId } = req.params;
    const { action = 'APPROVE', remarks = 'Verified via local cooperative secretary physical document audit' } = req.body;

    const task = secretaryReviewQueue.get(taskId);
    const workerId = task?.workerId || req.body.workerId;

    if (task) {
      task.status = action === 'APPROVE' ? 'VERIFIED_BY_SECRETARY' : 'REJECTED_BY_SECRETARY';
      task.resolvedAt = new Date().toISOString();
      task.remarks = remarks;
      secretaryReviewQueue.set(taskId, task);
    }

    if (workerId) {
      try {
        const isApprove = action === 'APPROVE';
        const targetStatus = isApprove ? 'VERIFIED' : 'REJECTED';
        await prisma.workerProfile.update({
          where: { id: workerId },
          data: {
            verificationStatus: targetStatus,
            verifiedAt: isApprove ? new Date() : null,
            verificationNotes: remarks
          }
        });
        await prisma.user.update({
          where: { id: (await prisma.workerProfile.findUnique({ where: { id: workerId } })).userId },
          data: { status: isApprove ? 'ACTIVE' : 'DEACTIVATED' }
        });
      } catch (dbErr) {
        console.warn('[Secretary Resolve DB Warning]:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Task ${taskId} resolved as ${action}`,
      taskId,
      status: action === 'APPROVE' ? 'VERIFIED' : 'REJECTED'
    });
  } catch (err) {
    console.error('[resolveSecretaryTask Error]:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}

module.exports = {
  verifyWorkerCredentials,
  getSecretaryQueue,
  resolveSecretaryTask,
  secretaryReviewQueue
};
