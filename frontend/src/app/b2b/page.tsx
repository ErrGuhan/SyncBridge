'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  Send, 
  Award,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { MOCK_B2G_CONTRACTS, B2GContract } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';

export default function B2GPortalPage() {
  const { t } = useLanguage();
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
    <div className="space-y-10 py-6 sm:py-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 border border-blue-200">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>{t('b2bBannerTag')}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          {t('b2bTitle')}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {t('b2bSubtitle')}
        </p>
      </section>

      {/* Highlights Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>{t('b2bStatHours')}</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">6,450+ hrs/mo</p>
          <p className="text-xs text-slate-500">Committed institutional hours preventing seasonal gig starvation.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{t('b2bStatSLA')}</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">100% On-Time</p>
          <p className="text-xs text-slate-500">Cooperative escrow eliminates traditional 90-day government contractor delays.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>{t('b2bStatCompliance')}</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">98.6% Average</p>
          <p className="text-xs text-slate-500">Backed by certified master technicians and primary society pooling.</p>
        </div>
      </section>

      {/* Active Institutional Contracts */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Contract Ledger
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              {t('b2bLedgerTitle')}
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Governed under Multi-State Cooperative Framework & verified registry
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {contracts.map((c) => (
            <div 
              key={c.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all space-y-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                      {c.id.toUpperCase()}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {c.contractType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 pt-1">{c.institutionName}</h3>
                  <p className="text-xs text-slate-500">{c.department}</p>
                </div>

                <div className="flex items-center gap-6 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">Annual Value</span>
                    <span className="text-base font-bold text-slate-900">{c.totalAnnualValue}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">SLA Compliance</span>
                    <span className="text-base font-bold text-emerald-600">{c.slaCompliancePct}%</span>
                  </div>
                </div>
              </div>

              {/* Scope & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block">Contract Scope</span>
                  <p className="text-slate-700 leading-relaxed">{c.scope}</p>
                  <div className="pt-2 flex items-center gap-2 text-slate-600 text-[11px]">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Nodal Authority: <strong className="text-slate-900">{c.contactNodalOfficer}</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block">Cooperative Fleet</span>
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{c.assignedWorkersCount} Dedicated Tradespeople</span>
                      <span className="text-slate-300">•</span>
                      <span>{c.monthlyVolumeHours} hrs/month</span>
                    </div>
                    <div className="text-[11px] text-slate-600 pt-1">
                      Societies: {c.participatingCooperatives.join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px]">
                    <span className="text-emerald-700 font-medium">✓ Escrow Protected: {c.paymentTermDays}-Day Net Settlement</span>
                    <span className="text-blue-700 font-medium">Audit Grade: A+</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional Tender / RFQ Engagement Card */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              For Municipalities, PSU Warehouses & Cooperative Enterprises
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {t('b2bIssueRfq')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Directly empanel registered Labour Cooperatives for your ward offices, processing facilities, and campuses with transparent 90/5/5 accounting and guaranteed SLAs.
            </p>
          </div>

          {showRfqSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Institutional RFQ registered! Federation Nodal Desk will transmit formal tender empanelment documents within 24 hours.</span>
            </div>
          ) : (
            <form onSubmit={handleRfqSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution / Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Municipal Corporation"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Service Requirement *
                  </label>
                  <select
                    value={serviceReq}
                    onChange={(e) => setServiceReq(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Municipal Facility Maintenance">Municipal Facility Electrical & Plumbing</option>
                    <option value="Cold Chain & Dairy Refrigeration">Cold Chain & Dairy Refrigeration</option>
                    <option value="Agro-Warehouse Conveyor Electricals">Agro-Warehouse Conveyor Electricals</option>
                    <option value="Hospital Sanitary & Oxygen Line Maintenance">Hospital Sanitary & Oxygen Line Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-500">
                  Backed by Cooperative Federation SLA and 1% Guarantee Fund.
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('b2bSubmitRfq')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
