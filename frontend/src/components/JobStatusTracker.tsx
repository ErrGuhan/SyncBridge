'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export type JobTrafficState = 'RED' | 'YELLOW' | 'GREEN';

interface JobStatusTrackerProps {
  initialState?: JobTrafficState;
  bookingNumber?: string;
  workerName?: string;
  workerPhone?: string;
  workerTrade?: string;
  workerEtaMinutes?: number;
  totalAmount?: number;
}

export default function JobStatusTracker({
  initialState = 'YELLOW',
  bookingNumber = 'EMG-2026-8819',
  workerName = 'Ramesh Chavan (NCCT Certified)',
  workerPhone = '+91 98201 11221',
  workerTrade = 'Master Electrician',
  workerEtaMinutes = 12,
  totalAmount = 1200
}: JobStatusTrackerProps) {
  const { t } = useLanguage();
  const [trafficState, setTrafficState] = useState<JobTrafficState>(initialState);

  const workerPayout = Math.round(totalAmount * 0.9);
  const coopTreasury = Math.round(totalAmount * 0.05);
  const welfareFund = Math.round(totalAmount * 0.05);

  return (
    <div className="accessible-card p-5 bg-white space-y-5">
      {/* Header & Booking Identifier */}
      <div className="flex items-center justify-between border-b-2 border-black pb-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
            Booking Reference
          </span>
          <span className="text-lg font-black text-black tracking-tight">
            #{bookingNumber}
          </span>
        </div>

        {/* Traffic Light State Selector Pills for Demo / Interactive Testing */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border-2 border-black">
          <button
            onClick={() => setTrafficState('RED')}
            className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center border transition-all ${
              trafficState === 'RED'
                ? 'bg-red-600 text-white border-black scale-110 shadow-sm'
                : 'bg-red-100 text-red-700 border-transparent hover:border-black'
            }`}
            aria-label="View Red State"
          >
            🔴
          </button>
          <button
            onClick={() => setTrafficState('YELLOW')}
            className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center border transition-all ${
              trafficState === 'YELLOW'
                ? 'bg-amber-400 text-black border-black scale-110 shadow-sm'
                : 'bg-yellow-100 text-yellow-700 border-transparent hover:border-black'
            }`}
            aria-label="View Yellow State"
          >
            🟡
          </button>
          <button
            onClick={() => setTrafficState('GREEN')}
            className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center border transition-all ${
              trafficState === 'GREEN'
                ? 'bg-emerald-500 text-black border-black scale-110 shadow-sm'
                : 'bg-emerald-100 text-emerald-700 border-transparent hover:border-black'
            }`}
            aria-label="View Green State"
          >
            🟢
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 🔴 RED STATE: WAITING FOR WORKER (Pulsing Radar Circle) */}
      {/* -------------------------------------------------------------------- */}
      {trafficState === 'RED' && (
        <div className="space-y-4 py-2 text-center animate-in fade-in duration-200">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            {/* Animated Pulsing Rings */}
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-red-500/30 animate-pulse" />
            <div className="relative w-16 h-16 rounded-full bg-red-600 text-white border-[3px] border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              📡
            </div>
          </div>

          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-red-100 border-2 border-red-600 text-red-800 text-xs font-black uppercase tracking-wider">
              Step 1: Finding Worker
            </span>
            <h3 className="text-2xl font-black text-black">
              {t('waitingWorker')}
            </h3>
            <p className="text-sm font-bold text-slate-700 max-w-xs mx-auto">
              Alerting verified cooperative workers in your 5km radius over WebSocket mesh.
            </p>
          </div>

          <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl text-xs font-bold text-red-900 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Estimated response time: ~60 seconds</span>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 🟡 YELLOW STATE: WORKER ON THE WAY (Animated Moving Scooter) */}
      {/* -------------------------------------------------------------------- */}
      {trafficState === 'YELLOW' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Status Banner */}
          <div className="flex items-center justify-between bg-amber-300 border-2 border-black rounded-2xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-600 animate-ping" />
              <span className="font-black text-base text-black">
                {t('workerOnWay')}
              </span>
            </div>
            <span className="font-black text-xs bg-black text-white px-2.5 py-1 rounded-lg">
              ETA: ~{workerEtaMinutes} Mins
            </span>
          </div>

          {/* Animated Scooter Track Visual */}
          <div className="p-4 bg-amber-50 border-2 border-black rounded-2xl space-y-2 overflow-hidden">
            <div className="flex justify-between text-xs font-black text-slate-700">
              <span>Cooperative Hub (Dadar)</span>
              <span>Your Location (Home)</span>
            </div>

            {/* Road Track with Moving Scooter */}
            <div className="relative h-14 bg-slate-200 border-2 border-black rounded-xl flex items-center px-4 overflow-hidden">
              {/* Dashed Road Line */}
              <div className="absolute inset-x-0 h-0.5 border-b-2 border-dashed border-slate-400" />
              {/* Moving Scooter Icon */}
              <div className="relative animate-scooter z-10 flex items-center">
                <span className="text-3xl filter drop-shadow-md">🛵</span>
                <span className="text-[10px] font-black bg-black text-white px-1.5 py-0.5 rounded shadow ml-1">
                  En Route
                </span>
              </div>
              {/* Destination Pin */}
              <div className="absolute right-3 z-10 text-2xl">
                📍
              </div>
            </div>
          </div>

          {/* Assigned Worker Profile & Direct Call Button (>= 48px) */}
          <div className="p-3.5 bg-white border-2 border-black rounded-2xl flex items-center justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-200 border-2 border-black flex items-center justify-center text-xl font-black">
                👨‍🔧
              </div>
              <div>
                <p className="font-black text-base text-black">{workerName}</p>
                <p className="text-xs font-bold text-slate-600">{workerTrade}</p>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-400">
                  ✓ Verified Member-Owner
                </span>
              </div>
            </div>

            <a
              href={`tel:${workerPhone}`}
              className="min-h-[50px] min-w-[50px] px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm border-2 border-black flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
              aria-label="Call Worker"
            >
              <Phone className="w-5 h-5 stroke-[2.5]" />
              <span>Call</span>
            </a>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 🟢 GREEN STATE: JOB DONE (Verified Stamp & 90% Worker Payout) */}
      {/* -------------------------------------------------------------------- */}
      {trafficState === 'GREEN' && (
        <div className="space-y-4 py-1 animate-in fade-in duration-200 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-400 border-[3px] border-black flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            ✓
          </div>

          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 border-2 border-emerald-600 text-emerald-900 text-xs font-black uppercase tracking-wider">
              Service Finished
            </span>
            <h3 className="text-2xl font-black text-black">
              {t('jobCompleted')}
            </h3>
            <p className="text-sm font-bold text-slate-700">
              Payment settled via UPI under the 90-5-5 cooperative charter.
            </p>
          </div>

          {/* Transparent Cooperative Payout Breakdown */}
          <div className="accessible-card p-4 text-left bg-emerald-50 space-y-2 border-emerald-600">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-950 border-b border-emerald-300 pb-1 flex items-center justify-between">
              <span>Cooperative Fair Payout</span>
              <span className="text-sm font-black text-black">Total: ₹{totalAmount}</span>
            </div>

            <div className="space-y-1 text-xs font-bold text-slate-800">
              <div className="flex justify-between text-emerald-900">
                <span className="font-extrabold">90% Direct to Worker Member:</span>
                <span className="font-black text-base">₹{workerPayout}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>5% Cooperative Treasury Reserve:</span>
                <span>₹{coopTreasury}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>5% Mutual Aid & Insurance Fund:</span>
                <span>₹{welfareFund}</span>
              </div>
            </div>

            <p className="text-[11px] font-extrabold text-emerald-800 pt-1">
              ✨ Zero corporate commissions deducted. 100% owned by member-workers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
