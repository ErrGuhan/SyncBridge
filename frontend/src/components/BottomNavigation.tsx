'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { Home, Search, ClipboardList, UserCheck } from 'lucide-react';

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
      icon: UserCheck,
      isActive: pathname.startsWith('/register') || pathname.startsWith('/dashboard')
    }
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-black shadow-[0px_-4px_12px_rgba(0,0,0,0.08)] py-1.5 px-2 safe-area-pb"
      aria-label="Bottom Navigation Bar"
    >
      <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center min-h-[56px] min-w-[48px] py-1 px-1 rounded-xl transition-all active:scale-95 ${
                item.isActive
                  ? 'bg-black text-white font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]'
                  : 'text-black hover:bg-slate-100 font-bold'
              }`}
              aria-current={item.isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-6 h-6 mb-0.5 transition-transform ${
                  item.isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                }`}
              />
              <span className="text-[11px] sm:text-xs leading-none tracking-tight text-center truncate max-w-[72px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
