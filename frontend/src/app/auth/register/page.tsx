'use client';

import React from 'react';
import Link from 'next/link';
import { 
  User, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  FileCheck,
  Building
} from 'lucide-react';

export default function RegisterGatewayPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cooperative Membership & Account Creation</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Join the Democratic Gig Network
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Select your account type to begin registration with transparent pricing and worker-first protection.
        </p>
      </div>

      {/* 4 Registration Pathways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Pathway 1: Customer Account */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Customer Account</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Book certified plumbers, electricians, appliance technicians, and carpenters within 5 km. Enjoy 1% guarantee damage recourse and transparent 90/5/5 fee breakdowns.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero hidden surge fees or markups</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI Home Diagnostic Assistant for fair price quotes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Same-day emergency dispatch options</span>
              </li>
            </ul>
          </div>

          <Link
            href="/auth/login?role=customer"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Create Customer Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pathway 2: Cooperative Worker Member */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Worker Member Onboarding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Join a registered primary labour cooperative society. Keep 90% of every rupee earned, receive daily payouts, access ₹5 Lakh health cover, and gain peer restorative justice.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>90% direct take-home earnings on same-day settlement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>e-Shram UAN and trade certification integration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No arbitrary account deactivations or rating bans</span>
              </li>
            </ul>
          </div>

          <Link
            href="/register/worker"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Start 5-Step Worker Registration</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pathway 3: Primary Society Registration */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Primary Society Chapter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empanel your primary labour cooperative society. Receive 5% operational overhead from all member jobs, manage shared power tool libraries, and govern your roster.
            </p>
          </div>

          <Link
            href="/auth/login?role=coop_admin"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Society Secretary Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pathway 4: Institutional B2B / B2G Empanelment */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">B2B / B2G Institutional RFQ</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              For Municipal Corporations, Dairy Federations, and Public Institutions seeking long-term facility maintenance contracts backed by cooperative SLAs and escrow.
            </p>
          </div>

          <Link
            href="/b2b"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Issue Institutional RFQ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      <div className="text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
          Sign in to your portal
        </Link>
      </div>

    </div>
  );
}
