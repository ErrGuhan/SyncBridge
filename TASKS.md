# TASKS.md — SyncBridge Demo Rebuild Task List
**Sprint:** Demo Rebuild (SIH 2026 Presentation)  
**Goal:** Fully interactive single-page demo for judges

---

## Status Legend
- [ ] TODO
- [x] DONE
- [~] IN PROGRESS

---

## Phase 0 — Planning Documents
- [x] PRD.md — Product Requirements
- [x] ARCHITECTURE.md — System Architecture
- [x] RULES.md — Development Rules
- [x] DESIGN.md — Design System
- [x] TASKS.md — This file
- [x] MEMORY.md — Project memory

---

## Phase 1 — Single-Page Demo (demo.html)

### Section 1: Navigation Bar
- [ ] Fixed top nav with logo + platform name
- [ ] Nav tabs: Home | Services | Workers | How It Works | Admin | AI Forecast
- [ ] Language switcher (EN / हि / ಕ / த)
- [ ] Emergency SOS button (red, pulsing)

### Section 2: Hero Section
- [ ] Headline: "Verified Workers. Fair Wages. Cooperative Power."
- [ ] Sub-headline explaining cooperative difference
- [ ] Search bar: "What service do you need?" with location
- [ ] Trust stats: 5,200+ Workers | 12,000+ Bookings | ₹2.1 Cr Disbursed
- [ ] 3 CTA badges: Verified | Insured | Fair Wages

### Section 3: Service Categories
- [ ] 10 service category cards with icons
- [ ] Electrician, Plumber, Carpenter, Painter, Cleaner, Driver, Gardener, Caregiver, Technician, Domestic Helper
- [ ] Click → filters worker list below

### Section 4: Worker Discovery
- [ ] Grid of 6 worker cards (mock data)
- [ ] Each card: avatar, name, skill, rating, distance, cooperative badge, price, Book Now button
- [ ] Available / Offline indicator dot
- [ ] Filter by category, rating, distance
- [ ] "Book Now" → opens booking modal

### Section 5: Booking Modal
- [ ] Worker summary at top
- [ ] Date/time picker (simulated)
- [ ] Description textarea
- [ ] Address field
- [ ] Price estimate breakdown
- [ ] Revenue split preview: 80% worker / 15% coop / 5% welfare
- [ ] "Confirm Booking" → success state with animated checkmark
- [ ] Success shows: Booking ID, Worker contact, Split breakdown

### Section 6: How It Works (3 Steps)
- [ ] Step 1: Search & Browse (Search icon)
- [ ] Step 2: Book & Pay (Calendar icon)
- [ ] Step 3: Verified Worker Arrives (Shield icon)
- [ ] Cooperative advantage callout

### Section 7: Why Cooperative? (Comparison Table)
- [ ] Side-by-side: Private Platforms vs SyncBridge
- [ ] Rows: Worker Earnings, Welfare, Transparency, Ownership, Surplus

### Section 8: Revenue Split Visualiser
- [ ] Donut chart (CSS/Canvas, no library gradients)
- [ ] 80% blue, 15% slate, 5% green — flat fills
- [ ] Legend with amounts for sample ₹1000 booking
- [ ] Animated fill on scroll into view

### Section 9: Admin Federation Dashboard
- [ ] Tab switcher: Overview | Workers | Bookings | Welfare
- [ ] Overview: 4 metric cards (workers, bookings today, revenue, welfare fund)
- [ ] Workers tab: table with verification queue (Approve/Reject buttons)
- [ ] Bookings tab: recent bookings list with status badges
- [ ] Welfare tab: fund balance + recent claims

### Section 10: AI Demand Forecast
- [ ] Bar chart: Hourly demand heatmap (mock data)
- [ ] Category breakdown: which services peak when
- [ ] Workforce allocation suggestion card
- [ ] "AI Recommended: Deploy 3 more electricians in Koramangala"

### Section 11: Worker Registration Preview
- [ ] Multi-step form preview (3 steps visual)
- [ ] Step 1: Personal Info
- [ ] Step 2: Skills & Certifications
- [ ] Step 3: Cooperative Membership ID
- [ ] Progress bar

### Section 12: Emergency Booking
- [ ] Large red card with "Emergency Service" headline
- [ ] Description: "Critical issue? Get a worker in < 30 minutes"
- [ ] SLA countdown timer simulation
- [ ] Book Emergency button → modal with urgency indicator

### Section 13: Multilingual Demo
- [ ] Toggle buttons for 4 languages
- [ ] Translate hero headline + service names + nav items on click
- [ ] Show translated content in-place (no page reload)

### Section 14: Footer
- [ ] Logo + tagline
- [ ] Ministry of Cooperation badge
- [ ] NCCT badge
- [ ] Links: About | Privacy | Terms | Contact
- [ ] "A cooperative-owned platform — profits stay with workers"

---

## Phase 2 — Polish & Interactions
- [ ] Smooth scroll between sections (nav clicks)
- [ ] Scroll-triggered section animations (fade-in from bottom)
- [ ] Active nav link highlighting on scroll (Intersection Observer)
- [ ] Mobile responsive (breakpoints at 640px, 1024px)
- [ ] Loading skeleton states on worker cards
- [ ] Tooltip on cooperative badge explaining what it means

---

## Phase 3 — Content & Data
- [ ] 6 mock workers with realistic Indian names, skills, ratings
- [ ] 5 mock recent bookings
- [ ] Simulated metric counters (animated counting up)
- [ ] AI forecast chart with realistic demand curve data
- [ ] Welfare fund stats (realistic numbers)

---

## Acceptance Criteria (Judge Demo Checklist)
- [ ] Judge can search for a service and see workers
- [ ] Judge can click "Book Now" and complete a simulated booking
- [ ] Revenue split is visually explained and clearly shows cooperative model
- [ ] Admin dashboard shows realistic metrics
- [ ] Language can be switched mid-demo
- [ ] Emergency booking flow is demonstrable
- [ ] AI forecast chart is interactive (hover shows values)
- [ ] Page loads in < 2 seconds
- [ ] Works on mobile screen (responsive)
- [ ] No console errors
