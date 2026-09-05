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
  Plus,
  Clock
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
    <div className="space-y-8">
      
      {/* -------------------------------------------------------------------- */}
      {/* 1. PAGE HEADER */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Service Orders
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track active dispatches, inspect worker coordinates, and verify 90/5/5 cooperative settlement.
          </p>
        </div>

        <Link
          href="/services"
          className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Service</span>
        </Link>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. LIVE DISPATCH TRACKER */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Order Status
          </span>
          <span className="text-xs text-slate-500">
            Tap Searching / En Route / Completed to inspect visual states
          </span>
        </div>

        <JobStatusTracker
          initialState="YELLOW"
          bookingNumber="BKG-2026-8819"
          workerName="Ramesh Chavan (NCCT Certified)"
          workerPhone="+91 98201 11221"
          workerTrade="Master Electrician"
          workerEtaMinutes={12}
          totalAmount={1200}
        />
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 3. ORDER HISTORY & TABS */}
      {/* -------------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filter === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <span className="text-xs font-medium text-slate-500">
            {filteredBookings.length} orders
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookings.map((booking) => {
            const isCompleted = booking.status === 'COMPLETED';
            const isInProgress = booking.status === 'IN_PROGRESS';

            return (
              <div
                key={booking.id}
                className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-3.5 flex flex-col justify-between"
              >
                {/* Header: ID, Category, Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {booking.id}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      {booking.serviceCategory} Service
                    </h4>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isInProgress
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {isCompleted ? '✓ Completed' : isInProgress ? 'En Route' : 'Confirmed'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900">Member-Worker:</span>
                    <span>{booking.workerName} ({booking.workerTrade})</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{booking.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{booking.scheduledDate} at {booking.scheduledTime}</span>
                  </div>
                </div>

                {/* Split Breakdown */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Total Amount:</span>
                    <span>₹{booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>90% Worker Member Payout:</span>
                    <span>₹{booking.workerPayout}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>10% Cooperative & Welfare Pool:</span>
                    <span>₹{booking.coopFee + booking.welfareFund}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <a
                    href="tel:9820011221"
                    className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Hub</span>
                  </a>

                  {isInProgress && (
                    <button
                      type="button"
                      onClick={() => handleMarkComplete(booking.id)}
                      className="h-9 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </button>
                  )}

                  {isCompleted && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      ✓ Escrow Released
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
