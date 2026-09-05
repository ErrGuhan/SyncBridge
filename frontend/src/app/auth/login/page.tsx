'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, UserRole, DEMO_PERSONAS } from '@/context/AuthContext';
import { 
  User, 
  Briefcase, 
  Building2, 
  BarChart3, 
  Terminal, 
  ArrowRight, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const ROLE_ITEMS: { role: UserRole; title: string; subtitle: string; icon: any }[] = [
  {
    role: 'CUSTOMER',
    title: 'Customer',
    subtitle: 'Book services & track dispatches',
    icon: User
  },
  {
    role: 'WORKER',
    title: 'Tradesperson',
    subtitle: 'Accept jobs & view 90% wallet',
    icon: Briefcase
  },
  {
    role: 'COOP_ADMIN',
    title: 'Society Admin',
    subtitle: 'Verify members & tool library',
    icon: Building2
  },
  {
    role: 'MANAGEMENT',
    title: 'Operations Team',
    subtitle: 'Demand forecast & arbitration',
    icon: BarChart3
  },
  {
    role: 'DEVELOPER',
    title: 'Technical Console',
    subtitle: 'API mesh & telemetry metrics',
    icon: Terminal
  }
];

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role')?.toUpperCase() as UserRole;
  const initialRole: UserRole = ROLE_ITEMS.some(r => r.role === initialRoleParam) ? initialRoleParam : 'CUSTOMER';

  const [authMode, setAuthMode] = useState<'DEMO' | 'SUPABASE'>('DEMO');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginAsDemoUser, loginWithSupabase, getPortalUrlForRole } = useAuth();

  const handleDemoSignIn = (role: UserRole) => {
    loginAsDemoUser(role);
    const targetUrl = getPortalUrlForRole(role);
    router.push(targetUrl);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await loginWithSupabase(email, password, selectedRole);
      if (res.success) {
        const targetUrl = getPortalUrlForRole(selectedRole);
        router.push(targetUrl);
      } else {
        setErrorMessage(res.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPersona = DEMO_PERSONAS[selectedRole];

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-6 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Multi-Portal Authentication Gateway</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Sign In to Your Dedicated Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Select your cooperative role to access specialized tools and services.
        </p>
      </div>

      {/* Segmented Auth Mode Switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200/80 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAuthMode('DEMO')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              authMode === 'DEMO'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>⚡ 1-Click Demo Persona</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('SUPABASE')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              authMode === 'SUPABASE'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-slate-700" />
            <span>🔐 Supabase Account</span>
          </button>
        </div>
      </div>

      {/* 5 Role Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {ROLE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedRole === item.role;
          return (
            <button
              key={item.role}
              type="button"
              onClick={() => {
                setSelectedRole(item.role);
                setErrorMessage(null);
              }}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-blue-50 border-blue-600 shadow-xs ring-1 ring-blue-600'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900">{item.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{item.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs p-6 sm:p-8">
        
        {authMode === 'DEMO' ? (
          /* 1-Click Fast Persona Mode */
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 border border-emerald-200 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant Evaluator Access</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Ready to test as {currentPersona.label}?
                </h3>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
                Role: {currentPersona.role}
              </span>
            </div>

            {/* Persona Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                <span>{currentPersona.user.name}</span>
                <span className="font-mono text-xs font-normal text-slate-500">{currentPersona.user.email}</span>
              </div>
              {currentPersona.user.trade && (
                <div>Certified Trade: <span className="font-semibold text-slate-800">{currentPersona.user.trade}</span></div>
              )}
              {currentPersona.user.cooperativeName && (
                <div>Labour Society: <span className="font-semibold text-slate-800">{currentPersona.user.cooperativeName}</span></div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleDemoSignIn(selectedRole)}
              className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Launch {currentPersona.label} Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Zero passwords needed. Session state persists in local memory with live Supabase JWT capabilities.
            </p>
          </div>
        ) : (
          /* Live Supabase Email/Password Mode */
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sign In with Supabase Credentials
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Authenticate against your live Supabase project (<code className="text-slate-700 font-mono">qniqutaavdjnutnprjdk</code>).
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder={currentPersona.user.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <a href="#forgot" className="text-[11px] text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to {ROLE_ITEMS.find(r => r.role === selectedRole)?.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>Need to register a new member or enterprise account? </span>
              <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
                Register here
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto py-16 text-center space-y-3 text-slate-500 text-xs">
        <div className="w-8 h-8 mx-auto border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p>Loading Authentication Gateway...</p>
      </div>
    }>
      <LoginInner />
    </Suspense>
  );
}
