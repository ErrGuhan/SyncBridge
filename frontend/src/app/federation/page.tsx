'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { 
  Building2, 
  Briefcase, 
  Wallet, 
  Scale, 
  ShieldCheck, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Users, 
  Award,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { REVENUE_SPLIT, SPLIT_LABEL, SPLIT_LABEL_DETAILED, SPLIT_PCT } from '@/lib/constants';

interface FederationMetricsData {
  success: boolean;
  source: string;
  splitProtocol: {
    label: string;
    description: string;
    ratios: typeof REVENUE_SPLIT;
    percentages: typeof SPLIT_PCT;
  };
  summary: {
    totalJobVolumeThisMonth: number;
    totalJobVolumeAllTime: number;
    grossRevenue: number;
    workerTotal: number;
    coopAdminTotal: number;
    welfareTotal: number;
    techFundTotal: number;
    openDisputesCount: number;
    totalWorkers: number;
    workerVerificationBreakdown: {
      VERIFIED: number;
      PENDING: number;
      REJECTED: number;
      UNVERIFIED: number;
      SUSPENDED: number;
    };
  };
  sections: {
    revenueSplit: {
      totals: {
        grossRevenue: number;
        workerTotal: number;
        coopAdminTotal: number;
        welfareTotal: number;
        techFundTotal: number;
      };
      recentTransactions: Array<{
        id: string;
        transactionId: string;
        bookingNumber: string;
        serviceCity: string;
        grossAmount: number;
        workerShare: number;
        coopAdminShare: number;
        welfareShare: number;
        techFundShare: number;
        paymentMethod: string;
        status: string;
        createdAt: string;
      }>;
    };
    skillCategoryDemand: Array<{
      id: string;
      name: string;
      slug: string;
      basePrice: number;
      bookingCount: number;
      demandSharePct: number;
    }>;
    workerVerifications: {
      counts: {
        VERIFIED: number;
        PENDING: number;
        REJECTED: number;
        UNVERIFIED: number;
        SUSPENDED: number;
      };
      workers: Array<{
        id: string;
        name: string;
        phone: string;
        trade: string;
        society: string;
        experienceYears: number;
        rating: number;
        verificationStatus: string;
      }>;
    };
    openDisputes: {
      openCount: number;
      disputes: Array<{
        id: string;
        bookingNumber: string;
        bookingAmount: number;
        raisedByName: string;
        complainantRole: string;
        reason: string;
        status: string;
        customerStatement: string;
        createdAt: string;
      }>;
    };
  };
}

function FederationDashboardContent() {
  const { user, loginAsDemoUser } = useAuth();
  const [data, setData] = useState<FederationMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/federation/metrics', {
        headers: {
          'x-demo-role': user?.role || 'FEDERATION_ADMIN'
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to load federation metrics (HTTP ${res.status})`);
      }
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch metrics';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-10 py-6 sm:py-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header & Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              <Building2 className="w-3.5 h-3.5" />
              State & National Federation Console
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Audited {SPLIT_LABEL} Protocol
            </span>
            {data?.source && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Source: {data.source}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Federation Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Read-only multi-society oversight: Real-time job volume, {SPLIT_LABEL_DETAILED}, worker credentialing, and dispute queue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Metrics'}</span>
          </button>
          
          {user?.role !== 'FEDERATION_ADMIN' && (
            <button
              onClick={() => loginAsDemoUser('FEDERATION_ADMIN')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Switch to Federation Admin</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="flex-1 font-medium">{error}</p>
          <button
            onClick={fetchMetrics}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 1. TOP STATS GRID                                                      */}
      {/* ---------------------------------------------------------------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        
        {/* Stat 1: Total Job Volume This Month */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-700 font-semibold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Job Volume
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">This Month</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? '...' : (data?.summary.totalJobVolumeThisMonth ?? 0)}
          </p>
          <p className="text-xs text-slate-500">
            {data?.summary.totalJobVolumeAllTime ?? 0} total bookings recorded all-time
          </p>
        </div>

        {/* Stat 2: Gross Revenue & 90/5/3/2 Split */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-700 font-semibold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-600" />
              Gross Settled
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono">{SPLIT_LABEL}</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? '...' : `₹${(data?.summary.grossRevenue ?? 0).toLocaleString('en-IN')}`}
          </p>
          <p className="text-xs text-emerald-700 font-medium">
            ₹{(data?.summary.workerTotal ?? 0).toLocaleString('en-IN')} ({SPLIT_PCT.worker}) to workers
          </p>
        </div>

        {/* Stat 3: Open Disputes / Arbitration */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-700 font-semibold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-600" />
              Open Disputes
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-mono">Peer Queue</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? '...' : (data?.summary.openDisputesCount ?? 0)}
          </p>
          <p className="text-xs text-slate-500">
            Active peer restorative arbitration review
          </p>
        </div>

        {/* Stat 4: Worker Verification Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-700 font-semibold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Verified Workers
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono">
              {data?.summary.totalWorkers ?? 0} Total
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? '...' : (data?.summary.workerVerificationBreakdown.VERIFIED ?? 0)}
          </p>
          <p className="text-xs text-slate-500">
            {data?.summary.workerVerificationBreakdown.PENDING ?? 0} pending review · {data?.summary.workerVerificationBreakdown.REJECTED ?? 0} rejected
          </p>
        </div>

        {/* Stat 5: Skill-Category Demand */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-violet-700 font-semibold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-violet-600" />
              Top Skill Trade
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 font-mono">
              {data?.sections.skillCategoryDemand.length ?? 0} Trades
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 truncate">
            {loading ? '...' : (data?.sections.skillCategoryDemand[0]?.name || 'Plumbing')}
          </p>
          <p className="text-xs text-slate-500">
            {data?.sections.skillCategoryDemand[0]?.bookingCount ?? 0} bookings ({data?.sections.skillCategoryDemand[0]?.demandSharePct ?? 0}% demand)
          </p>
        </div>

      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 1: REVENUE SPLIT TOTALS (90/5/3/2 CANONICAL CONSTANT)          */}
      {/* ---------------------------------------------------------------------- */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-6 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Section 1</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500">{SPLIT_LABEL} Distribution</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Cooperative Revenue Split Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregated settlement volume strictly partitioned via the platform-wide canonical split constant.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
            <span>Gross:</span>
            <strong className="text-slate-900">₹{(data?.summary.grossRevenue ?? 0).toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* 4 Partition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Worker Wage ({SPLIT_PCT.worker})
            </span>
            <p className="text-xl font-bold text-emerald-950">
              ₹{(data?.summary.workerTotal ?? 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700">Direct patronage credited to tradespeople</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
              Co-op Admin ({SPLIT_PCT.coopAdmin})
            </span>
            <p className="text-xl font-bold text-blue-950">
              ₹{(data?.summary.coopAdminTotal ?? 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-blue-700">Primary society operations & governance</p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-1">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block">
              Welfare & Insurance ({SPLIT_PCT.welfare})
            </span>
            <p className="text-xl font-bold text-indigo-950">
              ₹{(data?.summary.welfareTotal ?? 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-indigo-700">Mutual healthcare, micro-pensions, relief</p>
          </div>

          <div className="p-4 rounded-xl bg-violet-50/60 border border-violet-200 space-y-1">
            <span className="text-[11px] font-bold text-violet-800 uppercase tracking-wider block">
              Platform Tech ({SPLIT_PCT.techFund})
            </span>
            <p className="text-xl font-bold text-violet-950">
              ₹{(data?.summary.techFundTotal ?? 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-violet-700">Hosting, API gateway, open protocols</p>
          </div>
        </div>

        {/* Table: Recent Transactions / Settlements */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Recent Payment Settlement Records
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Gross Total</th>
                  <th className="py-3 px-4 text-right text-emerald-700">Worker (90%)</th>
                  <th className="py-3 px-4 text-right text-blue-700">Admin (5%)</th>
                  <th className="py-3 px-4 text-right text-indigo-700">Welfare (3%)</th>
                  <th className="py-3 px-4 text-right text-violet-700">Tech (2%)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.sections.revenueSplit.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-900">
                      {tx.bookingNumber}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{tx.serviceCity}</td>
                    <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                      ₹{tx.grossAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-emerald-700">
                      ₹{tx.workerShare.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-blue-700">
                      ₹{tx.coopAdminShare.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-indigo-700">
                      ₹{tx.welfareShare.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-violet-700">
                      ₹{tx.techFundShare.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 2: SKILL-CATEGORY DEMAND TABLE                                */}
      {/* ---------------------------------------------------------------------- */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6 sm:p-7">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">Section 2</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono text-slate-500">Service Category Breakdown</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            Skill-Category Demand & Volume
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real customer booking demand distribution across verified cooperative trade categories.
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Trade Category Name</th>
                <th className="py-3 px-4">Slug Identifier</th>
                <th className="py-3 px-4 text-right">Base Price</th>
                <th className="py-3 px-4 text-right">Job Count</th>
                <th className="py-3 px-4 text-right">Demand Share</th>
                <th className="py-3 px-4">Market Share Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.sections.skillCategoryDemand.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {cat.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{cat.slug}</td>
                  <td className="py-3 px-4 text-right text-slate-700">
                    ₹{cat.basePrice} / hr
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {cat.bookingCount}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-violet-700">
                    {cat.demandSharePct}%
                  </td>
                  <td className="py-3 px-4 w-44">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-violet-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(8, cat.demandSharePct))}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 3: WORKER VERIFICATION STATUS BREAKDOWN                        */}
      {/* ---------------------------------------------------------------------- */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Section 3</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500">Worker Credentialing Registry</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Worker Verification Status Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Member onboarding pipeline: e-Shram, Aadhaar e-KYC, and trade diploma validation.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified: {data?.summary.workerVerificationBreakdown.VERIFIED ?? 0}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Pending: {data?.summary.workerVerificationBreakdown.PENDING ?? 0}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              Rejected: {data?.summary.workerVerificationBreakdown.REJECTED ?? 0}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Primary Trade</th>
                <th className="py-3 px-4">Cooperative Society</th>
                <th className="py-3 px-4 text-center">Experience</th>
                <th className="py-3 px-4 text-center">Rating</th>
                <th className="py-3 px-4 text-center">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.sections.workerVerifications.workers.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{w.name}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-600">{w.phone}</td>
                  <td className="py-2.5 px-4 text-slate-800">{w.trade}</td>
                  <td className="py-2.5 px-4 text-slate-600">{w.society}</td>
                  <td className="py-2.5 px-4 text-center text-slate-700">{w.experienceYears} yrs</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="font-semibold text-amber-700">★ {w.rating}</span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      w.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : w.verificationStatus === 'PENDING'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {w.verificationStatus === 'VERIFIED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {w.verificationStatus === 'PENDING' && <Clock className="w-3 h-3 text-amber-600" />}
                      {w.verificationStatus === 'REJECTED' && <XCircle className="w-3 h-3 text-rose-600" />}
                      {w.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 4: OPEN DISPUTES & PEER ARBITRATION QUEUE                     */}
      {/* ---------------------------------------------------------------------- */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Section 4</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500">Restorative Arbitration</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Open Disputes & Peer Arbitration Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Democratic grievance redressal: zero algorithmic bans; disputes reviewed by fellow master artisans.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            {data?.sections.openDisputes.openCount ?? 0} Cases in Review
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Complainant</th>
                <th className="py-3 px-4">Reason for Concern</th>
                <th className="py-3 px-4">Complainant Statement</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.sections.openDisputes.disputes.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">{d.id}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{d.bookingNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{d.raisedByName}</td>
                  <td className="py-3 px-4 text-slate-800">{d.reason}</td>
                  <td className="py-3 px-4 text-slate-600 italic max-w-xs truncate">
                    "{d.customerStatement}"
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}

export default function FederationAdminPage() {
  return (
    <AuthGuard 
      allowedRoles={['FEDERATION_ADMIN', 'SUPER_ADMIN', 'COOP_ADMIN', 'SOCIETY_SECRETARY']} 
      redirectRole="admin"
    >
      <FederationDashboardContent />
    </AuthGuard>
  );
}
