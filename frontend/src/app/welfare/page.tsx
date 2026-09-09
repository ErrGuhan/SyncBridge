'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  ShieldCheck, 
  TrendingUp, 
  Wallet
} from 'lucide-react';
import { MOCK_WELFARE_FUND_SNAPSHOT } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';

export default function WelfarePortalPage() {
  const { t } = useLanguage();
  const [pensionMonthlyContrib, setPensionMonthlyContrib] = useState<number>(500);

  // Pension estimation calculation
  const coopMatch = pensionMonthlyContrib * 0.5; // 50% cooperative federation match
  const totalMonthlySavings = pensionMonthlyContrib + coopMatch;
  const estimatedRetirementCorpus15Yrs = Math.round(totalMonthlySavings * 12 * 15 * 1.85); // with 8% compound yield

  return (
    <div className="space-y-10 py-6 sm:py-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span>{t('footerWelfareTrust')}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          {t('welfareHeading')}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {t('welfareSub')}
        </p>
      </section>

      {/* Corpus Overview Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1.5">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">{t('metricTotalCorpus')}</span>
          <p className="text-3xl font-bold text-slate-900">{MOCK_WELFARE_FUND_SNAPSHOT.totalCorpus}</p>
          <span className="text-xs text-emerald-600 font-medium">{t('metricAuditedReserve')}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1.5">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">{t('metricMedicalClaims')}</span>
          <p className="text-3xl font-bold text-emerald-600">{MOCK_WELFARE_FUND_SNAPSHOT.medicalClaimsSettled}</p>
          <span className="text-xs text-slate-500">{t('metricCashlessDisbursed', { amount: MOCK_WELFARE_FUND_SNAPSHOT.totalMedicalPaid })}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1.5">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">{t('metricMicroPension')}</span>
          <p className="text-3xl font-bold text-blue-600">{MOCK_WELFARE_FUND_SNAPSHOT.microPensionAccounts.toLocaleString()}</p>
          <span className="text-xs text-slate-500">{t('metricCoopMatch')}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1.5">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">{t('metricGuaranteeFund')}</span>
          <p className="text-3xl font-bold text-amber-600">{MOCK_WELFARE_FUND_SNAPSHOT.guaranteeFundReserve}</p>
          <span className="text-xs text-slate-500">{t('metricDamageRecourse')}</span>
        </div>
      </section>

      {/* 4 Pillars of Protection */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            {t('pillarsTag')}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {t('pillarsTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('pillar1Title')}</h3>
                <span className="text-xs text-emerald-600 font-semibold">{t('pillar1Badge')}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('pillar1Desc')}
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>{t('pillar1Rate')}</span>
              <span className="text-emerald-700 font-medium">Direct TPA Settlement</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('pillar2Title')}</h3>
                <span className="text-xs text-blue-600 font-semibold">{t('pillar2Badge')}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('pillar2Desc')}
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>{t('pillar2Rate')}</span>
              <span className="text-blue-700 font-medium">24-Hour Nominee Disbursement</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('pillar3Title')}</h3>
                <span className="text-xs text-indigo-600 font-semibold">{t('pillar3Badge')}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('pillar3Desc')}
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>{t('pillar3Rate')}</span>
              <span className="text-indigo-700 font-medium">Tier-II Compliant</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('pillar4Title')}</h3>
                <span className="text-xs text-amber-600 font-semibold">{t('pillar4Badge')}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('pillar4Desc')}
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>{t('pillar4Rate')}</span>
              <span className="text-amber-700 font-medium">Peer Council Adjudicated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Micro-Pension Savings Calculator */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            {t('calcTag')}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('calcTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('calcSub')}
          </p>
        </div>

        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-5">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-700 mb-2">
              <span className="font-semibold">{t('monthlyWorkerContrib')}</span>
              <span className="text-base font-bold text-emerald-600">₹{pensionMonthlyContrib} / month</span>
            </div>
            <input 
              type="range"
              min={200}
              max={3000}
              step={100}
              value={pensionMonthlyContrib}
              onChange={(e) => setPensionMonthlyContrib(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="text-slate-500 block text-[11px]">{t('monthlyCoopMatch')}</span>
              <span className="text-base font-bold text-blue-600">+₹{coopMatch} / mo</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="text-slate-500 block text-[11px]">{t('monthlyTotalSavings')}</span>
              <span className="text-base font-bold text-slate-900">₹{totalMonthlySavings} / mo</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-600 block font-medium">{t('estimatedCorpus15Years')}</span>
              <span className="text-2xl font-bold text-emerald-700">
                ₹{estimatedRetirementCorpus15Yrs.toLocaleString()}
              </span>
            </div>
            <Link
              href="/register/worker"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors text-center shadow-sm"
            >
              {t('startContributingBtn')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
