/**
 * GET /api/workers/nearby
 * GIS geo-matching endpoint — returns workers within radius, sorted by real distance.
 *
 * Query params:
 *   lat       - Customer/job latitude (required)
 *   lng       - Customer/job longitude (required)
 *   category  - Service category slug (optional filter)
 *   radiusKm  - Override default 5km radius (optional)
 *
 * Strategy 1: ST_DWithin + ST_Distance PostGIS query (if DB connected)
 * Strategy 2: Haversine fallback (if PostGIS not available)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// Haversine distance in km (fallback if PostGIS unavailable)
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lng = parseFloat(searchParams.get('lng') ?? '');
  const category = searchParams.get('category') ?? '';
  const radiusKm = parseFloat(searchParams.get('radiusKm') ?? '5');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'lat and lng query params are required and must be valid numbers.' },
      { status: 400 }
    );
  }

  try {
    // -----------------------------------------------------------------------
    // Strategy 1: PostGIS ST_DWithin query
    // Requires PostGIS extension + geography column on WorkerProfile.
    // See seed-syncbridge.sql Step 8 for the column setup.
    // -----------------------------------------------------------------------
    let workers: WorkerRow[] | null = null;
    let usePostGIS = false;

    try {
      const radiusMeters = radiusKm * 1000;
      const { data: gisData, error: gisError } = await supabaseServer.rpc(
        'get_nearby_workers',
        {
          customer_lat: lat,
          customer_lng: lng,
          radius_meters: radiusMeters,
          category_slug: category || null
        }
      );

      if (!gisError && Array.isArray(gisData) && gisData.length >= 0) {
        workers = gisData as WorkerRow[];
        usePostGIS = true;
      }
    } catch {
      // PostGIS function not yet deployed — fall through to Haversine fallback
    }

    // -----------------------------------------------------------------------
    // Strategy 2: Haversine fallback — fetch all workers, compute distance in JS
    // -----------------------------------------------------------------------
    if (!usePostGIS) {
      let query = supabaseServer
        .from('WorkerProfile')
        .select(`
          id,
          userId,
          latitude,
          longitude,
          serviceRadiusKm,
          hourlyRate,
          averageRating,
          totalReviews,
          completedJobsCount,
          verificationStatus,
          isAvailable,
          serviceCity,
          servicePostalCode,
          experienceYears,
          bio,
          eShramUan,
          ncdSocietyCode,
          user:User!WorkerProfile_userId_fkey(firstName, lastName, email, phone, avatarUrl),
          society:Society!WorkerProfile_societyId_fkey(id, name, ncdCode),
          services:WorkerService(
            serviceCategoryId,
            customHourlyRate,
            isCertified,
            serviceCategory:ServiceCategory(id, name, slug)
          ),
          certifications:Certification(id, title, issuingAuthority, skill, grade, verificationStatus),
          verifications:WorkerVerification(verificationType, status, verifiedAt)
        `)
        .eq('isAvailable', true)
        .eq('verificationStatus', 'VERIFIED');

      if (category) {
        // Filter by workers who offer the requested category
        query = query.contains('services.serviceCategory.slug' as never, [category]);
      }

      const { data: rawWorkers, error: dbError } = await query.limit(100);

      if (dbError) {
        console.warn('[nearby workers] Supabase query error, using mock fallback:', dbError.message);
        return NextResponse.json(getMockFallback(lat, lng, category), { status: 200 });
      }

      if (!rawWorkers || rawWorkers.length === 0) {
        // DB empty — return seeded mock data so UI is never blank during demo
        return NextResponse.json(getMockFallback(lat, lng, category), { status: 200 });
      }

      // Compute Haversine distance and filter by worker's service radius
      const withDistance = (rawWorkers as unknown as WorkerRow[])
        .filter(w => w.latitude != null && w.longitude != null)
        .map(w => ({
          ...w,
          distanceKm: haversineKm(lat, lng, w.latitude!, w.longitude!)
        }))
        .filter(w => w.distanceKm <= Math.min(w.serviceRadiusKm ?? 5, radiusKm))
        .sort((a, b) => a.distanceKm - b.distanceKm);

      workers = withDistance;
    }

    // Format response
    const formatted = (workers ?? []).map(formatWorker);

    return NextResponse.json({
      success: true,
      count: formatted.length,
      radiusKm,
      customerLocation: { lat, lng },
      geoMethod: usePostGIS ? 'POSTGIS_ST_DWITHIN' : 'HAVERSINE_JS',
      data: formatted
    });

  } catch (err: unknown) {
    console.error('[nearby workers] Unexpected error:', err);
    // Always return something usable — never a blank screen during demo
    return NextResponse.json(getMockFallback(lat, lng, category), { status: 200 });
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WorkerRow {
  id: string;
  userId: string;
  latitude?: number | null;
  longitude?: number | null;
  serviceRadiusKm?: number;
  hourlyRate?: number | null;
  averageRating?: number;
  totalReviews?: number;
  completedJobsCount?: number;
  verificationStatus?: string;
  isAvailable?: boolean;
  serviceCity?: string | null;
  servicePostalCode?: string | null;
  experienceYears?: number | null;
  bio?: string | null;
  eShramUan?: string | null;
  ncdSocietyCode?: string | null;
  distanceKm?: number;
  user?: any;
  society?: any;
  services?: Array<{
    serviceCategoryId: string;
    customHourlyRate?: number | null;
    isCertified?: boolean;
    serviceCategory?: { id: string; name: string; slug: string };
  }>;
  certifications?: Array<{
    id: string; title: string; issuingAuthority: string; skill?: string; grade?: string; verificationStatus: string;
  }>;
  verifications?: Array<{ verificationType: string; status: string; verifiedAt?: string }>;
}

function formatWorker(w: WorkerRow) {
  const userObj = Array.isArray(w.user) ? w.user[0] : w.user;
  const firstName = userObj?.firstName ?? '';
  const lastName = userObj?.lastName ?? '';
  const distKm = typeof w.distanceKm === 'number' ? w.distanceKm : null;

  // Check all verification types
  const vMap = Object.fromEntries(
    (w.verifications ?? []).map(v => [v.verificationType, v.status])
  );

  return {
    id: w.id,
    name: `${firstName} ${lastName}`.trim(),
    trade: w.services?.[0]?.serviceCategory?.name ?? 'General Trade',
    cooperativeName: w.society?.name ?? 'Independent',
    cooperativeId: w.society?.id ?? null,
    ncdSocietyCode: w.ncdSocietyCode ?? w.society?.ncdCode ?? null,
    eShramUan: w.eShramUan ? `${w.eShramUan.slice(0, 4)}-XXXX-XXXX` : null,
    rating: typeof w.averageRating === 'number' ? w.averageRating : 4.8,
    reviewsCount: w.totalReviews ?? 0,
    distanceKm: distKm ? parseFloat(distKm.toFixed(2)) : null,
    distanceLabel: distKm != null
      ? `${w.serviceCity ?? 'Nearby'} (${distKm.toFixed(1)} km away)`
      : w.serviceCity ?? 'Nearby',
    hourlyRate: w.hourlyRate ?? w.services?.[0]?.customHourlyRate ?? 400,
    experienceYears: w.experienceYears ?? 0,
    isAvailable: w.isAvailable ?? true,
    verificationStatus: w.verificationStatus ?? 'PENDING',
    // Derived badge flags from WorkerVerification rows
    eShramVerified: vMap['ESHRAM_UAN'] === 'VERIFIED',
    policeVerified: vMap['POLICE_CLEARANCE'] === 'VERIFIED',
    ncctCertified: vMap['NCCT_CERT'] === 'VERIFIED',
    bio: w.bio ?? null,
    phone: userObj?.phone ?? null,
    avatarUrl: userObj?.avatarUrl ?? null,
    completedJobs: w.completedJobsCount ?? 0,
    certifications: (w.certifications ?? []).filter(c => c.verificationStatus === 'VERIFIED'),
    services: w.services ?? [],
    latitude: w.latitude,
    longitude: w.longitude
  };
}

// ---------------------------------------------------------------------------
// Mock fallback — returned when DB is empty or unavailable during demo
// Uses real Bangalore coordinates so distance is computable from customer location
// ---------------------------------------------------------------------------

function getMockFallback(lat: number, lng: number, _category: string) {
  const mockWorkers = [
    { id: 'wrk-101', firstName: 'Ramesh', lastName: 'Kumar', trade: 'Electrician', wlat: 12.9784, wlng: 77.6408, society: 'Vishwa Karma Labour Society', rate: 350, rating: 4.92, reviews: 142, jobs: 320, uan: 'UAN-8921-XXXX-9912' },
    { id: 'wrk-102', firstName: 'Suresh', lastName: 'Patil', trade: 'Plumber', wlat: 12.9352, wlng: 77.6244, society: 'Kalyan Labour Workers Society', rate: 300, rating: 4.81, reviews: 98, jobs: 215, uan: 'UAN-7712-XXXX-4321' },
    { id: 'wrk-103', firstName: 'Anjali', lastName: 'Sharma', trade: 'Caregiver & Nursing', wlat: 12.9116, wlng: 77.6389, society: 'Seva Shramik Care Cooperative', rate: 550, rating: 5.00, reviews: 84, jobs: 180, uan: 'UAN-9901-XXXX-2290' },
    { id: 'wrk-104', firstName: 'Vijay', lastName: 'Nair', trade: 'Carpenter', wlat: 12.9166, wlng: 77.6101, society: 'Metro Technicians Labour Cooperative', rate: 480, rating: 4.75, reviews: 67, jobs: 145, uan: 'UAN-5512-XXXX-6601' },
    { id: 'wrk-105', firstName: 'Lakshmi', lastName: 'Devi', trade: 'Deep Cleaning', wlat: 12.9299, wlng: 77.5833, society: 'Vishwa Karma Labour Society', rate: 420, rating: 4.88, reviews: 55, jobs: 120, uan: 'UAN-3301-XXXX-7712' },
  ];

  const withDist = mockWorkers
    .map(w => ({ ...w, distanceKm: haversineKm(lat, lng, w.wlat, w.wlng) }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    success: true,
    count: withDist.length,
    radiusKm: 5,
    customerLocation: { lat, lng },
    geoMethod: 'HAVERSINE_MOCK_SEED',
    isMockFallback: true,
    data: withDist.map(w => ({
      id: w.id,
      name: `${w.firstName} ${w.lastName}`,
      trade: w.trade,
      cooperativeName: w.society,
      rating: w.rating,
      reviewsCount: w.reviews,
      distanceKm: parseFloat(w.distanceKm.toFixed(2)),
      distanceLabel: `Bengaluru (${w.distanceKm.toFixed(1)} km away)`,
      hourlyRate: w.rate,
      experienceYears: 5,
      isAvailable: true,
      verificationStatus: 'VERIFIED',
      eShramVerified: true,
      policeVerified: true,
      ncctCertified: true,
      completedJobs: w.jobs,
      eShramUan: w.uan,
      latitude: w.wlat,
      longitude: w.wlng
    }))
  };
}
