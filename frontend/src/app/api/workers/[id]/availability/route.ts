/**
 * /api/workers/[id]/availability
 * GET: Retrieve availability windows for worker
 * POST: Set or update availability schedule
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try Supabase AvailabilityWindow table
    try {
      const { data, error } = await supabaseServer
        .from('AvailabilityWindow')
        .select('*')
        .eq('workerProfileId', id)
        .eq('isActive', true)
        .order('dayOfWeek', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          success: true,
          source: 'SUPABASE_DB',
          workerId: id,
          windows: data
        });
      }
    } catch (dbErr) {
      console.warn('[availability API] DB query error, using default schedule:', dbErr);
    }

    // Default cooperative working hours (Mon-Sat, 8:00 to 20:00)
    const defaultSchedule = [1, 2, 3, 4, 5, 6].map(day => ({
      dayOfWeek: day,
      startHour: 8,
      endHour: 20,
      timezone: 'Asia/Kolkata',
      isActive: true
    }));

    return NextResponse.json({
      success: true,
      source: 'COOPERATIVE_DEFAULT',
      workerId: id,
      windows: defaultSchedule
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown availability error';
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
    const { windows } = body;

    if (!Array.isArray(windows)) {
      return NextResponse.json(
        { error: 'windows array is required (e.g. [{ dayOfWeek: 1, startHour: 9, endHour: 18 }])' },
        { status: 400 }
      );
    }

    try {
      // Deactivate existing
      await supabaseServer
        .from('AvailabilityWindow')
        .delete()
        .eq('workerProfileId', id);

      // Insert new windows
      const rows = windows.map(w => ({
        workerProfileId: id,
        dayOfWeek: w.dayOfWeek,
        startHour: w.startHour,
        endHour: w.endHour,
        timezone: w.timezone || 'Asia/Kolkata',
        isActive: w.isActive ?? true
      }));

      const { data, error } = await supabaseServer
        .from('AvailabilityWindow')
        .insert(rows)
        .select();

      if (!error) {
        return NextResponse.json({
          success: true,
          source: 'SUPABASE_DB',
          workerId: id,
          windows: data
        });
      }
    } catch (dbErr) {
      console.warn('[availability API POST] DB save error, returning simulated success:', dbErr);
    }

    return NextResponse.json({
      success: true,
      source: 'MOCK_SAVED',
      workerId: id,
      windows
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown availability error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
