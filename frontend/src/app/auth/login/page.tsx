'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  User, 
  Briefcase, 
  Building2, 
  Lock, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  RotateCcw
} from 'lucide-react';

type PersonaTab = 'CUSTOMER' | 'WORKER' | 'ADMIN';

function RoleQuerySync({ onTabChange }: { onTabChange: (tab: PersonaTab) => void }) {
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get('role')?.toUpperCase();
  const syncedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (roleParam && roleParam !== syncedRef.current) {
      syncedRef.current = roleParam;
      if (roleParam === 'WORKER') {
        onTabChange('WORKER');
      } else if (roleParam === 'ADMIN' || roleParam === 'COOP_ADMIN' || roleParam === 'SOCIETY_SECRETARY') {
        onTabChange('ADMIN');
      } else if (roleParam === 'CUSTOMER') {
        onTabChange('CUSTOMER');
      }
    }
  }, [roleParam, onTabChange]);

  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { 
    loginWithPhoneOtp, 
    verifyAdminPassword, 
    loginAdminWith2FA 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<PersonaTab>('CUSTOMER');
  
  // Customer & Worker State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Admin 2FA State
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminStage, setAdminStage] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [adminMaskedPhone, setAdminMaskedPhone] = useState('');
  const [admin2faOtp, setAdmin2faOtp] = useState('');

  // UI status
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabSwitch = React.useCallback((tab: PersonaTab) => {
    setActiveTab(prev => {
      if (prev !== tab) {
        setPhoneNumber('');
        setOtpCode('');
        setOtpSent(false);
        setAdminId('');
        setAdminPassword('');
        setAdminStage('PASSWORD');
        setAdmin2faOtp('');
        setErrorMessage(null);
      }
      return tab;
    });
  }, []);

  // Quick fill helper for reviewers
  const fillSampleCustomer = () => {
    setPhoneNumber('9820144552');
    setOtpSent(true);
    setOtpCode('123456');
    setErrorMessage(null);
  };

  const fillSampleWorker = () => {
    setPhoneNumber('9820111221');
    setOtpSent(true);
    setOtpCode('123456');
    setErrorMessage(null);
  };

  const fillSampleAdmin = () => {
    setAdminId('admin@kalyancoop.in');
    setAdminPassword('Admin@2026');
    setErrorMessage(null);
  };

  // Customer / Worker OTP flow
  const handlePhoneOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!otpSent) {
      if (cleanPhone.length < 10) {
        setErrorMessage('Please enter a valid 10-digit mobile number.');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setOtpSent(true);
        setIsSubmitting(false);
      }, 500);
      return;
    }

    if (otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit confirmation OTP code.');
      return;
    }

    setIsSubmitting(true);
    const targetRole = activeTab === 'WORKER' ? 'WORKER' : 'CUSTOMER';
    const res = await loginWithPhoneOtp(cleanPhone, otpCode, targetRole);
    setIsSubmitting(false);

    if (res.success) {
      router.push(targetRole === 'WORKER' ? '/portal/worker' : '/portal/customer');
    } else {
      setErrorMessage(res.error || 'Verification failed. Please check OTP code.');
    }
  };

  // Admin Stage 1: Password Check
  const handleAdminPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!adminId.trim()) {
      setErrorMessage('Please enter your Administrator Email or Society ID.');
      return;
    }
    if (!adminPassword || adminPassword.length < 6) {
      setErrorMessage('Please enter your secret administrator password.');
      return;
    }

    setIsSubmitting(true);
    const res = await verifyAdminPassword(adminId, adminPassword);
    setIsSubmitting(false);

    if (res.success) {
      setAdminMaskedPhone(res.maskedPhone || '+91 98201 •••••');
      setAdminStage('OTP');
    } else {
      setErrorMessage(res.error || 'Invalid credentials.');
    }
  };

  // Admin Stage 2: 2FA OTP Confirmation
  const handleAdmin2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (admin2faOtp.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit 2FA confirmation code.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginAdminWith2FA(adminId, admin2faOtp);
    setIsSubmitting(false);

    if (res.success) {
      router.push('/portal/admin');
    } else {
      setErrorMessage(res.error || '2FA confirmation failed.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-6 animate-in fade-in duration-300">
      
      <Suspense fallback={null}>
        <RoleQuerySync onTabChange={handleTabSwitch} />
      </Suspense>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Role-Gated Cooperative Authentication</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Sign In to SyncBridge
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Choose your account type below. Unauthenticated visitors are kept isolated from internal data until verified.
        </p>
      </div>

      {/* Persona Tab Switcher */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => handleTabSwitch('CUSTOMER')}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
            activeTab === 'CUSTOMER'
              ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 text-blue-600" />
          <span>Customer</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('WORKER')}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
            activeTab === 'WORKER'
              ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-600" />
          <span>Tradesperson</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('ADMIN')}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
            activeTab === 'ADMIN'
              ? 'bg-white text-amber-700 shadow-xs ring-1 ring-amber-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-600" />
          <span>SOP / Admin</span>
        </button>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Error message banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. CUSTOMER TAB: MOBILE NUMBER + OTP */}
        {activeTab === 'CUSTOMER' && (
          <form onSubmit={handlePhoneOtpSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Customer Sign In</h2>
                <p className="text-xs text-slate-500">Sign in securely via mobile phone OTP verification.</p>
              </div>
              <button
                type="button"
                onClick={fillSampleCustomer}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/80 transition-colors"
              >
                1-Click Test Number
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Mobile Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-slate-500">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  disabled={otpSent}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98201 44552"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-slate-100 disabled:text-slate-500 transition-colors"
                />
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2 p-4 bg-blue-50/60 rounded-xl border border-blue-100 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-900 block">Enter 6-Digit SMS OTP</label>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Change Number</span>
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-300 bg-white text-base font-mono font-bold tracking-widest text-center text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[11px] text-blue-700">
                  Test code: <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-blue-200">123456</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : otpSent ? (
                <>
                  <span>Verify OTP & Enter Customer Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span>Send Login OTP</span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                New customer?{' '}
                <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
                  Register for cooperative service booking →
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* 2. WORKER TAB: MOBILE NUMBER + OTP */}
        {activeTab === 'WORKER' && (
          <form onSubmit={handlePhoneOtpSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Tradesperson Member Sign In</h2>
                <p className="text-xs text-slate-500">Fast field login for registered cooperative artisans.</p>
              </div>
              <button
                type="button"
                onClick={fillSampleWorker}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
              >
                1-Click Test Worker
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Registered Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-slate-500">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  disabled={otpSent}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98201 11221"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 disabled:bg-slate-100 disabled:text-slate-500 transition-colors"
                />
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2 p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-900 block">Enter 6-Digit Field OTP</label>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="text-[10px] text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Change Number</span>
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 bg-white text-base font-mono font-bold tracking-widest text-center text-slate-900 focus:ring-2 focus:ring-emerald-600"
                />
                <p className="text-[11px] text-emerald-700">
                  Test code: <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">123456</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : otpSent ? (
                <>
                  <span>Verify OTP & Access Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span>Send Field Login OTP</span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                New artisan?{' '}
                <Link href="/register/worker" className="text-emerald-700 font-semibold hover:underline">
                  Join a primary labour cooperative society →
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* 3. SOP / ADMIN TAB: PASSWORD AND BOTH THE OTP CONFIRMATION */}
        {activeTab === 'ADMIN' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">SOP & Society Administrator Login</h2>
                <p className="text-xs text-slate-500">Two-Factor Authentication: Requires Password AND OTP confirmation.</p>
              </div>
              {adminStage === 'PASSWORD' && (
                <button
                  type="button"
                  onClick={fillSampleAdmin}
                  className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
                >
                  1-Click Test Admin
                </button>
              )}
            </div>

            {/* STAGE 1: PASSWORD */}
            {adminStage === 'PASSWORD' ? (
              <form onSubmit={handleAdminPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Administrator Email or Society ID</label>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="admin@kalyancoop.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Administrator Secret Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <KeyRound className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">2-Factor Security Enforced</p>
                    <p className="text-[11px] text-amber-800">
                      Step 1 requires your verified administrator password. Upon validation, a one-time 2FA OTP code will be sent to your registered device.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Validating Password...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Verify Password & Request 2FA OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STAGE 2: OTP CONFIRMATION */
              <form onSubmit={handleAdmin2FASubmit} className="space-y-4 animate-in fade-in">
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Stage 1 Passed: Password Verified</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Stage 2: Enter the 6-digit 2FA confirmation code dispatched to:
                  </p>
                  <p className="text-xs font-bold text-slate-900 font-mono">
                    {adminMaskedPhone}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 block">2FA Confirmation OTP Code</label>
                    <button
                      type="button"
                      onClick={() => setAdmin2faOtp('123456')}
                      className="text-[11px] text-amber-800 hover:underline font-semibold"
                    >
                      Fill Test 2FA OTP (123456)
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={admin2faOtp}
                    onChange={(e) => setAdmin2faOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-base font-mono font-bold tracking-widest text-center text-slate-900 focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Authenticating 2FA Session...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm Both Credentials & Access Admin Console</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setAdminStage('PASSWORD'); setAdmin2faOtp(''); }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    ← Back to Password
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
