'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage, Language } from '../context/LanguageContext';
import { 
  Globe, 
  ChevronDown, 
  AlertCircle, 
  ShieldCheck, 
  Check,
  Zap
} from 'lucide-react';

export default function TopAccessibleHeader() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const langOptions: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' }
  ];

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'My Bookings', href: '/bookings' },
    { name: 'Register as Worker', href: '/register/worker' },
    { name: 'Dashboard', href: '/dashboard' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity & Trust Emblem */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:shadow-md transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-lg tracking-tight leading-none">
                  SyncBridge
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Co-op
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                <span>Worker-Owned Platform</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Language Switcher & Emergency Dispatch */}
        <div className="flex items-center gap-2.5">
          
          {/* Refined Language Toggle Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="h-10 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              aria-label="Change Language"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-800">
                {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'தமிழ்'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl p-1.5 shadow-lg w-48 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Language
                </div>
                {langOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLanguage(opt.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-2.5 py-2 rounded-lg text-xs font-medium text-left flex items-center justify-between transition-colors ${
                      language === opt.code
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span>{opt.native}</span>
                      <span className="text-[11px] text-slate-400 ml-1.5">({opt.label})</span>
                    </div>
                    {language === opt.code && <Check className="w-3.5 h-3.5 text-blue-700" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sleek Emergency SOS Button */}
          <Link
            href="/services?emergency=true"
            className="h-10 px-3.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs group"
            aria-label="Emergency SOS Dispatch"
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <Zap className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Emergency SOS</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
