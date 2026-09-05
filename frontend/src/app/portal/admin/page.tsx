'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
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
  Award
} from 'lucide-react';
import { MOCK_VERIFICATION_QUEUE, WorkerVerificationItem } from '@/data/mockData';

interface SocietyTool {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  status: 'AVAILABLE' | 'CHECKED_OUT' | 'IN_MAINTENANCE';
  currentHolder?: string;
  dueBack?: string;
}

export default function SocietyAdminPortalPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'VERIFICATIONS' | 'TOOLS' | 'TREASURY'>('VERIFICATIONS');
  const [queue, setQueue] = useState<WorkerVerificationItem[]>(MOCK_VERIFICATION_QUEUE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tool Library State
  const [tools, setTools] = useState<SocietyTool[]>([
    {
      id: 'tool-01',
      name: 'Bosch SDS-Max Heavy Rotary Hammer Drill',
      category: 'Masonry & Electrical Channelling',
      serialNumber: 'BSH-HD-9921',
      status: 'CHECKED_OUT',
      currentHolder: 'Ramesh Chavan (Electrician)',
      dueBack: 'Today, 6:00 PM'
    },
    {
      id: 'tool-02',
      name: 'Rothenberger Hydraulic Copper Pipe Bender',
      category: 'Plumbing & Gas Lines',
      serialNumber: 'RTH-PB-4102',
      status: 'AVAILABLE'
    },
    {
      id: 'tool-03',
      name: 'Flir E4 WiFi Thermal Imaging Camera',
      category: 'HVAC & Electrical Hotspot Audit',
      serialNumber: 'FLR-TH-1190',
      status: 'AVAILABLE'
    },
    {
      id: 'tool-04',
      name: 'Makita 18V Cordless Circular Saw (165mm)',
      category: 'Carpentry & Joinery',
      serialNumber: 'MKT-CS-7711',
      status: 'CHECKED_OUT',
      currentHolder: 'Kavita Suresh (Carpentry)',
      dueBack: 'Tomorrow, 12:00 PM'
    }
  ]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id: string, name: string) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'VERIFIED' } : item));
    showNotification(`Approved ${name}! Member granted active cooperative discovery.`);
  };

  const handleReject = (id: string, name: string) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'REJECTED' } : item));
    showNotification(`Application rejected for ${name}. Feedback transmitted.`);
  };

  const handleToggleTool = (toolId: string) => {
    setTools(prev => prev.map(t => {
      if (t.id === toolId) {
        const isAvail = t.status === 'AVAILABLE';
        return {
          ...t,
          status: isAvail ? 'CHECKED_OUT' : 'AVAILABLE',
          currentHolder: isAvail ? 'Ramesh Chavan (Member #101)' : undefined,
          dueBack: isAvail ? 'Tomorrow, 5:00 PM' : undefined
        };
      }
      return t;
    }));
    showNotification('Tool library status updated successfully.');
  };

  const pendingMembers = queue.filter(q => q.status === 'PENDING').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Society Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 border border-blue-200 mb-2">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Primary Labour Society Chapter • NCD-KA-BLR-0089</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Kalyan Labour Workers Society
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Secretary: <strong className="text-slate-700">{user?.name || 'Anand Patil'}</strong> • 310 Active Trade Artisans • 5% Operational Overhead Ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Society Quorum Active</span>
          </span>
        </div>
      </div>

      {/* Summary Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Member Verifications</span>
          <p className="text-3xl font-bold text-amber-600">{pendingMembers}</p>
          <span className="text-xs text-slate-400">Requires credential audit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Shared Equipment Fleet</span>
          <p className="text-3xl font-bold text-slate-900">{tools.length} Tools</p>
          <span className="text-xs text-emerald-600 font-medium">
            {tools.filter(t => t.status === 'AVAILABLE').length} Available for checkout
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">5% Society Treasury Pool</span>
          <p className="text-3xl font-bold text-emerald-600">₹1,42,800</p>
          <span className="text-xs text-slate-400">Maintains equipment library & office ops</span>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('VERIFICATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'VERIFICATIONS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Member Verification Queue</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            activeTab === 'VERIFICATIONS' ? 'bg-blue-700 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {pendingMembers}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TOOLS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'TOOLS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Shared Tool Library</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TREASURY')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'TREASURY'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>5% Society Treasury Ledger</span>
        </button>
      </div>

      {/* TAB 1: Member Verification Queue */}
      {activeTab === 'VERIFICATIONS' && (
        <section className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Worker Accreditation & National Credential Audits
            </h3>
            <p className="text-xs text-slate-500">
              Review government Aadhaar UID and technical trade certifications before admitting workers to the cooperative platform.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-3">Applicant Name</th>
                  <th className="py-3 px-3">Trade Category</th>
                  <th className="py-3 px-3">Credential / License</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Secretary Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {queue.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{w.workerName}</div>
                      <div className="text-[11px] text-slate-400">{w.phone}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-blue-700">{w.trade}</span>
                      <span className="text-[10px] text-slate-400 block">{w.experienceYears} yrs experience</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-800">{w.certificationTitle}</div>
                      <div className="font-mono text-[10px] text-slate-400">UID: {w.aadhaarNumber}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        w.status === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : w.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {w.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(w.id, w.workerName)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(w.id, w.workerName)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold text-xs flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Audit Concluded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: Shared Power Tool Library */}
      {activeTab === 'TOOLS' && (
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Primary Society Heavy Equipment & Power Tool Library
              </h3>
              <p className="text-xs text-slate-500">
                Democratically purchased with the 5% society treasury pool to eliminate worker capital expenditure.
              </p>
            </div>

            <button
              type="button"
              onClick={() => showNotification('Equipment requisition modal opened.')}
              className="h-9 px-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Equipment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      {tool.serialNumber}
                    </span>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                      tool.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {tool.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 pt-1">{tool.name}</h4>
                  <p className="text-xs text-slate-500">{tool.category}</p>

                  {tool.currentHolder && (
                    <div className="text-xs text-slate-700 pt-1">
                      Current Borrower: <strong>{tool.currentHolder}</strong>
                      <span className="text-slate-400 block text-[11px]">Due: {tool.dueBack}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleTool(tool.id)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    tool.status === 'AVAILABLE'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{tool.status === 'AVAILABLE' ? 'Check Out to Worker' : 'Mark Returned to Locker'}</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: 5% Society Treasury Ledger */}
      {activeTab === 'TREASURY' && (
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              5% Society Operational Treasury Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Audit logs of primary cooperative revenue retained directly from completed member dispatches.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Total 5% Fees Collected (FY 2026)</span>
              <span className="text-xl font-bold text-slate-900">₹2,84,500</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Tool Library Capital Upgrades</span>
              <span className="text-xl font-bold text-slate-900">₹1,12,000</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Liquid Society Reserve</span>
              <span className="text-xl font-bold text-emerald-600">₹1,72,500</span>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
