'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  HeartHandshake, 
  TrendingUp, 
  Check, 
  X, 
  Search, 
  Building2, 
  FileCheck, 
  ArrowUpRight,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  Zap,
  Radio,
  MapPin,
  Flame,
  Send,
  Scale,
  Gavel,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { 
  MOCK_ADMIN_METRICS, 
  MOCK_VERIFICATION_QUEUE, 
  MOCK_DEMAND_FORECASTS,
  MOCK_PEER_ARBITRATION_CASES,
  MOCK_WELFARE_FUND_SNAPSHOT,
  WorkerVerificationItem,
  DemandForecastItem,
  PeerArbitrationCase
} from '@/data/mockData';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'VERIFICATION' | 'PEER_ARBITRATION' | 'AI_FORECAST' | 'WELFARE_FUND'>('VERIFICATION');
  const [verifications, setVerifications] = useState<WorkerVerificationItem[]>(MOCK_VERIFICATION_QUEUE);
  const [forecasts] = useState<DemandForecastItem[]>(MOCK_DEMAND_FORECASTS);
  const [arbitrationCases, setArbitrationCases] = useState<PeerArbitrationCase[]>(MOCK_PEER_ARBITRATION_CASES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedDocWorker, setSelectedDocWorker] = useState<WorkerVerificationItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [alertDispatchedMap, setAlertDispatchedMap] = useState<Record<string, boolean>>({});

  const showToast = (text: string, type: 'success' | 'error' | 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRestoreRating = (caseId: string, workerName: string) => {
    setArbitrationCases(prev => prev.map(c => c.id === caseId ? { ...c, hearingStatus: 'RESTORED' } : c));
    showToast(`Peer Council restored standing for ${workerName}. Zero algorithmic deactivation applied.`, 'success');
  };

  const handleGuaranteeRemedy = (caseId: string, amount: number, customerName: string) => {
    setArbitrationCases(prev => prev.map(c => c.id === caseId ? { ...c, hearingStatus: 'MEDIATED_REFUND' } : c));
    showToast(`Disbursed ₹${amount} from 1% Cooperative Guarantee Fund to remediate ${customerName}.`, 'info');
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
    <div className="space-y-8 py-4 sm:py-6 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-xl border shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : toastMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
          {toastMessage.type === 'error' && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {toastMessage.type === 'info' && <Radio className="w-5 h-5 text-blue-600 shrink-0 animate-pulse" />}
          <span className="text-xs sm:text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 border border-blue-200 mb-2">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>National Cooperative Federation • Democratic Governance Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Cooperative Federation Central Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Credential audits, Peer Restorative Justice (anti-algorithmic deactivation), 
            AI time-series predictive demand, and ₹4.82 Cr worker welfare & mutual aid reserves.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-2 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Database & Services: Active</span>
          </span>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Total Workers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Worker Members
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {MOCK_ADMIN_METRICS.totalWorkers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.4% this quarter</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{MOCK_ADMIN_METRICS.activeWorkers} active</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Pending Verifications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Pending Verifications
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 tracking-tight">
              {pendingCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium mt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Requires credential audit</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Welfare Fund Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Welfare & Mutual Aid (5%)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-tight">
              {MOCK_ADMIN_METRICS.welfareFundBalance}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
              <span className="font-semibold">{MOCK_ADMIN_METRICS.welfareGrowth}</span>
              <span className="text-slate-500">from 5% booking split</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Total Worker Payout */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Worker Direct Payout (90%)
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {MOCK_ADMIN_METRICS.totalPatronage}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span className="text-indigo-600 font-semibold">{MOCK_ADMIN_METRICS.completedBookings.toLocaleString()}</span>
              <span>completed bookings</span>
            </div>
          </div>
        </div>

      </section>

      {/* Main Section Tab Selector */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('VERIFICATION')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'VERIFICATION'
              ? 'bg-blue-600 text-white shadow-sm font-semibold'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Worker Verification Queue</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            activeTab === 'VERIFICATION' ? 'bg-blue-700 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {pendingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PEER_ARBITRATION')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'PEER_ARBITRATION'
              ? 'bg-blue-600 text-white shadow-sm font-semibold'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Peer Arbitration & Justice</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            activeTab === 'PEER_ARBITRATION' ? 'bg-blue-700 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {arbitrationCases.filter(c => c.hearingStatus === 'PENDING_HEARING').length} Hearings
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('AI_FORECAST')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'AI_FORECAST'
              ? 'bg-blue-600 text-white shadow-sm font-semibold'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Demand Forecasting</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
            {criticalSurgeCount} Surges
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('WELFARE_FUND')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'WELFARE_FUND'
              ? 'bg-blue-600 text-white shadow-sm font-semibold'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Welfare & Mutual Aid</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            ₹4.82 Cr
          </span>
        </button>
      </div>

      {/* TAB 1: Verification Queue Section */}
      {activeTab === 'VERIFICATION' && (
        <section className="space-y-4 animate-in fade-in duration-200">
          
          {/* Table Filter & Search Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Worker Verification & Skill Profiling Queue</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
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
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Desktop Data Table (hidden on mobile, visible on md+) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-3.5 px-4">Worker Member</th>
                    <th className="py-3.5 px-4">Trade & Experience</th>
                    <th className="py-3.5 px-4">Cooperative Society</th>
                    <th className="py-3.5 px-4">Submitted Credentials</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredQueue.map((worker) => (
                    <tr 
                      key={worker.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Worker Info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {worker.workerName}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {worker.phone} • {worker.email}
                        </div>
                      </td>

                      {/* Trade & Exp */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-blue-700">
                          {worker.trade}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {worker.experienceYears} Years Field Exp • ₹{worker.hourlyRate}/hr
                        </div>
                      </td>

                      {/* Cooperative */}
                      <td className="py-4 px-4 max-w-xs">
                        <span className="text-slate-900 font-medium truncate block">
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
                            className="inline-flex items-center gap-1.5 text-[11px] text-blue-600 hover:text-blue-700 font-semibold text-left"
                          >
                            <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="underline truncate max-w-[180px]">{worker.certificationTitle}</span>
                          </button>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Aadhaar: {worker.aadhaarNumber}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {worker.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>PENDING</span>
                          </span>
                        )}
                        {worker.status === 'VERIFIED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>VERIFIED</span>
                          </span>
                        )}
                        {worker.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
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
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 transition-all shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(worker.id, worker.workerName)}
                              className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold text-xs flex items-center gap-1 transition-all"
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
                className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {worker.workerName}
                    </h3>
                    <p className="text-xs font-semibold text-blue-700 mt-0.5">
                      {worker.trade} • {worker.experienceYears}y exp
                    </p>
                  </div>

                  <div>
                    {worker.status === 'PENDING' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        PENDING
                      </span>
                    )}
                    {worker.status === 'VERIFIED' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        VERIFIED
                      </span>
                    )}
                    {worker.status === 'REJECTED' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        REJECTED
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cooperative:</span>
                    <span className="text-slate-900 font-medium text-right truncate max-w-[200px]">{worker.cooperative}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hourly Rate:</span>
                    <span className="text-emerald-700 font-semibold">₹{worker.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Aadhaar:</span>
                    <span className="font-mono text-slate-700">{worker.aadhaarNumber}</span>
                  </div>
                  <div className="pt-1 flex justify-between items-center">
                    <span className="text-slate-500">Cert:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDocWorker(worker)}
                      className="text-blue-600 underline font-semibold truncate max-w-[200px]"
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
                      className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(worker.id, worker.workerName)}
                      className="py-2.5 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs flex items-center justify-center gap-1.5"
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

      {/* TAB 2: AI Demand Forecasting & Surge Alerts Section */}
      {activeTab === 'AI_FORECAST' && (
        <section className="space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  Model: WEMA + Momentum Time-Series
                </span>
                <span className="text-xs text-slate-500">• Forecast Window: Next 7 Days</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Flame className="w-6 h-6 text-amber-500" />
                <span>AI Trade Demand Hotspots & Surge Prediction</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                Proactively identify regional service shortages across postal codes. Alert cooperative workers to high-earning dispatch zones ahead of weekend surges.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Total Projected Jobs</span>
                <span className="text-lg font-bold text-blue-600">
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
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Bar: Locality, Trade, Demand Badge */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>{forecast.areaName} ({forecast.areaCode})</span>
                          <span>•</span>
                          <span className="text-slate-400">{forecast.zone}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mt-1">
                          {forecast.serviceCategory}
                        </h3>
                      </div>

                      <div>
                        {forecast.demandLevel === 'CRITICAL_SURGE' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 shadow-sm">
                            <Flame className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                            <span>CRITICAL SURGE</span>
                          </span>
                        )}
                        {forecast.demandLevel === 'HIGH_DEMAND' && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                            <span>HIGH DEMAND</span>
                          </span>
                        )}
                        {forecast.demandLevel === 'MODERATE' && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            MODERATE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Statistical Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Next Week Jobs</span>
                        <span className="text-base font-bold text-slate-900">
                          {forecast.predictedDemandNextWeek}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Growth Rate</span>
                        <span className={`text-base font-bold ${forecast.growthRatePct >= 20 ? 'text-emerald-600' : 'text-slate-700'}`}>
                          +{forecast.growthRatePct}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Model Confidence</span>
                        <span className="text-base font-bold text-blue-600">
                          {(forecast.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {/* Supply vs Deficit Analysis */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Worker Supply Gap:</span>
                        {forecast.workerDeficit > 0 ? (
                          <span className="px-2 py-0.5 rounded-md font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Deficit: {forecast.workerDeficit} Workers Needed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Supply Balanced
                          </span>
                        )}
                      </div>

                      {/* Progress Bar of Capacity */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            forecast.workerDeficit > 0 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ 
                            width: `${Math.min((forecast.currentActiveWorkers / forecast.recommendedWorkerSupply) * 100, 100)}%` 
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Current Active: {forecast.currentActiveWorkers}</span>
                        <span>Recommended: {forecast.recommendedWorkerSupply}</span>
                      </div>
                    </div>

                    {/* Peak Days & Narrative Alert */}
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Peak Anticipated Window: <strong className="text-slate-900">{forecast.peakDays.join(' & ')}</strong></span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        {forecast.recommendedWorkerAlert}
                      </p>
                    </div>
                  </div>

                  {/* Dispatch Broadcast Button */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isDispatched}
                      onClick={() => handleBroadcastAlert(forecast)}
                      className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                        isDispatched
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      }`}
                    >
                      {isDispatched ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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

      {/* TAB 3: Peer Arbitration & Restorative Justice Section */}
      {activeTab === 'PEER_ARBITRATION' && (
        <section className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <span>Peer Arbitration & Restorative Justice Council</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Democratically mediated dispute hearings — replaces commercial platform algorithmic deactivations with fair peer review and 1% Guarantee Fund remediation.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Zero Arbitrary Account Bans Active
            </span>
          </div>

          {/* Restorative Justice Policy Explainer */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <span>Cooperative Dignity Protocol • Restorative Justice Council</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              When a customer files a rating under 4.0 or logs a damage claim, commercial platforms automatically blacklist or shadow-ban the gig worker. 
              Under our Cooperative framework, the case is routed to a <strong>3-Member Peer Council</strong> (2 fellow trade artisans + 1 legal ombudsman). 
              Damages are resolved through the <strong>1% Cooperative Guarantee Fund</strong>, preserving the worker’s livelihood and dignity.
            </p>
          </div>

          {/* Arbitration Cases Grid */}
          <div className="grid grid-cols-1 gap-5">
            {arbitrationCases.map((c) => {
              const isPending = c.hearingStatus === 'PENDING_HEARING';
              const isRestored = c.hearingStatus === 'RESTORED';
              const isMediated = c.hearingStatus === 'MEDIATED_REFUND';

              return (
                <div 
                  key={c.id} 
                  className={`bg-white p-5 rounded-2xl border transition-all ${
                    isPending 
                      ? 'border-amber-300 shadow-md' 
                      : 'border-slate-200/80 shadow-sm opacity-95'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Gavel className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{c.workerName}</h3>
                          <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-semibold">
                            {c.trade}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            [{c.ncdCode}]
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {c.cooperativeName} • Booking: <span className="text-slate-900 font-mono font-medium">{c.bookingId}</span> • Reported: {c.reportedAt}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isPending && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          HEARING PENDING
                        </span>
                      )}
                      {isRestored && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          RESTORED BY COUNCIL ✓
                        </span>
                      )}
                      {isMediated && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          GUARANTEE REMEDY DISBURSED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
                    {/* Customer Claim */}
                    <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1.5">
                      <div className="flex items-center justify-between text-rose-800 font-semibold">
                        <span>Customer Claim ({c.customerName})</span>
                        <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[11px] font-bold">★ {c.customerRating}.0 Rating</span>
                      </div>
                      <p className="text-slate-700 italic">"{c.customerStatement}"</p>
                      <p className="text-[11px] text-slate-500 pt-1">
                        <strong>Dispute Note:</strong> {c.disputeReason}
                      </p>
                    </div>

                    {/* Worker Defense Statement */}
                    <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                      <div className="flex items-center justify-between text-blue-800 font-semibold">
                        <span>Worker Member Statement ({c.workerName})</span>
                        <span className="text-emerald-700 text-[11px] font-semibold">Verified Member ✓</span>
                      </div>
                      <p className="text-slate-700 italic">"{c.workerDefenseStatement}"</p>
                      <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-blue-600" />
                        <span><strong>Arbitration Council:</strong> {c.arbitrationCouncil.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Restorative Outcome Banner */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 flex items-start gap-2">
                    <Scale className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Council Recommendation / Remedy:</span>
                      <p className="mt-0.5 text-slate-600 text-[11px] leading-relaxed">{c.restorativeRemedy}</p>
                    </div>
                  </div>

                  {/* Actions for Pending Case */}
                  {isPending && (
                    <div className="flex flex-wrap items-center justify-end gap-2.5 mt-4 pt-3 border-t border-slate-100">
                      {c.guaranteePayoutAmount && c.guaranteePayoutAmount > 0 && (
                        <button
                          type="button"
                          onClick={() => handleGuaranteeRemedy(c.id, c.guaranteePayoutAmount!, c.customerName)}
                          className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-medium text-xs transition-all"
                        >
                          Disburse 1% Guarantee Fund (₹{c.guaranteePayoutAmount})
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRestoreRating(c.id, c.workerName)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
                      >
                        Dismiss Penalty & Restore Rating
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 4: Worker Welfare & Mutual Aid Section */}
      {activeTab === 'WELFARE_FUND' && (
        <section className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <span>Worker Social Security & Mutual Aid Pool (5% Allocation)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every booking deposits 5% into the collective cooperative mutual fund, providing non-venture social security.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Total Corpus: {MOCK_WELFARE_FUND_SNAPSHOT.totalCorpus}
            </span>
          </div>

          {/* Welfare Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Medical Claims Settled</span>
              <p className="text-2xl font-bold text-slate-900">{MOCK_WELFARE_FUND_SNAPSHOT.medicalClaimsSettled}</p>
              <span className="text-xs text-emerald-600 font-medium">{MOCK_WELFARE_FUND_SNAPSHOT.totalMedicalPaid} disbursed</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Micro-Pension Accounts</span>
              <p className="text-2xl font-bold text-blue-600">{MOCK_WELFARE_FUND_SNAPSHOT.microPensionAccounts.toLocaleString()}</p>
              <span className="text-xs text-slate-500">Cooperative matching corpus</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Accident & Disability Cover</span>
              <p className="text-2xl font-bold text-slate-900">{MOCK_WELFARE_FUND_SNAPSHOT.accidentInsuranceActive.toLocaleString()}</p>
              <span className="text-xs text-blue-600 font-medium">₹10 Lakhs active cover</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">1% Guarantee Fund Reserve</span>
              <p className="text-2xl font-bold text-amber-600">{MOCK_WELFARE_FUND_SNAPSHOT.guaranteeFundReserve}</p>
              <span className="text-xs text-slate-500">Instant recourse pool</span>
            </div>
          </div>

          {/* Social Security Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">₹5 Lakhs Family Health Shield</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cashless hospitalization across 800+ empaneled government and cooperative hospitals for the worker, spouse, and up to 2 children.
              </p>
              <div className="text-[11px] text-emerald-700 font-medium pt-1">
                ✓ 98.4% Democratic claim approval rate
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Retirement Micro-Pension</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cooperative match: for every ₹100 contributed from gig booking dividends, the federation matches ₹50 toward retirement annuities.
              </p>
              <div className="text-[11px] text-blue-700 font-medium pt-1">
                ✓ Administered by registered Cooperative Trust
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1% Customer Guarantee Fund</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Separated from worker pay. When rare accidental damages occur on jobs, claims up to ₹25,000 are settled within 2 hours without docking worker pay.
              </p>
              <div className="text-[11px] text-amber-700 font-medium pt-1">
                ✓ Solves the classic gig contractor conflict
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Document Inspector Modal */}
      {selectedDocWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setSelectedDocWorker(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Official Credential Verification
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {selectedDocWorker.workerName} — {selectedDocWorker.trade}
              </h3>
              <p className="text-xs text-slate-500">
                Cooperative: {selectedDocWorker.cooperative}
              </p>
            </div>

            <div className="space-y-3">
              {/* Aadhaar preview */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Government Aadhaar Identification (Masked)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">VERIFIED FORMAT</span>
                </div>
                <p className="text-xs text-slate-700 font-mono">
                  UID: {selectedDocWorker.aadhaarNumber}
                </p>
                <div className="h-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-xs text-slate-500">
                  Encrypted Document Hash Verified
                </div>
              </div>

              {/* Trade Certificate preview */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Technical Trade Accreditation</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">VALID LICENSE</span>
                </div>
                <p className="text-xs text-slate-900 font-semibold">
                  {selectedDocWorker.certificationTitle}
                </p>
                <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col justify-between text-xs text-slate-600 gap-1">
                  <div className="flex justify-between">
                    <span>Issued By: Directorate of Skill Development</span>
                    <span className="text-emerald-700 font-semibold">Grade A</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
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
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors"
              >
                Approve Credentials
              </button>
              <button
                type="button"
                onClick={() => setSelectedDocWorker(null)}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium"
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
