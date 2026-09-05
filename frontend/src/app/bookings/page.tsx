'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import JobStatusTracker from '@/components/JobStatusTracker';
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Plus
} from 'lucide-react';
import { MOCK_BOOKINGS, BookingItem } from '@/data/mockData';

export default function BookingsPage() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<BookingItem[]>(MOCK_BOOKINGS);
  const [filter, setFilter] = useState<string>('ALL');

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  const handleMarkComplete = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return { ...b, status: 'COMPLETED' };
        }
        return b;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* 1. PAGE HEADER */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            {t('navJobs')} (Service Orders)
          </h1>
          <p className="text-sm font-bold text-slate-700 mt-0.5">
            Track active dispatches with traffic-light status & direct worker payouts.
          </p>
        </div>

        <Link
          href="/services"
          className="min-h-[48px] px-4 py-2 rounded-xl bg-black text-white hover:bg-slate-800 font-black text-sm flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[1px] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Book Service</span>
        </Link>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. PROMINENT ACTIVE REAL-TIME STATUS TRACKER (Traffic Light System) */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span>Live Dispatch Tracker</span>
          </h2>
          <span className="text-[11px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-black">
            Tap 🔴 🟡 🟢 to test visual states
          </span>
        </div>

        {/* Traffic Light Tracker Component */}
        <JobStatusTracker
          initialState="YELLOW"
          bookingNumber="BKG-2026-8819"
          workerName="Ramesh Chavan (NCCT Certified)"
          workerPhone="+91 98201 11221"
          workerTrade="Master Electrician"
          workerEtaMinutes={11}
          totalAmount={1200}
        />
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 3. FILTER TABS (Large Touch Targets >= 48px) */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`min-h-[48px] px-4 py-2 rounded-xl text-xs sm:text-sm font-black border-2 border-black transition-all flex-shrink-0 active:scale-95 ${
              filter === tab
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]'
                : 'bg-white text-black hover:bg-slate-100'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4. BOOKINGS LIST (High Contrast Accessible Cards) */}
      {/* -------------------------------------------------------------------- */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => {
          const isCompleted = booking.status === 'COMPLETED';
          const isInProgress = booking.status === 'IN_PROGRESS';

          return (
            <div
              key={booking.id}
              className="accessible-card p-4 sm:p-5 bg-white space-y-3.5"
            >
              {/* Header: ID, Category, Badge */}
              <div className="flex items-center justify-between border-b-2 border-black pb-2.5">
                <div>
                  <span className="font-mono text-xs font-black text-black bg-amber-200 px-2 py-0.5 rounded border border-black mr-2">
                    {booking.id}
                  </span>
                  <span className="text-base font-black text-black">
                    {booking.serviceCategory}
                  </span>
                </div>

                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-lg border border-black ${
                    isCompleted
                      ? 'bg-emerald-400 text-black'
                      : isInProgress
                      ? 'bg-amber-300 text-black'
                      : 'bg-sky-200 text-black'
                  }`}
                >
                  {isCompleted ? '✓ Done' : isInProgress ? '🛵 In Progress' : '⏳ Confirmed'}
                </span>
              </div>

              {/* Details & Location */}
              <div className="space-y-1.5 text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-black">Member:</span>
                  <span>{booking.workerName} ({booking.workerTrade})</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{booking.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-black flex-shrink-0" />
                  <span>{booking.scheduledDate} at {booking.scheduledTime}</span>
                </div>
              </div>

              {/* 90-5-5 Payment Summary */}
              <div className="p-3 bg-slate-50 border-2 border-black rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-black text-black text-sm">
                  <span>Total Amount:</span>
                  <span>₹{booking.totalAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>90% Member Payout:</span>
                  <span>₹{booking.workerPayout}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>10% Co-op & Welfare:</span>
                  <span>₹{booking.coopFee + booking.welfareFund}</span>
                </div>
              </div>

              {/* Footer Actions (>= 48px Touch Targets) */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <a
                  href={`tel:9820011221`}
                  className="min-h-[48px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-black text-black font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Hub</span>
                </a>

                {isInProgress && (
                  <button
                    type="button"
                    onClick={() => handleMarkComplete(booking.id)}
                    className="flex-1 min-h-[48px] px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 border-2 border-black text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Mark Job Completed</span>
                  </button>
                )}

                {isCompleted && (
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-500">
                    ✓ Escrow Settled
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
