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

import { GET_ROLE_NAV_LINKS, PUBLIC_NAV_LINKS, EMERGENCY_LINK } from '@/config/nav';

export default function TopAccessibleHeader() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, role, logout } = useAuth();
  
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const langOptions: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' }
  ];

  const getTranslatedNav = (href: string, fallback: string) => {
    switch (href) {
      case '/': return t('navHome');
      case '/services': return t('navServices');
      case '/bookings': return t('navOrders');
      case '/welfare': return t('navWelfare');
      case '/b2b': return t('navB2B');
      case '/portal/worker': return t('navWorker');
      case '/portal/admin': return t('navAdmin');
      default: return fallback;
    }
  };

  const navLinks = user ? GET_ROLE_NAV_LINKS(role) : PUBLIC_NAV_LINKS;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-6 xl:px-8 h-16 flex items-center justify-between gap-2 xl:gap-4">
        
        {/* Left: Brand Identity & Desktop Navigation */}
        <div className="flex items-center gap-3 xl:gap-5 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors shrink-0">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight leading-none">
                  SyncBridge
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Co-op
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 hidden 2xl:flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline shrink-0" />
                <span>{t('memberOwned')}</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Visible on large screens, whitespace-nowrap prevents multi-line wrap) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-xs xl:text-xs 2xl:text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {getTranslatedNav(link.href, link.label)}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Language, Auth Profile / Sign In & Emergency SOS */}
        <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0">
          
          {/* Refined Language Toggle Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowUserMenu(false);
              }}
              className="h-9 w-9 sm:w-auto sm:h-10 sm:px-2.5 xl:px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5 shadow-2xs transition-colors shrink-0 whitespace-nowrap"
              aria-label="Change Language"
            >
              <Globe className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="font-semibold text-slate-800 hidden sm:inline">
                {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : language === 'kn' ? 'ಕನ್ನಡ' : 'தமிழ்'}
              </span>
              <ChevronDown className="hidden sm:inline w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLangMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-2xs sm:hidden" 
                  onClick={() => setShowLangMenu(false)} 
                />
                <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-12 bg-white border border-slate-200 rounded-xl p-1.5 shadow-xl sm:w-56 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('activeLanguages')}
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

                  {/* 22 Scheduled Languages Roadmap */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="px-2.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {t('upcomingLanguages')}
                    </div>
                    <div className="px-2 py-1 flex flex-wrap gap-1 text-[10px] text-slate-500">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">বাংলা</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">తెలుగు</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">मराठी</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">ગુજરાતી</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">മലയാളം</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">ଓଡ଼ಿଆ</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">ਪੰਜਾਬੀ</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">অসমীয়া</span>
                    </div>
                    <p className="px-2.5 pt-1 text-[9px] text-slate-400 italic">
                      {t('bhashiniNote')}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Authenticated User Menu vs Public Sign In */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowLangMenu(false);
                }}
                className="h-9 sm:h-10 px-2 sm:px-2.5 xl:px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 whitespace-nowrap"
                aria-label="User profile and portal options"
              >
                <div className={`w-2 h-2 rounded-full ${
                  role === 'WORKER' ? 'bg-emerald-500' : 
                  role === 'SOCIETY_SECRETARY' || role === 'COOP_ADMIN' ? 'bg-amber-500' : 
                  'bg-blue-600'
                }`} />
                <span className="hidden md:inline truncate max-w-[100px] xl:max-w-[130px] font-bold text-slate-900">
                  {user.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border ${
                  role === 'WORKER' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : role === 'SOCIETY_SECRETARY' || role === 'COOP_ADMIN'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {role === 'WORKER' ? t('roleWorker') : role === 'SOCIETY_SECRETARY' || role === 'COOP_ADMIN' ? t('roleAdmin') : t('roleCustomer')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-2xs sm:hidden" 
                    onClick={() => setShowUserMenu(false)} 
                  />
                  <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-12 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xl sm:w-64 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                    <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                      <div className="text-xs font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user.phone || user.email}</div>
                      {user.trade && (
                        <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                          {user.trade}
                        </div>
                      )}
                      {user.cooperativeName && (
                        <div className="text-[10px] text-slate-500 line-clamp-1">
                          {user.cooperativeName}
                        </div>
                      )}
                    </div>

                    <Link
                      href={
                        role === 'WORKER'
                          ? '/portal/worker'
                          : role === 'SOCIETY_SECRETARY' || role === 'COOP_ADMIN'
                          ? '/portal/admin'
                          : role === 'MANAGEMENT'
                          ? '/portal/management'
                          : role === 'DEVELOPER'
                          ? '/portal/developer'
                          : '/portal/customer'
                      }
                      onClick={() => setShowUserMenu(false)}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <span>
                        {role === 'WORKER' 
                          ? t('openWorkspace') 
                          : role === 'SOCIETY_SECRETARY' || role === 'COOP_ADMIN' 
                          ? t('openAdminConsole') 
                          : t('openCustomerPortal')}
                      </span>
                      <span>→</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-rose-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('navSignOut')}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          ) : (
            <Link
              href="/auth/login"
              className="h-9 px-3 sm:h-10 sm:px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('navSignIn')}</span>
            </Link>
          )}

          {/* Distinct Emergency SOS Action Button */}
          <Link
            href={EMERGENCY_LINK.href}
            className="h-9 px-2 sm:h-10 sm:px-2.5 xl:px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-rose-600/20 group shrink-0 whitespace-nowrap"
            aria-label="Emergency SOS Dispatch"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
            <Zap className="w-3.5 h-3.5 text-white fill-white group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-bold tracking-tight">
              <span className="hidden 2xl:inline">{t('emergencyLabel')} </span>SOS
            </span>
          </Link>
        </div>

      </div>
    </header>
  );
}
