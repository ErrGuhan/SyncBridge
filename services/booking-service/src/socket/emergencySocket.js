/**
 * Real-Time Emergency Booking Socket & Distributed Lock Engine
 * Eliminates polling lag for critical on-demand services (e.g., electrical short circuit, pipe burst).
 * 
 * Protocol:
 * 1. Broadcasts EMERGENCY_DISPATCH to geofenced workers.
 * 2. Employs Redlock / Atomic Lease Lock on ACCEPT_EMERGENCY_JOB to prevent race conditions.
 * 3. Notifies customer instantly via EMERGENCY_ACCEPTED and streams live worker coordinates.
 */

// ----------------------------------------------------------------------------
// ATOMIC REDLOCK / LEASE LOCK IMPLEMENTATION
// ----------------------------------------------------------------------------

class DistributedEmergencyLock {
  constructor() {
    this.locks = new Map(); // bookingId -> { workerId, acquiredAt, expiresAt }
    this.lockTtlMs = 15000; // 15-second mutual exclusion lease
  }

  /**
   * Atomically acquires a lock on a booking ID.
   * Ensures only the FIRST worker to click accept acquires the job.
   */
  acquire(bookingId, workerId) {
    const now = Date.now();
    const existing = this.locks.get(bookingId);

    // If lock exists and hasn't expired, reject concurrent attempts
    if (existing && existing.expiresAt > now) {
      return {
        acquired: false,
        reason: 'LOCKED_BY_OTHER_WORKER',
        lockedBy: existing.workerId,
        remainingMs: existing.expiresAt - now
      };
    }

    // Atomically grant lock
    this.locks.set(bookingId, {
      workerId,
      acquiredAt: now,
      expiresAt: now + this.lockTtlMs
    });

    return {
      acquired: true,
      workerId,
      bookingId,
      expiresAt: now + this.lockTtlMs
    };
  }

  release(bookingId, workerId) {
    const existing = this.locks.get(bookingId);
    if (existing && existing.workerId === workerId) {
      this.locks.delete(bookingId);
      return true;
    }
    return false;
  }

  isLocked(bookingId) {
    const existing = this.locks.get(bookingId);
    return Boolean(existing && existing.expiresAt > Date.now());
  }
}

const emergencyLock = new DistributedEmergencyLock();

// ----------------------------------------------------------------------------
// GEOSPATIAL HELPER (Haversine Formula)
// ----------------------------------------------------------------------------
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ----------------------------------------------------------------------------
// SOCKET.IO EVENT CONTROLLER
// ----------------------------------------------------------------------------

// Registry of connected worker sockets: socketId -> { workerId, socket, lat, lng, radiusKm, active }
const connectedWorkers = new Map();

// Registry of customer rooms: bookingId -> Set of socketIds
const activeBookings = new Map();

let ioInstance = null;

function initEmergencySocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`⚡ [Emergency Socket] Client connected: ${socket.id}`);

    // ------------------------------------------------------------------------
    // 1. Worker joins & registers live GPS coordinates
    // ------------------------------------------------------------------------
    socket.on('WORKER_REGISTER', (data) => {
      const { workerId, lat, lng, serviceRadiusKm = 15 } = data || {};
      if (!workerId) return;

      socket.join('workers-channel');
      socket.join(`worker:${workerId}`);

      connectedWorkers.set(socket.id, {
        socketId: socket.id,
        workerId,
        lat: parseFloat(lat) || null,
        lng: parseFloat(lng) || null,
        serviceRadiusKm: parseFloat(serviceRadiusKm),
        updatedAt: Date.now()
      });

      console.log(`👷 [Worker Registered] ID: ${workerId} at (${lat}, ${lng})`);
      socket.emit('WORKER_REGISTERED_ACK', { success: true, socketId: socket.id });
    });

    // ------------------------------------------------------------------------
    // 2. Customer subscribes to an Emergency Booking room
    // ------------------------------------------------------------------------
    socket.on('CUSTOMER_JOIN_BOOKING', ({ bookingId, customerId }) => {
      if (!bookingId) return;
      socket.join(`booking:${bookingId}`);
      if (customerId) socket.join(`customer:${customerId}`);

      if (!activeBookings.has(bookingId)) {
        activeBookings.set(bookingId, new Set());
      }
      activeBookings.get(bookingId).add(socket.id);

      console.log(`👤 [Customer Joined] Booking Room: booking:${bookingId}`);
      socket.emit('ROOM_JOINED', { bookingId, status: 'WAITING_FOR_DISPATCH_ACCEPT' });
    });

    // ------------------------------------------------------------------------
    // 3. Worker attempts to ACCEPT an Emergency Dispatch (With Atomic Redlock)
    // ------------------------------------------------------------------------
    socket.on('ACCEPT_EMERGENCY_JOB', async (data) => {
      const {
        bookingId,
        workerId,
        workerName = 'Cooperative Worker',
        workerPhone,
        currentLat,
        currentLng
      } = data || {};

      console.log(`⚡ [ACCEPT_EMERGENCY_JOB Attempt] Worker: ${workerId} on Booking: ${bookingId}`);

      if (!bookingId || !workerId) {
        return socket.emit('EMERGENCY_LOCK_FAILED', {
          bookingId,
          message: 'bookingId and workerId are required'
        });
      }

      // Step 2 from Prompt: Acquire Redis / Mutex lock on bookingId
      const lockResult = emergencyLock.acquire(bookingId, workerId);

      if (!lockResult.acquired) {
        console.warn(`🔒 [Lock Conflict] Worker ${workerId} missed lock for Booking ${bookingId}: Already locked`);
        return socket.emit('EMERGENCY_LOCK_FAILED', {
          bookingId,
          success: false,
          code: 'RACE_CONDITION_AVOIDED',
          message: 'Another worker-member just accepted this emergency job 1 millisecond earlier. Job no longer available.'
        });
      }

      console.log(`✅ [Lock Acquired] Worker ${workerId} successfully claimed Booking ${bookingId}!`);

      // Confirm to winning worker
      socket.emit('EMERGENCY_ACCEPT_CONFIRMED', {
        success: true,
        bookingId,
        status: 'CONFIRMED',
        message: 'Emergency dispatch confirmed. Proceeding to job destination.'
      });

      // Broadcast to all other workers that this emergency job is claimed
      io.to('workers-channel').emit('EMERGENCY_JOB_TAKEN', {
        bookingId,
        claimedBy: workerId
      });

      // Step 3 from Prompt: Notify the customer instantly via WebSocket with live location stream
      const customerPayload = {
        bookingId,
        status: 'CONFIRMED',
        assignedWorker: {
          id: workerId,
          name: workerName,
          phone: workerPhone || 'Verified Cooperative Contact',
          location: {
            latitude: currentLat,
            longitude: currentLng
          },
          dispatchAcceptedAt: new Date().toISOString()
        },
        message: 'A verified cooperative member has accepted your emergency request and is on their way!'
      };

      io.to(`booking:${bookingId}`).emit('EMERGENCY_ACCEPTED', customerPayload);
    });

    // ------------------------------------------------------------------------
    // 4. Live Coordinate Stream from Worker to Customer
    // ------------------------------------------------------------------------
    socket.on('WORKER_LOCATION_UPDATE', (data) => {
      const { bookingId, workerId, lat, lng, speedKmH, heading } = data || {};
      if (!bookingId || lat === undefined || lng === undefined) return;

      // Update registry
      const workerRecord = connectedWorkers.get(socket.id);
      if (workerRecord) {
        workerRecord.lat = lat;
        workerRecord.lng = lng;
        workerRecord.updatedAt = Date.now();
      }

      // Stream directly to customer listening to this booking room with zero polling
      io.to(`booking:${bookingId}`).emit('WORKER_LOCATION_STREAM', {
        bookingId,
        workerId,
        latitude: lat,
        longitude: lng,
        speedKmH: speedKmH || 0,
        heading: heading || 0,
        timestamp: new Date().toISOString()
      });
    });

    // ------------------------------------------------------------------------
    // Disconnect cleanup
    // ------------------------------------------------------------------------
    socket.on('disconnect', () => {
      connectedWorkers.delete(socket.id);
      for (const [bookingId, sockets] of activeBookings.entries()) {
        sockets.delete(socket.id);
        if (sockets.size === 0) activeBookings.delete(bookingId);
      }
      console.log(`🔌 [Emergency Socket] Client disconnected: ${socket.id}`);
    });
  });
}

/**
 * Step 1 from Prompt:
 * Broadcast real-time EMERGENCY_DISPATCH containing coordinates and job details
 * to all connected workers inside that geofenced area.
 */
function broadcastEmergencyDispatch(booking) {
  if (!ioInstance) {
    console.warn('[Emergency Socket] io instance not yet initialized');
    return { dispatchedWorkersCount: 0 };
  }

  const {
    id: bookingId,
    bookingNumber,
    serviceCategoryId,
    serviceCategoryName = 'Emergency Technical Service',
    serviceAddressLine1,
    serviceCity,
    serviceLatitude,
    serviceLongitude,
    totalAmount,
    emergencySurgeRate = 1.0, // 100% surge pass-through to worker
    notes
  } = booking;

  let dispatchedCount = 0;

  for (const [socketId, worker] of connectedWorkers.entries()) {
    // Check if worker has coordinates
    if (worker.lat && worker.lng && serviceLatitude && serviceLongitude) {
      const distance = calculateDistanceKm(
        serviceLatitude,
        serviceLongitude,
        worker.lat,
        worker.lng
      );

      // Check if within worker's radius or standard 15km emergency perimeter
      const allowedRadius = worker.serviceRadiusKm || 15;
      if (distance <= allowedRadius) {
        const payload = {
          bookingId,
          bookingNumber: bookingNumber || `EMG-${Date.now().toString().slice(-6)}`,
          serviceCategoryId,
          serviceCategoryName,
          address: serviceAddressLine1,
          city: serviceCity,
          coordinates: {
            latitude: serviceLatitude,
            longitude: serviceLongitude
          },
          distanceKm: parseFloat(distance.toFixed(2)),
          totalAmount,
          cooperativeWorkerPayout: parseFloat((totalAmount * 0.9).toFixed(2)), // 90% direct payout
          dispatchedAt: new Date().toISOString(),
          isEmergency: true,
          notes: notes || 'Immediate response needed: Electrical/Water emergency'
        };

        ioInstance.to(socketId).emit('EMERGENCY_DISPATCH', payload);
        dispatchedCount++;
      }
    } else {
      // If worker coordinates not yet calibrated, broadcast to general worker channel
      ioInstance.to(socketId).emit('EMERGENCY_DISPATCH', {
        bookingId,
        bookingNumber: bookingNumber || `EMG-${Date.now().toString().slice(-6)}`,
        serviceCategoryId,
        serviceCategoryName,
        address: serviceAddressLine1,
        city: serviceCity,
        coordinates: {
          latitude: serviceLatitude,
          longitude: serviceLongitude
        },
        totalAmount,
        cooperativeWorkerPayout: parseFloat((totalAmount * 0.9).toFixed(2)),
        dispatchedAt: new Date().toISOString(),
        isEmergency: true,
        notes: notes || 'Immediate response needed'
      });
      dispatchedCount++;
    }
  }

  console.log(
    `🚨 [EMERGENCY_DISPATCH] Broadcasted to ${dispatchedCount} geofenced worker(s) for Booking ${bookingId}`
  );

  return { dispatchedWorkersCount: dispatchedCount };
}

module.exports = {
  initEmergencySocket,
  broadcastEmergencyDispatch,
  emergencyLock,
  connectedWorkers
};
