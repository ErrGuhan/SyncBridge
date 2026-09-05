const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

/**
 * Register a new Worker-Member with skills, initial certifications, and geo-coordinates.
 * POST /api/users/register/worker
 */
async function registerWorker(req, res) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      bio,
      hourlyRate,
      experienceYears,
      latitude,
      longitude,
      serviceRadiusKm,
      serviceCity,
      servicePostalCode,
      serviceCategoryIds = [], // Array of category UUIDs
      certifications = [],     // Array of { title, issuingAuthority, licenseNumber, documentUrl, issueDate, expiryDate }
      cooperativeId
    } = req.body;

    // Check duplicate
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          ...(phone ? [{ phone }] : [])
        ]
      }
    });

    if (existing) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'An account with this email or phone number already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Atomic creation of User, WorkerProfile, Skills, Certifications, and Worker Wallet
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Base User
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          firstName,
          lastName,
          phone,
          role: 'WORKER',
          status: 'PENDING_VERIFICATION',
          isCoopMember: true,
          cooperativeId: cooperativeId || null
        }
      });

      // 2. Create Worker Profile
      const workerProfile = await tx.workerProfile.create({
        data: {
          userId: user.id,
          cooperativeId: cooperativeId || null,
          verificationStatus: 'PENDING',
          bio: bio || null,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
          experienceYears: experienceYears ? parseInt(experienceYears, 10) : 0,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          serviceRadiusKm: serviceRadiusKm ? parseFloat(serviceRadiusKm) : 15.0,
          serviceCity: serviceCity || null,
          servicePostalCode: servicePostalCode || null,
          isAvailable: true
        }
      });

      // 3. Link Service Categories (Skills)
      if (serviceCategoryIds.length > 0) {
        const workerServicesData = serviceCategoryIds.map((catId) => ({
          workerProfileId: workerProfile.id,
          serviceCategoryId: catId,
          isActive: true
        }));
        await tx.workerService.createMany({
          data: workerServicesData
        });
      }

      // 4. Attach Skill Certifications
      if (certifications.length > 0) {
        const certData = certifications.map((cert) => ({
          workerProfileId: workerProfile.id,
          title: cert.title,
          issuingAuthority: cert.issuingAuthority,
          licenseNumber: cert.licenseNumber || null,
          documentUrl: cert.documentUrl || null,
          issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
          verificationStatus: 'PENDING'
        }));
        await tx.certification.createMany({
          data: certData
        });
      }

      // 5. Initialize Worker Digital Wallet
      await tx.wallet.create({
        data: {
          userId: user.id,
          cooperativeId: cooperativeId || null,
          type: 'WORKER_WALLET',
          balance: 0.00,
          currency: 'INR'
        }
      });

      return { user, workerProfile };
    });

    return res.status(201).json({
      success: true,
      message: 'Worker registered successfully. Profile is pending cooperative admin verification.',
      data: {
        userId: result.user.id,
        workerProfileId: result.workerProfile.id,
        email: result.user.email,
        verificationStatus: result.workerProfile.verificationStatus,
        isAvailable: result.workerProfile.isAvailable
      }
    });
  } catch (error) {
    console.error('[registerWorker Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

/**
 * Update Worker Live Availability & Coordinates.
 * PATCH /api/users/workers/me/status
 */
async function updateWorkerStatus(req, res) {
  try {
    const userId = req.user.id;
    const { isAvailable, latitude, longitude, serviceRadiusKm } = req.body;

    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId }
    });

    if (!workerProfile) {
      return res.status(404).json({ error: 'Not Found', message: 'Worker profile not found for current user' });
    }

    const updateData = {};
    if (typeof isAvailable === 'boolean') updateData.isAvailable = isAvailable;
    if (latitude !== undefined) updateData.latitude = parseFloat(latitude);
    if (longitude !== undefined) updateData.longitude = parseFloat(longitude);
    if (serviceRadiusKm !== undefined) updateData.serviceRadiusKm = parseFloat(serviceRadiusKm);

    const updated = await prisma.workerProfile.update({
      where: { id: workerProfile.id },
      data: updateData,
      select: {
        id: true,
        isAvailable: true,
        latitude: true,
        longitude: true,
        serviceRadiusKm: true,
        updatedAt: true
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Worker availability and location updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('[updateWorkerStatus Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

/**
 * Worker uploads/adds a new skill certification.
 * POST /api/users/workers/me/certifications
 */
async function addCertification(req, res) {
  try {
    const userId = req.user.id;
    const { title, issuingAuthority, licenseNumber, documentUrl, issueDate, expiryDate } = req.body;

    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId }
    });

    if (!workerProfile) {
      return res.status(404).json({ error: 'Not Found', message: 'Worker profile not found' });
    }

    const certification = await prisma.certification.create({
      data: {
        workerProfileId: workerProfile.id,
        title,
        issuingAuthority,
        licenseNumber: licenseNumber || null,
        documentUrl: documentUrl || null,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        verificationStatus: 'PENDING'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Certification submitted for cooperative verification',
      data: certification
    });
  } catch (error) {
    console.error('[addCertification Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

/**
 * Get Worker profile details.
 * GET /api/users/workers/me
 */
async function getWorkerProfile(req, res) {
  try {
    const userId = req.user.id;

    const profile = await prisma.workerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatarUrl: true,
            status: true
          }
        },
        services: {
          include: {
            serviceCategory: {
              select: { id: true, name: true, slug: true }
            }
          }
        },
        certifications: true
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Not Found', message: 'Worker profile not found' });
    }

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('[getWorkerProfile Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

module.exports = {
  registerWorker,
  updateWorkerStatus,
  addCertification,
  getWorkerProfile
};
