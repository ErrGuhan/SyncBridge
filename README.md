# SyncBridge — Cooperative Gig Services Platform

A microservices-based, cooperative-first gig services platform built with Node.js, Express, PostgreSQL, Prisma, and Supabase Authentication.

---

## 🏛️ Architecture Overview

The system consists of an API Gateway and three core isolated microservices:

```
SyncBridge/
├── api-gateway/                      # Port 3000: Reverse Proxy & Supabase JWT Auth
├── services/
│   ├── user-service/                 # Port 3001: Customers, Worker Profiles & Coop Verification
│   ├── booking-service/              # Port 3002: Booking Engine & 10km Haversine Geo-Matching
│   └── payment-service/              # Port 3003: 80/15/5 Cooperative & Worker Welfare Tri-Split
├── prisma/
│   └── schema.prisma                 # Complete PostgreSQL schema (Entities, Wallets & Ledgers)
```

---

## 🚀 Microservices Breakdown

### 1. API Gateway (Port 3000)
- Built with **Express** and `express-http-proxy`.
- Verifies **Supabase JWT** tokens at the gateway level.
- Decorates downstream requests with verified user context (`x-user-id`, `x-user-role`, `x-user-email`, `x-gateway-secret`).
- Public route handling (registration, public worker search) vs protected route guards.

### 2. User & Worker Management Service (Port 3001)
- Customer registration and profile fetching.
- Worker-member registration with service categories, licenses, certifications, and GPS coordinates.
- Live worker availability toggling (`isAvailable`, GPS coordinates).
- Cooperative Admin verification workflows (`VERIFIED`, `REJECTED`, `SUSPENDED`).

### 3. Booking & Geo-Matching Service (Port 3002)
- Customer service booking requests with coordinates and scheduled date.
- **10km Great-Circle Haversine Geo-Matching Query** in raw PostgreSQL/Prisma finding available, verified workers sorted by proximity.
- Worker booking dispatch: Accept (`CONFIRMED`) or Decline (`CANCELLED`).
- Full lifecycle state machine (`PENDING` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED`).

### 4. Payment & Welfare Split Service (Port 3003)
- Cooperative patronage and mutual aid split on completed bookings:
  - **80%** → Worker Digital Wallet (`WORKER_WALLET`)
  - **15%** → Cooperative Operating & Capital Fund (`COOP_ADMIN_FUND`)
  - **5%** → Worker Welfare & Mutual Aid Insurance Fund (`WORKER_WELFARE_INSURANCE_FUND`)
- ACID transaction execution via `prisma.$transaction`.
- Double-entry audit ledger entries (`WalletLedger`) for each credit.
- Generates transparent, verifiable transaction receipts.

---

## 📦 Setup & Installation

1. Copy `.env.example` to `.env` in the root and in each microservice directory.
2. Configure your PostgreSQL database URL and Supabase credentials.
3. Install dependencies and start services:
   ```bash
   # Root / Prisma setup
   npx prisma generate
   npx prisma db push

   # API Gateway
   cd api-gateway && npm install && npm run dev

   # User Service
   cd services/user-service && npm install && npm run dev

   # Booking Service
   cd services/booking-service && npm install && npm run dev

   # Payment Service
   cd services/payment-service && npm install && npm run dev
   ```
