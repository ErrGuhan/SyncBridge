'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCoopData } from '@/context/CoopDataContext';
import { 
  Wallet, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  UploadCloud, 
  FileText, 
  Award, 
  ShieldCheck, 
  ArrowUpRight, 
  Zap, 
  Radio, 
  Check, 
  X, 
  Wrench,
  Volume2
} from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

interface VaultDocument {
  id: string;
  name: string;
  type: string;
  status: 'VERIFIED' | 'PENDING_REVIEW';
  uploadedAt: string;
  url: string;
}

export default function WorkerPortalPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { 
    orders, 
    acceptOrder, 
    completeOrder, 
    workerWallets, 
    withdrawWorkerWallet, 
    toolInventory 
  } = useCoopData();

  const workerId = user?.id || 'wrk-01';
  const workerWalletBalance = workerWallets[workerId] ?? 4850;

  // Availability state
  const [isOnline, setIsOnline] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [withdrawResult, setWithdrawResult] = useState<{ success: boolean; utr: string; amount: number } | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleReadAloud = (lead: any) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    let textToSpeak = '';
    let voiceLang = 'en-IN';

    if (language === 'hi') {
      voiceLang = 'hi-IN';
      textToSpeak = `नया काम उपलब्ध है। सेवा: ${lead.serviceCategory}। स्थान: ${lead.location}। ग्राहक: ${lead.customerName}। आपकी नब्बे प्रतिशत कमाई है ${lead.workerPayout} रुपये।`;
    } else if (language === 'kn') {
      voiceLang = 'kn-IN';
      textToSpeak = `ಹೊಸ ಕೆಲಸ ಬಂದಿದೆ. ಸೇವೆ: ${lead.serviceCategory}. ಸ್ಥಳ: ${lead.location}. ಗ್ರಾಹಕರು: ${lead.customerName}. ನಿಮ್ಮ ಗಳಿಕೆ: ${lead.workerPayout} ರೂಪಾಯಿಗಳು.`;
    } else if (language === 'ta') {
      voiceLang = 'ta-IN';
      textToSpeak = `புதிய வேலை வாய்ப்பு. சேவை: ${lead.serviceCategory}. இடம்: ${lead.location}. வாடிக்கையாளர்: ${lead.customerName}. உங்கள் பங்கு: ${lead.workerPayout} ரூபாய்.`;
    } else {
      voiceLang = 'en-IN';
      textToSpeak = `Incoming job dispatch. Service: ${lead.serviceCategory}. Location: ${lead.location}. Customer: ${lead.customerName}. Your 90 percent payout is ${lead.workerPayout} rupees.`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = voiceLang;
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Incoming and active orders
  const [declinedOrderIds, setDeclinedOrderIds] = useState<string[]>([]);
  const incomingLead = orders.find(o => o.status === 'CONFIRMED' && !declinedOrderIds.includes(o.id));
  const activeOngoingOrders = orders.filter(o => o.status === 'IN_PROGRESS');
  const recentCompletedOrders = orders.filter(o => o.status === 'COMPLETED');

  // Tools assigned to this worker
  const myAssignedTools = toolInventory.filter(t => t.assignedWorkerId === workerId || t.assignedWorkerName?.includes('Ramesh'));

  // Cloud Storage Vault Documents
  const [documents, setDocuments] = useState<VaultDocument[]>([
    {
      id: 'doc-01',
      name: 'e-Shram National Worker Card',
      type: 'Government UAN (Masked)',
      status: 'VERIFIED',
      uploadedAt: '12 Jan 2026',
      url: 'https://qniqutaavdjnutnprjdk.supabase.co/storage/v1/object/public/worker-vault/eshram_verified.pdf'
    },
    {
      id: 'doc-02',
      name: 'NCCT Wireman Trade Certification',
      type: 'Technical Accreditation Grade A',
      status: 'VERIFIED',
      uploadedAt: '14 Jan 2026',
      url: 'https://qniqutaavdjnutnprjdk.supabase.co/storage/v1/object/public/worker-vault/ncct_license.pdf'
    },
    {
      id: 'doc-03',
      name: '₹5 Lakh Cooperative Health Shield Card',
      type: 'Mutual Aid Medical Policy',
      status: 'VERIFIED',
      uploadedAt: '18 Jan 2026',
      url: 'https://qniqutaavdjnutnprjdk.supabase.co/storage/v1/object/public/worker-vault/health_shield.pdf'
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const res = await fetch('/api/storage/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || 'application/pdf',
          workerId: workerId,
          documentType: 'SKILL_LICENSE'
        })
      });

      const data = await res.json();

      setTimeout(() => {
        const newDoc: VaultDocument = {
          id: `doc-${Date.now()}`,
          name: file.name,
          type: 'Additional Trade License',
          status: 'PENDING_REVIEW',
          uploadedAt: 'Just now',
          url: data.publicUrl || '#'
        };
        setDocuments(prev => [newDoc, ...prev]);
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const handleWithdraw = () => {
    if (workerWalletBalance <= 0) return;
    const res = withdrawWorkerWallet(workerId, 'ramesh@okhdfcbank');
    setWithdrawResult(res);
    setTimeout(() => {
      setWithdrawResult(null);
    }, 6000);
  };

  const handleAcceptJob = (orderId: string) => {
    acceptOrder(orderId, workerId);
    setActionSuccessMsg('Job Accepted! Mutex dispatch lock held. Customer alerted you are en route.');
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleCompleteJob = (orderId: string) => {
    completeOrder(orderId);
    setActionSuccessMsg('Job Completed! 90% direct payout has been credited to your available balance.');
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  const handlePassJob = (orderId: string) => {
    setDeclinedOrderIds(prev => [...prev, orderId]);
    setActionSuccessMsg('Job passed to peer artisan in Kalyan Labour Society (5 km radius).');
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Compute live active escrow
  const inTransitEscrow = activeOngoingOrders.reduce((acc, curr) => acc + curr.workerPayout, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Worker Profile & Live Status Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('workerVerifiedBadge')}</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
              Rating: ★ 4.92 / 5.0 (Peer Audited)
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dispute Standing: 0 Inquiries (100% Clean Record)</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {user?.name || 'Ramesh Chavan'} ({user?.trade || 'Master Electrician'})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            UAN: <span className="font-mono text-slate-700">1009-XXXX-4412</span> • NCD Code: <span className="font-mono text-slate-700">NCD-KA-BLR-0042</span> • 90% Direct Pay Active
          </p>
        </div>

        {/* Availability Toggle Controls */}
        <div className="flex items-center gap-3 self-start md:self-center bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isOnline
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
            <span>{isOnline ? t('onlineStatus') : t('offlineStatus')}</span>
          </button>

          <button
            type="button"
            onClick={() => setSosActive(!sosActive)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              sosActive
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-rose-600 border border-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{sosActive ? t('sosModeOn') : t('sosEmergencyOptIn')}</span>
          </button>
        </div>
      </div>

      {/* 90% EARNINGS & ESCROW WALLET */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('availableWallet')}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">₹{workerWalletBalance.toLocaleString()}</p>
          
          <div className="pt-2">
            {withdrawResult ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>₹{withdrawResult.amount} Sent to UPI!</span>
                </div>
                <div className="font-mono text-[10px] text-emerald-700">
                  {withdrawResult.utr} • ramesh@okhdfcbank
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={workerWalletBalance === 0}
                onClick={handleWithdraw}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-40"
              >
                <span>{t('withdrawUpi')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('activeJobEscrow')}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">₹{inTransitEscrow > 0 ? inTransitEscrow.toLocaleString() : '1,200'}</p>
          <p className="text-xs text-slate-500">
            Auto-released upon customer OTP verification or service completion.
          </p>
        </div>

        {/* Mutual Aid Accrual */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('pensionCorpus')}
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-indigo-600">₹42,800</p>
            <p className="text-xs text-slate-500">
              Part of ₹1.45 Cr collective trust with 50% cooperative matching grant.
            </p>
          </div>

          <Link
            href="/welfare"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 pt-2"
          >
            <span>View Welfare Fund & ₹5L Shield →</span>
          </Link>
        </div>
      </section>

      {/* WEEKLY & TODAY'S 90/5/5 EARNINGS BREAKDOWN */}
      {(() => {
        const completedVolume = recentCompletedOrders.reduce((sum, o) => sum + o.totalAmount, 0) || 14200;
        const completedTakeHome = Math.round(completedVolume * 0.9);
        const completedSociety = Math.round(completedVolume * 0.05);
        const completedWelfare = Math.round(completedVolume * 0.05);
        const jobsCount = recentCompletedOrders.length > 0 ? recentCompletedOrders.length : 8;

        return (
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {t('weeklyBreakdownTitle')}
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Pure Cooperative Mathematics
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  This week: {jobsCount} completed jobs across Dadar &amp; Bandra. Total client volume: ₹{completedVolume.toLocaleString()}.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  Today: 3 Jobs (₹2,430 net take-home)
                </span>
              </div>
            </div>

            {/* 3 Metric Cards for the 90/5/5 distribution */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {t('workerTakeHome')}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-mono">
                    90.0%
                  </span>
                </div>
                <p className="text-2xl font-black text-emerald-700">₹{completedTakeHome.toLocaleString()}</p>
                <p className="text-[11px] text-emerald-600">
                  Credited instantly to your available balance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                    {t('societyTreasuryShare')}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-200/80 text-blue-900 font-mono">
                    5.0%
                  </span>
                </div>
                <p className="text-2xl font-black text-blue-700">₹{completedSociety.toLocaleString()}</p>
                <p className="text-[11px] text-blue-600">
                  Funds power tool lockers &amp; secretary dispatch.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    {t('mutualAidShare')}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-mono">
                    5.0%
                  </span>
                </div>
                <p className="text-2xl font-black text-amber-700">₹{completedWelfare.toLocaleString()}</p>
                <p className="text-[11px] text-amber-600">
                  ₹5L health shield + pension corpus matching.
                </p>
              </div>
            </div>

            {/* Proportional Split Visual Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner">
                <div className="bg-emerald-500 h-full transition-all" style={{ width: '90%' }} title={`90% Worker Take-Home (₹${completedTakeHome.toLocaleString()})`} />
                <div className="bg-blue-500 h-full transition-all" style={{ width: '5%' }} title={`5% Society Operational (₹${completedSociety.toLocaleString()})`} />
                <div className="bg-amber-500 h-full transition-all" style={{ width: '5%' }} title={`5% Welfare & Pension (₹${completedWelfare.toLocaleString()})`} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Total Gross Client Volume: ₹{completedVolume.toLocaleString()}</span>
                <span>Mathematical Check: ₹{completedTakeHome.toLocaleString()} + ₹{completedSociety.toLocaleString()} + ₹{completedWelfare.toLocaleString()} = ₹{completedVolume.toLocaleString()} (Exact 100%)</span>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ACTIVE ONGOING JOBS (IF ANY) */}
      {activeOngoingOrders.length > 0 && (
        <section className="bg-white border-2 border-emerald-500/70 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('activeJobTitle')} ({activeOngoingOrders.length})</span>
              </span>
            </div>
            <span className="text-xs text-slate-400">Lock ID: Active Mutex Session</span>
          </div>

          <div className="space-y-4">
            {activeOngoingOrders.map(order => (
              <div key={order.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{order.serviceCategory}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">{order.id}</span>
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.location}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Client: <strong className="text-slate-700">{order.customerName}</strong>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-right sm:pr-4">
                    <span className="text-xs text-slate-400 block">Your 90% Take-Home:</span>
                    <span className="text-xl font-bold text-emerald-600">₹{order.workerPayout}</span>
                  </div>

                  <a
                    href="tel:9820144552"
                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-100"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Client</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCompleteJob(order.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('completeJobBtn')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* INCOMING DISPATCH BROADCAST (LIVE JOB OPPORTUNITY) */}
      {incomingLead && (
        <section className="bg-white border-2 border-blue-600/70 rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 animate-pulse">
                <Radio className="w-3.5 h-3.5 text-rose-600" />
                <span>INCOMING LIVE DISPATCH</span>
              </span>
              <button
                type="button"
                onClick={() => handleReadAloud(incomingLead)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  isSpeaking
                    ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}
                title="Listen to dispatch details in your language"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeaking ? 'Speaking...' : '🔊 Read Aloud'}</span>
              </button>
              <span className="text-xs text-slate-500">• 100% Surge Pass-Through</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block font-medium">Your 90% Take-Home Payout:</span>
              <span className="text-2xl font-black text-emerald-600">₹{incomingLead.workerPayout}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <span>{incomingLead.serviceCategory}</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600 flex items-center gap-1 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>2.1 km away</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              &quot;Customer requested immediate cooperative service dispatch at {incomingLead.location}.&quot;
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span>Location: <strong className="text-slate-800">{incomingLead.location}</strong></span>
              <span>Customer: <strong className="text-slate-800">{incomingLead.customerName}</strong></span>
              <span>Scheduled: <strong className="text-slate-800">{incomingLead.scheduledTime}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleAcceptJob(incomingLead.id)}
              className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{t('acceptJobBtn')}</span>
            </button>
            <button
              type="button"
              onClick={() => handlePassJob(incomingLead.id)}
              className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <X className="w-4 h-4" />
              <span>{t('passJobBtn')}</span>
            </button>
          </div>
        </section>
      )}

      {/* COOPERATIVE SHARED POWER TOOLS SECTION */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                My Checked-Out Cooperative Power Tools
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Democratically shared equipment funded via the 5% Society Operational Treasury.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
            {myAssignedTools.length} Tools in Possession
          </span>
        </div>

        {myAssignedTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myAssignedTools.map(tool => (
              <div key={tool.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-semibold">
                      {tool.serialNumber}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Condition: {tool.condition}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 pt-1">{tool.name}</h4>
                  <p className="text-xs text-slate-500">{tool.category}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span>Society: <strong>{tool.cooperativeChapter}</strong></span>
                  <span className="text-emerald-700 font-semibold">₹{tool.dailyFee}/day subsidized</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No heavy power tools checked out. Visit your Primary Society Locker to borrow industrial equipment for free or subsidized rates.
          </div>
        )}
      </section>

      {/* CLOUD STORAGE DOCUMENT VAULT */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Cloud Storage Document & Verification Vault
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                GCS / Supabase Storage
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Encrypted credentials audited by Primary Society Secretary to preserve platform discovery status.
            </p>
          </div>

          <div className="relative">
            <input
              type="file"
              id="vault-file-upload"
              className="hidden"
              onChange={handleSimulateUpload}
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <label
              htmlFor="vault-file-upload"
              className="cursor-pointer h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? 'Uploading to Bucket...' : 'Upload New Certificate'}</span>
            </label>
          </div>
        </div>

        {uploadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Document encrypted and uploaded to Cloud Storage bucket. Society Secretary review task queued!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    doc.status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 pt-1">{doc.name}</h3>
                <p className="text-xs text-slate-500">{doc.type}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Uploaded: {doc.uploadedAt}</span>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  View File
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COOPERATIVE DIGNITY & ANTI-DEACTIVATION GUARANTEE */}
      <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 text-sm">
            Cooperative Livelihood Guarantee
          </span>
          <p className="leading-relaxed text-slate-600">
            Unlike commercial venture gig apps, your account cannot be automatically deactivated by customer rating algorithms. 
            All disputes are mediated by a <strong>3-Member Restorative Peer Council</strong> of fellow artisans and covered by the <strong>1% Cooperative Guarantee Fund</strong>.
          </p>
        </div>
      </div>

    </div>
  );
}
