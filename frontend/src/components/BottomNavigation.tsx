'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Search, 
  ClipboardList, 
  User, 
  Wallet, 
  Briefcase, 
  Building2, 
  BarChart3, 
  Terminal,
  LayoutGrid
} from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { role } = useAuth();

  // Dynamic portal link and icon based on active role
  const getRolePortalItem = () => {
    switch (role) {
      case 'WORKER':
        return {
          label: 'Workspace',
          href: '/portal/worker',
          icon: Briefcase,
          isActive: pathname.startsWith('/portal/worker')
        };
      case 'COOP_ADMIN':
        return {
          label: 'Society',
          href: '/portal/admin',
          icon: Building2,
          isActive: pathname.startsWith('/portal/admin')
        };
      case 'MANAGEMENT':
        return {
          label: 'Operations',
          href: '/portal/management',
          icon: BarChart3,
          isActive: pathname.startsWith('/portal/management')
        };
      case 'DEVELOPER':
        return {
          label: 'Console',
          href: '/portal/developer',
          icon: Terminal,
          isActive: pathname.startsWith('/portal/developer')
        };
      default:
        return {
          label: 'Customer',
          href: '/portal/customer',
          icon: User,
          isActive: pathname.startsWith('/portal/customer')
        };
    }
  };

  const portalItem = getRolePortalItem();

  const navItems = [
    {
      label: t('navHome'),
      href: '/',
      icon: Home,
      isActive: pathname === '/'
    },
    {
      label: t('navServices'),
      href: '/services',
      icon: Search,
      isActive: pathname.startsWith('/services')
    },
    {
      label: t('navOrders'),
      href: '/bookings',
      icon: ClipboardList,
      isActive: pathname.startsWith('/bookings')
    },
    portalItem,
    {
      label: t('navSignIn'),
      href: '/auth/login',
      icon: LayoutGrid,
      isActive: pathname.startsWith('/auth')
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
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative ${
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
              <span className={`text-[10px] mt-1 tracking-tight truncate ${
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
