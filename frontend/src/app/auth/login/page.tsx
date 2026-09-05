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
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Multi-Portal Authentication Gateway</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Sign In to Your Dedicated Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Choose your cooperative platform role to access specialized features for your workflow.
        </p>
      </div>

      {/* 5 Role Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
              className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50 border-blue-600 shadow-sm ring-1 ring-blue-600'
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

              <div className="mt-3">
                <div className="text-xs font-bold text-slate-900">{item.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{item.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8">
        
        {/* Left: 1-Click Fast Persona Switcher (For Evaluation & Demo) */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-6 space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>1-Click Evaluator Access</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Instant Demo Sign-In
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Experience the {currentPersona.label} portal without typing credentials.
            </p>
          </div>

          {/* Persona Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{currentPersona.user.name}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                {currentPersona.role}
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Email: <span className="font-mono text-slate-800">{currentPersona.user.email}</span></div>
              {currentPersona.user.trade && (
                <div>Trade: <span className="font-medium text-slate-800">{currentPersona.user.trade}</span></div>
              )}
              {currentPersona.user.cooperativeName && (
                <div>Society: <span className="font-medium text-slate-800">{currentPersona.user.cooperativeName}</span></div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleDemoSignIn(selectedRole)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all mt-2"
            >
              <span>Launch {currentPersona.label} Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Backed by live Supabase JWT & Role-Based Access Control.
          </div>
        </div>

        {/* Right: Live Supabase Email/Password Form */}
        <div className="lg:col-span-7 lg:pl-2 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Sign In with Supabase Credentials
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authenticate against the cooperative platform's Supabase auth service.
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
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to {ROLE_ITEMS.find(r => r.role === selectedRole)?.title} Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>New member or organization? </span>
            <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>

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
