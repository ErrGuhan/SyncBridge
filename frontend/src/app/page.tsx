'use client';

import React from 'react';
import Link from 'next/link';
import ServiceDiscovery from '@/components/ServiceDiscovery';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ShieldCheck, 
  Wallet, 
  Users, 
  HeartHandshake, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* 1. HIGH-CONTRAST COOPERATIVE CHARTER BANNER (90 / 5 / 5 MODEL) */}
      {/* -------------------------------------------------------------------- */}
      <section className="accessible-card p-4 sm:p-5 bg-amber-50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Cooperative Worker-Owned Platform</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-black mt-0.5 tracking-tight">
              90% Payout to Workers. Zero Corporate Cuts.
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/register/worker"
              className="min-h-[48px] px-3.5 py-2 rounded-xl bg-black text-white hover:bg-slate-800 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
            >
              <span>Join as Worker</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* 3 Large Accessible Split Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 90% Worker Card */}
          <div className="p-3.5 rounded-xl border-2 border-black bg-white space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-black">90%</span>
              <Wallet className="w-6 h-6 text-emerald-600 stroke-[2.5]" />
            </div>
            <h3 className="text-sm font-black text-black leading-tight">Direct Worker Wallet</h3>
            <p className="text-xs font-bold text-slate-700">
              Paid straight to the worker member upon job completion with 100% emergency surge pass-through.
            </p>
          </div>

          {/* 5% Society Card */}
          <div className="p-3.5 rounded-xl border-2 border-black bg-white space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-black">5%</span>
              <Users className="w-6 h-6 text-blue-600 stroke-[2.5]" />
            </div>
            <h3 className="text-sm font-black text-black leading-tight">Co-op Tool Library</h3>
            <p className="text-xs font-bold text-slate-700">
              Retained democratically for shared tools, testing equipment, and local cooperative secretary support.
            </p>
          </div>

          {/* 5% Welfare Card */}
          <div className="p-3.5 rounded-xl border-2 border-black bg-white space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-black">5%</span>
              <HeartHandshake className="w-6 h-6 text-amber-600 stroke-[2.5]" />
            </div>
            <h3 className="text-sm font-black text-black leading-tight">Welfare & Insurance</h3>
            <p className="text-xs font-bold text-slate-700">
              ₹5 Lakh family medical safety net, injury coverage, and 1% customer service guarantee fund.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 2. ICON-DRIVEN SERVICE DISCOVERY WITH TOUCH SWIPE CAROUSEL */}
      {/* -------------------------------------------------------------------- */}
      <ServiceDiscovery />
    </div>
  );
}
