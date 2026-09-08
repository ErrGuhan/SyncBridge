# SyncBridge — External Integrations & Adapter Architecture
**Smart India Hackathon PS ID 26089** — Ministry of Cooperation / NCCT

SyncBridge is built using an **Adapter Pattern** for all external financial, governmental, and storage integrations. This ensures that the platform functions immediately during evaluation and offline demonstrations, while being 1-line swappable for live production gateways.

---

## 1. Financial & Settlement Integrations (`PaymentGateway`)

### Interface: `PaymentGateway` (`frontend/src/lib/paymentGateway.ts`)
Controls the lifecycle of service escrows and direct 90/5/5 instant payouts to worker UPI accounts.

```typescript
export interface PaymentGateway {
  holdInEscrow(params: EscrowParams): Promise<EscrowResult>;
  releaseToWorker(params: ReleaseParams): Promise<ReleaseResult>;
  disburseCoopFees(params: CoopFeeParams): Promise<CoopFeeResult>;
  refundCustomer(params: RefundParams): Promise<RefundResult>;
}
```

### Active Adapter: `MockUPIGateway`
- Simulates atomic UPI 2.0 escrow holds, UTR generation (`UTR-UPI-2026-XXXXXXXX`), and instant IMPS/UPI payouts without incurring transaction fees during development.

### Production Migration: UPI Auto-Split (Razorpay Route / Cashfree Easy Split / NPCI BHIM)
To swap to a live PSP, implement `PaymentGateway` and set the following in `frontend/.env.local`:
```env
# Razorpay Route / Cashfree Vendor Split Credentials
PSP_PROVIDER=RAZORPAY_ROUTE        # Or CASHFREE_SPLIT / NPCI_BHIM
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx
COOP_ESCROW_VIRTUAL_ACCOUNT=VA_SYNCBRIDGE_001
```

---

## 2. Government Credentialing & Verification (`VerificationProvider`)

### Interface: `VerificationProvider` (`frontend/src/lib/verificationProvider.ts`)
Validates citizen identity, informal worker registry status, cooperative society standing, and police records.

```typescript
export interface VerificationProvider {
  verifyAadhaar(uid: string, workerId: string): Promise<VerificationResult>;
  syncEShram(uan: string, workerId: string): Promise<VerificationResult>;
  syncNCD(coopId: string): Promise<VerificationResult>;
  checkPoliceClearance(workerId: string): Promise<VerificationResult>;
}
```

### Active Adapter: `MockVerificationProvider`
- Emulates UIDAI demographic/OTP e-KYC with masked Aadhaar formatting (`XXXX-XXXX-3821`).
- Validates e-Shram 12-digit UAN identifiers against National Database for Unorganised Workers (NDUW).
- Checks cooperative registration against Ministry of Cooperation NCD norms.
- Confirms state police clearance certificates through Crime and Criminal Tracking Network & Systems (CCTNS).

### Production Migration
```env
# UIDAI ASA / KUA Credentials (Aadhaar e-KYC)
UIDAI_ASA_LICENSE_KEY=xxxxxxxxxxxxxxxxxxxx
UIDAI_PUBLIC_CERT_PATH=/etc/ssl/uidai_cert.pem

# Ministry of Labour & Employment (NDUW / e-Shram API)
ESHRAM_API_ENDPOINT=https://eshram.gov.in/api/v1/verify
ESHRAM_CLIENT_ID=syncbridge_portal
ESHRAM_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx

# Ministry of Cooperation (NCD Registry)
NCD_API_ENDPOINT=https://cooperation.gov.in/ncd/api/v2
NCD_FEDERATION_TOKEN=xxxxxxxxxxxxxxxxxxxx
```

---

## 3. Generative AI & Operations Advisor (`@google/genai`)

### Model: Gemini 2.5 Flash
- **Diagnostic Assistant (`/api/ai/diagnose`)**: Parses multimodal customer requests (photos of damaged pipes, wiring diagrams, voice transcripts), estimating fair cooperative labor rates and safety precautions.
- **Demand Forecasting Insight (`/api/demand-forecast`)**: Reads weekly WEMA time-series predictions and generates executive supply directives for cooperative secretaries.

### Configuration
```env
# Google AI Studio API Key (Get at: https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
*Note: If `GEMINI_API_KEY` is not present, both routes automatically fall back to deterministic heuristic diagnostics and WEMA time-series statistical models without failing.*

---

## 4. Object Storage & Document Vault

### Provider: Supabase Storage / Google Cloud Storage
- Endpoint: `POST /api/storage/upload`
- Bucket: `worker-vault`
- Stores worker trade diplomas, NCCT certifications, and insurance policy cards. Persists verifiable public URLs linked to the `Certification` database table.
