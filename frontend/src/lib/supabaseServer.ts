/**
 * SyncBridge — Server-side Supabase Client
 * Uses the SERVICE_ROLE key for trusted server operations (API routes, middleware).
 * NEVER import this in client components — it exposes the service-role key.
 */

import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://qniqutaavdjnutnprjdk.supabase.co';
const DEFAULT_SERVICE_ROLE_KEY = 'dummy-service-role-key-for-build';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  DEFAULT_SERVICE_ROLE_KEY;

if (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.SUPABASE_URL) {
  console.warn(
    '[supabaseServer] NEXT_PUBLIC_SUPABASE_URL not found in environment. ' +
    'Using fallback project URL. In Vercel, set NEXT_PUBLIC_SUPABASE_URL in Project Settings > Environment Variables.'
  );
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SECRET_KEY) {
  console.warn(
    '[supabaseServer] SUPABASE_SERVICE_ROLE_KEY not found in environment. ' +
    'Using fallback key. In Vercel, set SUPABASE_SERVICE_ROLE_KEY in Project Settings > Environment Variables.'
  );
}

export const supabaseServer = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// ---------------------------------------------------------------------------
// Typed helper: run a raw SQL query via the Supabase RPC / REST SQL interface
// ---------------------------------------------------------------------------

export async function supabaseSQL<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const { data, error } = await supabaseServer.rpc('exec_sql', {
    query: sql,
    params
  });
  if (error) throw new Error(`[supabaseSQL] ${error.message}`);
  return (data ?? []) as T[];
}

// ---------------------------------------------------------------------------
// Typed table helpers — avoids string literal table names in API routes
// ---------------------------------------------------------------------------

export const db = {
  workers: () => supabaseServer.from('WorkerProfile'),
  users: () => supabaseServer.from('User'),
  bookings: () => supabaseServer.from('Booking'),
  payments: () => supabaseServer.from('Payment'),
  wallets: () => supabaseServer.from('Wallet'),
  walletLedger: () => supabaseServer.from('WalletLedger'),
  disputes: () => supabaseServer.from('Dispute'),
  peerCouncilVotes: () => supabaseServer.from('PeerCouncilVote'),
  certifications: () => supabaseServer.from('Certification'),
  workerVerifications: () => supabaseServer.from('WorkerVerification'),
  societies: () => supabaseServer.from('Society'),
  federations: () => supabaseServer.from('Federation'),
  toolInventory: () => supabaseServer.from('ToolInventory'),
  toolCheckouts: () => supabaseServer.from('ToolCheckout'),
  availabilityWindows: () => supabaseServer.from('AvailabilityWindow'),
  demandSnapshots: () => supabaseServer.from('DemandSnapshot'),
  eventOutbox: () => supabaseServer.from('EventOutbox'),
  serviceCategories: () => supabaseServer.from('ServiceCategory'),
};
