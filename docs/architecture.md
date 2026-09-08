# SyncBridge — System Architecture & Data Flow
**Smart India Hackathon PS ID 26089** — Ministry of Cooperation / NCCT  
**System Designation:** Cooperative Gig Services Platform (Federation Layer)

---

## 1. High-Level Architectural Topology

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SyncBridge Progressive Web App                       │
│     (Next.js 16 App Router • TailwindCSS • React Context • Lucide)     │
└──────────────┬────────────────────────────┬────────────────────────────┘
               │ HTTPS / JSON               │ WebSocket / Realtime
               ▼                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Serverless API Gateway                          │
│  /api/workers/nearby  │  /api/bookings   │  /api/payments/process       │
│  /api/disputes/vote   │  /api/admin/kpi  │  /api/demand-forecast        │
└──────────────┬────────────────────────────┬────────────────────────────┘
               │ Service-Role Client        │ GenAI SDK
               ▼                            ▼
┌────────────────────────────────────────┐ ┌─────────────────────────────┐
│    PostgreSQL 14+ Database Engine      │ │   Google Gemini 2.5 Flash   │
│  • PostGIS Geo-Matching Extensions     │ │  • Multimodal Diagnostic    │
│  • Double-Entry Wallet Ledgers         │ │  • AI Operations Directives │
│  • Peer Arbitration State Engine       │ └─────────────────────────────┘
│  • Storage Bucket ('worker-vault')     │
└────────────────────────────────────────┘
```

---

## 2. The 90/5/5 Cooperative Split Mathematics

Commercial gig aggregators retain 25%–35% in platform commissions and arbitrary cancellation clawbacks. SyncBridge is built on statutory cooperative principles:

$$\text{Gross Total} = \text{Worker Payout (90\%)} + \text{Society Reserve (5\%)} + \text{Welfare Pool (5\%)}$$

### Integer Paise Arithmetic
To prevent IEEE-754 floating-point drift, all calculations are computed via integer truncation with strict remainder assignment:
1. $\text{Worker Payout} = \lfloor\text{Total} \times 0.90\rfloor$
2. $\text{Society Fee} = \lfloor\text{Total} \times 0.05\rfloor$
3. $\text{Welfare Fund} = \text{Total} - \text{Worker Payout} - \text{Society Fee}$

### Section 3.8 Emergency Surge Rule
During acute demand surges (e.g. monsoon storms, severe plumbing bursts), a surge premium is charged. **100% of the surge delta is passed directly to the dispatch artisan.** The cooperative retains 0% surge clawback:
$$\text{Emergency Payout} = \lfloor\text{Base} \times 0.90\rfloor + \text{Surge Delta}$$

---

## 3. Dispute Arbitration & Anti-Deactivation State Machine

SyncBridge replaces algorithmic shadow-banning with a **Democratic Restorative Justice Council**:

```
[ Customer Rating <= 3 / Damage Claim ]
                   │
                   ▼
       [ Status: OPEN (Dispute Logged) ]
                   │
                   ▼
  [ Status: PEER_REVIEW (3-Member Council) ]
    ├─ Fellow Trade Artisan 1
    ├─ Fellow Trade Artisan 2
    └─ Legal/Cooperative Ombudsman
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
(Majority UPHELD)      (Majority OVERTURNED)
      │                         │
      ▼                         ▼
[ Status: RESOLVED_UPHELD ]  [ Status: RESOLVED_OVERTURNED ]
Remedy disbursed from 1%    Worker standing restored immediately
Cooperative Guarantee Fund. with zero algorithmic penalty.
```

---

## 4. Event Bus Architecture: Postgres Outbox → Kafka Scaling Path

### Current Implementation: Transaction Outbox Pattern
For immediate hackathon and prototype evaluation:
- State mutations are committed inside atomic PostgreSQL transactions.
- On each payment or booking completion, an event payload is written to the `EventOutbox` table.
- Real-time client updates are pushed through Supabase Realtime (PostgreSQL Logical Replication / LISTEN-NOTIFY).

### Production Scale-Out to Apache Kafka
When scaling to millions of transactions across national federations, the platform swaps the local listener with a Debezium Change Data Capture (CDC) connector publishing to Kafka topics:

| Event Type | Kafka Topic | Primary Consumers |
|---|---|---|
| `booking.dispatched` | `syncbridge.bookings.events` | GIS Router, Worker SMS Gateway, Push Dispatch |
| `payment.processed` | `syncbridge.payments.ledger` | Bank Host-to-Host UPI, Auditor, Tax Service |
| `dispute.tallied` | `syncbridge.governance.disputes` | Society Ombudsman, Guarantee Escrow Service |
| `forecast.surge` | `syncbridge.analytics.surge` | Worker Telegram Bot, SMS Pre-Alert Dispatch |
