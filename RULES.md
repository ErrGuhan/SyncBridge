# RULES.md — SyncBridge Development Rules & Constraints
**Version:** 2.0  
**Enforced by:** All contributors, AI agents, and code reviewers

---

## 1. Design Rules

### DR-1: No AI Gradient Effects
- **FORBIDDEN:** CSS `linear-gradient`, `radial-gradient`, `conic-gradient` on background of any primary UI element
- **ALLOWED:** Solid colours, flat fills, subtle borders, box-shadows
- **REASON:** Design must be clean, accessible, and print-friendly for federation officers

### DR-2: Colour Palette (Strict)
```css
/* Primary Brand */
--blue-primary:    #1e40af;   /* Cooperative trust blue */
--blue-accent:     #2563eb;

/* Status / Semantic */
--green-success:   #059669;   /* Verified, online */
--amber-warning:   #d97706;   /* Pending, review */
--red-danger:      #dc2626;   /* Emergency, rejected */

/* Neutrals */
--slate-900:       #0f172a;
--slate-700:       #334155;
--slate-500:       #64748b;
--slate-200:       #e2e8f0;
--slate-50:        #f8fafc;
--white:           #ffffff;
```

### DR-3: Typography
- **Font:** Inter (Google Fonts) — NO system font fallbacks for headings
- **Scale:** 12 / 14 / 16 / 20 / 24 / 30 / 36 / 48px only
- **Weight:** 400 (body), 500 (label), 600 (subheading), 700 (heading), 800 (display)

### DR-4: Spacing
- Use 4px base grid: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64px
- Never use arbitrary pixel values outside this scale

### DR-5: Component Consistency
- All cards: `border-radius: 16px`, `border: 1px solid #e2e8f0`, `box-shadow: 0 1px 3px rgba(0,0,0,0.06)`
- All primary buttons: `border-radius: 12px`, `min-height: 44px` (touch target)
- All inputs: `border-radius: 10px`, focus ring `2px solid #2563eb`

---

## 2. Code Rules

### CR-1: Language & Framework
- Frontend: **Next.js 15 + TypeScript** (strict mode ON)
- Backend: **Node.js + Express** (no Fastify, no NestJS)
- ORM: **Prisma** only (no raw Knex, no Sequelize)
- Styling: **Vanilla CSS + CSS Modules** (no Tailwind unless explicitly approved)
- State: **React Context** (no Redux unless scaling requires)

### CR-2: No Direct DB Calls from Frontend
- All data fetching via Next.js API routes (`/api/*`) or API Gateway
- Zero Prisma imports in `app/` or `components/`

### CR-3: Environment Variables
- ALL secrets in `.env` — never hardcode API keys
- Prefix client-side env vars with `NEXT_PUBLIC_`
- Never commit `.env` (enforced by `.gitignore`)

### CR-4: Error Handling
- All async functions: try/catch with explicit error logging
- API routes: return `{ error: string, code: number }` on failure
- Never return 200 with an error body

### CR-5: TypeScript
- No `any` type — use `unknown` and narrow
- All API response shapes typed with interfaces
- No `ts-ignore` comments without a justification comment above it

---

## 3. Cooperative Governance Rules

### GR-1: Revenue Split is Non-Negotiable
- The 80/15/5 split is defined in `revenueSplit.js` and must never be changed without federation approval
- Any PR touching `revenueSplit.js` requires 2 COOP_ADMIN approvals

### GR-2: Worker Welfare Fund
- The 5% welfare contribution must be processed BEFORE any other credit
- Fund balance must never go negative — reject transaction if insufficient

### GR-3: Audit Ledger
- Every financial transaction MUST create a `WalletLedger` entry
- Ledger entries are IMMUTABLE — no UPDATE or DELETE on ledger table
- Auditors (FEDERATION_ADMIN role) can read all ledger entries

### GR-4: Worker Verification Gate
- Only `verifyStatus === 'VERIFIED'` workers appear in booking geo-match
- KYC document review is mandatory before VERIFIED status

---

## 4. Security Rules

### SR-1: Authentication
- All protected routes MUST validate Supabase JWT at the gateway
- JWT expiry: 1 hour (Supabase default)
- Refresh tokens stored in httpOnly cookies only

### SR-2: Role Enforcement
- `COOP_ADMIN` and `FEDERATION_ADMIN` routes double-check role in the service layer, not just at gateway
- Never trust `x-user-role` header from client directly

### SR-3: Input Validation
- All API inputs validated with Zod schemas
- File uploads (certifications): max 5MB, only PDF/JPG/PNG
- Phone numbers: Indian E.164 format (`+91XXXXXXXXXX`)

### SR-4: PII
- Worker Aadhaar numbers hashed (bcrypt, not stored plaintext)
- Customer location coordinates rounded to 3 decimal places in logs

---

## 5. Git Rules

### VR-1: Branch Naming
- `feat/` — new feature
- `fix/` — bug fix
- `refactor/` — code restructure
- `docs/` — documentation only

### VR-2: Commit Messages
- Format: `type(scope): description`
- Example: `feat(booking): add haversine 10km geo-match query`

### VR-3: PR Requirements
- All PRs require passing CI (lint + tests)
- No PR merges without at least 1 reviewer approval
- PRs touching payment logic require 2 reviews

---

## 6. Accessibility Rules

### AR-1: WCAG 2.1 AA Compliance
- All text must meet 4.5:1 contrast ratio (3:1 for large text)
- All interactive elements must be keyboard accessible
- All images must have descriptive `alt` attributes
- Forms must have associated `<label>` elements

### AR-2: Touch Targets
- All tappable elements: minimum 44×44px
- Spacing between adjacent touch targets: minimum 8px
