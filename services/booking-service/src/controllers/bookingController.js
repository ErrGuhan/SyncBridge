const prisma = require('../lib/prisma');

/**
 * Generate human-readable booking reference (e.g. BKG-20260905-4819)
 */
function generateBookingNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `BKG-${dateStr}-${randomSuffix}`;
}

/**
 * Create a new service booking request from a Customer.
 * POST /api/bookings
 */
async function createBooking(req, res) {
  try {
    const customerId = req.user.id;
    const {
      workerId, // Optional: direct worker selection or match from nearby search
      serviceCategoryId,
      scheduledDate,
      estimatedDurationHours,
      serviceAddressLine1,
      serviceAddressLine2,
      serviceCity,
      servicePostalCode,
      serviceLatitude,
      serviceLongitude,
      locationInstructions,
      totalAmount,
      currency = 'INR'
    } = req.body;

    if (!serviceCategoryId || !scheduledDate || !serviceAddressLine1 || !serviceLatitude || !serviceLongitude || !totalAmount) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required booking parameters (serviceCategoryId, scheduledDate, serviceAddressLine1, coordinates, totalAmount)'
      });
    }

    // Verify service category exists
    const category = await prisma.serviceCategory.findUnique({
      where: { id: serviceCategoryId }
    });

    if (!category) {
      return res.status(404).json({ error: 'Not Found', message: 'Service category not found' });
    }

    let assignedWorkerId = workerId;

    // If no direct worker specified, automatically assign the closest available verified worker
    if (!assignedWorkerId) {
      const targetLat = parseFloat(serviceLatitude);
      const targetLng = parseFloat(serviceLongitude);

      const nearbyWorkers = await prisma.$queryRaw`
        SELECT 
          wp.id,
          (
            6371 * acos(
              least(1.0, greatest(-1.0, 
                cos(radians(${targetLat})) * cos(radians(wp.latitude)) * 
                cos(radians(wp.longitude) - radians(${targetLng})) + 
                sin(radians(${targetLat})) * sin(radians(wp.latitude))
              ))
            )
          ) AS distance_km
        FROM "WorkerProfile" wp
        JOIN "WorkerService" ws ON ws."workerProfileId" = wp.id
        WHERE 
          ws."serviceCategoryId" = ${serviceCategoryId}
          AND ws."isActive" = true
          AND wp."isAvailable" = true
          AND wp."verificationStatus" = 'VERIFIED'
          AND wp.latitude IS NOT NULL 
          AND wp.longitude IS NOT NULL
        ORDER BY distance_km ASC
        LIMIT 1;
      `;

      if (nearbyWorkers.length === 0) {
        return res.status(404).json({
          error: 'No Workers Available',
          message: 'No available verified workers found for this service category in your area'
        });
      }

      assignedWorkerId = nearbyWorkers[0].id;
    }

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        customerId,
        workerId: assignedWorkerId,
        serviceCategoryId,
        status: 'PENDING',
        scheduledDate: new Date(scheduledDate),
        estimatedDurationHours: estimatedDurationHours ? parseFloat(estimatedDurationHours) : 1.0,
        serviceAddressLine1,
        serviceAddressLine2: serviceAddressLine2 || null,
        serviceCity: serviceCity || 'Local',
        servicePostalCode: servicePostalCode || '000000',
        serviceLatitude: parseFloat(serviceLatitude),
        serviceLongitude: parseFloat(serviceLongitude),
        locationInstructions: locationInstructions || null,
        totalAmount: parseFloat(totalAmount),
        currency
      },
      include: {
        customer: {
          select: { firstName: true, lastName: true, phone: true }
        },
        worker: {
          include: {
            user: { select: { firstName: true, lastName: true, phone: true } }
          }
        },
        serviceCategory: {
          select: { name: true }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      data: booking
    });
  } catch (error) {
    console.error('[createBooking Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

/**
 * Fetch available workers matching a ServiceCategory within a 10km radius.
 * GET /api/bookings/workers/nearby?categoryId=...&lat=...&lng=...&radiusKm=10
 */
async function getNearbyWorkers(req, res) {
  try {
    const { categoryId, lat, lng, radiusKm = 10.0 } = req.query;

    if (!categoryId || !lat || !lng) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'categoryId, lat (latitude), and lng (longitude) are required query parameters'
      });
    }

    const targetLat = parseFloat(lat);
    const targetLng = parseFloat(lng);
    const searchRadius = parseFloat(radiusKm);

    /**
     * Haversine Great-Circle Distance Formula:
     * d = 2R * asin(sqrt(sin^2(Δlat/2) + cos(lat1)*cos(lat2)*sin^2(Δlng/2)))
     * Represented compactly with spherical law of cosines:
     * 6371 * acos(cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lng2) - radians(lng1)) + sin(radians(lat1)) * sin(radians(lat2)))
     * Clamped between -1 and 1 via LEAST(1.0, GREATEST(-1.0, ...)) to prevent NaN from floating-point inaccuracies.
     */
    const workers = await prisma.$queryRaw`
      SELECT 
        wp.id AS "workerProfileId",
        wp."userId",
        u."firstName",
        u."lastName",
        u."avatarUrl",
        u."phone",
        wp."hourlyRate",
        wp."averageRating",
        wp."totalReviews",
        wp."completedJobsCount",
        wp."serviceRadiusKm",
        wp.latitude,
        wp.longitude,
        sc.name AS "categoryName",
        ROUND(
          CAST(
            6371 * acos(
              LEAST(1.0, GREATEST(-1.0, 
                cos(radians(${targetLat})) * cos(radians(wp.latitude)) * 
                cos(radians(wp.longitude) - radians(${targetLng})) + 
                sin(radians(${targetLat})) * sin(radians(wp.latitude))
              ))
            ) AS NUMERIC
          ), 2
        ) AS distance_km
      FROM "WorkerProfile" wp
      JOIN "User" u ON wp."userId" = u.id
      JOIN "WorkerService" ws ON ws."workerProfileId" = wp.id
      JOIN "ServiceCategory" sc ON ws."serviceCategoryId" = sc.id
      WHERE 
        ws."serviceCategoryId" = ${categoryId}
        AND ws."isActive" = true
        AND wp."isAvailable" = true
        AND wp."verificationStatus" = 'VERIFIED'
        AND wp.latitude IS NOT NULL 
        AND wp.longitude IS NOT NULL
        AND (
          6371 * acos(
            LEAST(1.0, GREATEST(-1.0, 
              cos(radians(${targetLat})) * cos(radians(wp.latitude)) * 
              cos(radians(wp.longitude) - radians(${targetLng})) + 
              sin(radians(${targetLat})) * sin(radians(wp.latitude))
            ))
          )
        ) <= ${searchRadius}
      ORDER BY distance_km ASC;
    `;

    return res.status(200).json({
      success: true,
      count: workers.length,
      searchParameters: {
        categoryId,
        latitude: targetLat,
        longitude: targetLng,
        radiusKm: searchRadius
      },
      data: workers
    });
  } catch (error) {
    console.error('[getNearbyWorkers Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

/**
 * Worker Accepts or Declines a Booking.
 * PATCH /api/bookings/:id/accept
 * PATCH /api/bookings/:id/decline
 */
async function respondToBooking(req, res) {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'ACCEPT' or 'DECLINE'
    const workerUserId = req.user.id;

    // Find worker profile
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId: workerUserId }
    });

    if (!workerProfile) {
      return res.status(403).json({ error: 'Forbidden', message: 'Only registered workers can accept or decline bookings' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Not Found', message: 'Booking not found' });
    }

    if (booking.workerId !== workerProfile.id) {
      return res.status(403).json({ error: 'Forbidden', message: 'You are not assigned to this booking' });
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({
        error: 'Invalid Action',
        message: `Booking cannot be responded to because current status is ${booking.status}`
      });
    }

    const newStatus = action === 'ACCEPT' ? 'CONFIRMED' : 'CANCELLED';
    const cancellationReason = action === 'DECLINE' ? 'Declined by worker' : null;

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: newStatus,
        cancellationReason: cancellationReason,
        cancelledAt: action === 'DECLINE' ? new Date() : null
      }
    });

    return res.status(200).json({
      success: true,
      message: `Booking has been ${action === 'ACCEPT' ? 'accepted and confirmed' : 'declined'}`,
      data: updated
    });
  } catch (error) {
    console.error('[respondToBooking Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

/**
 * Update Booking Lifecycle Status (Pending -> Confirmed -> In Progress -> Completed).
 * PATCH /api/bookings/:id/status
 */
async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    const validTransitions = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'DISPUTED'],
      COMPLETED: [],
      CANCELLED: [],
      DISPUTED: ['COMPLETED', 'CANCELLED']
    };

    const currentBooking = await prisma.booking.findUnique({
      where: { id },
      include: { worker: true }
    });

    if (!currentBooking) {
      return res.status(404).json({ error: 'Not Found', message: 'Booking not found' });
    }

    const allowedNext = validTransitions[currentBooking.status] || [];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        error: 'Invalid Status Transition',
        message: `Cannot transition booking from ${currentBooking.status} to ${status}. Allowed: [${allowedNext.join(', ')}]`
      });
    }

    const updateData = { status };

    if (status === 'IN_PROGRESS') {
      updateData.startedAt = new Date();
    } else if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    } else if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
      updateData.cancellationReason = cancellationReason || 'Cancelled by participant';
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.booking.update({
        where: { id },
        data: updateData
      });

      // Increment completed jobs count on worker profile
      if (status === 'COMPLETED') {
        await tx.workerProfile.update({
          where: { id: currentBooking.workerId },
          data: {
            completedJobsCount: { increment: 1 }
          }
        });
      }

      return result;
    });

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    console.error('[updateBookingStatus Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

/**
 * Get Booking Details by ID
 * GET /api/bookings/:id
 */
async function getBookingById(req, res) {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
        worker: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true } }
          }
        },
        serviceCategory: true,
        payment: true,
        review: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Not Found', message: 'Booking not found' });
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error('[getBookingById Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

const { forecastNextWeekDemand, generateSampleHistoricalBookings } = require('../utils/demandForecasting');

/**
 * AI Demand Forecasting for Cooperative Federation Dashboard & Worker Surge Alerts
 * GET /api/bookings/demand-forecast
 */
async function getDemandForecast(req, res) {
  try {
    let realBookings = [];
    try {
      realBookings = await prisma.booking.findMany({
        select: {
          id: true,
          scheduledDate: true,
          servicePostalCode: true,
          totalAmount: true,
          serviceCategory: { select: { name: true } }
        },
        orderBy: { scheduledDate: 'desc' },
        take: 500
      });
    } catch (dbErr) {
      console.warn('[DemandForecast] Database query fallback:', dbErr.message);
    }

    const formattedDbBookings = realBookings.map(b => ({
      bookingId: b.id,
      date: b.scheduledDate,
      serviceCategory: b.serviceCategory?.name || 'General Trade',
      areaCode: b.servicePostalCode || '560038',
      amount: Number(b.totalAmount)
    }));

    let dataset = formattedDbBookings;
    if (dataset.length < 20) {
      const benchmarkData = generateSampleHistoricalBookings(28);
      dataset = [...formattedDbBookings, ...benchmarkData];
    }

    const forecast = forecastNextWeekDemand(dataset);

    return res.status(200).json({
      success: true,
      data: forecast,
      metadata: {
        totalHistoricalSamples: dataset.length,
        algorithm: 'Multi-Window Weighted Exponential Moving Average (WEMA) + Momentum Trend',
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[getDemandForecast Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

module.exports = {
  createBooking,
  getNearbyWorkers,
  respondToBooking,
  updateBookingStatus,
  getBookingById,
  getDemandForecast
};
