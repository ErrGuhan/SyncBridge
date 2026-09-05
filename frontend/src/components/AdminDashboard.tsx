'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  HeartHandshake, 
  TrendingUp, 
  Check, 
  X, 
  Eye, 
  Search, 
  ShieldCheck, 
  Building2, 
  FileCheck, 
  Filter, 
  ArrowUpRight,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  Zap,
  Radio,
  Bell,
  BarChart3,
  MapPin,
  Flame,
  Send
} from 'lucide-react';
import { 
  MOCK_ADMIN_METRICS, 
  MOCK_VERIFICATION_QUEUE, 
  MOCK_DEMAND_FORECASTS,
  WorkerVerificationItem,
  DemandForecastItem
} from '@/data/mockData';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'VERIFICATION' | 'AI_FORECAST'>('VERIFICATION');
  const [verifications, setVerifications] = useState<WorkerVerificationItem[]>(MOCK_VERIFICATION_QUEUE);
  const [forecasts, setForecasts] = useState<DemandForecastItem[]>(MOCK_DEMAND_FORECASTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedDocWorker, setSelectedDocWorker] = useState<WorkerVerificationItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [alertDispatchedMap, setAlertDispatchedMap] = useState<Record<string, boolean>>({});

  const showToast = (text: string, type: 'success' | 'error' | 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id: string, workerName: string) => {
    setVerifications(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'VERIFIED' };
      }
      return item;
    }));
    showToast(`Approved ${workerName} as verified cooperative trade member!`, 'success');
  };

  const handleReject = (id: string, workerName: string) => {
    setVerifications(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'REJECTED' };
      }
      return item;
    }));
    showToast(`Rejected application for ${workerName}. Notification sent to cooperative admin.`, 'error');
  };

  const handleBroadcastAlert = (forecast: DemandForecastItem) => {
    const key = `${forecast.serviceCategory}__${forecast.areaCode}`;
    setAlertDispatchedMap(prev => ({ ...prev, [key]: true }));
    showToast(
      `Broadcast dispatched: Alerted ${forecast.currentActiveWorkers + forecast.workerDeficit} ${forecast.serviceCategory}s in ${forecast.areaName} (${forecast.areaCode}) for expected surge!`,
      'info'
    );
  };

  // Filter verification queue
  const filteredQueue = verifications.filter(item => {
    const matchesSearch = 
      item.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cooperative.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = verifications.filter(i => i.status === 'PENDING').length;
  const criticalSurgeCount = forecasts.filter(f => f.demandLevel === 'CRITICAL_SURGE').length;

  return (
    <div className="space-y-8 py-2 sm:py-6 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' 
            : toastMessage.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
              : 'bg-cyan-950/90 border-cyan-500/40 text-cyan-200'
        }`}>
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toastMessage.type === 'error' && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toastMessage.type === 'info' && <Radio className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />}
          <span className="text-xs sm:text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-cyan-300 border-cyan-500/30 mb-2">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Labour Cooperative Federation • Central Governance</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Cooperative Federation Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Audit skill verifications, monitor AI time-series demand surges, and steward worker mutual aid reserves.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Postgres & API Mesh: Active</span>
          </span>
        </div>
      </div>

      {/* Summary Metric Cards (Prompt 9 Grid Layout) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Total Workers */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-cyan-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Worker Members
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {MOCK_ADMIN_METRICS.totalWorkers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.4% this quarter</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{MOCK_ADMIN_METRICS.activeWorkers} active</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Pending Verifications */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900/60 to-amber-950/20 relative overflow-hidden group hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Pending Verifications
            </span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold text-amber-300 tracking-tight">
              {pendingCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-200/80 font-medium mt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Requires credential audit</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Welfare Fund Balance */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-emerald-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Welfare & Mutual Aid
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-300 tracking-tight">
              {MOCK_ADMIN_METRICS.welfareFundBalance}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-1">
              <span className="text-emerald-400 font-semibold">{MOCK_ADMIN_METRICS.welfareGrowth}</span>
              <span className="text-slate-400">from 5% booking split</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Total Patronage Distributed */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-indigo-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Worker Payout (80%)
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {MOCK_ADMIN_METRICS.totalPatronage}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <span className="text-indigo-300 font-medium">{MOCK_ADMIN_METRICS.completedBookings.toLocaleString()}</span>
              <span>completed bookings</span>
            </div>
          </div>
        </div>

      </section>

      {/* Main Section Tab Selector */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('VERIFICATION')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
            activeTab === 'VERIFICATION'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
              : 'glass-panel text-slate-300 hover:text-white hover:border-white/20'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Worker Verification Queue</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            activeTab === 'VERIFICATION' ? 'bg-slate-950 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {pendingCount} Pending
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('AI_FORECAST')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
            activeTab === 'AI_FORECAST'
              ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/25'
              : 'glass-panel text-slate-300 hover:text-white hover:border-white/20'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Demand Forecasting</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
            {criticalSurgeCount} Surges Detected
          </span>
        </button>
      </div>

      {/* TAB 1: Verification Queue Section (Prompt 9 Data Table) */}
      {activeTab === 'VERIFICATION' && (
        <section className="space-y-4 animate-in fade-in duration-200">
          
          {/* Table Filter & Search Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                <span>Worker Verification & Skill Profiling Queue</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review official government ID and trade certification before granting marketplace discovery status.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search worker or trade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="glass-input px-3 py-2 rounded-xl text-xs"
              >
                <option value="ALL" className="bg-slate-900">All Status</option>
                <option value="PENDING" className="bg-slate-900">Pending</option>
                <option value="VERIFIED" className="bg-slate-900">Verified</option>
                <option value="REJECTED" className="bg-slate-900">Rejected</option>
              </select>
            </div>
          </div>

          {/* Desktop Data Table (hidden on mobile, visible on md+) */}
          <div className="hidden md:block glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-900/60 text-xs font-semibold text-slate-300">
                    <th className="py-3.5 px-4">Worker Member</th>
                    <th className="py-3.5 px-4">Trade & Experience</th>
                    <th className="py-3.5 px-4">Cooperative Society</th>
                    <th className="py-3.5 px-4">Submitted Credentials</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                  {filteredQueue.map((worker) => (
                    <tr 
                      key={worker.id}
                      className="hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Worker Info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-sm">
                          {worker.workerName}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {worker.phone} • {worker.email}
                        </div>
                      </td>

                      {/* Trade & Exp */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-cyan-300">
                          {worker.trade}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {worker.experienceYears} Years Field Exp • ₹{worker.hourlyRate}/hr
                        </div>
                      </td>

                      {/* Cooperative */}
                      <td className="py-4 px-4 max-w-xs">
                        <span className="text-white truncate block">
                          {worker.cooperative}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Applied: {worker.submittedAt}
                        </span>
                      </td>

                      {/* Credentials */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedDocWorker(worker)}
                            className="inline-flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                          >
                            <Award className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="underline truncate max-w-[180px]">{worker.certificationTitle}</span>
                          </button>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Aadhaar: {worker.aadhaarNumber}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {worker.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3" />
                            <span>PENDING</span>
                          </span>
                        )}
                        {worker.status === 'VERIFIED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            <span>VERIFIED</span>
                          </span>
                        )}
                        {worker.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <X className="w-3 h-3" />
                            <span>REJECTED</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        {worker.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(worker.id, worker.workerName)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all shadow-md shadow-emerald-500/20"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(worker.id, worker.workerName)}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center gap-1 transition-all"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Action Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Responsive Card Stack (Shown on < md screens) */}
          <div className="md:hidden space-y-4">
            {filteredQueue.map((worker) => (
              <div
                key={worker.id}
                className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {worker.workerName}
                    </h3>
                    <p className="text-xs font-semibold text-cyan-300 mt-0.5">
                      {worker.trade} • {worker.experienceYears}y exp
                    </p>
                  </div>

                  <div>
                    {worker.status === 'PENDING' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        PENDING
                      </span>
                    )}
                    {worker.status === 'VERIFIED' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        VERIFIED
                      </span>
                    )}
                    {worker.status === 'REJECTED' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        REJECTED
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cooperative:</span>
                    <span className="text-white font-medium text-right truncate max-w-[200px]">{worker.cooperative}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hourly Rate:</span>
                    <span className="text-emerald-300 font-semibold">₹{worker.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Aadhaar:</span>
                    <span className="font-mono text-slate-300">{worker.aadhaarNumber}</span>
                  </div>
                  <div className="pt-1 flex justify-between items-center">
                    <span className="text-slate-400">Cert:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDocWorker(worker)}
                      className="text-cyan-400 underline font-medium truncate max-w-[200px]"
                    >
                      {worker.certificationTitle}
                    </button>
                  </div>
                </div>

                {worker.status === 'PENDING' ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleApprove(worker.id, worker.workerName)}
                      className="py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(worker.id, worker.workerName)}
                      className="py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-1 text-xs text-slate-500 italic">
                    Status recorded as {worker.status}
                  </div>
                )}
              </div>
            ))}
          </div>

        </section>
      )}

      {/* TAB 2: AI Demand Forecasting & Surge Alerts Section (Prompt 10) */}
      {activeTab === 'AI_FORECAST' && (
        <section className="space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 rounded-2xl border border-cyan-500/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  Model: WEMA + Momentum Time-Series
                </span>
                <span className="text-xs text-slate-400">• Forecast Window: Next 7 Days</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
                <Flame className="w-6 h-6 text-amber-400" />
                <span>AI Trade Demand Hotspots & Surge Prediction</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Proactively identify regional service shortages across postal codes. Alert cooperative workers to high-earning dispatch zones ahead of weekend surges.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Projected Jobs</span>
                <span className="text-lg font-black text-cyan-300">
                  {forecasts.reduce((acc, f) => acc + f.predictedDemandNextWeek, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Hotspot Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {forecasts.map((forecast) => {
              const alertKey = `${forecast.serviceCategory}__${forecast.areaCode}`;
              const isDispatched = alertDispatchedMap[alertKey];

              return (
                <div
                  key={alertKey}
                  className={`glass-panel rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
                    forecast.demandLevel === 'CRITICAL_SURGE'
                      ? 'border-rose-500/40 shadow-[0_12px_36px_rgba(244,63,94,0.15)]'
                      : forecast.demandLevel === 'HIGH_DEMAND'
                        ? 'border-amber-500/40 shadow-[0_12px_36px_rgba(245,158,11,0.15)]'
                        : 'border-white/10'
                  }`}
                >
                  {/* Top Bar: Locality, Trade, Demand Badge */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{forecast.areaName} ({forecast.areaCode})</span>
                          <span>•</span>
                          <span className="text-slate-500">{forecast.zone}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-1">
                          {forecast.serviceCategory}
                        </h3>
                      </div>

                      <div>
                        {forecast.demandLevel === 'CRITICAL_SURGE' && (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 animate-pulse shadow-sm">
                            <Flame className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                            <span>CRITICAL SURGE</span>
                          </span>
                        )}
                        {forecast.demandLevel === 'HIGH_DEMAND' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>HIGH DEMAND</span>
                          </span>
                        )}
                        {forecast.demandLevel === 'MODERATE' && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            MODERATE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Statistical Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-900/70 p-3 rounded-2xl border border-white/5 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Next Week Jobs</span>
                        <span className="text-base font-extrabold text-white">
                          {forecast.predictedDemandNextWeek}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Growth Rate</span>
                        <span className={`text-base font-extrabold ${forecast.growthRatePct >= 20 ? 'text-emerald-400' : 'text-slate-300'}`}>
                          +{forecast.growthRatePct}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Model Confidence</span>
                        <span className="text-base font-extrabold text-cyan-300">
                          {(forecast.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {/* Supply vs Deficit Analysis */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Worker Supply Gap:</span>
                        {forecast.workerDeficit > 0 ? (
                          <span className="px-2 py-0.5 rounded-md font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Deficit: {forecast.workerDeficit} Workers Needed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md font-semibold bg-emerald-500/20 text-emerald-300">
                            Supply Balanced
                          </span>
                        )}
                      </div>

                      {/* Progress Bar of Capacity */}
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            forecast.workerDeficit > 0 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-emerald-400'
                          }`}
                          style={{ 
                            width: `${Math.min((forecast.currentActiveWorkers / forecast.recommendedWorkerSupply) * 100, 100)}%` 
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Current Active: {forecast.currentActiveWorkers}</span>
                        <span>Recommended: {forecast.recommendedWorkerSupply}</span>
                      </div>
                    </div>

                    {/* Peak Days & Narrative Alert */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Peak Anticipated Window: <strong className="text-white">{forecast.peakDays.join(' & ')}</strong></span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                        {forecast.recommendedWorkerAlert}
                      </p>
                    </div>
                  </div>

                  {/* Dispatch Broadcast Button */}
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      disabled={isDispatched}
                      onClick={() => handleBroadcastAlert(forecast)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                        isDispatched
                          ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                          : forecast.demandLevel === 'CRITICAL_SURGE'
                            ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 hover:brightness-110 shadow-lg shadow-rose-500/20 active:scale-98'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-98'
                      }`}
                    >
                      {isDispatched ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Surge Alert Dispatched to Cooperative Workers</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Broadcast Surge Alert to {forecast.serviceCategory}s in {forecast.areaName}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* Document Inspector Modal */}
      {selectedDocWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 border border-white/15 shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setSelectedDocWorker(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Official Credential Verification
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {selectedDocWorker.workerName} — {selectedDocWorker.trade}
              </h3>
              <p className="text-xs text-slate-400">
                Cooperative: {selectedDocWorker.cooperative}
              </p>
            </div>

            <div className="space-y-3">
              {/* Aadhaar preview */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Government Aadhaar Card (Masked)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">VERIFIED FORMAT</span>
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  UID: {selectedDocWorker.aadhaarNumber}
                </p>
                <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-center text-xs text-slate-500">
                  [Official Encrypted Aadhaar PDF Document Attached]
                </div>
              </div>

              {/* Trade Certificate preview */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-400" />
                    <span>Technical Trade License</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">VALID ACCREDITATION</span>
                </div>
                <p className="text-xs text-white font-medium">
                  {selectedDocWorker.certificationTitle}
                </p>
                <div className="h-24 bg-slate-900/60 rounded-xl border border-white/5 p-3 flex flex-col justify-between text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Issued By: Directorate of Skill Development</span>
                    <span className="text-emerald-300">Grade A</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Registration No: LIC-BLR-2021-9941 • Status: Clean Record
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleApprove(selectedDocWorker.id, selectedDocWorker.workerName);
                  setSelectedDocWorker(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-emerald-400 transition-colors"
              >
                Approve Credentials
              </button>
              <button
                type="button"
                onClick={() => setSelectedDocWorker(null)}
                className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 text-xs sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
