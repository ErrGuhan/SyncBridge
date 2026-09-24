'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectRole?: 'customer' | 'worker' | 'admin';
}

export default function AuthGuard({
  children,
  allowedRoles,
  redirectRole = 'customer'
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isClientReady, setIsClientReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const targetRole = redirectRole;
  const redirectParam = pathname ? `&redirect=${encodeURIComponent(pathname)}` : '';
  const loginUrl = `/auth/login?role=${targetRole}${redirectParam}`;

  useEffect(() => {
    if (!isClientReady || isLoading) return;

    if (!isAuthenticated) {
      router.replace(loginUrl);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0 && user) {
      const hasAllowedRole = allowedRoles.includes(user.role) || (user.role as any) === 'SUPER_ADMIN';
      if (!hasAllowedRole) {
        // Redirect to appropriate portal based on their actual role
        let targetPortal = '/portal/customer';
        if (user.role === 'WORKER') targetPortal = '/portal/worker';
        else if (user.role === 'SOCIETY_SECRETARY' || user.role === 'COOP_ADMIN') targetPortal = '/portal/admin';
        else if (user.role === 'FEDERATION_ADMIN' || user.role === 'MANAGEMENT') targetPortal = '/portal/management';
        
        router.replace(targetPortal);
      }
    }
  }, [isClientReady, isAuthenticated, isLoading, user, allowedRoles, loginUrl, router]);

  // If timeout reached and not authenticated, render explicit sign-in prompt instead of spinning forever
  if ((!isClientReady || !isAuthenticated) && timedOut) {
    return (
      <div className="min-h-[55vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto shadow-2xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Sign in as Federation Admin to Continue
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              This sovereign audit console is restricted to authorized cooperative administrators, state federation officers, and auditors.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <a
              href={loginUrl}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-2xs"
            >
              Sign In to Continue
            </a>
            <a
              href="/"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // While checking auth state on client side, render minimal secure loading state
  if (!isClientReady || isLoading || !isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-200">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-800 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verifying Cooperative Authorization</span>
          </p>
          <p className="text-xs text-slate-400">
            Checking session credentials and route access permissions...
          </p>
        </div>
      </div>
    );
  }

  // If role mismatch is pending redirect
  if (allowedRoles && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role) && (user.role as any) !== 'SUPER_ADMIN') {
    return null;
  }

  return <>{children}</>;
}
