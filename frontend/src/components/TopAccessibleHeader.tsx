'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage, Language } from '../context/LanguageContext';
import { PhoneCall, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TopAccessibleHeader() {
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const langOptions: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'Default' },
    { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
    { code: 'ta', label: 'தமிழ்', sub: 'Tamil' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-black px-4 py-3 shadow-sm">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Cooperative Trust Icon */}
        <Link
          href="/"
          className="flex items-center gap-2 min-h-[48px] px-2 rounded-lg hover:bg-slate-100 active:scale-95 transition-transform"
          aria-label="Home"
        >
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black text-xl shadow">
            🤝
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-black text-lg tracking-tight leading-none">
              {t('appName')}
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> {t('memberOwned')}
            </span>
          </div>
        </Link>

        {/* Action Controls: Language Toggle & Emergency Helpline */}
        <div className="flex items-center gap-2">
          {/* Prominent Language Switcher Button (A/अ) */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="min-h-[48px] min-w-[48px] px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-black font-black text-base border-2 border-black flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              aria-label="Change Language"
            >
              <span className="text-lg">A/अ</span>
              <span className="text-xs font-black uppercase bg-black text-white px-1.5 py-0.5 rounded">
                {language}
              </span>
            </button>

            {/* Tap-Friendly Language Selection Modal/Dropdown */}
            {showLangMenu && (
              <div className="absolute right-0 top-14 bg-white border-2 border-black rounded-2xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-56 flex flex-col gap-1.5 z-50">
                <div className="px-2 py-1 text-xs font-black uppercase tracking-wider text-slate-600 border-b border-slate-200">
                  Select Language / भाषा चुनें
                </div>
                {langOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLanguage(opt.code);
                      setShowLangMenu(false);
                    }}
                    className={`min-h-[48px] px-3 py-2 rounded-xl text-left font-bold flex items-center justify-between border-2 transition-all ${
                      language === opt.code
                        ? 'bg-black text-white border-black'
                        : 'bg-slate-50 text-black border-slate-200 hover:border-black'
                    }`}
                  >
                    <span className="text-base">{opt.label}</span>
                    <span className="text-xs opacity-75">{opt.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick SOS Emergency Direct Dispatch Button */}
          <Link
            href="/services?emergency=true"
            className="min-h-[48px] px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            aria-label="Emergency SOS"
          >
            <AlertTriangle className="w-5 h-5 animate-bounce text-yellow-300" />
            <span className="hidden xs:inline">SOS</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
