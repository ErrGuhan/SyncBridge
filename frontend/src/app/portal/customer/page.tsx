'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import JobStatusTracker from '@/components/JobStatusTracker';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Flame,
  Send,
  Camera,
  Layers,
  PhoneCall
} from 'lucide-react';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { calculateCoopSplit } from '@/lib/splitUtils';
import { useLanguage } from '@/context/LanguageContext';

export default function CustomerPortalPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // AI Diagnostic State
  const [promptText, setPromptText] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const samplePrompts = [
    'Water pipe burst under kitchen sink, flooding floor',
    'Main MCB tripping repeatedly when water heater starts',
    'Heavy wooden front door stuck and scraping floor tiles',
    'Refrigerator compressor buzzing loudly but not cooling'
  ];

  const handleRunAiDiagnosis = async (textToDiagnose?: string) => {
    const text = textToDiagnose || promptText;
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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Customer Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 border border-blue-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('customerHubBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t('welcomeCustomer')}, {user?.name || 'Valued Customer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            {t('customerSub')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center">
          <Link
            href="/services"
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>{t('findArtisanBtn')}</span>
          </Link>
          <Link
            href="/bookings"
            className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>{t('allOrdersBtn')}</span>
          </Link>
        </div>
      </div>

      {/* GEMINI MULTIMODAL AI DIAGNOSTIC ASSISTANT */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t('geminiAssistantTitle')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('geminiAssistantSub')}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 hidden sm:inline">
            Model: Gemini 3.7 Flash
          </span>
        </div>

        {/* Input Field & Prompt Pills */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunAiDiagnosis()}
                placeholder="Describe your maintenance issue (e.g., Water dripping near electric board)..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              />
            </div>

            <button
              type="button"
              disabled={isDiagnosing || !promptText.trim()}
              onClick={() => handleRunAiDiagnosis()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {isDiagnosing ? (
                <span>Diagnosing...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Diagnosis</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Prompts Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Try:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPromptText(p);
                  handleRunAiDiagnosis(p);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* AI Diagnosis Result Card */}
        {aiResult && (
          <div className="p-5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Diagnosis Result:
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

              <div className="text-xs text-slate-600">
                Fair Estimate:{' '}
                <strong className="text-slate-900 font-bold text-sm">
                  ₹{aiResult.fairPriceRange?.min} – ₹{aiResult.fairPriceRange?.max}
                </strong>
                <span className="text-slate-400 text-[11px] ml-1">({aiResult.estimatedHours} hrs standard)</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {aiResult.diagnosisSummary}
            </p>

            {aiResult.safetyCaution && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{aiResult.safetyCaution}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                <span>Required Tools: {aiResult.suggestedTools?.join(', ')}</span>
              </div>

              <Link
                href={`/services?category=${encodeURIComponent(aiResult.tradeCategory)}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span>Book Certified {aiResult.tradeCategory}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ACTIVE LIVE DISPATCH TIMELINE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Active Service Dispatch
          </h2>
          <span className="text-xs text-slate-500">
            Order #BKG-2026-8819 • Real-Time GPS Tracking
          </span>
        </div>

        <JobStatusTracker
          initialState="YELLOW"
          bookingNumber="BKG-2026-8819"
          workerName="Ramesh Chavan (NCCT Certified)"
          workerPhone="+91 98201 11221"
          workerTrade="Master Electrician"
          workerEtaMinutes={12}
          totalAmount={1200}
        />
      </section>

      {/* RECENT BOOKINGS & 90/5/5 TRANSPARENT RECEIPTS */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recent Completed Services
            </h2>
            <p className="text-xs text-slate-500">
              Verified with 100% transparent 90/5/5 cooperative dividend receipts.
            </p>
          </div>

          <Link href="/bookings" className="text-xs text-blue-600 font-semibold hover:underline">
            View all orders →
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs text-slate-700">
          {MOCK_BOOKINGS.slice(0, 3).map((b) => {
            const split = calculateCoopSplit(b.totalAmount);
            return (
              <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{b.serviceCategory} Service</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {b.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Completed
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Worker: <strong className="text-slate-700">{b.workerName}</strong> ({b.workerTrade}) • {b.scheduledDate}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-auto">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block">₹{b.totalAmount}</span>
                    <span className="text-[10px] text-emerald-700 font-medium">₹{split.workerPayout} direct to worker (90%)</span>
                  </div>

                  <a
                    href="tel:9820111221"
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Call Hub"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
