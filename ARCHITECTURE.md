# ARCHITECTURE.md — SyncBridge System Architecture
**Version:** 2.0  
**Date:** September 2026

---

## 1. System Overview

SyncBridge is a **cooperative-owned, microservices-based** gig services marketplace. The architecture ensures separation of concerns, independent scalability, and transparent cooperative governance at the data layer.

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  Next.js 15 SPA  │  PWA (Mobile)  │  Admin Dashboard    │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / REST
┌────────────────────────▼────────────────────────────────┐
│              API GATEWAY (Port 3000)                     │
│   Supabase JWT Verification  │  Rate Limiting            │
│   Role Injection (x-user-role)  │  Route Proxy           │
└──────┬───────────────┬──────────────┬────────────────────┘
       │               │              │
┌──────▼──────┐ ┌──────▼──────┐ ┌────▼──────────┐
│ User Service│ │Booking Svc  │ │Payment Service│
│  Port 3001  │ │  Port 3002  │ │   Port 3003   │
│             │ │             │ │               │
│ - Auth      │ │ - Geo Match │ │ - Split 80/15/│
│ - Profiles  │ │ - Lifecycle │ │   5           │
│ - KYC/Verif │ │ - Dispatch  │ │ - Wallet      │
│ - Worker Reg│ │ - SLA Track │ │ - Ledger      │
└──────┬──────┘ └──────┬──────┘ └────┬──────────┘
       │               │              │
┌──────▼───────────────▼──────────────▼────────────────────┐
│              PostgreSQL (Supabase)                        │
│   Users │ Workers │ Bookings │ Payments │ WalletLedger    │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Microservices Breakdown

### 2.1 API Gateway (Port 3000)
- **Tech:** Node.js + Express + express-http-proxy
- **Responsibilities:**
  - Supabase JWT validation on every protected request
  - Injects `x-user-id`, `x-user-role`, `x-user-email` headers downstream
  - Distinguishes public routes (search, worker browse) from protected routes
  - Global rate limiting (100 req/min per IP)

### 2.2 User Service (Port 3001)
- **Tech:** Node.js + Express + Prisma
- **Responsibilities:**
  - Customer & Worker registration
  - Worker skill profile, certifications, GPS coordinates
  - Cooperative KYC verification workflow (PENDING → VERIFIED / REJECTED)
  - Live availability toggle
  - Admin: list, approve, reject, suspend workers

### 2.3 Booking Service (Port 3002)
- **Tech:** Node.js + Express + Prisma + Raw SQL
- **Responsibilities:**
  - Accept booking requests with lat/lng + service category
  - **Haversine 10km geo-match query** — finds available, VERIFIED workers sorted by proximity
  - Worker accepts/declines dispatch
  - Booking state machine: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
  - Emergency booking: SLA < 30 minutes, priority queue

### 2.4 Payment Service (Port 3003)
- **Tech:** Node.js + Express + Prisma + ACID Transactions
- **Responsibilities:**
  - Process payment on COMPLETED booking
  - Cooperative Revenue Split (Prisma `$transaction`):
    - **80%** → Worker Digital Wallet
    - **15%** → Coop Operating & Capital Fund
    - **5%** → Worker Welfare & Mutual Aid Insurance Fund
  - Double-entry `WalletLedger` entries for auditability
  - Invoice / receipt generation

---

## 3. Database Schema (Prisma / PostgreSQL)

```
User              Worker            Booking
───────           ───────           ─────────
id (uuid)         id (uuid)         id (uuid)
email             userId (FK)       customerId (FK)
role              skills[]          workerId (FK)
name              certifications    serviceCategory
phone             gpsLat            scheduledAt
                  gpsLng            status (enum)
                  isAvailable       totalAmount
                  verifyStatus      geoMatchRadius

Wallet            WalletLedger      CoopFund
──────            ────────────      ────────
id (uuid)         id (uuid)         id (uuid)
userId (FK)       walletId (FK)     fundType
balance           bookingId (FK)    balance
type              amount            ledger[]
                  txType (CREDIT)
                  note
```

---

## 4. Frontend Architecture

```
frontend/
├── app/
│   ├── page.tsx              # Landing + Hero
│   ├── services/             # Service discovery
│   ├── bookings/             # Booking management
│   ├── dashboard/            # Worker dashboard
│   ├── federation/           # Admin federation dashboard
│   ├── welfare/              # Welfare fund UI
│   ├── portal/               # Auth portal
│   └── api/                  # Next.js API routes (BFF)
├── components/
│   ├── WorkerCard.tsx        # Worker profile card
│   ├── AdminDashboard.tsx    # Federation admin panel
│   ├── ServiceDiscovery.tsx  # Search + filter
│   └── ...
├── context/
│   ├── AuthContext.tsx       # Supabase auth state
│   ├── LanguageContext.tsx   # i18n
│   └── CoopDataContext.tsx   # Global cooperative data
├── i18n/
│   ├── en.json
│   ├── hi.json
│   ├── kn.json
│   └── ta.json
└── data/
    └── mockData.ts           # Demo mock workers & bookings
```

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Vanilla CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Supabase JWT |
| Payments | Razorpay / UPI |
| Maps | Leaflet.js + OpenStreetMap |
| AI | Gemini API (diagnosis + forecasting) |
| Hosting | Vercel (frontend) + Railway (services) |
| PWA | next-pwa |

---

## 6. Geo-Matching Algorithm

```sql
-- Haversine formula: find workers within 10km
SELECT w.*, 
  (6371 * acos(
    cos(radians(:lat)) * cos(radians(w."gpsLat")) *
    cos(radians(w."gpsLng") - radians(:lng)) +
    sin(radians(:lat)) * sin(radians(w."gpsLat"))
  )) AS distance_km
FROM "Worker" w
WHERE w."isAvailable" = true
  AND w."verifyStatus" = 'VERIFIED'
  AND w."serviceCategory" @> ARRAY[:category]
HAVING distance_km < 10
ORDER BY distance_km ASC
LIMIT 10;
```

---

## 7. Security Architecture

- All API routes protected by Supabase JWT at gateway
- Role-based access control: `CUSTOMER`, `WORKER`, `COOP_ADMIN`, `FEDERATION_ADMIN`
- PII encrypted at rest (Supabase encryption)
- Aadhaar / KYC data never stored plaintext
- CORS restricted to known frontend origins
- All financial transactions in ACID Prisma `$transaction`

---

## 8. Deployment Topology

```
Vercel CDN
  └── Next.js Frontend (SSR + Static)
       └── /api/* → BFF routes

Railway Cloud
  ├── api-gateway:3000
  ├── user-service:3001
  ├── booking-service:3002
  └── payment-service:3003

Supabase
  ├── PostgreSQL Database
  ├── Auth (JWT)
  └── Realtime (booking status updates)
```
