# MEMORY.md — SyncBridge Project Memory
**Last Updated:** September 2026  
**Purpose:** Persistent context for AI agents and developers resuming work

---

## Project Identity

| Field | Value |
|---|---|
| Platform Name | SyncBridge |
| SIH Problem ID | 26089 |
| Problem Title | Cooperative Gig Services Platform for Household & Community Services |
| Organisation | Ministry of Cooperation |
| Department | National Council for Cooperative Training (NCCT) |
| Category | Software |
| Theme | Agriculture, FoodTech & Rural Development |

---

## Core Business Logic (NEVER CHANGE WITHOUT APPROVAL)

### Revenue Split (Cooperative Mandate)
```
On every COMPLETED booking payment:
  80% → Worker Digital Wallet         (their earned wages)
  15% → Cooperative Operating Fund    (platform infrastructure + capital)
   5% → Worker Welfare Insurance Fund (mutual aid, injury insurance)
```
- Defined in: `services/payment-service/src/config/revenueSplit.js`
- Enforced via: `prisma.$transaction` (ACID)
- Audit trail: `WalletLedger` table (IMMUTABLE entries)

### Geo-Matching
- Algorithm: Haversine Great-Circle distance
- Radius: 10 km from customer's coordinates
- Only VERIFIED workers with `isAvailable: true` returned
- Sorted by: distance ASC (nearest first)

### Booking Lifecycle
```
PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
                  ↘ CANCELLED (worker declines or customer cancels)
```

### Worker Verification States
```
PENDING_REVIEW → VERIFIED
              ↘ REJECTED
VERIFIED → SUSPENDED (admin action)
```

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | Next.js 15, TypeScript, Vanilla CSS |
| API Gateway | Node.js + Express (Port 3000) |
| User Service | Node.js + Express + Prisma (Port 3001) |
| Booking Service | Node.js + Express + Prisma (Port 3002) |
| Payment Service | Node.js + Express + Prisma (Port 3003) |
| Database | PostgreSQL via Supabase |
| Auth | Supabase JWT |
| i18n | Custom LanguageContext — EN / HI / KN / TA |

---

## File Locations (Critical Paths)

| File | Purpose |
|---|---|
| `services/payment-service/src/config/revenueSplit.js` | Revenue split constants |
| `prisma/schema.prisma` | Full database schema |
| `api-gateway/src/server.js` | Gateway + JWT middleware |
| `services/user-service/src/routes/adminRoutes.js` | Worker verification API |
| `frontend/src/app/page.tsx` | Landing page (current) |
| `frontend/src/app/globals.css` | Global styles |
| `frontend/src/context/LanguageContext.tsx` | i18n context |
| `frontend/src/data/mockData.ts` | Mock workers & bookings |
| `frontend/src/components/AdminDashboard.tsx` | Federation admin UI |
| `frontend/src/components/WorkerCard.tsx` | Worker profile card |

---

## Design System (Key Rules)

- **NO AI gradients** on backgrounds — flat solid colours only
- **Primary blue:** `#1e40af` / `#2563eb`
- **Success green:** `#059669`
- **Danger red:** `#dc2626`
- **Font:** Inter (Google Fonts)
- **Border radius:** Cards = 16px, Buttons = 12px, Inputs = 10px
- **Motion:** Hover lift (translateY -2px), fade-in on mount — NO gradient animations

---

## Demo Architecture (Single-Page HTML)

The demo is a **self-contained `demo.html`** file that:
- Uses no backend (all mock data inline)
- Uses Vanilla CSS + JS (no framework dependencies)
- Loads Inter font from Google Fonts CDN
- Uses Chart.js CDN for demand forecast chart
- All sections visible in a single scrollable page
- Language switching implemented via JS object swap

### Demo Sections Order
1. Fixed Navigation Bar
2. Hero + Search
3. Service Categories
4. Worker Discovery + Booking Flow
5. How It Works
6. Why Cooperative? (Comparison Table)
7. Revenue Split Visualiser
8. Admin Federation Dashboard
9. AI Demand Forecast
10. Worker Registration Preview
11. Emergency Booking
12. Multilingual Demo
13. Footer

---

## Known Issues & Decisions

| Issue | Decision | Date |
|---|---|---|
| Frontend uses Tailwind CSS | Rebuild demo using Vanilla CSS per RULES.md | Sep 2026 |
| Multi-page Next.js app | Single-page HTML demo for judge presentation | Sep 2026 |
| Backend requires PostgreSQL | Demo uses mock data inline | Sep 2026 |
| AI diagnosis uses Gemini API | Demo simulates response with mock output | Sep 2026 |

---

## Competitive Landscape

| Platform | Model | Worker Earning | Coop Alternative |
|---|---|---|---|
| Urban Company | VC-backed, private | 55–65% | SyncBridge: 80% |
| Sulekha | Lead marketplace | Variable | SyncBridge: Fixed + Transparent |
| TaskRabbit | US, subscription | 70% | SyncBridge: 80% + welfare |
| Justdial | Directory listing | N/A | SyncBridge: Full booking |

---

## Agents & Contributors

- **Antigravity AI** — architecture planning, document generation, demo build
- **Human Team (SIH 2026)** — domain expertise, cooperative governance rules, UX review

---

## Next Steps (After Demo)

1. Connect demo to live Next.js frontend
2. Wire booking modal to API gateway
3. Implement Razorpay payment integration
4. Deploy microservices on Railway
5. Set up Supabase production database
6. Conduct user testing with cooperative federation officers
