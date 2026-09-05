'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Navigation,
  Check
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
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      
      {/* Header & State Pill Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              #{bookingNumber}
            </span>
            <span className="text-xs font-medium text-slate-500">Live Cooperative Dispatch</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {trafficState === 'RED' && 'Locating Available Member-Worker...'}
            {trafficState === 'YELLOW' && 'Member-Worker is En Route'}
            {trafficState === 'GREEN' && 'Service Completed & Settled'}
          </h3>
        </div>

        {/* State Toggle Buttons for Testing */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setTrafficState('RED')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              trafficState === 'RED'
                ? 'bg-white text-rose-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Searching
          </button>
          <button
            onClick={() => setTrafficState('YELLOW')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              trafficState === 'YELLOW'
                ? 'bg-white text-amber-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            En Route
          </button>
          <button
            onClick={() => setTrafficState('GREEN')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              trafficState === 'GREEN'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 🔴 RED STATE: SEARCHING (Clean, Minimalist Pulse) */}
      {/* -------------------------------------------------------------------- */}
      {trafficState === 'RED' && (
        <div className="p-6 rounded-xl bg-rose-50/40 border border-rose-200/80 text-center space-y-3 animate-in fade-in duration-150">
          <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-rose-400/20 animate-ping" />
            <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-base">Alerting Local Cooperative Hub</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Broadcasting your request to verified trade members within a 5 km perimeter. Average acceptance: 45 seconds.
            </p>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 🟡 YELLOW STATE: EN ROUTE (Sleek Modern Progress Track) */}
      {/* -------------------------------------------------------------------- */}
      {trafficState === 'YELLOW' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Progress Timeline Bar */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>Worker Dispatched from Hub</span>
              </span>
              <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                ETA: ~{workerEtaMinutes} mins
              </span>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
              <div className="bg-gradient-to-r from-blue-600 to-amber-500 h-full rounded-full w-[65%] transition-all duration-1000" />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Cooperative Hub (Dadar)</span>
              <span>Your Address</span>
            </div>
          </div>

          {/* Assigned Worker Profile Card */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-sm">
                RC
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{workerName}</p>
                <p className="text-xs text-slate-500">{workerTrade}</p>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 inline" /> NCCT Certified Member
                </span>
              </div>
            </div>

            <a
              href={`tel:${workerPhone}`}
              className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 🟢 GREEN STATE: COMPLETED (Verified Receipt) */}
      {/* -------------------------------------------------------------------- */}
      {trafficState === 'GREEN' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Job Completed & Verified</h4>
              <p className="text-xs text-slate-600">
                Payment settled under the 90/5/5 cooperative patronage model with 0% venture commission.
              </p>
            </div>
          </div>

          {/* Clean Receipt Breakdown */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-200">
              <span>Total Service Cost</span>
              <span className="font-bold text-slate-900 text-sm">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-emerald-800 font-semibold">
              <span>• 90% Direct Worker Member Payout:</span>
              <span>₹{workerPayout}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>• 5% Primary Society Capital Fund:</span>
              <span>₹{coopTreasury}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>• 5% Healthcare & Social Security Pool:</span>
              <span>₹{welfareFund}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
