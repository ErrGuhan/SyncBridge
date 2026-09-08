'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Wallet, 
  HeartHandshake, 
  ArrowRight, 
  Search, 
  Droplets, 
  Zap, 
  Sparkles, 
  Wind, 
  Hammer, 
  Star, 
  MapPin, 
  AlertTriangle, 
  Wrench, 
  CheckCircle2,
  Paintbrush
} from 'lucide-react';
import { MOCK_WORKERS } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';

const QUICK_SERVICES = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    rate: 'From ₹450/hr',
    icon: Droplets,
    desc: 'Leaks, fittings, pipes & heaters'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    rate: 'From ₹500/hr',
    icon: Zap,
    desc: 'Wiring, switches, fans & fuse'
  },
  {
    id: 'cleaning',
    name: 'Home Cleaning',
    rate: 'From ₹420/hr',
    icon: Sparkles,
    desc: 'Deep cleaning, tanks & sanitization'
  },
  {
    id: 'appliance-repair',
    name: 'Appliances',
    rate: 'From ₹550/hr',
    icon: Wind,
    desc: 'AC servicing, fridge & washing machine'
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    rate: 'From ₹520/hr',
    icon: Hammer,
    desc: 'Furniture repair, locks & doors'
  },
  {
    id: 'painting',
    name: 'Painting',
    rate: 'From ₹480/hr',
    icon: Paintbrush,
    desc: 'Wall touch-ups, waterproofing'
  }
];

interface AiDiagnosticResponse {
  tradeCategory: string;
  urgencyLevel: 'EMERGENCY' | 'HIGH' | 'STANDARD';
  fairPriceRange?: { min: number; max: number };
  estimatedHours?: number;
  suggestedTools?: string[];
  diagnosisSummary: string;
  safetyCaution?: string;
}

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Diagnostic Quick Assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [aiResult, setAiResult] = useState<AiDiagnosticResponse | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/services');
    }
  };

  const handleRunAiDiagnosis = async (promptToUse?: string) => {
    const text = promptToUse || aiPrompt;
    if (!text.trim()) return;

    setIsDiagnosing(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemDescription: text })
      });

      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error('AI diagnosis error:', err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const topArtisans = MOCK_WORKERS.slice(0, 3);

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-300">
      
      {/* -------------------------------------------------------------------- */}
      {/* 1. CLEAN CONSUMER HERO & SEARCH */}
      {/* -------------------------------------------------------------------- */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-12 shadow-xs text-center max-w-5xl mx-auto space-y-6">
        
        {/* Cooperative Trust Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>100% Worker-Member Owned Cooperative • Zero Corporate Middlemen</span>
        </div>

        {/* Clear, Human-Centered Heading */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Trusted Home Services by <span className="text-blue-600">Certified Artisans</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Book background-verified electricians, plumbers, technicians, and carpenters in minutes. Fair transparent pricing for you, 90% direct earnings for skilled workers.
          </p>
        </div>

        {/* Single Modern Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <div className="flex items-center bg-slate-50 border border-slate-300 rounded-2xl p-1.5 shadow-xs focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-5 h-5 ml-3 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search service, trade, or area (e.g. Electrician, Water leak, AC repair)..."
              className="w-full px-3 py-2.5 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
            >
              <span>Find Artisan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Clean Service Category Cards (Unified Styling, No Rainbow Clutter) */}
        <div className="pt-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Popular Services
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_SERVICES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/services?category=${cat.id}`}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center border border-slate-200/60 transition-colors shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">{cat.rate}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 2. THE 3 COOPERATIVE ADVANTAGES (CLEAN BENEFIT CARDS) */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Why Choose a Cooperative Platform?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A sustainable, equitable alternative to predatory aggregator platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Fair Pricing */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Direct 90% Worker Pay</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every artisan keeps 90% of what you pay. No hidden surge charges, no 30% aggregator commissions, and no arbitrary clawbacks.
            </p>
          </div>

          {/* Pillar 2: Background Verified */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">100% Certified & Verified</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every worker is verified via Ministry of Labour e-Shram, background-checked, and sponsored by a registered primary labour society.
            </p>
          </div>

          {/* Pillar 3: Fast Local Dispatch */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">5 km Local Geofencing</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Get matched instantly with qualified artisans in your immediate neighborhood for faster arrival and verified local accountability.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 3. GEMINI AI INSTANT HOME DIAGNOSTIC ASSISTANT */}
      {/* -------------------------------------------------------------------- */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Not sure what trade you need? Ask AI Assistant
              </h2>
              <p className="text-xs text-slate-500">
                Describe your home maintenance issue to instantly determine the required trade, tools, and fair quote range.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
            Powered by Gemini AI
          </span>
        </div>

        {/* Input & Quick Try Chips */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAiDiagnosis()}
              placeholder="Describe your issue (e.g. Water dripping from bathroom ceiling, circuit breaker tripping)..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
            />
            <button
              type="button"
              disabled={isDiagnosing || !aiPrompt.trim()}
              onClick={() => handleRunAiDiagnosis()}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50"
            >
              {isDiagnosing ? (
                <span>Analyzing Issue...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Diagnose Now</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Sample Prompts */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-xs text-slate-400 font-medium">Try asking:</span>
            {[
              'Water tap leaking under kitchen sink',
              'Circuit breaker trips when water heater starts',
              'Air conditioner blowing warm air'
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAiPrompt(p);
                  handleRunAiDiagnosis(p);
                }}
                className="text-xs px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* AI Result Card */}
        {aiResult && (
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/60 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recommended Trade:
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                  {aiResult.tradeCategory}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  aiResult.urgencyLevel === 'EMERGENCY'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {aiResult.urgencyLevel}
                </span>
              </div>

              <div className="text-xs text-slate-700">
                Fair Quote Estimate:{' '}
                <strong className="text-slate-900 font-bold text-sm">
                  ₹{aiResult.fairPriceRange?.min} – ₹{aiResult.fairPriceRange?.max}
                </strong>
                <span className="text-slate-500 text-xs ml-1">({aiResult.estimatedHours} hrs standard)</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {aiResult.diagnosisSummary}
            </p>

            {aiResult.safetyCaution && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{aiResult.safetyCaution}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                <span>Suggested Tools: {aiResult.suggestedTools?.join(', ')}</span>
              </div>

              <Link
                href={`/services?category=${encodeURIComponent(aiResult.tradeCategory.toLowerCase())}&ai=true&desc=${encodeURIComponent(aiPrompt || aiResult.diagnosisSummary)}${aiResult.urgencyLevel === 'EMERGENCY' ? '&emergency=true' : ''}`}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <span>Book Certified {aiResult.tradeCategory}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 4. FEATURED TOP ARTISANS (CLEAN CARDS) */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Top-Rated Local Artisans
            </h2>
            <p className="text-xs text-slate-500">
              Verified members available within 5 km for immediate or scheduled booking.
            </p>
          </div>

          <Link
            href="/services"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Tradespeople</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topArtisans.map((worker) => (
            <div
              key={worker.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
            >
              {/* Top Row: Avatar & Details */}
              <div className="flex items-start gap-3.5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-100 shrink-0">
                    {worker.name.charAt(0)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{worker.name}</h3>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold">{worker.trade}</p>
                  <p className="text-xs text-slate-400 truncate">{worker.cooperativeName}</p>
                </div>
              </div>

              {/* Rating & Location Row */}
              <div className="flex items-center gap-x-2.5 flex-wrap text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                  {worker.rating}
                </span>
                <span className="text-slate-300">·</span>
                <span>{worker.completedJobs} jobs completed</span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center text-slate-500">
                  <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                  {worker.locationName}
                </span>
              </div>

              {/* Single Clean Verification Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-700">e-Shram Verified Member</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">Police Cleared</span>
              </div>

              {/* Price & Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-base font-bold text-slate-900">₹{worker.hourlyRate}</span>
                  <span className="text-xs text-slate-500">/hr</span>
                </div>

                <Link
                  href="/services"
                  className="min-h-[44px] px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 5. WORKER RECRUITMENT CALLOUT */}
      {/* -------------------------------------------------------------------- */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-6 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Are You a Skilled Trade Professional?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Join your local primary labour cooperative society. Keep 90% of every rupee earned, receive instant daily payouts, and access group welfare benefits.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/register/worker"
            className="h-11 px-5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Register as an Artisan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
