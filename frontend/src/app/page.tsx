import React from 'react';
import Link from 'next/link';
import ServiceDiscovery from '@/components/ServiceDiscovery';
import { 
  ShieldCheck, 
  Users, 
  Wallet, 
  HeartHandshake, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-8">
      
      {/* 90 / 5 / 5 Tri-Split Transparency Feature Banner */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Ministry of Cooperation / NCCT • PS ID: 26089</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                90/5/5 Cooperative Split. 100% Surge Pass-Through. Zero Venture Extraction.
              </h2>
            </div>

            <div className="flex items-center gap-2 self-center sm:self-auto">
              <Link
                href="/b2b"
                className="px-3.5 py-2 rounded-xl glass-panel text-slate-200 font-semibold text-xs sm:text-sm hover:border-white/30 transition-all"
              >
                B2B/B2G Anchor
              </Link>
              <Link
                href="/register/worker"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Register Worker</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 90% Worker */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">90%</span>
                <Wallet className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Direct Worker Take-Home</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct bank payout on job completion. In emergency dispatches, <strong className="text-emerald-300">100% of surge premiums</strong> pass straight to the worker.
              </p>
            </div>

            {/* 5% Primary Society */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-cyan-400">5%</span>
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Primary Cooperative Society</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Democratically retained by the primary society for tool libraries, shared equipment, legal ombud services, and local administration.
              </p>
            </div>

            {/* 5% Mutual Aid & Social Security */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-amber-400">5%</span>
                <HeartHandshake className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Social Security & Mutual Aid</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ₹5L family medical cover, micro-pensions, and personal disability pool. Complemented by a 1% Cooperative Customer Guarantee Fund.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Main Service Discovery Interface */}
      <ServiceDiscovery />

    </div>
  );
}
