'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
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
  AlertCircle, 
  Zap, 
  Radio,
  Send,
  Calendar,
  Check,
  X,
  Building2,
  Lock
} from 'lucide-react';

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

  // Availability state
  const [isOnline, setIsOnline] = useState(true);
  const [sosActive, setSosActive] = useState(false);

  // Incoming Job Lead State
  const [activeJobLead, setActiveJobLead] = useState<{
    id: string;
    customerName: string;
    category: string;
    distanceKm: number;
    locality: string;
    issueDescription: string;
    estimatedPayout: number;
    isEmergency: boolean;
  } | null>({
    id: 'EMG-JOB-8821',
    customerName: 'Suresh Kumar',
    category: 'Electrical Emergency',
    distanceKm: 2.1,
    locality: 'Indiranagar 2nd Stage, Ward 88',
    issueDescription: 'Main circuit breaker sparked and cut power to refrigeration line. Urgent assistance required.',
    estimatedPayout: 850,
    isEmergency: true
  });

  const [jobAccepted, setJobAccepted] = useState(false);

  // Wallet & Withdraw state
  const [walletBalance, setWalletBalance] = useState(4850);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

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
      // Call signed upload URL route
      const res = await fetch('/api/storage/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || 'application/pdf',
          workerId: user?.id || 'wrk-demo-01',
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
    if (walletBalance <= 0) return;
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWalletBalance(0);
      setWithdrawSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Worker Profile & Live Status Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Cooperative Member • Kalyan Labour Society</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
              Rating: ★ 4.88 / 5.0
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
            <span>{isOnline ? 'Online (Receiving Jobs)' : 'Offline'}</span>
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
            <span>{sosActive ? 'SOS Mode ON' : 'Emergency Opt-In'}</span>
          </button>
        </div>
      </div>

      {/* 90% EARNINGS & ESCROW WALLET */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available 90% Wallet Balance
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">₹{walletBalance.toLocaleString()}</p>
          <div className="pt-2">
            {withdrawSuccess ? (
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                ✓ Payout sent to UPI (ramesh@okhdfcbank)
              </div>
            ) : (
              <button
                type="button"
                disabled={walletBalance === 0}
                onClick={handleWithdraw}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-40"
              >
                <span>Instant Withdraw to UPI / Bank</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Job Escrow (In Transit)
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">₹1,200</p>
          <p className="text-xs text-slate-500">
            Auto-released upon customer OTP verification or completion photo.
          </p>
        </div>

        {/* Mutual Aid Accrual */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Accrued Pension Corpus (5% Pool)
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-indigo-600">₹42,800</p>
          <p className="text-xs text-slate-500">
            With 50% cooperative federation matching grant.
          </p>
        </div>
      </section>

      {/* INCOMING DISPATCH BROADCAST (JOB OPPORTUNITY) */}
      {activeJobLead && (
        <section className="bg-white border-2 border-blue-600/70 rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 animate-pulse">
                <Radio className="w-3.5 h-3.5 text-rose-600" />
                <span>INCOMING LIVE DISPATCH</span>
              </span>
              <span className="text-xs text-slate-500">• 100% Surge Pass-Through</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block font-medium">Your 90% Take-Home Payout:</span>
              <span className="text-2xl font-black text-emerald-600">₹{activeJobLead.estimatedPayout}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <span>{activeJobLead.category}</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600 flex items-center gap-1 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeJobLead.distanceKm} km away</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              "{activeJobLead.issueDescription}"
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span>Location: <strong className="text-slate-800">{activeJobLead.locality}</strong></span>
              <span>Customer: <strong className="text-slate-800">{activeJobLead.customerName}</strong></span>
            </div>
          </div>

          {jobAccepted ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Job Accepted! Mutex lock secured. Customer informed you are en route.</span>
              </div>
              <a
                href="tel:9820144552"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Client</span>
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setJobAccepted(true)}
                className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Accept Job (Lock Dispatch)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveJobLead(null)}
                className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <X className="w-4 h-4" />
                <span>Pass to Peer Society Worker</span>
              </button>
            </div>
          )}
        </section>
      )}

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
