'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { NAV_LINKS, EMERGENCY_LINK } from '@/config/nav';

export default function Footer() {
  const { t } = useLanguage();

  const getTranslatedLabel = (href: string, fallbackLabel: string) => {
    switch (href) {
      case '/': return t('navHome');
      case '/services': return t('navServices');
      case '/bookings': return t('navOrders');
      case '/welfare': return t('navWelfare');
      case '/b2b': return t('navB2B');
      case '/portal/worker': return t('navWorker');
      case '/portal/admin': return t('navAdmin');
      default: return fallbackLabel;
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mb-16 md:mb-0">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">{t('footerFederationTitle')}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">{t('footerMemberOwned')}</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {t('footerAuditedCharter')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600 flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <strong className="text-emerald-700">90%</strong> {t('footerWorkerTakeHome')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <strong className="text-blue-700">5%</strong> {t('footerSocietyReserve')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <strong className="text-amber-700">5%</strong> {t('footerWelfareTrust')}
            </span>
          </div>
        </div>

        {/* Shared Navigation Links */}
        <div className="flex items-center justify-between gap-4 flex-wrap text-xs pt-1 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap font-medium">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors">
                {getTranslatedLabel(link.href, link.label)}
              </Link>
            ))}
          </div>
          <Link
            href={EMERGENCY_LINK.href}
            className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1.5 transition-colors bg-rose-50 px-3 py-1 rounded-full border border-rose-200"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{t('emergencySOS')}</span>
          </Link>
        </div>

        {/* Sovereign Tech & Compliance Metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span>Smart India Hackathon 2026</span>
            <span>|</span>
            <span className="font-mono text-slate-600 font-semibold">PS ID: 26089</span>
            <span>|</span>
            <span>{t('footerMinistryNote')}</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
              {t('footerHostedOn')}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
              {t('footerDPDP')}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
              {t('footerDataCommons')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
