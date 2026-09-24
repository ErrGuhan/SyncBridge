# PRD — SyncBridge: Cooperative Gig Services Platform
**Problem Statement ID:** 26089  
**Organisation:** Ministry of Cooperation / NCCT  
**Version:** 2.0 (Demo Rebuild)  
**Date:** September 2026

---

## 1. Vision & Mission

> **Vision:** A cooperative-owned digital marketplace where every skilled trade worker earns fairly, every consumer gets verified service, and profits flow back to the community — not private investors.

**Mission:** Replace privately-owned gig platforms (Urban Company, Taskrabbit clones) with a federation-governed, transparent, worker-first digital service marketplace for Indian Labour Cooperative Federations and Cooperative Societies.

---

## 2. Problem Context

### Market Gap
| Private Platforms (Urban Company, etc.) | SyncBridge Cooperative |
|---|---|
| Workers earn 55–70% after commissions | Workers earn **80%** of service fee |
| No insurance or welfare contribution | **5%** mandated to Worker Welfare Fund |
| Algorithm-driven opaque pricing | **Transparent pricing** published by federation |
| No worker ownership | Workers are **members & part-owners** |
| Profit leaves community | **Surplus stays in the cooperative** |

### Scope of Workers (India)
- **Electricians, Plumbers, Carpenters, Painters** (Trade workers)
- **Domestic Helpers, Caregivers** (Home care)
- **Drivers, Gardeners, Cleaners** (Support services)
- **Technicians** (Appliance & device repair)

---

## 3. User Personas

### P1 — Customer (Homeowner / Institution)
- **Goal:** Book a verified, insured service worker quickly near their location
- **Pain:** No trust in random freelancers; private platforms overcharge
- **Need:** Transparent pricing, real-time booking, verified worker badges

### P2 — Worker Member (कारीगर)
- **Goal:** Get consistent work, fair wages, insurance coverage
- **Pain:** No digital presence; underutilised despite being skilled
- **Need:** Easy job acceptance, digital wallet, welfare fund access

### P3 — Cooperative Admin / Federation Officer
- **Goal:** Manage worker verification, monitor platform health, generate reports
- **Pain:** Manual paperwork, no real-time data on worker deployment
- **Need:** Admin dashboard, worker KYC workflow, revenue reports

### P4 — Federation Auditor
- **Goal:** Ensure cooperative governance compliance, audit fund flows
- **Need:** Transparent ledger, surplus distribution records

---

## 4. Core Feature Requirements

### F1 — Service Discovery & Booking
- Service category browse (10 categories)
- Real-time geo-based worker matching (Haversine, 10 km radius)
- Instant + Scheduled booking modes
- Emergency / On-Demand panic booking (< 30 min SLA)
- Booking lifecycle: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED

### F2 — Worker Registration & Profiling
- Cooperative member onboarding form
- Skill selection + certification upload
- KYC (Aadhaar / Cooperative membership ID) verification
- Live availability toggle (GPS coordinates)
- Worker public profile with ratings & work history

### F3 — Payments & Revenue Split (Cooperative Model)
- UPI / Digital payment collection
- Automated split on COMPLETED bookings:
  - **80%** → Worker Digital Wallet
  - **15%** → Cooperative Capital / Operating Fund
  - **5%** → Worker Welfare & Mutual Aid Insurance Fund
- Transparent transaction receipt / invoice generation
- Double-entry audit ledger

### F4 — Rating & Feedback
- 5-star rating by customer post-service
- Worker feedback on platform / cooperative
- Dispute resolution workflow (Admin mediation)

### F5 — Admin & Federation Dashboard
- Worker verification queue (Approve / Reject / Suspend)
- Live metrics: Active workers, bookings today, revenue
- AI demand forecast charts (weekly/monthly)
- Revenue split ledger (visible to federation auditors)

### F6 — Worker Welfare Integration
- Welfare fund balance display per worker
- Insurance claim initiation
- Mutual Aid loan eligibility checker

### F7 — Multilingual Support
- English, Hindi, Kannada, Tamil
- All UI strings externalised to i18n JSON

### F8 — AI Features
- AI Problem Diagnosis → auto-categorise service request
- Demand Forecasting model (hourly/daily heatmap)
- Workforce allocation recommendation

---

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | First Contentful Paint < 2s on 4G |
| Accessibility | WCAG 2.1 AA — screen reader, keyboard nav |
| Security | JWT auth, role-based access (CUSTOMER / WORKER / COOP_ADMIN) |
| Scalability | Microservices; each service independently deployable |
| Languages | 4 Indian languages minimum |

---

## 6. Demo Scope (SIH Judge Presentation)

For the **single-page interactive demo**, the following flows must be fully demonstrable without backend:

1. Hero Search → Service Category → Worker List (mock data)
2. Worker Profile card with cooperative badge, rating, price
3. Booking Modal → success state with split breakdown shown
4. Admin Dashboard section with live-looking metrics
5. AI Demand Forecast chart (simulated)
6. Revenue Split Visualiser (pie / bar chart)
7. Multilingual toggle (EN / HI / KN / TA)
8. Worker Registration preview
9. Emergency Booking button with SLA countdown

---

## 7. Success Metrics (Post-Launch)

| Metric | Target (6 months) |
|---|---|
| Registered Workers | 5,000 |
| Successful Bookings | 20,000 |
| Worker Wallet Disbursements | ₹2 Cr+ |
| Welfare Fund Corpus | ₹10 L+ |
| Customer NPS | > 65 |
| Platform Uptime | 99.5% |
