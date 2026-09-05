'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { Home, Search, ClipboardList, User } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      label: t('navHome'),
      href: '/',
      icon: Home,
      isActive: pathname === '/'
    },
    {
      label: t('navSearch'),
      href: '/services',
      icon: Search,
      isActive: pathname.startsWith('/services')
    },
    {
      label: t('navJobs'),
      href: '/bookings',
      icon: ClipboardList,
      isActive: pathname.startsWith('/bookings')
    },
    {
      label: t('navProfile'),
      href: '/register/worker',
      icon: User,
      isActive: pathname.startsWith('/register') || pathname.startsWith('/dashboard')
    }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] py-1 safe-area-pb"
      aria-label="Mobile Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
                item.isActive
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-900 active:scale-95'
              }`}
              aria-current={item.isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    item.isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight truncate ${
                item.isActive ? 'font-semibold text-blue-700' : 'font-medium text-slate-500'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
