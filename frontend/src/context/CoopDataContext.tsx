'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BookingItem, 
  WorkerProfile, 
  WorkerVerificationItem, 
  PeerArbitrationCase,
  MOCK_BOOKINGS, 
  MOCK_WORKERS, 
  MOCK_VERIFICATION_QUEUE, 
  MOCK_PEER_ARBITRATION_CASES 
} from '@/data/mockData';

export interface PowerToolItem {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR';
  dailyFee: number;
  status: 'AVAILABLE' | 'CHECKED_OUT';
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  cooperativeChapter: string;
}

const DEFAULT_TOOLS: PowerToolItem[] = [
  {
    id: 'tool-01',
    name: 'Bosch Professional Rotary Hammer Drill (GBH 2-26)',
    category: 'Heavy Concrete & Masonry',
    serialNumber: 'BOS-HAM-8841',
    condition: 'EXCELLENT',
    dailyFee: 150,
    status: 'AVAILABLE',
    cooperativeChapter: 'Kalyan Labour Society'
  },
  {
    id: 'tool-02',
    name: 'Rothenberger Industrial Hydraulic Pipe Threader (1/2"-2")',
    category: 'Plumbing & Gas Lines',
    serialNumber: 'ROTH-PIP-0912',
    condition: 'GOOD',
    dailyFee: 250,
    status: 'CHECKED_OUT',
    assignedWorkerId: 'wrk-01',
    assignedWorkerName: 'Ramesh Chavan',
    cooperativeChapter: 'Kalyan Labour Society'
  },
  {
    id: 'tool-03',
    name: 'Makita 4100NH Electric Wet Tile & Marble Cutter',
    category: 'Flooring & Tiling',
    serialNumber: 'MAK-TIL-3321',
    condition: 'EXCELLENT',
    dailyFee: 180,
    status: 'AVAILABLE',
    cooperativeChapter: 'Kalyan Labour Society'
  },
  {
    id: 'tool-04',
    name: 'Aluminium Mobile Scaffolding Tower (6 Meter)',
    category: 'Elevated Electrical & Painting',
    serialNumber: 'SCAF-ALU-7729',
    condition: 'GOOD',
    dailyFee: 350,
    status: 'AVAILABLE',
    cooperativeChapter: 'Kalyan Labour Society'
  },
  {
    id: 'tool-05',
    name: 'Fluke 117 True-RMS Electrician Digital Multimeter',
    category: 'Precision Electrical Testing',
    serialNumber: 'FLU-117-9021',
    condition: 'EXCELLENT',
    dailyFee: 100,
    status: 'CHECKED_OUT',
    assignedWorkerId: 'wrk-02',
    assignedWorkerName: 'Priya Sharma',
    cooperativeChapter: 'Kalyan Labour Society'
  }
];

interface CoopDataContextType {
  orders: BookingItem[];
  workers: WorkerProfile[];
  verificationQueue: WorkerVerificationItem[];
  toolInventory: PowerToolItem[];
  arbitrationCases: PeerArbitrationCase[];
  workerWallets: Record<string, number>;
  societyTreasury: number;
  welfareFund: number;
  latestCreatedOrder: BookingItem | null;

  // Actions
  createOrder: (orderData: {
    workerId?: string;
    workerName: string;
    workerTrade: string;
    cooperativeName?: string;
    customerName: string;
    customerAddress: string;
    totalAmount: number;
    issueDescription: string;
    isEmergency?: boolean;
    serviceCategory: string;
  }) => BookingItem;

  acceptOrder: (orderId: string, workerId: string) => void;
  completeOrder: (orderId: string) => void;
  withdrawWorkerWallet: (workerId: string, upiId: string) => { success: boolean; utr: string; amount: number };
  
  submitWorkerApplication: (applicantData: {
    fullName: string;
    phone: string;
    trade: string;
    city: string;
    uanNumber: string;
    hourlyRate: number;
    experienceYears: number;
    certificationTitle?: string;
  }) => void;

  approveWorker: (applicantId: string) => void;
  rejectWorker: (applicantId: string) => void;

  checkOutTool: (toolId: string, workerId: string, workerName: string) => void;
  returnTool: (toolId: string) => void;

  fileDispute: (orderId: string, disputeReason: string, customerStatement: string) => void;
  voteArbitration: (caseId: string, decision: 'RESTORED' | 'MEDIATED_REFUND', voter: string) => void;
}

const CoopDataContext = createContext<CoopDataContextType | undefined>(undefined);

export function CoopDataProvider({ children }: { children: React.ReactNode }) {
  // 1. Orders state
  const [orders, setOrders] = useState<BookingItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('syncbridge_orders');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return MOCK_BOOKINGS;
  });

  // 2. Workers state
  const [workers, setWorkers] = useState<WorkerProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('syncbridge_workers');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return MOCK_WORKERS;
  });

  // 3. Verification queue for Society Admin
  const [verificationQueue, setVerificationQueue] = useState<WorkerVerificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('syncbridge_verifications');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return MOCK_VERIFICATION_QUEUE;
  });

  // 4. Power tool inventory
  const [toolInventory, setToolInventory] = useState<PowerToolItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('syncbridge_tools');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return DEFAULT_TOOLS;
  });

  // 5. Arbitration cases
  const [arbitrationCases, setArbitrationCases] = useState<PeerArbitrationCase[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('syncbridge_arbitrations');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return MOCK_PEER_ARBITRATION_CASES;
  });

  // 6. Wallets & Accounting
  const [workerWallets, setWorkerWallets] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('syncbridge_wallets');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {
      'wrk-01': 4850,
      'wrk-02': 3200,
      'wrk-03': 6100,
      'wrk-04': 2900,
      'wrk-05': 5400
    };
  });

  const [societyTreasury, setSocietyTreasury] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('syncbridge_treasury');
      if (saved) return Number(saved);
    }
    return 38400;
  });

  const [welfareFund, setWelfareFund] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('syncbridge_welfare');
      if (saved) return Number(saved);
    }
    return 145000;
  });

  const [latestCreatedOrder, setLatestCreatedOrder] = useState<BookingItem | null>(null);

  // Persistence side-effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('syncbridge_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('syncbridge_workers', JSON.stringify(workers));
    }
  }, [workers]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('syncbridge_verifications', JSON.stringify(verificationQueue));
    }
  }, [verificationQueue]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('syncbridge_tools', JSON.stringify(toolInventory));
    }
  }, [toolInventory]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('syncbridge_arbitrations', JSON.stringify(arbitrationCases));
    }
  }, [arbitrationCases]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('syncbridge_wallets', JSON.stringify(workerWallets));
      localStorage.setItem('syncbridge_treasury', String(societyTreasury));
      localStorage.setItem('syncbridge_welfare', String(welfareFund));
    }
  }, [workerWallets, societyTreasury, welfareFund]);

  // ACTION 1: Create Order
  const createOrder = (orderData: {
    workerId?: string;
    workerName: string;
    workerTrade: string;
    cooperativeName?: string;
    customerName: string;
    customerAddress: string;
    totalAmount: number;
    issueDescription: string;
    isEmergency?: boolean;
    serviceCategory: string;
  }): BookingItem => {
    const total = orderData.totalAmount || 500;
    const workerPayout = Math.round(total * 0.9);
    const coopFee = Math.round(total * 0.05);
    const welfare = Math.round(total * 0.05);

    const newOrder: BookingItem = {
      id: `BKG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceCategory: orderData.serviceCategory || orderData.workerTrade,
      workerName: orderData.workerName,
      workerTrade: orderData.workerTrade,
      cooperativeName: orderData.cooperativeName || 'Kalyan Labour Society',
      customerName: orderData.customerName || 'Priya Sharma',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: 'Today • Instant Dispatch',
      status: 'CONFIRMED',
      isEmergency: orderData.isEmergency || false,
      totalAmount: total,
      emergencySurgeAmount: orderData.isEmergency ? 250 : 0,
      workerPayout: workerPayout,
      coopFee: coopFee,
      welfareFund: welfare,
      guaranteeFund: Math.round(total * 0.01),
      location: orderData.customerAddress || 'Indiranagar 2nd Stage, Bengaluru',
      ncctBadge: 'Certified Trade Artisan'
    };

    setOrders(prev => [newOrder, ...prev]);
    setLatestCreatedOrder(newOrder);
    return newOrder;
  };

  // ACTION 2: Accept Order (Worker)
  const acceptOrder = (orderId: string, workerId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'IN_PROGRESS' };
      }
      return o;
    }));
  };

  // ACTION 3: Complete Order (Worker marks done -> 90/5/5 split)
  const completeOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && o.status !== 'COMPLETED') {
        const workerAmt = o.workerPayout;
        const coopAmt = o.coopFee;
        const welfareAmt = o.welfareFund;

        // Credit worker wallet
        setWorkerWallets(w => ({
          ...w,
          'wrk-01': (w['wrk-01'] || 0) + workerAmt
        }));

        // Credit society treasury
        setSocietyTreasury(t => t + coopAmt);

        // Credit welfare fund
        setWelfareFund(wf => wf + welfareAmt);

        return { ...o, status: 'COMPLETED' };
      }
      return o;
    }));
  };

  // ACTION 4: Instant UPI Payout
  const withdrawWorkerWallet = (workerId: string, upiId: string) => {
    const balance = workerWallets[workerId] || 0;
    const utr = `UTR-UPI-2026-${Math.floor(10000000 + Math.random() * 90000000)}`;

    setWorkerWallets(prev => ({
      ...prev,
      [workerId]: 0
    }));

    return {
      success: true,
      utr,
      amount: balance
    };
  };

  // ACTION 5: Submit Worker Application (Onboarding)
  const submitWorkerApplication = (applicantData: {
    fullName: string;
    phone: string;
    trade: string;
    city: string;
    uanNumber: string;
    hourlyRate: number;
    experienceYears: number;
    certificationTitle?: string;
  }) => {
    const newApplicant: WorkerVerificationItem = {
      id: `verif-${Date.now()}`,
      workerName: applicantData.fullName,
      trade: applicantData.trade,
      cooperative: 'Kalyan Labour Workers Society',
      ncdSocietyCode: 'NCD-KA-BLR-0089',
      eShramUan: applicantData.uanNumber,
      phone: applicantData.phone,
      email: `${applicantData.fullName.toLowerCase().replace(/\s+/g, '.')}@member.coop`,
      experienceYears: applicantData.experienceYears || 4,
      submittedAt: new Date().toLocaleString(),
      status: 'PENDING',
      aadhaarNumber: 'XXXX-XXXX-9912',
      certificationTitle: applicantData.certificationTitle || 'Govt ITI Trade Certification',
      ncctAccreditation: 'NCCT National Trade Certification (NSQF Level 4)',
      policeClearance: 'VERIFIED',
      hourlyRate: applicantData.hourlyRate || 450
    };

    setVerificationQueue(prev => [newApplicant, ...prev]);
  };

  // ACTION 6: Approve Worker
  const approveWorker = (applicantId: string) => {
    const applicant = verificationQueue.find(v => v.id === applicantId);
    if (!applicant) return;

    // Update queue status
    setVerificationQueue(prev => prev.map(v => v.id === applicantId ? { ...v, status: 'VERIFIED' } : v));

    // Create & add new WorkerProfile
    const newWorker: WorkerProfile = {
      id: `wrk-${Date.now()}`,
      name: applicant.workerName,
      trade: applicant.trade,
      cooperativeName: applicant.cooperative,
      cooperativeId: 'coop-02',
      ncdSocietyCode: applicant.ncdSocietyCode,
      eShramUan: applicant.eShramUan,
      rating: 5.0,
      reviewsCount: 1,
      distanceKm: 2.3,
      hourlyRate: applicant.hourlyRate,
      experienceYears: applicant.experienceYears,
      isAvailable: true,
      verified: true,
      ncctCertified: true,
      ncctBadgeTitle: 'NCCT Certified Trade Artisan',
      policeVerified: true,
      guaranteeCovered: true,
      skills: [applicant.trade, 'Diagnostic Inspection', 'Cooperative Standards'],
      phone: applicant.phone,
      locationName: 'Indiranagar (2.3 km away)',
      completedJobs: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      bio: `Newly approved cooperative member. 90% direct patronage compensation accredited.`
    };

    setWorkers(prev => [newWorker, ...prev]);
  };

  // ACTION 7: Reject Worker
  const rejectWorker = (applicantId: string) => {
    setVerificationQueue(prev => prev.map(v => v.id === applicantId ? { ...v, status: 'REJECTED' } : v));
  };

  // ACTION 8: Tool Library Check-out
  const checkOutTool = (toolId: string, workerId: string, workerName: string) => {
    setToolInventory(prev => prev.map(t => {
      if (t.id === toolId) {
        return {
          ...t,
          status: 'CHECKED_OUT',
          assignedWorkerId: workerId,
          assignedWorkerName: workerName
        };
      }
      return t;
    }));
  };

  // ACTION 9: Tool Library Return
  const returnTool = (toolId: string) => {
    setToolInventory(prev => prev.map(t => {
      if (t.id === toolId) {
        return {
          ...t,
          status: 'AVAILABLE',
          assignedWorkerId: undefined,
          assignedWorkerName: undefined
        };
      }
      return t;
    }));
  };

  // ACTION 10: File Dispute
  const fileDispute = (orderId: string, disputeReason: string, customerStatement: string) => {
    const order = orders.find(o => o.id === orderId);
    const newCase: PeerArbitrationCase = {
      id: `ARB-2026-${Math.floor(100 + Math.random() * 900)}`,
      workerId: 'wrk-01',
      workerName: order?.workerName || 'Ramesh Chavan',
      trade: order?.workerTrade || 'Electrician',
      cooperativeName: order?.cooperativeName || 'Kalyan Labour Workers Society',
      ncdCode: 'NCD-KA-BLR-0089',
      customerName: order?.customerName || 'Priya Sharma',
      bookingId: orderId,
      disputeReason,
      customerRating: 2,
      reportedAt: new Date().toISOString().split('T')[0],
      hearingStatus: 'PENDING_HEARING',
      arbitrationCouncil: ['Anand Patil (Secretary)', 'Sunita Rao (Member Worker)', 'Vikram Rao (Director)'],
      workerDefenseStatement: 'Work was executed per ISI electrical standards. Additional fitting was required due to legacy corroded box.',
      customerStatement,
      restorativeRemedy: 'Under Council Review: 100% guarantee insurance escrow protection active.',
      guaranteePayoutAmount: order?.totalAmount || 850
    };

    setArbitrationCases(prev => [newCase, ...prev]);
  };

  // ACTION 11: Vote on Arbitration
  const voteArbitration = (caseId: string, decision: 'RESTORED' | 'MEDIATED_REFUND', voter: string) => {
    setArbitrationCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          hearingStatus: decision,
          restorativeRemedy: decision === 'RESTORED'
            ? `Council Unanimous Decision: Worker exonerated. Mutual Aid guarantee escrow reimbursed customer ₹${c.guaranteePayoutAmount}.`
            : `Council Decision: Mediated 50/50 mutual settlement with guarantee rework voucher issued.`
        };
      }
      return c;
    }));
  };

  return (
    <CoopDataContext.Provider
      value={{
        orders,
        workers,
        verificationQueue,
        toolInventory,
        arbitrationCases,
        workerWallets,
        societyTreasury,
        welfareFund,
        latestCreatedOrder,
        createOrder,
        acceptOrder,
        completeOrder,
        withdrawWorkerWallet,
        submitWorkerApplication,
        approveWorker,
        rejectWorker,
        checkOutTool,
        returnTool,
        fileDispute,
        voteArbitration
      }}
    >
      {children}
    </CoopDataContext.Provider>
  );
}

export function useCoopData() {
  const context = useContext(CoopDataContext);
  if (!context) {
    throw new Error('useCoopData must be used within a CoopDataProvider');
  }
  return context;
}
