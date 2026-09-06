/**
 * API Service Layer for Cooperative Gig Services Platform
 * Handles typed requests/responses, Supabase JWT session injection,
 * and global 401 authentication error redirection.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ||
  'http://localhost:3000';

// ----------------------------------------------------------------------------
// DATA TRANSFER OBJECTS (DTOs) & TYPES
// ----------------------------------------------------------------------------

export interface CertificationDTO {
  id?: string;
  title: string;
  issuingAuthority: string;
  licenseNumber?: string | null;
  documentUrl?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface WorkerServiceSkillDTO {
  serviceCategoryId: string;
  serviceCategory?: {
    id: string;
    name: string;
    slug: string;
  };
  customHourlyRate?: number;
  isCertified?: boolean;
}

export interface WorkerProfileDTO {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  avatarUrl?: string | null;
  hourlyRate?: number | null;
  experienceYears?: number;
  latitude?: number | null;
  longitude?: number | null;
  serviceRadiusKm?: number;
  serviceCity?: string | null;
  servicePostalCode?: string | null;
  isAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  completedJobsCount: number;
  cooperativeId?: string | null;
  cooperativeName?: string | null;
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  nationalIdMasked?: string | null;
  certifications?: CertificationDTO[];
  services?: WorkerServiceSkillDTO[];
}

export interface BookingDTO {
  customerId?: string;
  serviceCategoryId: string;
  scheduledDate: string; // ISO-8601
  estimatedDurationHours?: number;
  serviceAddressLine1: string;
  serviceAddressLine2?: string;
  serviceCity: string;
  servicePostalCode: string;
  serviceLatitude: number;
  serviceLongitude: number;
  locationInstructions?: string;
  totalAmount: number;
  currency?: string;
  isEmergency?: boolean;
}

export interface BookingResponseDTO {
  id: string;
  bookingNumber: string;
  customerId: string;
  workerId: string;
  serviceCategoryId: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  scheduledDate: string;
  totalAmount: number;
  currency: string;
  serviceAddressLine1: string;
  serviceCity: string;
  createdAt: string;
  message?: string;
}

export interface ApproveWorkerResponseDTO {
  success: boolean;
  message: string;
  data: {
    id: string;
    userId: string;
    verificationStatus: 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
    verifiedAt?: string | null;
    verificationNotes?: string | null;
    backgroundChecked?: boolean;
  };
}

export interface PaymentSplitResponseDTO {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    transactionId: string;
    bookingId: string;
    totalAmount: number;
    workerAmount: number; // 90% (or configured worker dividend ratio)
    coopAmount: number;   // 5% (cooperative operating reserve)
    welfareAmount: number; // 5% (worker welfare insurance fund)
    workerSplitRatio: number;
    coopSplitRatio: number;
    welfareSplitRatio: number;
    currency: string;
    paymentMethod: string;
    status: string;
    workerPaidOutAt?: string | null;
    createdAt: string;
  };
}

export interface FallbackVerificationResponseDTO {
  success: boolean;
  status: 'PENDING_SOCIETY_APPROVAL' | 'VERIFIED' | 'REJECTED';
  verificationMode: 'REALTIME_ESHRAM' | 'FALLBACK_OFFLINE_QUEUE';
  message: string;
  taskId: string;
  workerId: string;
  estimatedReviewTime?: string;
  societyReviewDetails?: {
    societyName?: string;
    secretaryAssigned?: string;
    queuedAt: string;
  };
}

// ----------------------------------------------------------------------------
// API ERROR CLASS
// ----------------------------------------------------------------------------

export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// ----------------------------------------------------------------------------
// TOKEN MANAGEMENT HELPERS
// ----------------------------------------------------------------------------

/**
 * Extracts the user's Supabase JWT access token from browser session storage.
 * Inspects both standard keys and Supabase client session structures.
 */
export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Direct explicit token key
    const directToken =
      sessionStorage.getItem('supabase_token') ||
      sessionStorage.getItem('sb-access-token') ||
      sessionStorage.getItem('auth_token');
    if (directToken) return directToken;

    // 2. Scan for Supabase project auth session keys: `sb-<project-id>-auth-token`
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('sb-') && key.endsWith('-auth-token'))) {
        const item = sessionStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed?.access_token) {
            return parsed.access_token;
          }
        }
      }
    }
  } catch (err) {
    console.warn('[API Service] Failed to read token from session storage:', err);
  }

  return null;
}

/**
 * Global handler for 401 Unauthorized errors:
 * Clears stale credentials and redirects the user to the login screen.
 */
export function handleUnauthorized(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem('supabase_token');
    sessionStorage.removeItem('sb-access-token');
    sessionStorage.removeItem('auth_token');
  } catch {
    // ignore clean-up error
  }

  const currentPath = window.location.pathname;
  if (!currentPath.includes('/auth/login') && !currentPath.includes('/auth/register')) {
    const redirectUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`${window.location.origin}${redirectUrl}`);
  }
}

// ----------------------------------------------------------------------------
// CORE HTTP CLIENT
// ----------------------------------------------------------------------------

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = new Headers(options.headers || {});

  // Automatically inject Supabase JWT from session storage
  const token = getSessionToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);

    // Global 401 Unauthorized Interceptor
    if (response.status === 401) {
      handleUnauthorized();
      throw new ApiError(
        401,
        'Unauthorized: Your session has expired. Redirecting to login...',
        { url, status: 401 }
      );
    }

    // Parse JSON payload or handle empty response
    let responseData: Record<string, unknown> | null = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = (await response.json()) as Record<string, unknown>;
    } else {
      const text = await response.text();
      responseData = text ? { message: text } : {};
    }

    if (!response.ok) {
      const errorMessage =
        (typeof responseData?.message === 'string' ? responseData.message : null) ||
        (typeof responseData?.error === 'string' ? responseData.error : null) ||
        `HTTP Request failed with status ${response.status}`;
      throw new ApiError(response.status, errorMessage, responseData);
    }

    return responseData as unknown as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors or fetch aborts
    const msg = error instanceof Error ? error.message : 'Network error occurred. Please check your connection.';
    throw new ApiError(0, msg);
  }
}

// ----------------------------------------------------------------------------
// REQUIRED HELPER FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * 1. Fetch available workers matching a category within a geospatial radius.
 * Calls the booking & geo-matching microservice via API Gateway.
 */
export async function fetchAvailableWorkers(
  categoryId: string,
  lat: number,
  lng: number
): Promise<WorkerProfileDTO[]> {
  const params = new URLSearchParams({
    categoryId,
    lat: lat.toString(),
    lng: lng.toString()
  });

  const response = await request<{ success: boolean; data: WorkerProfileDTO[] }>(
    `/api/bookings/workers/nearby?${params.toString()}`,
    { method: 'GET' }
  );

  return response.data || [];
}

/**
 * 2. Create a new booking request for an available cooperative worker.
 * Encapsulates client payload and routes to Booking Service.
 */
export async function createBooking(
  bookingPayload: BookingDTO
): Promise<BookingResponseDTO> {
  const response = await request<{ success: boolean; data: BookingResponseDTO; message?: string }>(
    '/api/bookings',
    {
      method: 'POST',
      body: JSON.stringify(bookingPayload)
    }
  );

  return response.data;
}

/**
 * 3. Approve a pending worker-member profile by Cooperative Administrator.
 * Transitions verificationStatus to VERIFIED and activates the worker's account.
 */
export async function approveWorker(
  workerId: string
): Promise<ApproveWorkerResponseDTO> {
  return await request<ApproveWorkerResponseDTO>(
    `/api/users/admin/workers/${encodeURIComponent(workerId)}/verify`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'VERIFIED',
        verificationNotes: 'Approved via Cooperative Admin Portal',
        backgroundChecked: true
      })
    }
  );
}

/**
 * 4. Process payment split calculation for a completed booking.
 * Triggers the 90/5/5 cooperative patronage dividend distribution.
 */
export async function processPaymentSplit(
  bookingId: string
): Promise<PaymentSplitResponseDTO> {
  return await request<PaymentSplitResponseDTO>(
    '/api/payments/process',
    {
      method: 'POST',
      body: JSON.stringify({
        bookingId,
        paymentMethod: 'UPI'
      })
    }
  );
}

/**
 * Additional Helper: Worker e-Shram identity verification with offline society fallback.
 */
export async function verifyWorkerOfflineFallback(payload: {
  workerId: string;
  uan: string;
  stateCode?: string;
  cooperativeId?: string;
}): Promise<FallbackVerificationResponseDTO> {
  return await request<FallbackVerificationResponseDTO>(
    '/api/users/verify/e-shram',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  );
}

/**
 * Additional Helper: Fetch Primary Cooperative Secretary Manual Review Queue.
 */
export async function fetchSecretaryReviewQueue(): Promise<{
  success: boolean;
  count: number;
  data: Record<string, unknown>[];
}> {
  return await request('/api/users/admin/secretary-queue', {
    method: 'GET'
  });
}
