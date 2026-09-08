/**
 * /api/workers/[id]/verify
 * GET: Retrieve all government/cooperative credentials for a worker
 * POST: Execute verification check via VerificationProvider and persist result
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { createVerificationProvider } from '@/lib/verificationProvider';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const { data: verifications, error } = await supabaseServer
        .from('WorkerVerification')
        .select('*')
        .eq('workerProfileId', id);

      if (!error && verifications && verifications.length > 0) {
        return NextResponse.json({
          success: true,
          source: 'SUPABASE_DB',
          workerId: id,
          verifications
        });
      }
    } catch (dbErr) {
      console.warn('[verify API GET] DB error:', dbErr);
    }

    // Default verified credentials for demo
    return NextResponse.json({
      success: true,
      source: 'MOCK_SEEDED',
      workerId: id,
      verifications: [
        {
          verificationType: 'AADHAAR',
          status: 'VERIFIED',
          authority: 'UIDAI',
          referenceId: 'UIDAI-2026-998124',
          verifiedAt: '2026-01-10T10:00:00Z'
        },
        {
          verificationType: 'ESHRAM_UAN',
          status: 'VERIFIED',
          authority: 'Ministry of Labour & Employment',
          referenceId: 'ESHRAM-2026-382910',
          verifiedAt: '2026-01-12T14:30:00Z'
        },
        {
          verificationType: 'POLICE_CLEARANCE',
          status: 'VERIFIED',
          authority: 'Bengaluru Police CCTNS',
          referenceId: 'BPS-CLR-2026-0042',
          verifiedAt: '2026-02-01T09:15:00Z'
        }
      ]
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown verification error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { verificationType, credentialValue = '' } = body;

    const provider = createVerificationProvider();
    let result;

    switch (verificationType) {
      case 'AADHAAR':
        result = await provider.verifyAadhaar(credentialValue, id);
        break;
      case 'ESHRAM_UAN':
        result = await provider.syncEShram(credentialValue, id);
        break;
      case 'NCD_SOCIETY':
        result = await provider.syncNCD(credentialValue || 'NCD-KA-BLR-0042');
        break;
      case 'POLICE_CLEARANCE':
        result = await provider.checkPoliceClearance(id);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid verificationType. Supported: AADHAAR, ESHRAM_UAN, NCD_SOCIETY, POLICE_CLEARANCE' },
          { status: 400 }
        );
    }

    // Persist to Supabase if available
    try {
      await supabaseServer.from('WorkerVerification').upsert({
        workerProfileId: id,
        verificationType: result.verificationType,
        status: result.status,
        authority: result.authority,
        referenceId: result.referenceId,
        metadata: result.details,
        verifiedAt: result.verifiedAt
      }, { onConflict: 'workerProfileId,verificationType' });
    } catch (dbErr) {
      console.warn('[verify API POST] DB save warning:', dbErr);
    }

    return NextResponse.json({
      success: true,
      workerId: id,
      result
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown verification error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
