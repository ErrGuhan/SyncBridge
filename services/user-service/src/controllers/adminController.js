const prisma = require('../lib/prisma');

/**
 * Approve or Reject a Worker Profile by Cooperative Admin.
 * PATCH /api/users/admin/workers/:id/verify
 */
async function verifyWorkerProfile(req, res) {
  try {
    const { id } = req.params; // workerProfileId
    const {
      status, // 'VERIFIED' | 'REJECTED' | 'SUSPENDED'
      verificationNotes,
      backgroundChecked
    } = req.body;

    const allowedStatuses = ['VERIFIED', 'REJECTED', 'SUSPENDED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Status must be one of: [${allowedStatuses.join(', ')}]`
      });
    }

    const workerProfile = await prisma.workerProfile.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!workerProfile) {
      return res.status(404).json({ error: 'Not Found', message: 'Worker profile not found' });
    }

    // Atomic update of WorkerProfile and parent User account status
    const updated = await prisma.$transaction(async (tx) => {
      const updatedProfile = await tx.workerProfile.update({
        where: { id },
        data: {
          verificationStatus: status,
          verificationNotes: verificationNotes || null,
          verifiedAt: status === 'VERIFIED' ? new Date() : null,
          backgroundChecked: backgroundChecked !== undefined ? Boolean(backgroundChecked) : workerProfile.backgroundChecked,
          backgroundCheckedAt: backgroundChecked ? new Date() : workerProfile.backgroundCheckedAt
        }
      });

      // Synchronize base user account status
      await tx.user.update({
        where: { id: workerProfile.userId },
        data: {
          status: status === 'VERIFIED' ? 'ACTIVE' : (status === 'REJECTED' ? 'DEACTIVATED' : 'SUSPENDED')
        }
      });

      return updatedProfile;
    });

    return res.status(200).json({
      success: true,
      message: `Worker profile status successfully updated to ${status}`,
      data: updated
    });
  } catch (error) {
    console.error('[verifyWorkerProfile Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

/**
 * List all workers pending verification.
 * GET /api/users/admin/workers/pending
 */
async function getPendingWorkers(req, res) {
  try {
    const pendingWorkers = await prisma.workerProfile.findMany({
      where: { verificationStatus: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            createdAt: true
          }
        },
        certifications: true,
        services: {
          include: {
            serviceCategory: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return res.status(200).json({
      success: true,
      count: pendingWorkers.length,
      data: pendingWorkers
    });
  } catch (error) {
    console.error('[getPendingWorkers Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

module.exports = {
  verifyWorkerProfile,
  getPendingWorkers
};
