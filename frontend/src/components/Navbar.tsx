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
  Layers
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/', icon: Home, badge: null },
    { name: 'Find Services', href: '/services', icon: Compass, badge: 'Nearby' },
    { name: 'My Bookings', href: '/bookings', icon: CalendarCheck, badge: null },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: 'Coop Admin' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Floating Glassmorphic Header */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
        <div className="max-w-7xl mx-auto">
          <nav className="glass-panel rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
            
            {/* Logo / Brand */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-shadow">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    SyncBridge
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Coop
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Democratic Gig Workers Federation
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      active
                        ? 'text-white bg-cyan-500/20 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                        active ? 'bg-cyan-400/30 text-cyan-200' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/register/worker"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 transition-all flex items-center gap-2 group"
              >
                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform text-slate-950" />
                <span>Join as Worker</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button with 48px Touch Area */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/register/worker"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-medium"
              >
                Join Coop
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-900/70 border border-white/10 text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-cyan-400" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-300" />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Dropdown Drawer (Gesture & Touch Friendly) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 max-w-7xl mx-auto">
            <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`min-h-[52px] px-4 py-3 rounded-xl flex items-center justify-between transition-all ${
                        active
                          ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/15 border border-cyan-400/40 text-white font-medium shadow-md shadow-cyan-950'
                          : 'text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${active ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800/60 text-slate-400'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-base font-medium">{link.name}</span>
                      </div>
                      {link.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="my-2 border-t border-white/10" />

                <Link
                  href="/register/worker"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[52px] px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
                >
                  <UserPlus className="w-5 h-5 text-slate-950" />
                  <span>Register as Cooperative Member</span>
                </Link>

                <div className="mt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 py-1">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>80% Worker · 15% Coop Reserve · 5% Mutual Aid</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom Navigation Bar for Fast 1-Thumb Usage */}
      <div className="fixed bottom-3 inset-x-0 z-40 px-4 md:hidden pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <nav className="glass-panel rounded-2xl px-2 py-1.5 flex items-center justify-around border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
                    active
                      ? 'text-cyan-400 font-semibold scale-105'
                      : 'text-slate-400 hover:text-slate-200 active:scale-95'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : ''}`} />
                  <span className="text-[10px] mt-1 tracking-tight">{link.name}</span>
                </Link>
              );
            })}
            <Link
              href="/register/worker"
              className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl text-teal-400 hover:text-teal-300"
            >
              <div className="p-1 rounded-lg bg-teal-500/20 border border-teal-500/40">
                <UserPlus className="w-4 h-4 text-teal-300" />
              </div>
              <span className="text-[10px] mt-1 font-medium">Join</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
