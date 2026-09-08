/**
 * /api/disputes
 * GET: List disputes for peer arbitration council & admin
 * POST: File a new dispute (e.g. triggered by rating <= 3 or manual customer complaint)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer, db } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  try {
    let query = supabaseServer.from('Dispute').select(`
      id,
      bookingId,
      raisedById,
      reason,
      description,
      customerStatement,
      workerDefenseStatement,
      status,
      resolutionNotes,
      resolvedAt,
      remedyAmount,
      createdAt,
      booking:Booking(
        id,
        bookingNumber,
        totalAmount,
        customer:User!Booking_customerId_fkey(firstName, lastName, phone),
        worker:WorkerProfile!Booking_workerId_fkey(
          id,
          user:User!WorkerProfile_userId_fkey(firstName, lastName),
          society:Society!WorkerProfile_societyId_fkey(name)
        )
      ),
      councilVotes:PeerCouncilVote(id, voterId, decision, comments, votedAt)
    `);

    if (status && status !== 'ALL') {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('createdAt', { ascending: false }).limit(25);

    if (!error && data && data.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'SUPABASE_DB',
        count: data.length,
        disputes: data
      });
    }
  } catch (err) {
    console.warn('[disputes API] DB query warning:', err);
  }

  // Demo Fallback Cases
  const mockDisputes = [
    {
      id: 'disp-01',
      bookingId: 'bkg-101',
      bookingNumber: 'BKG-2026-8812',
      customerName: 'Ananya Deshmukh',
      workerName: 'Ramesh Chavan',
      workerTrade: 'Master Electrician',
      cooperativeName: 'Vishwa Karma Labour Society',
      disputeReason: 'Incomplete junction box insulation reported post-service.',
      amount: 650,
      status: 'PEER_REVIEW',
      filedDate: '2 hours ago',
      votes: {
        upheld: 1,
        overturned: 0,
        requiredTotal: 3
      },
      councilMembers: [
        { id: 'c-01', name: 'Suresh Patil (Senior Wireman, Ward 88)', hasVoted: true, vote: 'UPHELD' },
        { id: 'c-02', name: 'Vijay Nair (Co-op Auditor)', hasVoted: false },
        { id: 'c-03', name: 'Lakshmi Devi (Labour Council Member)', hasVoted: false }
      ]
    },
    {
      id: 'disp-02',
      bookingId: 'bkg-104',
      bookingNumber: 'BKG-2026-7734',
      customerName: 'Vikram Mehta',
      workerName: 'Kavita Sundaram',
      workerTrade: 'Plumbing Specialist',
      cooperativeName: 'Kalyan Labour Workers Society',
      disputeReason: 'Claimed delayed arrival of 35 minutes on standard non-emergency appointment.',
      amount: 450,
      status: 'RESOLVED_OVERTURNED',
      filedDate: '1 day ago',
      votes: {
        upheld: 0,
        overturned: 3,
        requiredTotal: 3
      },
      resolutionNotes: 'Peer council reviewed GPS traffic log along Outer Ring Road and found genuine force majeure gridlock. Worker upheld without penalty.',
      councilMembers: [
        { id: 'c-01', name: 'Ravi Verma (Plumber Rep)', hasVoted: true, vote: 'OVERTURNED' },
        { id: 'c-02', name: 'Anita Rao (Co-op Ombudsman)', hasVoted: true, vote: 'OVERTURNED' },
        { id: 'c-03', name: 'Deepak Gowda (Society Vice-Chair)', hasVoted: true, vote: 'OVERTURNED' }
      ]
    }
  ];

  return NextResponse.json({
    success: true,
    source: 'MOCK_SEEDED',
    count: mockDisputes.length,
    disputes: mockDisputes
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookingId,
      raisedById = 'cust-anon-001',
      reason,
      description,
      customerStatement
    } = body;

    if (!bookingId || !reason) {
      return NextResponse.json(
        { error: 'bookingId and reason are required to file a dispute.' },
        { status: 400 }
      );
    }

    try {
      const { data, error } = await db.disputes().insert({
        bookingId,
        raisedById,
        reason,
        description: description || reason,
        customerStatement: customerStatement || description || reason,
        status: 'OPEN'
      }).select().single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          source: 'SUPABASE_DB',
          dispute: data
        }, { status: 201 });
      }
    } catch (dbErr) {
      console.warn('[disputes POST] DB error, using mock response:', dbErr);
    }

    const mockCreated = {
      id: `disp-${Date.now()}`,
      bookingId,
      reason,
      description: description || reason,
      status: 'OPEN',
      filedDate: 'Just now',
      votes: { upheld: 0, overturned: 0, requiredTotal: 3 }
    };

    return NextResponse.json({
      success: true,
      source: 'MOCK_CREATED',
      dispute: mockCreated
    }, { status: 201 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown dispute error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
