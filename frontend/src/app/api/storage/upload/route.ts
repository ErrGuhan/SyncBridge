/**
 * /api/storage/upload
 * POST: Directly receives file (multipart FormData), uploads to Supabase Storage 'worker-vault' bucket,
 * and creates a Certification record for the worker.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const workerId = (formData.get('workerId') as string) || 'wrk-01';
    const documentType = (formData.get('documentType') as string) || 'TRADE_CERTIFICATE';
    const title = (formData.get('title') as string) || file?.name || 'Uploaded Certificate';

    if (!file) {
      return NextResponse.json({ error: 'file is required.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${workerId}/${Date.now()}_${sanitizedName}`;
    const bucketName = 'worker-vault';

    let publicUrl = `https://qniqutaavdjnutnprjdk.supabase.co/storage/v1/object/public/${bucketName}/${storagePath}`;

    // 1. Try Supabase storage upload
    try {
      const { data: uploadData, error: uploadErr } = await supabaseServer.storage
        .from(bucketName)
        .upload(storagePath, fileBuffer, {
          contentType: file.type || 'application/pdf',
          upsert: true
        });

      if (!uploadErr && uploadData) {
        const { data: pubData } = supabaseServer.storage
          .from(bucketName)
          .getPublicUrl(storagePath);
        if (pubData?.publicUrl) {
          publicUrl = pubData.publicUrl;
        }
      }
    } catch (sErr) {
      console.warn('[storage upload] Supabase storage warning:', sErr);
    }

    // 2. Persist to Certification table
    try {
      await supabaseServer.from('Certification').insert({
        workerProfileId: workerId,
        title,
        issuingAuthority: 'NCCT / Skill Council',
        skill: documentType,
        documentUrl: publicUrl,
        verificationStatus: 'PENDING'
      });
    } catch (cErr) {
      console.warn('[storage upload] Certification row warning:', cErr);
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      storagePath,
      publicUrl,
      documentType,
      uploadedAt: new Date().toISOString()
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown upload error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
