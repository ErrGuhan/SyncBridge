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
      
      {/* 80 / 15 / 5 Tri-Split Transparency Feature Banner */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Layers className="w-4 h-4" />
                <span>The Cooperative Economic Protocol</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Zero Exploitative Platform Cuts. 100% Democratic Transparency.
              </h2>
            </div>

            <Link
              href="/register/worker"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all self-center sm:self-auto shrink-0 flex items-center gap-1.5"
            >
              <span>Join as Trade Worker</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 80% Worker */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">80%</span>
                <Wallet className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Direct Worker Digital Wallet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paid directly into the worker’s bank account on job completion. No delayed payouts or hidden commissions.
              </p>
            </div>

            {/* 15% Coop Reserve */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-cyan-400">15%</span>
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Cooperative Operating Fund</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Co-owned by all members. Funds bulk tool purchases, training centers, dispute arbitration, and infrastructure.
              </p>
            </div>

            {/* 5% Mutual Aid */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-indigo-400">5%</span>
                <HeartHandshake className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Mutual Aid & Welfare Reserve</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated emergency pool providing on-duty injury insurance, hospital subsidies, and pensions for gig workers.
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
