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

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    if (!isClientReady || isLoading) return;

    if (!isAuthenticated) {
      const targetRole = redirectRole;
      const redirectParam = pathname ? `&redirect=${encodeURIComponent(pathname)}` : '';
      router.replace(`/auth/login?role=${targetRole}${redirectParam}`);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0 && user) {
      const hasAllowedRole = allowedRoles.includes(user.role) || user.role === 'SUPER_ADMIN' as any;
      if (!hasAllowedRole) {
        // Redirect to appropriate portal based on their actual role
        let targetPortal = '/portal/customer';
        if (user.role === 'WORKER') targetPortal = '/portal/worker';
        else if (user.role === 'SOCIETY_SECRETARY' || user.role === 'COOP_ADMIN') targetPortal = '/portal/admin';
        else if (user.role === 'FEDERATION_ADMIN' || user.role === 'MANAGEMENT') targetPortal = '/portal/management';
        
        router.replace(targetPortal);
      }
    }
  }, [isClientReady, isAuthenticated, isLoading, user, allowedRoles, redirectRole, pathname, router]);

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
