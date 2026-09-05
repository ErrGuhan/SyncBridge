'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Globe, 
  ChevronDown, 
  ShieldCheck, 
  Check,
  Zap,
  LayoutGrid,
  User,
  Briefcase,
  Building2,
  BarChart3,
  Terminal,
  LogOut
} from 'lucide-react';

export default function TopAccessibleHeader() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { user, role, logout } = useAuth();
  
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showPortalMenu, setShowPortalMenu] = useState(false);

  const langOptions: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' }
  ];

  const portalOptions = [
    { name: 'Customer Hub', href: '/portal/customer', role: 'CUSTOMER', icon: User, desc: 'AI diagnose & fast booking' },
    { name: 'Worker Portal', href: '/portal/worker', role: 'WORKER', icon: Briefcase, desc: '90% wallet & jobs queue' },
    { name: 'Society Admin', href: '/portal/admin', role: 'COOP_ADMIN', icon: Building2, desc: 'Verifications & tool library' },
    { name: 'Operations Team', href: '/portal/management', role: 'MANAGEMENT', icon: BarChart3, desc: 'Demand forecast & disputes' },
    { name: 'Technical Console', href: '/portal/developer', role: 'DEVELOPER', icon: Terminal, desc: 'API mesh & Supabase health' },
  ];

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'My Orders', href: '/bookings' },
    { name: 'B2B Contracts', href: '/b2b' },
    { name: 'Welfare Fund', href: '/welfare' }
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
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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

        {/* Right: Portals Switcher, Language & Auth Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Dedicated Portals Dropdown Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPortalMenu(!showPortalMenu);
                setShowLangMenu(false);
              }}
              className="h-10 px-2 sm:px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              aria-label="Switch User Portal"
            >
              <LayoutGrid className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline font-semibold">Portals</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showPortalMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-2xs sm:hidden" 
                  onClick={() => setShowPortalMenu(false)} 
                />
                <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-12 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl sm:w-64 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Commercial Portals
                  </div>
                  {portalOptions.map((p) => {
                    const Icon = p.icon;
                    const isActive = pathname.startsWith(p.href);
                    return (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={() => setShowPortalMenu(false)}
                        className={`w-full p-2 rounded-xl text-left flex items-start gap-2.5 transition-colors ${
                          isActive ? 'bg-blue-50 text-blue-800' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.desc}</div>
                        </div>
                      </Link>
                    );
                  })}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2 text-xs">
                    <Link
                      href="/auth/login"
                      onClick={() => setShowPortalMenu(false)}
                      className="text-blue-600 font-semibold hover:underline text-xs"
                    >
                      Switch Account / Sign In →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Refined Language Toggle Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowPortalMenu(false);
              }}
              className="h-10 px-2 sm:px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              aria-label="Change Language"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-800 hidden sm:inline">
                {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'தமிழ்'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLangMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-2xs sm:hidden" 
                  onClick={() => setShowLangMenu(false)} 
                />
                <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-12 bg-white border border-slate-200 rounded-xl p-1.5 shadow-lg sm:w-44 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
              </>
            )}
          </div>

          {/* Active Persona / Sign In Button */}
          {user ? (
            <Link
              href={
                role === 'WORKER'
                  ? '/portal/worker'
                  : role === 'COOP_ADMIN'
                  ? '/portal/admin'
                  : role === 'MANAGEMENT'
                  ? '/portal/management'
                  : role === 'DEVELOPER'
                  ? '/portal/developer'
                  : '/portal/customer'
              }
              className="h-10 px-2 sm:px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
              title={`Logged in as ${user.name} (${user.role})`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="hidden md:inline truncate max-w-[100px]">{user.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 font-mono font-bold border border-slate-200">
                {role.slice(0, 4)}
              </span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="h-10 px-2.5 sm:px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>Sign In</span>
            </Link>
          )}

          {/* Sleek Emergency SOS Button */}
          <Link
            href="/services?emergency=true"
            className="h-10 px-2.5 sm:px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs group"
            aria-label="Emergency SOS Dispatch"
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <Zap className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold hidden sm:inline">SOS</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
