'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Users, 
  ArrowRight, 
  Send, 
  Layers, 
  Award,
  Calendar
} from 'lucide-react';
import { MOCK_B2G_CONTRACTS, B2GContract } from '@/data/mockData';

export default function B2GPortalPage() {
  const [contracts] = useState<B2GContract[]>(MOCK_B2G_CONTRACTS);
  const [showRfqSuccess, setShowRfqSuccess] = useState(false);
  const [institutionName, setInstitutionName] = useState('');
  const [serviceReq, setServiceReq] = useState('Municipal Facility Maintenance');

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRfqSuccess(true);
    setTimeout(() => {
      setShowRfqSuccess(false);
      setInstitutionName('');
    }, 4500);
  };

  return (
    <div className="space-y-12 py-4 sm:py-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-semibold text-amber-300 border-amber-500/30">
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Ministry of Cooperation / NCCT • Problem Statement ID: 26089</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Institutional Anchor Demand & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            B2B / B2G Facility Management
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Public-Private-Cooperative Partnerships (PPCP) anchoring 44,000+ primary labour cooperatives with long-term, high-volume maintenance contracts from Municipal Corporations, Dairy Federations, and Public Institutions.
        </p>
      </section>

      {/* Highlights Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Guaranteed Demand Baseline</span>
          </div>
          <p className="text-2xl font-black text-white">6,450+ hrs/mo</p>
          <p className="text-xs text-slate-400">Committed institutional hours preventing seasonal gig starvation.</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>7-Day Payout SLA</span>
          </div>
          <p className="text-2xl font-black text-white">100% On-Time</p>
          <p className="text-xs text-slate-400">Cooperative escrow eliminates traditional 90-day government contractor delays.</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>SLA Compliance</span>
          </div>
          <p className="text-2xl font-black text-white">98.6% Average</p>
          <p className="text-xs text-slate-400">Backed by NCCT-certified master technicians and primary society pooling.</p>
        </div>
      </section>

      {/* Active Institutional Contracts */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Contract Ledger
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Active Municipal & Cooperative Frameworks
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Governed under Multi-State Cooperative Societies Act & NCD registry
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {contracts.map((c) => (
            <div 
              key={c.id}
              className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-cyan-400/40 transition-all shadow-xl space-y-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold bg-cyan-950/70 text-cyan-300 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                      {c.id.toUpperCase()}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-medium border border-white/5">
                      {c.contractType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white pt-1">{c.institutionName}</h3>
                  <p className="text-xs text-slate-400">{c.department}</p>
                </div>

                <div className="flex items-center gap-4 bg-slate-900/70 px-4 py-2.5 rounded-2xl border border-white/5 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Annual Value</span>
                    <span className="text-lg font-black text-amber-300">{c.totalAnnualValue}</span>
                  </div>
                  <div className="border-l border-white/10 pl-4">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">SLA Compliance</span>
                    <span className="text-lg font-black text-emerald-400">{c.slaCompliancePct}%</span>
                  </div>
                </div>
              </div>

              {/* Scope & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">Contract Scope</span>
                  <p className="text-slate-200 leading-relaxed">{c.scope}</p>
                  <div className="pt-2 flex items-center gap-2 text-slate-400 text-[11px]">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Nodal Authority: <strong className="text-white">{c.contactNodalOfficer}</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">Cooperative Society Fleet</span>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span>{c.assignedWorkersCount} Dedicated Tradespeople</span>
                      <span className="text-slate-500">•</span>
                      <span>{c.monthlyVolumeHours} hrs/month</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Societies: {c.participatingCooperatives.join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[11px]">
                    <span className="text-emerald-400 font-medium">✓ Escrow Protected: {c.paymentTermDays}-Day Net Settlement</span>
                    <span className="text-cyan-400">Audit Grade: A+</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional Tender / RFQ Engagement Card */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              For Municipalities, PSU Warehouses & Dairy Cooperatives
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Issue an Institutional Maintenance RFQ
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Directly empanel NCD-registered Labour Cooperatives for your ward offices, processing dairies, and schools with transparent 90/5/5 accounting and guaranteed SLAs.
            </p>
          </div>

          {showRfqSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Institutional RFQ registered! Federation Nodal Desk will transmit formal tender empanelment docs within 24 hours.</span>
            </div>
          ) : (
            <form onSubmit={handleRfqSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Institution / Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru Metro Rail Corporation (BMRCL)"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Service Requirement *
                  </label>
                  <select
                    value={serviceReq}
                    onChange={(e) => setServiceReq(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  >
                    <option value="Municipal Facility Maintenance" className="bg-slate-900">Municipal Facility Electrical & Plumbing</option>
                    <option value="Cold Chain & Dairy Refrigeration" className="bg-slate-900">Cold Chain & Dairy Refrigeration</option>
                    <option value="Agro-Warehouse Conveyor Electricals" className="bg-slate-900">Agro-Warehouse Conveyor Electricals</option>
                    <option value="Hospital Sanitary & Oxygen Line Maintenance" className="bg-slate-900">Hospital Sanitary & Oxygen Line Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-400">
                  Backed by Multi-State Cooperative Federation SLA and 1% Guarantee Fund.
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Institutional RFQ</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
