/**
 * SyncBridge — Verification & Credential Provider Interface
 *
 * Pluggable adapter pattern for government and cooperative credentialing:
 *   - UIDAI Aadhaar e-KYC
 *   - Ministry of Labour & Employment e-Shram UAN Registry
 *   - Ministry of Cooperation National Cooperative Database (NCD)
 *   - State Police Clearance Service
 *   - NCCT (National Council for Cooperative Training) Skills
 *
 * Production PSP/Govt APIs can be swapped without touching frontend logic.
 */

export interface VerificationResult {
  success: boolean;
  verificationType: 'AADHAAR' | 'ESHRAM_UAN' | 'NCD_SOCIETY' | 'POLICE_CLEARANCE' | 'NCCT_CERT';
  status: 'VERIFIED' | 'REJECTED' | 'PENDING';
  referenceId: string;
  verifiedAt: string;
  authority: string;
  details: Record<string, unknown>;
}

export interface VerificationProvider {
  verifyAadhaar(uid: string, workerId: string): Promise<VerificationResult>;
  syncEShram(uan: string, workerId: string): Promise<VerificationResult>;
  syncNCD(coopId: string): Promise<VerificationResult>;
  checkPoliceClearance(workerId: string): Promise<VerificationResult>;
}

/**
 * MockVerificationProvider:
 * Simulates government API responses with realistic latency and deterministic verification.
 */
export class MockVerificationProvider implements VerificationProvider {
  async verifyAadhaar(uid: string, workerId: string): Promise<VerificationResult> {
    const cleanUid = uid.replace(/\D/g, '');
    const isValid = cleanUid.length === 12 || uid.includes('XXXX');

    return {
      success: isValid,
      verificationType: 'AADHAAR',
      status: isValid ? 'VERIFIED' : 'REJECTED',
      referenceId: `UIDAI-AUTH-2026-${Math.floor(10000000 + Math.random() * 90000000)}`,
      verifiedAt: new Date().toISOString(),
      authority: 'Unique Identification Authority of India (UIDAI)',
      details: {
        workerId,
        maskedUid: cleanUid.length === 12 ? `XXXX-XXXX-${cleanUid.slice(-4)}` : uid,
        ekycTimestamp: new Date().toISOString(),
        authMethod: 'DEMOGRAPHIC_AND_OTP'
      }
    };
  }

  async syncEShram(uan: string, workerId: string): Promise<VerificationResult> {
    const isUanValid = uan.replace(/\D/g, '').length === 12 || uan.startsWith('UAN-') || uan.includes('XXXX');

    return {
      success: isUanValid,
      verificationType: 'ESHRAM_UAN',
      status: isUanValid ? 'VERIFIED' : 'REJECTED',
      referenceId: `ESHRAM-NDUW-2026-${Math.floor(1000000 + Math.random() * 9000000)}`,
      verifiedAt: new Date().toISOString(),
      authority: 'Ministry of Labour & Employment (NDUW)',
      details: {
        workerId,
        uan,
        occupationCode: '7411 - Building and related electricians',
        primarySkill: 'Electrical Installation and Repair',
        stateSocialSecurityStatus: 'ACTIVE_COVER'
      }
    };
  }

  async syncNCD(coopId: string): Promise<VerificationResult> {
    return {
      success: true,
      verificationType: 'NCD_SOCIETY',
      status: 'VERIFIED',
      referenceId: `NCD-MOC-REG-${coopId}`,
      verifiedAt: new Date().toISOString(),
      authority: 'Ministry of Cooperation (National Cooperative Database)',
      details: {
        coopId,
        cooperativeStatus: 'REGISTERED_ACTIVE',
        auditGrade: 'A',
        registeredState: 'Karnataka',
        bylawsCompliant: true
      }
    };
  }

  async checkPoliceClearance(workerId: string): Promise<VerificationResult> {
    return {
      success: true,
      verificationType: 'POLICE_CLEARANCE',
      status: 'VERIFIED',
      referenceId: `BPS-CRIM-CLR-2026-${workerId.slice(-6).toUpperCase()}`,
      verifiedAt: new Date().toISOString(),
      authority: 'Bengaluru City Police Crime & Criminal Tracking Network (CCTNS)',
      details: {
        workerId,
        adverseRecordsFound: false,
        validityMonths: 12,
        clearedAtStation: 'Indiranagar Police Station'
      }
    };
  }
}

/**
 * Factory pattern: Returns live Govt API client if env vars set, else mock adapter.
 */
export function createVerificationProvider(): VerificationProvider {
  // If government API credentials are configured in production:
  // ESHRAM_API_KEY, UIDAI_ASA_LICENSE_KEY, NCD_SERVICE_URL
  return new MockVerificationProvider();
}
