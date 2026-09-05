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
  TrendingUp,
  Award
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-10">
      
      {/* -------------------------------------------------------------------- */}
      {/* 1. HERO & 90/5/5 COOPERATIVE CHARTER TRANSPARENCY SECTION */}
      {/* -------------------------------------------------------------------- */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle decorative ambient gradient in corner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/60 via-indigo-50/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Cooperative Worker-Owned Charter</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                90% Payout to Workers. <span className="text-blue-600">Zero Corporate Cut.</span>
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                SyncBridge eliminates extractive gig intermediaries. Member-workers own the cooperative platform, receive fair wages on same-day settlement, and retain 100% of emergency surge premiums.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-center">
              <Link
                href="/register/worker"
                className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Join as Worker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Federation Portal</span>
              </Link>
            </div>
          </div>

          {/* 3 Modern Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 90% Worker Take-Home */}
            <div className="p-5 rounded-xl bg-slate-50/60 border border-slate-200/80 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">90%</span>
                <div className="w-9 h-9 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Direct Worker Take-Home</h3>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  Immediate UPI payout to the member's wallet. In on-demand dispatches, 100% of surge pricing passes straight to the worker.
                </p>
              </div>
              <div className="w-full bg-emerald-200/60 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[90%]" />
              </div>
            </div>

            {/* 5% Primary Society Reserve */}
            <div className="p-5 rounded-xl bg-slate-50/60 border border-slate-200/80 hover:border-blue-200 hover:bg-blue-50/30 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-blue-700 tracking-tight">5%</span>
                <div className="w-9 h-9 rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-700">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Primary Society Treasury</h3>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  Retained democratically by the local cooperative chapter for shared power tool libraries, testing gear, and secretary ops.
                </p>
              </div>
              <div className="w-full bg-blue-200/60 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[5%]" />
              </div>
            </div>

            {/* 5% Social Security & Healthcare */}
            <div className="p-5 rounded-xl bg-slate-50/60 border border-slate-200/80 hover:border-amber-200 hover:bg-amber-50/30 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-amber-700 tracking-tight">5%</span>
                <div className="w-9 h-9 rounded-lg bg-amber-100/80 flex items-center justify-center text-amber-700">
                  <HeartHandshake className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Welfare & Social Security</h3>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  Funds ₹5 Lakh emergency medical hospitalization cover, disability insurance, and a 1% customer guarantee escrow reserve.
                </p>
              </div>
              <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full w-[5%]" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 2. REFINED VISUAL SERVICE DISCOVERY */}
      {/* -------------------------------------------------------------------- */}
      <ServiceDiscovery />

    </div>
  );
}
