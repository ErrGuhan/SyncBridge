'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  CalendarCheck, 
  LayoutDashboard, 
  UserPlus, 
  Menu, 
  X, 
  ShieldCheck, 
  Home,
  Building2,
  HeartHandshake,
  Globe,
  Volume2,
  VolumeX,
  Layers,
  Sparkles
} from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [voiceAssistanceActive, setVoiceAssistanceActive] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/', icon: Home, badge: null },
    { name: 'Find Services', href: '/services', icon: Compass, badge: 'Nearby' },
    { name: 'B2B / B2G Anchor', href: '/b2b', icon: Building2, badge: 'Enterprise' },
    { name: 'Welfare Fund', href: '/welfare', icon: HeartHandshake, badge: 'Social Security' },
    { name: 'My Bookings', href: '/bookings', icon: CalendarCheck, badge: null },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: 'Coop Admin' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleVoiceGuide = () => {
    const nextState = !voiceAssistanceActive;
    setVoiceAssistanceActive(nextState);
    if (nextState && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Voice navigation activated. Welcome to SyncBridge, the democratic gig services platform for India's 44,000 primary labour cooperatives."
      );
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Top Ministry of Cooperation Compliance Banner */}
      <div className="w-full bg-gradient-to-r from-emerald-950/80 via-slate-950 to-cyan-950/80 border-b border-white/5 py-1.5 px-4 text-center text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold tracking-wider text-[10px] border border-emerald-500/30">
              NCCT / Ministry of Cooperation • PS ID: 26089
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Serving 44,000+ Primary Labour Cooperatives & e-Shram Workers
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">90% Direct to Worker</span>
            <span>•</span>
            <span className="text-cyan-400 font-medium">5% Society Overhead</span>
            <span>•</span>
            <span className="text-indigo-400 font-medium">5% Social Security</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">100% Emergency Surge</span>
          </div>
        </div>
      </div>

      {/* Main Floating Glassmorphic Header */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
        <div className="max-w-7xl mx-auto">
          <nav className="glass-panel rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.35)] border border-white/10">
            
            {/* Logo / Brand with NCCT Accreditation */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group focus:outline-none shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-600 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-400/40 transition-shadow">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    SyncBridge
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    NCCT Coop
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:inline tracking-tight">
                  National Labour Cooperative Federation (NLCF)
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      active
                        ? 'text-white bg-emerald-500/20 border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                        active ? 'bg-emerald-400/30 text-emerald-200' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Language Switcher & Voice Guide Accessibility Controls */}
            <div className="flex items-center gap-2">
              
              {/* Voice Guide Assistance (Feature 10 in PDF for low-literacy trade workers) */}
              <button
                type="button"
                onClick={toggleVoiceGuide}
                title="Voice Navigation Assistance for Low-Literacy Workers"
                className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition-all ${
                  voiceAssistanceActive 
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse' 
                    : 'bg-slate-900/70 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {voiceAssistanceActive ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <span className="hidden xl:inline text-[11px] font-medium">Voice UI</span>
              </button>

              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900/70 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-medium"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{LANGUAGES.find(l => l.code === currentLang)?.native}</span>
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 glass-panel rounded-xl py-1 shadow-2xl border border-white/10 z-50 animate-in fade-in duration-150">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 ${
                          currentLang === lang.code ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'
                        }`}
                      >
                        <span>{lang.native}</span>
                        <span className="text-[10px] text-slate-500">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href="/register/worker"
                className="hidden sm:flex px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all items-center gap-1.5 shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-950" />
                <span>Join as Worker</span>
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 hover:text-white"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-7xl mx-auto">
            <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-2 animate-in fade-in duration-200">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`min-h-[48px] px-4 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                      active
                        ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/15 border border-emerald-400/40 text-white font-medium shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className="text-sm font-medium">{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="border-t border-white/10 pt-2">
                <Link
                  href="/register/worker"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <UserPlus className="w-4 h-4 text-slate-950" />
                  <span>Register as Cooperative Member (e-Shram / NCD)</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Docked Navigation Bar */}
      <div className="fixed bottom-3 inset-x-0 z-40 px-3 lg:hidden pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <nav className="glass-panel rounded-2xl px-2 py-1 flex items-center justify-around border border-white/15 shadow-2xl backdrop-blur-2xl">
            {navLinks.slice(0, 4).map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex flex-col items-center justify-center min-w-[50px] min-h-[46px] py-1 px-1.5 rounded-xl transition-all ${
                    active ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : ''}`} />
                  <span className="text-[9px] mt-1 tracking-tight truncate max-w-[64px]">{link.name}</span>
                </Link>
              );
            })}
            <Link
              href="/register/worker"
              className="flex flex-col items-center justify-center min-w-[50px] min-h-[46px] py-1 px-1.5 rounded-xl text-teal-300 hover:text-white"
            >
              <div className="p-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40">
                <UserPlus className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <span className="text-[9px] mt-0.5 font-bold">Join</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
