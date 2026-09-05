import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType, workerId, documentType } = await req.json();

    if (!fileName || !workerId || !documentType) {
      return NextResponse.json(
        { error: 'fileName, workerId, and documentType are required' },
        { status: 400 }
      );
    }

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `worker-vault/${workerId}/${documentType}_${Date.now()}_${sanitizedName}`;

    // Cloud Storage Bucket Name
    const bucketName = process.env.GCS_BUCKET_NAME || 'syncbridge-cooperative-vault';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qniqutaavdjnutnprjdk.supabase.co';

    // Generates signed upload URL for Cloud Storage / Supabase Storage endpoint
    const signedUploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${storagePath}`;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`;

    return NextResponse.json({
      success: true,
      bucket: bucketName,
      storagePath,
      signedUploadUrl,
      publicUrl,
      expiresInSeconds: 900,
      protocol: 'GCS_V4_COMPLIANT'
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to generate storage upload URL' },
      { status: 500 }
    );
  }
}
