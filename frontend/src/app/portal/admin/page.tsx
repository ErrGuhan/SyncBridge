'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCoopData } from '@/context/CoopDataContext';
import { 
  Building2, 
  Users, 
  Wrench, 
  Wallet, 
  Check, 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  Plus,
  Search,
  Award,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Radio,
  Zap,
  Flame,
  Scale,
  Gavel,
  ShieldAlert,
  Send,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  MOCK_DEMAND_FORECASTS, 
  DemandForecastItem, 
  PeerArbitrationCase,
  WorkerVerificationItem
} from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';

export default function CooperativeFederationAdminPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { 
    verificationQueue, 
    approveWorker, 
    rejectWorker, 
    toolInventory, 
    checkOutTool, 
    returnTool, 
    societyTreasury, 
    welfareFund,
    orders,
    arbitrationCases,
    voteArbitration
  } = useCoopData();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FORECASTING' | 'DISPUTES' | 'VERIFICATIONS' | 'TOOLS'>('OVERVIEW');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [alertDispatchedMap, setAlertDispatchedMap] = useState<Record<string, boolean>>({});

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBroadcastAlert = (forecast: DemandForecastItem) => {
    const key = `${forecast.serviceCategory}__${forecast.areaCode}`;
    setAlertDispatchedMap(prev => ({ ...prev, [key]: true }));
    showNotification(
      `Broadcast dispatched: Alerted ${forecast.currentActiveWorkers + forecast.workerDeficit} ${forecast.serviceCategory}s in ${forecast.areaName} (${forecast.areaCode}) for expected weekend surge!`
    );
  };

  const handleApprove = (id: string, name: string) => {
    approveWorker(id);
    showNotification(`Approved ${name}! Member granted active cooperative discovery.`);
  };

  const handleReject = (id: string, name: string) => {
    rejectWorker(id);
    showNotification(`Application rejected for ${name}. Feedback transmitted.`);
  };

  const handleToggleTool = (toolId: string) => {
    const targetTool = toolInventory.find(t => t.id === toolId);
    if (!targetTool) return;

    if (targetTool.status === 'AVAILABLE') {
      checkOutTool(toolId, 'wrk-01', 'Ramesh Chavan (Electrician)');
      showNotification(`Tool checked out to Ramesh Chavan.`);
    } else {
      returnTool(toolId);
      showNotification(`Tool returned to Society Locker.`);
    }
  };

  const pendingMembers = verificationQueue.filter(q => q.status === 'PENDING').length;
  const activeDisputes = arbitrationCases.filter(c => c.hearingStatus === 'PENDING_HEARING' || c.hearingStatus === 'IN_DELIBERATION').length;

  // Member societies mock data (Deliverable #9)
  const memberSocieties = [
    {
      id: 'soc-01',
      name: 'Kalyan Labour Workers Society',
      ncdCode: 'NCD-KA-BLR-0089',
      zone: 'Bengaluru East',
      registeredWorkers: 310,
      activeJobs: 42,
      treasuryPool: 48500,
      establishedYear: 2018,
      status: 'QUORUM_ACTIVE'
    },
    {
      id: 'soc-02',
      name: 'Metro Technicians Labour Cooperative',
      ncdCode: 'NCD-KA-BLR-0042',
      zone: 'Bengaluru Central',
      registeredWorkers: 280,
      activeJobs: 38,
      treasuryPool: 54200,
      establishedYear: 2020,
      status: 'QUORUM_ACTIVE'
    },
    {
      id: 'soc-03',
      name: 'Seva Shramik Care Cooperative',
      ncdCode: 'NCD-KA-BLR-0105',
      zone: 'Bengaluru South',
      registeredWorkers: 195,
      activeJobs: 29,
      treasuryPool: 36800,
      establishedYear: 2021,
      status: 'QUORUM_ACTIVE'
    },
    {
      id: 'soc-04',
      name: 'National Skilled Artisans Guild',
      ncdCode: 'NCD-KA-BLR-0033',
      zone: 'Bengaluru West',
      registeredWorkers: 240,
      activeJobs: 31,
      treasuryPool: 41900,
      establishedYear: 2019,
      status: 'QUORUM_ACTIVE'
    }
  ];

  // Job volume over time mock distribution
  const volumeByMonth = [
    { month: 'Apr 2026', totalJobs: 980, gmv: '₹5.8L' },
    { month: 'May 2026', totalJobs: 1120, gmv: '₹6.9L' },
    { month: 'Jun 2026', totalJobs: 1240, gmv: '₹7.6L' },
    { month: 'Jul 2026', totalJobs: 1390, gmv: '₹8.4L' },
    { month: 'Aug 2026', totalJobs: 1540, gmv: '₹9.2L' },
    { month: 'Sep 2026 (MTD)', totalJobs: 482, gmv: '₹2.9L' },
  ];

  // Aggregated 90/5/5 Gross Revenue Split
  const totalGmv = 2480000;
  const workerTakeHome = Math.round(totalGmv * 0.90);
  const societyReserves = Math.round(totalGmv * 0.05);
  const welfarePool = Math.round(totalGmv * 0.05);
  const guaranteeReserve = Math.round(totalGmv * 0.01);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Federation Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 border border-blue-200 mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('adminFederationTag')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('adminFederationTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Presiding Administrator: <strong className="text-slate-800">{user?.name || 'Anand Patil (Society Secretary)'}</strong> • 
            4 Member Societies • 1,025 Verified Trade Artisans • 100% Democratic Multi-Stakeholder Governance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center">
          <span className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('quorumActive')}</span>
          </span>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('totalGmvLabel')}</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">₹{(totalGmv / 100000).toFixed(1)} Lakh</p>
          <span className="text-[11px] text-emerald-700 font-semibold block">90% Direct Pay: ₹{(workerTakeHome / 100000).toFixed(1)} Lakh</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Member Society Chapters</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">4 Societies</p>
          <span className="text-[11px] text-slate-500">1,025 certified artisans active</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Shortage Alerts</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">2 Critical</p>
          <span className="text-[11px] text-amber-700 font-medium">Monsoon surge in Koramangala & Indiranagar</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Dispute Queue</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">{activeDisputes} Cases</p>
          <span className="text-[11px] text-slate-500">Peer Council restorative resolution</span>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: t('tabOverview'), icon: BarChart3 },
          { id: 'FORECASTING', label: t('tabForecasting'), icon: Zap, badge: '2 Alerts' },
          { id: 'DISPUTES', label: t('tabDisputes'), icon: Scale, badge: activeDisputes > 0 ? `${activeDisputes} Open` : undefined },
          { id: 'VERIFICATIONS', label: t('tabVerifications'), icon: ShieldCheck, badge: pendingMembers > 0 ? `${pendingMembers}` : undefined },
          { id: 'TOOLS', label: t('tabTools'), icon: Wrench }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white text-slate-900' : 'bg-amber-100 text-amber-800'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* TAB 1: FEDERATION OVERVIEW & REVENUE DISTRIBUTION */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Revenue Distribution Across 90/5/5 Split */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Aggregated Revenue Distribution (Strict 90/5/5 Architecture)
                </h3>
                <p className="text-xs text-slate-500">
                  Total audited gross receipts distributed automatically via cooperative smart contract.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                Audited & Ledger-Balanced
              </span>
            </div>

            {/* Visual Bar Split */}
            <div className="space-y-2">
              <div className="w-full h-5 rounded-full overflow-hidden flex shadow-inner bg-slate-100">
                <div style={{ width: '90%' }} className="bg-emerald-600 transition-all" title="90% Worker Direct Payout" />
                <div style={{ width: '5%' }} className="bg-blue-600 transition-all" title="5% Primary Society Reserve" />
                <div style={{ width: '5%' }} className="bg-amber-500 transition-all" title="5% Welfare & Healthcare Fund" />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
                <span>90% Worker Take-Home (₹{workerTakeHome.toLocaleString()})</span>
                <span>5% Co-op (₹{societyReserves.toLocaleString()})</span>
                <span>5% Welfare (₹{welfarePool.toLocaleString()})</span>
              </div>
            </div>

            {/* 3 Split Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <span>90% Worker Direct Pay</span>
                  <Wallet className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-extrabold text-emerald-900">₹{workerTakeHome.toLocaleString()}</p>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Settled instantly via UPI directly to registered artisans. Zero platform commission deducted.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-blue-800 uppercase tracking-wider">
                  <span>5% Primary Society Treasury</span>
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-2xl font-extrabold text-blue-900">₹{societyReserves.toLocaleString()}</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Allocated democratically to the 4 chapter societies for power tool maintenance, physical offices, and local dispatchers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <span>5% Welfare & Health Shield</span>
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-extrabold text-amber-900">₹{welfarePool.toLocaleString()}</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Powers the ₹5 Lakh hospitalization pool, disability coverage, and a 1% customer guarantee reserve (₹{guaranteeReserve.toLocaleString()}).
                </p>
              </div>
            </div>
          </div>

          {/* Job Volume Over Time */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Job Volume Over Time (Aggregate & Trajectory)
                </h3>
                <p className="text-xs text-slate-500">
                  Monthly job dispatches across all primary cooperative chapters.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Quarterly Growth: +38.4%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {volumeByMonth.map((v) => (
                <div key={v.month} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">{v.month}</div>
                  <div className="text-xl font-extrabold text-slate-900">{v.totalJobs}</div>
                  <div className="text-[10px] text-blue-600 font-bold">{v.gmv} volume</div>
                </div>
              ))}
            </div>
          </div>

          {/* Member Societies Directory (Deliverable #9) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Member Cooperative Societies
                </h3>
                <p className="text-xs text-slate-500">
                  Primary Labour Cooperatives registered under Ministry of Cooperation (NCD Portal).
                </p>
              </div>
              <span className="text-xs text-blue-700 font-semibold">4 Affiliated Chapters</span>
            </div>

            <div className="divide-y divide-slate-100">
              {memberSocieties.map((soc) => (
                <div key={soc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{soc.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {soc.ncdCode}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ {soc.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Zone: <strong>{soc.zone}</strong> • Operating since {soc.establishedYear} • 5% Operational Overhead Ledger
                    </p>
                  </div>

                  <div className="flex items-center gap-6 self-start sm:self-auto text-right">
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">{soc.registeredWorkers}</span>
                      <span className="text-[10px] text-slate-400">Workers</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-blue-600 block">{soc.activeJobs}</span>
                      <span className="text-[10px] text-slate-400">Active Jobs</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-emerald-600 block">₹{soc.treasuryPool.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400">Chapter Treasury</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 2: AI DEMAND FORECASTING & WORKFORCE ALLOCATION (DELIVERABLE #11) */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'FORECASTING' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    AI Predictive Workforce Allocation Engine (Deliverable #11)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Forecasts demand spikes using historical booking frequency, local weather sensors, and festival cycles to alert off-duty artisans in advance.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
                ARIMA / Gemini Predictive Model
              </span>
            </div>

            {/* Critical Surge Highlight Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Predicted Demand Spike: Electrical Services (+50.6% next 7 days, monsoon onset)</span>
              </div>
              <p className="leading-relaxed">
                Weather radar indicates heavy rainfall & ceiling leakage risk in Indiranagar & Koramangala clusters. 
                Pre-allocation protocol advises mobilizing 12 off-duty electricians and 8 plumbers to prevent dispatch bottlenecks.
              </p>
            </div>

            {/* Forecast Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {MOCK_DEMAND_FORECASTS.map((forecast) => {
                const key = `${forecast.serviceCategory}__${forecast.areaCode}`;
                const isDispatched = alertDispatchedMap[key];
                const isSurge = forecast.demandLevel === 'CRITICAL_SURGE';

                return (
                  <div
                    key={key}
                    className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                      isSurge
                        ? 'bg-rose-50/30 border-rose-300 ring-1 ring-rose-300/30'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">{forecast.serviceCategory}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSurge ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {forecast.demandLevel.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500">
                        Area: <strong className="text-slate-700">{forecast.areaName}</strong> ({forecast.areaCode}) • {forecast.zone}
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Projected</span>
                          <strong className="text-slate-900 font-bold">{forecast.predictedDemandNextWeek} jobs</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Growth</span>
                          <strong className="text-rose-600 font-bold">+{forecast.growthRatePct}%</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Deficit</span>
                          <strong className="text-amber-700 font-bold">{forecast.workerDeficit} workers</strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {forecast.recommendedWorkerAlert}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Confidence: {(forecast.confidenceScore * 100).toFixed(0)}%
                      </span>

                      <button
                        type="button"
                        disabled={isDispatched}
                        onClick={() => handleBroadcastAlert(forecast)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                          isDispatched
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isDispatched ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Broadcast Sent</span>
                          </>
                        ) : (
                          <>
                            <Radio className="w-3.5 h-3.5" />
                            <span>Alert Off-Duty Artisans</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 3: RESTORATIVE PEER ARBITRATION DISPUTE QUEUE */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'DISPUTES' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Democratic Peer-Arbitration Dispute Council
                </h3>
                <p className="text-xs text-slate-500">
                  Replaces corporate deactivations with transparent peer review by fellow trade council members.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
                {arbitrationCases.length} Total Cases
              </span>
            </div>

            <div className="space-y-4">
              {arbitrationCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3.5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Case #{caseItem.id}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {caseItem.workerName} ({caseItem.trade})
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      caseItem.hearingStatus === 'RESTORED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : caseItem.hearingStatus === 'MEDIATED_REFUND'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {caseItem.hearingStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p>
                      <strong className="text-slate-800">Customer Claim ({caseItem.customerName}):</strong>{' '}
                      {caseItem.disputeReason}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Cooperative Chapter: {caseItem.cooperativeName} • Reported: {caseItem.reportedAt}
                    </p>
                  </div>

                  {(caseItem.hearingStatus === 'PENDING_HEARING' || caseItem.hearingStatus === 'IN_DELIBERATION') && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          voteArbitration(caseItem.id, 'RESTORED', 'Council Chair');
                          showNotification(`Restored standing for ${caseItem.workerName}. No algorithm penalty.`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                      >
                        Restore Member Standing
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          voteArbitration(caseItem.id, 'MEDIATED_REFUND', 'Council Trustee');
                          showNotification(`Disbursed remedy to ${caseItem.customerName} from 1% Guarantee pool.`);
                        }}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                      >
                        Disburse Guarantee Remedy
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 4: MEMBER VERIFICATION QUEUE */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'VERIFICATIONS' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Trade Credential & e-KYC Verification Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Verify national e-Shram UAN records, police clearances, and NCCT skill certifications.
                </p>
              </div>
              <span className="text-xs text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {pendingMembers} Pending Audit
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {verificationQueue.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.workerName}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                        {item.trade}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                      <span>UAN: <strong className="font-mono text-slate-700">{item.eShramUan}</strong></span>
                      <span>•</span>
                      <span>Aadhaar: <strong className="font-mono text-slate-700">{item.aadhaarNumber || 'XXXX-XXXX-9912'}</strong></span>
                      <span>•</span>
                      <span>Experience: {item.experienceYears} Years</span>
                      <span>•</span>
                      <span>Phone: {item.phone}</span>
                    </div>
                  </div>

                  {item.status === 'PENDING' && (
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleApprove(item.id, item.workerName)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(item.id, item.workerName)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 5: POWER TOOL INVENTORY FLEET */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'TOOLS' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Shared Heavy Power Tool Library
                </h3>
                <p className="text-xs text-slate-500">
                  Equipment purchased democratically using 5% Primary Society Reserves.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {toolInventory.length} Managed Tools
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolInventory.map((tool) => {
                const isAvailable = tool.status === 'AVAILABLE';
                return (
                  <div
                    key={tool.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isAvailable ? '✓ In Locker' : 'Checked Out'}
                        </span>
                        <span className="text-xs font-bold text-slate-900">₹{tool.dailyFee}/day</span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{tool.name}</h4>
                      <p className="text-xs text-slate-500">{tool.category}</p>
                      <p className="text-[10px] font-mono text-slate-400">SN: {tool.serialNumber}</p>

                      {!isAvailable && tool.assignedWorkerName && (
                        <div className="p-2 bg-slate-50 rounded-lg text-xs text-slate-600">
                          Checked out by: <strong>{tool.assignedWorkerName}</strong>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleTool(tool.id)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isAvailable
                          ? 'bg-slate-900 hover:bg-slate-800 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {isAvailable ? 'Check Out to Worker' : 'Mark Returned to Locker'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
