'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  ShieldCheck, 
  TrendingUp, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  Users, 
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';
import { MOCK_WELFARE_FUND_SNAPSHOT } from '@/data/mockData';

export default function WelfarePortalPage() {
  const [pensionMonthlyContrib, setPensionMonthlyContrib] = useState<number>(500);
  const [loanRequested, setLoanRequested] = useState(false);

  // Pension estimation calculation
  const coopMatch = pensionMonthlyContrib * 0.5; // 50% cooperative federation match
  const totalMonthlySavings = pensionMonthlyContrib + coopMatch;
  const estimatedRetirementCorpus15Yrs = Math.round(totalMonthlySavings * 12 * 15 * 1.85); // with 8% compound yield

  return (
    <div className="space-y-12 py-4 sm:py-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-semibold text-emerald-300 border-emerald-500/30">
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          <span>Worker Social Security & Mutual Aid Pool • PS ID: 26089</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Dignity & Non-Exploitative <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Social Security Infrastructure
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Unlike commercial gig platforms where unorganized workers bear 100% of the health and accident risks, 5% of every transaction across our cooperative network automatically fuels a collective mutual aid trust.
        </p>
      </section>

      {/* Corpus Overview Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1.5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Collective Corpus</span>
          <p className="text-3xl font-black text-white">{MOCK_WELFARE_FUND_SNAPSHOT.totalCorpus}</p>
          <span className="text-xs text-emerald-400 font-medium">Audited by Registrar of Cooperatives</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1.5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Medical Claims Settled</span>
          <p className="text-3xl font-black text-emerald-300">{MOCK_WELFARE_FUND_SNAPSHOT.medicalClaimsSettled}</p>
          <span className="text-xs text-emerald-400 font-medium">{MOCK_WELFARE_FUND_SNAPSHOT.totalMedicalPaid} disbursed cashless</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1.5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Micro-Pension Members</span>
          <p className="text-3xl font-black text-cyan-300">{MOCK_WELFARE_FUND_SNAPSHOT.microPensionAccounts.toLocaleString()}</p>
          <span className="text-xs text-cyan-400 font-medium">With 50% cooperative match</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1.5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">1% Customer Guarantee Fund</span>
          <p className="text-3xl font-black text-amber-300">{MOCK_WELFARE_FUND_SNAPSHOT.guaranteeFundReserve}</p>
          <span className="text-xs text-amber-300 font-medium">Instant customer damage recourse</span>
        </div>
      </section>

      {/* 4 Pillars of Protection */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Democratic Protections
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Four Core Pillars of Cooperative Mutual Aid
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">₹5 Lakhs Family Health Shield</h3>
                <span className="text-xs text-emerald-400 font-semibold">Cashless Hospitalization</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Covers primary member, spouse, and dependent children across 850+ empanelled government and cooperative healthcare facilities. Pre-existing conditions covered after 90 days of active cooperative standing.
            </p>
            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 flex justify-between">
              <span>Claims Approval Rate: <strong>98.4%</strong></span>
              <span className="text-emerald-300">Direct TPA Settlement</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">₹10 Lakhs Accident & Disability Cover</h3>
                <span className="text-xs text-cyan-400 font-semibold">Active On-Duty & In-Transit</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Immediate financial support in the event of job-site electrical shocks, falls from height, or transit accidents while travelling to customer appointments within the 10km Haversine radius.
            </p>
            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 flex justify-between">
              <span>Active Policies: <strong>4,120 workers</strong></span>
              <span className="text-cyan-300">24-Hour Nominee Disbursement</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Retirement Micro-Pension Trust</h3>
                <span className="text-xs text-indigo-400 font-semibold">50% Federation Match</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every ₹100 of dividend earnings opted by the worker into their pension fund receives a ₹50 matching grant from the Cooperative Society operating pool, creating true long-term wealth.
            </p>
            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 flex justify-between">
              <span>Enrolled Members: <strong>3,840</strong></span>
              <span className="text-indigo-300">Tier-II PFRDA Compliant</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">1% Customer Guarantee Fund</h3>
                <span className="text-xs text-amber-400 font-semibold">Decoupled Customer Damage Recourse</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Eliminates the structural bullying of gig workers. In case of unintentional damage to client property, claims up to ₹25,000 are settled from this reserve without docking worker pay or forcing predatory fines.
            </p>
            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 flex justify-between">
              <span>Reserve Size: <strong>₹48.25 Lakhs</strong></span>
              <span className="text-amber-300">Peer Council Adjudicated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Micro-Pension Savings Calculator */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 shadow-2xl space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Interactive Calculator
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Worker Retirement Corpus Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            See how small monthly contributions from completed gig payouts grow with the 50% cooperative match.
          </p>
        </div>

        <div className="max-w-xl mx-auto glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-300 mb-2">
              <span className="font-semibold">Your Monthly Contribution:</span>
              <span className="text-base font-bold text-emerald-400">₹{pensionMonthlyContrib} / month</span>
            </div>
            <input 
              type="range"
              min={200}
              max={3000}
              step={100}
              value={pensionMonthlyContrib}
              onChange={(e) => setPensionMonthlyContrib(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Coop Federation 50% Match</span>
              <span className="text-base font-bold text-cyan-300">+₹{coopMatch} / mo</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Total Monthly Invested</span>
              <span className="text-base font-bold text-white">₹{totalMonthlySavings} / mo</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300 block">Projected 15-Year Retirement Corpus:</span>
              <span className="text-2xl font-black text-emerald-300">
                ₹{estimatedRetirementCorpus15Yrs.toLocaleString()}
              </span>
            </div>
            <Link
              href="/register/worker"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Enroll as Member
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
