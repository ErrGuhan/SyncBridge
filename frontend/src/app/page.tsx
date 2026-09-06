'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Wallet, 
  Users, 
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
  Building2 
} from 'lucide-react';
import { MOCK_WORKERS } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';

const QUICK_CATEGORIES = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    hindi: 'नलसाज़ (प्लंबर)',
    kannada: 'ಪ್ಲಂಬರ್ (ಕೊಳವೆ ಕೆಲಸ)',
    tamil: 'குழாய் பணி',
    rate: '₹450/hr',
    icon: Droplets,
    color: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    hindi: 'इलेक्ट्रीशियन (बिजली)',
    kannada: 'ಎಲೆಕ್ಟ್ರಿಷಿಯನ್',
    tamil: 'மின்சார பணி',
    rate: '₹500/hr',
    icon: Zap,
    color: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200'
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    hindi: 'सफ़ाई सेवा',
    kannada: 'ಸ್ವಚ್ಛತೆ',
    tamil: 'சுத்தம்',
    rate: '₹420/hr',
    icon: Sparkles,
    color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
  },
  {
    id: 'appliance-repair',
    name: 'Appliances',
    hindi: 'उपकरण मरम्मत',
    kannada: 'ಉಪಕರಣ ರಿಪೇರಿ',
    tamil: 'உபகரண பழுது',
    rate: '₹550/hr',
    icon: Wind,
    color: 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border-cyan-200'
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    hindi: 'बढ़ई (लकड़ी काम)',
    kannada: 'ಬಡಗಿ (ಮರದ ಕೆಲಸ)',
    tamil: 'மர வேலை',
    rate: '₹520/hr',
    icon: Hammer,
    color: 'text-orange-700 bg-orange-50 hover:bg-orange-100 border-orange-200'
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
  isAiGenerated?: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const { language, t } = useLanguage();
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
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* -------------------------------------------------------------------- */}
      {/* 1. HERO BANNER & QUICK TRADE LAUNCHER */}
      {/* -------------------------------------------------------------------- */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/70 via-indigo-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Democratic Worker-Member Cooperative</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% e-Shram & Trade Verified</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {language === 'en' ? (
                <>
                  90% Payout to Workers. <br className="hidden sm:block" />
                  <span className="text-blue-600">Zero Corporate Cut.</span>
                </>
              ) : (
                <span>{t('heroHeadline')}</span>
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {t('heroSub')}
            </p>
          </div>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl">
            <div className="relative flex items-center bg-slate-50 border border-slate-300/80 rounded-2xl shadow-xs focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all p-1.5">
              <Search className="w-5 h-5 ml-2.5 sm:ml-3 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 py-2.5 px-2.5 sm:px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent min-w-0"
              />
              <button
                type="submit"
                className="h-10 px-3.5 sm:px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
              >
                <span>{t('findArtisanBtn')}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </form>

          {/* Quick Category Launcher Pills (Swipeable on Mobile) */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('popularServices')}
            </div>
            <div className="flex sm:grid sm:grid-cols-5 gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
              {QUICK_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const catLabel = language === 'hi' ? cat.hindi : language === 'kn' ? cat.kannada : language === 'ta' ? cat.tamil : cat.name;
                return (
                  <Link
                    key={cat.id}
                    href={`/services?category=${cat.id}`}
                    className={`min-w-[130px] sm:min-w-0 flex-1 p-3 rounded-2xl border transition-all flex flex-col items-center sm:items-start justify-between gap-2 text-center sm:text-left shrink-0 ${cat.color}`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{catLabel}</div>
                      <div className="text-[10px] text-slate-500">{cat.rate}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 1.5 COMPACT 4-STAT COOPERATIVE IMPACT STRIP */}
      {/* -------------------------------------------------------------------- */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">44,859+</div>
            <div className="text-xs text-slate-500 font-medium">{t('statsCoops')}</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">90%</div>
            <div className="text-xs text-slate-500 font-medium">{t('statsRetention')}</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">₹1.45 Cr+</div>
            <div className="text-xs text-slate-500 font-medium">{t('statsCorpus')}</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 tracking-tight">5 km</div>
            <div className="text-xs text-slate-500 font-medium">{t('statsRadius')}</div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 2. GEMINI AI INSTANT HOME ISSUE DIAGNOSTIC BOX */}
      {/* -------------------------------------------------------------------- */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                AI Home Diagnostic Assistant
              </h2>
              <p className="text-xs text-slate-500">
                Not sure what trade you need? Describe the problem to instantly get the trade category, required tools, and fair quote estimate.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
            Powered by Gemini AI
          </span>
        </div>

        {/* Input & Quick Try Chips */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAiDiagnosis()}
              placeholder="Describe your maintenance issue (e.g. Water dripping from bathroom ceiling)..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
            />
            <button
              type="button"
              disabled={isDiagnosing || !aiPrompt.trim()}
              onClick={() => handleRunAiDiagnosis()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50"
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
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Quick Try:</span>
            {[
              'Water tap leaking under sink',
              'Circuit breaker trips when geyser starts',
              'Air conditioner blowing warm air'
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAiPrompt(p);
                  handleRunAiDiagnosis(p);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
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
                <span className="text-slate-500 text-[11px] ml-1">({aiResult.estimatedHours} hrs standard)</span>
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
                <span>Artisan Tools: {aiResult.suggestedTools?.join(', ')}</span>
              </div>

              <Link
                href={`/services?category=${encodeURIComponent(aiResult.tradeCategory.toLowerCase())}&ai=true&desc=${encodeURIComponent(aiPrompt || aiResult.diagnosisSummary)}${aiResult.urgencyLevel === 'EMERGENCY' ? '&emergency=true' : ''}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <span>Book Certified {aiResult.tradeCategory}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 3. 90/5/5 COOPERATIVE CHARTER METRICS */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {t('coopDiffTitle')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('coopDiffDesc')}
            </p>
          </div>
          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            Audited Transparency Model
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 90% Worker Take-Home */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 transition-all space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">90%</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('directCompTitle')}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {t('directCompDesc')}
              </p>
            </div>
            <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full w-[90%]" />
            </div>
          </div>

          {/* 5% Primary Society Reserve */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-blue-700 tracking-tight">5%</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('societyTreasuryTitle')}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {t('societyTreasuryDesc')}
              </p>
            </div>
            <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full w-[5%]" />
            </div>
          </div>

          {/* 5% Welfare Fund */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-300 transition-all space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-amber-700 tracking-tight">5%</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('welfareShieldTitle')}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {t('welfareShieldDesc')}
              </p>
            </div>
            <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-600 h-full rounded-full w-[5%]" />
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 4. FEATURED VERIFIED ARTISANS HIGHLIGHT */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {t('verifiedArtisansTitle')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('verifiedArtisansSub')}
            </p>
          </div>

          <Link
            href="/services"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>{t('viewAllArtisans')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topArtisans.map((worker) => (
            <div
              key={worker.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-base border border-blue-100 shrink-0">
                  {worker.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{worker.name}</h3>
                    <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                      ✓ Co-op
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{worker.trade}</p>
                  <p className="text-[11px] text-slate-400 truncate">{worker.cooperativeName}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center text-amber-600 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                  {worker.rating}
                </span>
                <span>{worker.completedJobs} jobs</span>
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                  {worker.locationName}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>e-KYC: Verified ✓</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    UAN: {worker.eShramUan ? worker.eShramUan.replace(/(\d{4})-(\d{4})-(\d{4})/, '$1-XXXX-$3') : 'XXXX-XXXX-3821'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 border-t border-slate-200/50">
                  <span className="text-emerald-700 font-medium">Police: Cleared ✓</span>
                  <span className="truncate ml-1">{worker.cooperativeName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-sm font-bold text-slate-900">₹{worker.hourlyRate}</span>
                  <span className="text-xs text-slate-500">/hr</span>
                </div>

                <Link
                  href="/services"
                  className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>{t('bookNow')}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 5. WORKER ONBOARDING CALLOUT */}
      {/* -------------------------------------------------------------------- */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t('joinAsWorkerTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {t('joinAsWorkerDesc')}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/register/worker"
            className="h-11 px-5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>{t('registerAsWorkerBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
