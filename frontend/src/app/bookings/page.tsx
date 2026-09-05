'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCoopData } from '@/context/CoopDataContext';
import JobStatusTracker from '@/components/JobStatusTracker';
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  ArrowRight,
  ShieldCheck, 
  Plus, 
  FileText, 
  AlertTriangle,
  Download,
  Star,
  Receipt
} from 'lucide-react';
import { BookingItem } from '@/data/mockData';

export default function BookingsPage() {
  const { t } = useLanguage();
  const { orders, completeOrder, fileDispute } = useCoopData();
  const [filter, setFilter] = useState<string>('ALL');

  // Receipt Modal state
  const [viewingReceipt, setViewingReceipt] = useState<BookingItem | null>(null);

  // Dispute Modal state
  const [disputeBooking, setDisputeBooking] = useState<BookingItem | null>(null);
  const [disputeReason, setDisputeReason] = useState('Quality of work did not match cooperative standard');
  const [disputeStatement, setDisputeStatement] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const filteredBookings = orders.filter((b) => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  const activeOrder = orders.find(o => o.status === 'CONFIRMED' || o.status === 'IN_PROGRESS') || orders[0];

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeBooking) return;
    fileDispute(disputeBooking.id, disputeReason, disputeStatement || 'Customer requested restorative rework review.');
    setDisputeSubmitted(true);
    setTimeout(() => {
      setDisputeBooking(null);
      setDisputeSubmitted(false);
      setDisputeStatement('');
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* -------------------------------------------------------------------- */}
      {/* 1. PAGE HEADER */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Service Orders
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track active dispatches, inspect worker coordinates, and verify 90/5/5 cooperative settlement receipts.
          </p>
        </div>

        <Link
          href="/services"
          className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Service</span>
        </Link>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. LIVE DISPATCH TRACKER */}
      {/* -------------------------------------------------------------------- */}
      {activeOrder && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Order Live Tracking
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Ref #{activeOrder.id}
            </span>
          </div>

          <JobStatusTracker
            initialState={activeOrder.status === 'COMPLETED' ? 'GREEN' : activeOrder.status === 'IN_PROGRESS' ? 'YELLOW' : 'RED'}
            bookingNumber={activeOrder.id}
            workerName={`${activeOrder.workerName} (${activeOrder.workerTrade})`}
            workerPhone="+91 98201 11221"
            workerTrade={activeOrder.workerTrade}
            workerEtaMinutes={activeOrder.status === 'IN_PROGRESS' ? 8 : 15}
            totalAmount={activeOrder.totalAmount}
          />
        </section>
      )}

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
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all space-y-3.5 flex flex-col justify-between"
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
                    <span className="font-semibold text-slate-900">Artisan:</span>
                    <span>{booking.workerName} ({booking.workerTrade})</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{booking.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{booking.scheduledDate} • {booking.scheduledTime}</span>
                  </div>
                </div>

                {/* Split Breakdown */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Total Bill:</span>
                    <span>₹{booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>90% Direct Artisan Take-Home:</span>
                    <span>₹{booking.workerPayout}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>5% Society Reserve + 5% Welfare Fund:</span>
                    <span>₹{booking.coopFee + booking.welfareFund}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:9820011221"
                      className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Artisan</span>
                    </a>

                    {isCompleted && (
                      <button
                        type="button"
                        onClick={() => setViewingReceipt(booking)}
                        className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5 text-slate-600" />
                        <span>Invoice</span>
                      </button>
                    )}
                  </div>

                  {isInProgress && (
                    <button
                      type="button"
                      onClick={() => completeOrder(booking.id)}
                      className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Completion</span>
                    </button>
                  )}

                  {isCompleted && (
                    <button
                      type="button"
                      onClick={() => setDisputeBooking(booking)}
                      className="text-xs text-slate-500 hover:text-amber-700 font-medium transition-colors"
                    >
                      Dispute / Arbitration
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4. ITEMISED COOPERATIVE INVOICE MODAL */}
      {/* -------------------------------------------------------------------- */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Official Cooperative Receipt</h3>
                  <span className="text-[10px] font-mono text-slate-400">Order #{viewingReceipt.id}</span>
                </div>
              </div>

              <button
                onClick={() => setViewingReceipt(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 font-medium"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between font-semibold text-slate-900">
                <span>Customer:</span>
                <span>{viewingReceipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Artisan:</span>
                <span>{viewingReceipt.workerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Cooperative Chapter:</span>
                <span>{viewingReceipt.cooperativeName}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Date:</span>
                <span>{viewingReceipt.scheduledDate}</span>
              </div>
            </div>

            {/* Financial Transparency Table */}
            <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
              <div className="flex justify-between font-bold text-sm text-slate-900 pb-1 border-b border-slate-100">
                <span>Gross Service Charge</span>
                <span>₹{viewingReceipt.totalAmount}.00</span>
              </div>

              <div className="flex justify-between text-emerald-800 font-semibold pt-1">
                <span>• 90% Direct Artisan Take-Home (UPI Settled)</span>
                <span>₹{viewingReceipt.workerPayout}.00</span>
              </div>

              <div className="flex justify-between text-blue-700">
                <span>• 5% Primary Society Operational Reserve</span>
                <span>₹{viewingReceipt.coopFee}.00</span>
              </div>

              <div className="flex justify-between text-amber-700">
                <span>• 5% Mutual Aid & Health Hospitalization Pool</span>
                <span>₹{viewingReceipt.welfareFund}.00</span>
              </div>

              <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                <span>• 1% Central Guarantee Escrow Protection</span>
                <span>₹{viewingReceipt.guaranteeFund}.00</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 text-center font-medium">
              ✓ Transaction Verified on Cooperative Distributed Ledger
            </div>

            <button
              type="button"
              onClick={() => setViewingReceipt(null)}
              className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 5. RESTORATIVE ARBITRATION DISPUTE CLAIM MODAL */}
      {/* -------------------------------------------------------------------- */}
      {disputeBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Restorative Arbitration Claim</h3>
              </div>
              <button
                onClick={() => setDisputeBooking(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 font-medium"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              SyncBridge uses a 3-member restorative peer arbitration council (1 chapter secretary, 1 peer artisan, 1 consumer advocate) to resolve disputes fairly without corporate penalties.
            </p>

            {disputeSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1 text-emerald-800 text-xs font-semibold">
                ✓ Claim Registered! Scheduled for hearing by the Regional Restorative Council.
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dispute Category</label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none text-slate-900 bg-white font-medium"
                  >
                    <option>Quality of work did not match cooperative standard</option>
                    <option>Artisan arrived significantly later than scheduled</option>
                    <option>Additional unscheduled material charges requested</option>
                    <option>Incomplete service execution</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Your Statement</label>
                  <textarea
                    rows={3}
                    required
                    value={disputeStatement}
                    onChange={(e) => setDisputeStatement(e.target.value)}
                    placeholder="Provide specific details of what was unsatisfactory..."
                    className="w-full p-3 border border-slate-300 rounded-xl outline-none text-slate-900 bg-white"
                  />
                </div>

                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                  🛡️ 100% Cooperative Guarantee: Your payment of ₹{disputeBooking.totalAmount} is protected by the mutual guarantee escrow.
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDisputeBooking(null)}
                    className="flex-1 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
                  >
                    Submit to Council
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
