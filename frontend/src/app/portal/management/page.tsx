'use client';

import React from 'react';
import AdminDashboard from '@/components/AdminDashboard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { BarChart3 } from 'lucide-react';

export default function ManagementPortalPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Executive Portal Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700 border border-indigo-200 mb-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('adminFederationTag')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('adminFederationTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as: <strong className="text-slate-800">{user?.name || 'Director Vikram Rao'}</strong> • Governing 44,000+ Primary Labour Societies
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('quorumActive')}</span>
          </span>
        </div>
      </div>

      {/* Embedded Executive Central Command Engine */}
      <AdminDashboard />

    </div>
  );
}
