'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, UserRole, DEMO_PERSONAS } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  User, 
  Briefcase, 
  Building2, 
  BarChart3, 
  Terminal, 
  ArrowRight, 
  Lock, 
  Mail, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Phone,
  LucideIcon
} from 'lucide-react';

const ROLE_ITEMS: { role: UserRole; title: string; titleKey: string; defaultTitle: string; subtitle: string; icon: LucideIcon }[] = [
  {
    role: 'CUSTOMER',
    title: 'Customer',
    titleKey: 'authRoleCustomer',
    defaultTitle: 'Customer',
    subtitle: 'Book services & track dispatches',
    icon: User
  },
  {
    role: 'WORKER',
    title: 'Tradesperson',
    titleKey: 'authRoleWorker',
    defaultTitle: 'Tradesperson',
    subtitle: 'Accept jobs & view 90% wallet',
    icon: Briefcase
  },
  {
    role: 'COOP_ADMIN',
    title: 'Society Admin',
    titleKey: 'authRoleAdmin',
    defaultTitle: 'Society Admin',
    subtitle: 'Verify members & tool library',
    icon: Building2
  },
  {
    role: 'MANAGEMENT',
    title: 'Operations Team',
    titleKey: 'authRoleManagement',
    defaultTitle: 'Operations Team',
    subtitle: 'Demand forecast & arbitration',
    icon: BarChart3
  },
  {
    role: 'DEVELOPER',
    title: 'Technical Console',
    titleKey: 'authRoleDev',
    defaultTitle: 'Technical Console',
    subtitle: 'API mesh & telemetry metrics',
    icon: Terminal
  }
];

// Silent query parameter synchronizer (isolated in Suspense to prevent SSR page-blocking)
function RoleQuerySync({ onRoleChange }: { onRoleChange: (role: UserRole) => void }) {
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get('role')?.toUpperCase() as UserRole;

  React.useEffect(() => {
    if (roleParam && ROLE_ITEMS.some(r => r.role === roleParam)) {
      onRoleChange(roleParam);
    }
  }, [roleParam, onRoleChange]);

  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [authMode, setAuthMode] = useState<'DEMO' | 'SUPABASE' | 'OTP'>('DEMO');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
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
        setErrorMessage(res.error || 'Invalid credentials. You can use 1-Click Persona Access above for demo.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (phoneNumber.length < 10) {
        setErrorMessage('Please enter a valid 10-digit mobile number.');
        return;
      }
      setErrorMessage(null);
      setOtpSent(true);
      return;
    }

    if (otpCode.length < 4) {
      setErrorMessage('Please enter the 4-digit OTP.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      loginAsDemoUser(selectedRole);
      const targetUrl = getPortalUrlForRole(selectedRole);
      router.push(targetUrl);
    }, 800);
  };

  const currentPersona = DEMO_PERSONAS[selectedRole];

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-6 animate-in fade-in duration-300">
      
      {/* Silent client query synchronizer */}
      <Suspense fallback={null}>
        <RoleQuerySync onRoleChange={setSelectedRole} />
      </Suspense>

      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Multi-Portal Authentication Gateway</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('authGatewayTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          {t('authGatewaySubtitle')}
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          {t('authPersonaHeading')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {t(item.titleKey) || item.defaultTitle}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">{item.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setAuthMode('DEMO')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            authMode === 'DEMO'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{t('authDemoMode')}</span>
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('OTP')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            authMode === 'OTP'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-blue-600" />
          <span>{t('authOtpMode')}</span>
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('SUPABASE')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            authMode === 'SUPABASE'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>{t('authPasswordMode')}</span>
        </button>
      </div>

      {/* Auth Card Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        
        {/* Error notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. DEMO FAST LOGIN */}
        {authMode === 'DEMO' && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                {currentPersona.user.name.charAt(0)}
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{currentPersona.user.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                    {currentPersona.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{currentPersona.user.email}</p>
                {currentPersona.user.trade && (
                  <p className="text-xs text-slate-700 font-medium">
                    Trade: {currentPersona.user.trade} • {currentPersona.user.cooperativeName}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Target Environment:</p>
              <p className="font-mono text-slate-500 text-[11px]">{currentPersona.targetPath}</p>
              <p className="text-[11px] text-slate-500">
                Instantly signs you in as a verified member with active Supabase session & local storage context.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleDemoSignIn(selectedRole)}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Launch {ROLE_ITEMS.find(r => r.role === selectedRole)?.title} Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. MOBILE PHONE OTP */}
        {authMode === 'OTP' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Mobile Phone Number</label>
              <div className="flex items-center border border-slate-300 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all overflow-hidden">
                <span className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-700 font-medium text-xs sm:text-sm">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98201 11221"
                  className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Instant OTP authentication tailored for artisan field members.
              </p>
            </div>

            {otpSent && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Enter OTP (One-Time Password)</label>
                  <span className="text-[10px] text-emerald-600 font-semibold">Demo code: 2608</span>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="2608"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-center tracking-widest font-mono text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Verifying Credentials...</span>
              ) : otpSent ? (
                <>
                  <span>Verify OTP & Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Send Login OTP via SMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. EMAIL & PASSWORD (SUPABASE) */}
        {authMode === 'SUPABASE' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative flex items-center border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Mail className="w-4 h-4 ml-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentPersona.user.email}
                  className="flex-1 py-2.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => handleDemoSignIn(selectedRole)}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Use demo credentials?
                </button>
              </div>
              <div className="relative flex items-center border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Lock className="w-4 h-4 ml-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="flex-1 py-2.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                />
              </div>
            </div>

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
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Need to register a new member or enterprise account? </span>
          <Link href="/register/worker" className="text-blue-600 font-semibold hover:underline">
            Register as Artisan
          </Link>
          <span> • </span>
          <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
            Client / Co-op Sign Up
          </Link>
        </div>

      </div>

    </div>
  );
}
