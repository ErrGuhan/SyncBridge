'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  CreditCard, 
  Wallet, 
  Layers,
  ArrowRight,
  Phone
} from 'lucide-react';
import { MOCK_BOOKINGS, BookingItem } from '@/data/mockData';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(MOCK_BOOKINGS);
  const [filter, setFilter] = useState<string>('ALL');

  const filteredBookings = bookings.filter(b => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  const handleMarkComplete = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'COMPLETED' };
      }
      return b;
    }));
  };

  const getStatusBadge = (status: BookingItem['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>CONFIRMED</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>IN PROGRESS</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>COMPLETED</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-white/10">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 py-4 sm:py-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-cyan-300 border-cyan-500/30 mb-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Client Escrow & Service Orders</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            My Service Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track active service dispatches, inspect worker coordinates, and verify 80/15/5 cooperative escrow payout splits.
          </p>
        </div>

        <Link
          href="/services"
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors self-start sm:self-auto flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
        >
          <span>Book New Trade Service</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              filter === tab
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'glass-panel text-slate-300 hover:text-white hover:border-white/20'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 hover:border-cyan-400/30 transition-all"
          >
            {/* Header: ID, Status, Trade */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                    {booking.id}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {booking.serviceCategory} Service
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Assigned Member: <strong className="text-white">{booking.workerName}</strong> ({booking.workerTrade})</span>
                </p>
              </div>

              <div>
                {getStatusBadge(booking.status)}
              </div>
            </div>

            {/* Middle: Details & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Scheduled: <strong className="text-white">{booking.scheduledDate} at {booking.scheduledTime}</strong></span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Location: <span className="text-white">{booking.location}</span></span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Affiliated Coop: <span className="text-teal-200">{booking.cooperativeName}</span></span>
                </div>
              </div>

              {/* Escrow Payment Tri-Split (80/15/5) */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>Total Service Escrow:</span>
                  </span>
                  <span className="text-base font-extrabold text-white">
                    ₹{booking.totalAmount}
                  </span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-emerald-300">
                    <span>• 80% Direct Worker Payout:</span>
                    <span className="font-semibold">₹{booking.workerPayout}</span>
                  </div>
                  <div className="flex justify-between text-cyan-300">
                    <span>• 15% Cooperative Operating Fund:</span>
                    <span className="font-semibold">₹{booking.coopFee}</span>
                  </div>
                  <div className="flex justify-between text-indigo-300">
                    <span>• 5% Worker Mutual Aid & Insurance:</span>
                    <span className="font-semibold">₹{booking.welfareFund}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Contact Dispatcher: 1800-COOP-GIG</span>
              </div>

              {booking.status === 'IN_PROGRESS' && (
                <button
                  type="button"
                  onClick={() => handleMarkComplete(booking.id)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Release Escrow & Mark Completed</span>
                </button>
              )}

              {booking.status === 'CONFIRMED' && (
                <span className="text-xs text-cyan-300 bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-500/20">
                  Worker dispatched • Expected arrival on schedule
                </span>
              )}

              {booking.status === 'COMPLETED' && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Escrow Distributed via 80/15/5 Tri-Split Protocol</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
