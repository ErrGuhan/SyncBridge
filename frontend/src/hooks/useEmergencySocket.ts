'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface EmergencyDispatch {
  bookingId: string;
  bookingNumber: string;
  serviceCategoryId: string;
  serviceCategoryName: string;
  address: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distanceKm?: number;
  totalAmount: number;
  cooperativeWorkerPayout: number; // 90% direct payout
  dispatchedAt: string;
  isEmergency: boolean;
  notes?: string;
}

export interface AssignedWorkerInfo {
  id: string;
  name: string;
  phone: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  dispatchAcceptedAt: string;
}

export interface WorkerLiveCoordinates {
  bookingId: string;
  workerId: string;
  latitude: number;
  longitude: number;
  speedKmH?: number;
  heading?: number;
  timestamp: string;
}

export interface UseEmergencySocketOptions {
  socketUrl?: string;
  workerId?: string;
  customerId?: string;
  autoConnect?: boolean;
}

export function useEmergencySocket(options: UseEmergencySocketOptions = {}) {
  const {
    socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002',
    workerId,
    customerId,
    autoConnect = true
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeDispatches, setActiveDispatches] = useState<EmergencyDispatch[]>([]);
  const [acceptedWorker, setAcceptedWorker] = useState<AssignedWorkerInfo | null>(null);
  const [liveWorkerLocation, setLiveWorkerLocation] = useState<WorkerLiveCoordinates | null>(null);
  const [lockStatus, setLockStatus] = useState<'IDLE' | 'ACQUIRING' | 'LOCKED' | 'LOCK_FAILED'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize and connect socket
  useEffect(() => {
    if (!autoConnect) return;

    const socket: Socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setErrorMessage(null);
      console.log(`⚡ Connected to Emergency Dispatch Socket (ID: ${socket.id})`);

      // If workerId is provided, register worker into pool
      if (workerId) {
        socket.emit('WORKER_REGISTER', { workerId });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔌 Disconnected from Emergency Dispatch Socket');
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setIsConnected(false);
      setErrorMessage(`Socket connection failed: ${err.message}`);
    });

    // 1. Worker receives geofenced Emergency Dispatch
    socket.on('EMERGENCY_DISPATCH', (dispatch: EmergencyDispatch) => {
      console.log('🚨 Received EMERGENCY_DISPATCH:', dispatch);
      setActiveDispatches((prev) => {
        if (prev.some((d) => d.bookingId === dispatch.bookingId)) return prev;
        return [dispatch, ...prev];
      });
    });

    // 2. Worker wins the atomic lock lease
    socket.on('EMERGENCY_ACCEPT_CONFIRMED', (data) => {
      console.log('✅ EMERGENCY_ACCEPT_CONFIRMED:', data);
      setLockStatus('LOCKED');
      // Remove from pending dispatches
      setActiveDispatches((prev) => prev.filter((d) => d.bookingId !== data.bookingId));
    });

    // 2b. Worker missed lock due to concurrent acceptance (Race Condition Prevented)
    socket.on('EMERGENCY_LOCK_FAILED', (data) => {
      console.warn('🔒 EMERGENCY_LOCK_FAILED:', data.message);
      setLockStatus('LOCK_FAILED');
      setErrorMessage(data.message || 'Job already accepted by another member-worker.');
      // Remove stale dispatch
      if (data.bookingId) {
        setActiveDispatches((prev) => prev.filter((d) => d.bookingId !== data.bookingId));
      }
    });

    // 2c. Another worker claimed the job -> broadcasted to all workers to dismiss prompt
    socket.on('EMERGENCY_JOB_TAKEN', (data) => {
      console.log('ℹ️ EMERGENCY_JOB_TAKEN by another worker:', data.claimedBy);
      setActiveDispatches((prev) => prev.filter((d) => d.bookingId !== data.bookingId));
    });

    // 3. Customer notified that worker accepted the emergency dispatch
    socket.on('EMERGENCY_ACCEPTED', (payload) => {
      console.log('🎉 EMERGENCY_ACCEPTED notification received:', payload);
      if (payload.assignedWorker) {
        setAcceptedWorker(payload.assignedWorker);
        if (payload.assignedWorker.location) {
          setLiveWorkerLocation({
            bookingId: payload.bookingId,
            workerId: payload.assignedWorker.id,
            latitude: payload.assignedWorker.location.latitude,
            longitude: payload.assignedWorker.location.longitude,
            timestamp: payload.assignedWorker.dispatchAcceptedAt || new Date().toISOString()
          });
        }
      }
    });

    // 4. Live location stream with zero HTTP polling
    socket.on('WORKER_LOCATION_STREAM', (coords: WorkerLiveCoordinates) => {
      setLiveWorkerLocation(coords);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [socketUrl, workerId, autoConnect]);

  // --------------------------------------------------------------------------
  // ACTIONS
  // --------------------------------------------------------------------------

  /**
   * Worker registers live coordinates to receive geofenced dispatches
   */
  const registerWorkerLocation = useCallback(
    (wId: string, lat: number, lng: number, radiusKm: number = 15) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('WORKER_REGISTER', {
          workerId: wId,
          lat,
          lng,
          serviceRadiusKm: radiusKm
        });
      }
    },
    []
  );

  /**
   * Customer joins room for a specific emergency booking
   */
  const joinBookingRoom = useCallback(
    (bookingId: string, custId?: string) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('CUSTOMER_JOIN_BOOKING', {
          bookingId,
          customerId: custId || customerId
        });
      }
    },
    [customerId]
  );

  /**
   * Worker attempts to claim an emergency job with Redis atomic lock
   */
  const acceptEmergencyJob = useCallback(
    (
      bookingId: string,
      wId: string,
      workerName: string,
      workerPhone?: string,
      currentLat?: number,
      currentLng?: number
    ) => {
      if (!socketRef.current?.connected) {
        setErrorMessage('Socket not connected. Please try again.');
        return;
      }

      setLockStatus('ACQUIRING');
      setErrorMessage(null);

      socketRef.current.emit('ACCEPT_EMERGENCY_JOB', {
        bookingId,
        workerId: wId,
        workerName,
        workerPhone,
        currentLat,
        currentLng
      });
    },
    []
  );

  /**
   * Worker streams live coordinates to customer
   */
  const streamWorkerLocation = useCallback(
    (
      bookingId: string,
      wId: string,
      lat: number,
      lng: number,
      speedKmH: number = 0,
      heading: number = 0
    ) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('WORKER_LOCATION_UPDATE', {
          bookingId,
          workerId: wId,
          lat,
          lng,
          speedKmH,
          heading
        });
      }
    },
    []
  );

  /**
   * Dismiss an active dispatch alert locally
   */
  const dismissDispatch = useCallback((bookingId: string) => {
    setActiveDispatches((prev) => prev.filter((d) => d.bookingId !== bookingId));
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    activeDispatches,
    acceptedWorker,
    liveWorkerLocation,
    lockStatus,
    errorMessage,
    registerWorkerLocation,
    joinBookingRoom,
    acceptEmergencyJob,
    streamWorkerLocation,
    dismissDispatch
  };
}
