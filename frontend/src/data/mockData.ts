/**
 * ============================================================================
 * SyncBridge Cooperative Platform — Data Models & Mock Datasets
 * Cooperative Labour Federation & Democratic Services Network
 * ============================================================================
 */

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  startingPrice: number;
  activeWorkers: number;
  popularTrade: boolean;
  accentColor: string;
  isEmergencyEligible?: boolean;
}

export interface WorkerProfile {
  id: string;
  name: string;
  trade: string;
  cooperativeName: string;
  cooperativeId: string;
  ncdSocietyCode: string;
  eShramUan: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  hourlyRate: number;
  experienceYears: number;
  isAvailable: boolean;
  verified: boolean;
  ncctCertified: boolean;
  ncctBadgeTitle: string;
  policeVerified: boolean;
  skills: string[];
  phone: string;
  locationName: string;
  completedJobs: number;
  avatarUrl: string;
  bio: string;
  guaranteeCovered: boolean;
}

export interface WorkerVerificationItem {
  id: string;
  workerName: string;
  trade: string;
  cooperative: string;
  ncdSocietyCode: string;
  eShramUan: string;
  phone: string;
  email: string;
  experienceYears: number;
  submittedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  aadhaarNumber: string;
  certificationTitle: string;
  ncctAccreditation: string;
  policeClearance: 'VERIFIED' | 'IN_PROGRESS' | 'PENDING';
  hourlyRate: number;
}

export interface PeerArbitrationCase {
  id: string;
  workerId: string;
  workerName: string;
  trade: string;
  cooperativeName: string;
  ncdCode: string;
  customerName: string;
  bookingId: string;
  disputeReason: string;
  customerRating: number;
  reportedAt: string;
  hearingStatus: 'PENDING_HEARING' | 'IN_DELIBERATION' | 'RESTORED' | 'MEDIATED_REFUND';
  arbitrationCouncil: string[];
  workerDefenseStatement: string;
  customerStatement: string;
  restorativeRemedy: string;
  guaranteePayoutAmount?: number;
}

export interface B2GContract {
  id: string;
  institutionName: string;
  department: string;
  contractType: 'MUNICIPAL_B2G' | 'COOPERATIVE_FEDERATION_B2B' | 'PUBLIC_FACILITY';
  status: 'ACTIVE_COMMITTED' | 'TENDER_AWARDED' | 'IN_EXECUTION';
  monthlyVolumeHours: number;
  assignedWorkersCount: number;
  totalAnnualValue: string;
  participatingCooperatives: string[];
  paymentTermDays: number;
  scope: string;
  contactNodalOfficer: string;
  slaCompliancePct: number;
}

export interface WelfareFundSnapshot {
  totalCorpus: string;
  medicalClaimsSettled: number;
  totalMedicalPaid: string;
  microPensionAccounts: number;
  accidentInsuranceActive: number;
  guaranteeFundReserve: string;
  emergencyReliefLoansIssued: number;
  claimsApprovalRatePct: number;
}

export interface BookingItem {
  id: string;
  serviceCategory: string;
  workerName: string;
  workerTrade: string;
  cooperativeName: string;
  customerName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  isEmergency: boolean;
  totalAmount: number;
  emergencySurgeAmount: number;
  workerPayout: number; // 90% of base + 100% of emergency surge
  coopFee: number;      // 5% of base
  welfareFund: number;  // 5% of base
  guaranteeFund: number;// 1% centralized protection escrow
  location: string;
  ncctBadge: string;
}

export const MOCK_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-1',
    name: 'Electrician',
    slug: 'electrician',
    iconName: 'Zap',
    description: 'Wiring, circuit repairs, installations & power backups',
    startingPrice: 299,
    activeWorkers: 48,
    popularTrade: true,
    isEmergencyEligible: true,
    accentColor: 'from-amber-400 to-yellow-600'
  },
  {
    id: 'cat-2',
    name: 'Plumber',
    slug: 'plumber',
    iconName: 'Droplets',
    description: 'Pipe leaks, faucet fitting, drainage & water heaters',
    startingPrice: 249,
    activeWorkers: 39,
    popularTrade: true,
    isEmergencyEligible: true,
    accentColor: 'from-blue-400 to-cyan-600'
  },
  {
    id: 'cat-3',
    name: 'Caregiver & Nursing',
    slug: 'caregiver',
    iconName: 'HeartHandshake',
    description: 'Elderly care, patient assistance & post-op nursing',
    startingPrice: 499,
    activeWorkers: 27,
    popularTrade: true,
    isEmergencyEligible: true,
    accentColor: 'from-rose-400 to-pink-600'
  },
  {
    id: 'cat-4',
    name: 'Carpenter',
    slug: 'carpenter',
    iconName: 'Hammer',
    description: 'Custom furniture, door lock fitting, woodwork & repairs',
    startingPrice: 349,
    activeWorkers: 31,
    popularTrade: false,
    isEmergencyEligible: false,
    accentColor: 'from-orange-400 to-amber-700'
  },
  {
    id: 'cat-5',
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    iconName: 'Wrench',
    description: 'AC servicing, refrigerator, washing machine & microwave',
    startingPrice: 399,
    activeWorkers: 42,
    popularTrade: true,
    isEmergencyEligible: true,
    accentColor: 'from-teal-400 to-emerald-600'
  },
  {
    id: 'cat-6',
    name: 'Deep Cleaning',
    slug: 'cleaning',
    iconName: 'Sparkles',
    description: 'Full home sanitization, kitchen, sofa & bathroom cleaning',
    startingPrice: 599,
    activeWorkers: 53,
    popularTrade: false,
    isEmergencyEligible: false,
    accentColor: 'from-violet-400 to-purple-600'
  },
  {
    id: 'cat-7',
    name: 'Painter & Decorator',
    slug: 'painter',
    iconName: 'Paintbrush',
    description: 'Interior/exterior wall painting, waterproofing & touchups',
    startingPrice: 449,
    activeWorkers: 22,
    popularTrade: false,
    isEmergencyEligible: false,
    accentColor: 'from-indigo-400 to-blue-600'
  },
  {
    id: 'cat-8',
    name: 'Mason & Construction',
    slug: 'mason',
    iconName: 'BrickWall',
    description: 'Tile laying, plastering, structural brickwork & renovations',
    startingPrice: 499,
    activeWorkers: 19,
    popularTrade: false,
    isEmergencyEligible: false,
    accentColor: 'from-stone-400 to-zinc-600'
  }
];

export const MOCK_WORKERS: WorkerProfile[] = [
  {
    id: 'w-101',
    name: 'Ramesh Kumar',
    trade: 'Electrician',
    cooperativeName: 'Metro Technicians Labour Cooperative',
    cooperativeId: 'coop-01',
    ncdSocietyCode: 'NCD-KA-BLR-0042',
    eShramUan: 'UAN-8921-1402-9912',
    rating: 4.9,
    reviewsCount: 142,
    distanceKm: 1.4,
    hourlyRate: 350,
    experienceYears: 8,
    isAvailable: true,
    verified: true,
    ncctCertified: true,
    ncctBadgeTitle: 'NCCT Wireman Trade Class A',
    policeVerified: true,
    guaranteeCovered: true,
    skills: ['Three-Phase Wiring', 'Inverter Systems', 'MCB Distribution', 'Smart Home Setup'],
    phone: '+91 98452 11092',
    locationName: 'Indiranagar (1.4 km away)',
    completedJobs: 320,
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    bio: 'Certified master electrician with 8+ years experience. NCCT accredited with full e-Shram social security.'
  },
  {
    id: 'w-102',
    name: 'Suresh Patil',
    trade: 'Plumber',
    cooperativeName: 'Kalyan Labour Workers Society',
    cooperativeId: 'coop-02',
    ncdSocietyCode: 'NCD-KA-BLR-0089',
    eShramUan: 'UAN-7712-9014-4321',
    rating: 4.8,
    reviewsCount: 98,
    distanceKm: 2.2,
    hourlyRate: 300,
    experienceYears: 6,
    isAvailable: true,
    verified: true,
    ncctCertified: true,
    ncctBadgeTitle: 'Skill India Sanitaryware Specialist',
    policeVerified: true,
    guaranteeCovered: true,
    skills: ['Leak Detection', 'PPR Pipe Jointing', 'RO Water Filter', 'Bathroom Fitting'],
    phone: '+91 98231 44520',
    locationName: 'Koramangala (2.2 km away)',
    completedJobs: 215,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Experienced in residential plumbing pipelines, motorized pumps, and immediate leak emergencies.'
  },
  {
    id: 'w-103',
    name: 'Anjali Sharma',
    trade: 'Caregiver & Nursing',
    cooperativeName: 'Seva Shramik Care Cooperative',
    cooperativeId: 'coop-03',
    ncdSocietyCode: 'NCD-KA-BLR-0105',
    eShramUan: 'UAN-9901-4451-2290',
    rating: 5.0,
    reviewsCount: 84,
    distanceKm: 3.1,
    hourlyRate: 550,
    experienceYears: 7,
    isAvailable: true,
    verified: true,
    ncctCertified: true,
    ncctBadgeTitle: 'NCCT Geriatric Care Fellow',
    policeVerified: true,
    guaranteeCovered: true,
    skills: ['Geriatric Care', 'Vitals Monitoring', 'Physiotherapy Assist', 'Post-Surgical Care'],
    phone: '+91 99120 78431',
    locationName: 'HSR Layout (3.1 km away)',
    completedJobs: 178,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Registered nursing assistant. Specializing in dignified, compassionate elderly home healthcare.'
  },
  {
    id: 'w-104',
    name: 'Vikram Singh',
    trade: 'Carpenter',
    cooperativeName: 'National Skilled Artisans Guild',
    cooperativeId: 'coop-04',
    ncdSocietyCode: 'NCD-KA-BLR-0033',
    eShramUan: 'UAN-6632-1109-8831',
    rating: 4.7,
    reviewsCount: 110,
    distanceKm: 4.5,
    hourlyRate: 400,
    experienceYears: 10,
    isAvailable: false,
    verified: true,
    ncctCertified: true,
    ncctBadgeTitle: 'Master Woodwork Craftsperson',
    policeVerified: true,
    guaranteeCovered: true,
    skills: ['Modular Kitchen Fitting', 'Hardwood Furniture', 'Door Hinges & Locks', 'Veneer Polishing'],
    phone: '+91 97411 90812',
    locationName: 'BTM Layout (4.5 km away)',
    completedJobs: 290,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Artisan woodworker with precision tools and decade-long craftsmanship on bespoke interiors.'
  },
  {
    id: 'w-105',
    name: 'Mohammad Tariq',
    trade: 'Appliance Repair',
    cooperativeName: 'Metro Technicians Labour Cooperative',
    cooperativeId: 'coop-01',
    ncdSocietyCode: 'NCD-KA-BLR-0042',
    eShramUan: 'UAN-8921-9981-4412',
    rating: 4.9,
    reviewsCount: 165,
    distanceKm: 2.8,
    hourlyRate: 450,
    experienceYears: 9,
    isAvailable: true,
    verified: true,
    ncctCertified: true,
    ncctBadgeTitle: 'Skill India HVAC Technician Level 4',
    policeVerified: true,
    guaranteeCovered: true,
    skills: ['Inverter AC Gas Refill', 'Compressor Diagnostics', 'Circuit Board Repair', 'Drum Balancing'],
    phone: '+91 96321 00293',
    locationName: 'Jayanagar (2.8 km away)',
    completedJobs: 410,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    bio: 'HVAC and refrigeration specialist with original spare parts guarantee from cooperative inventory.'
  },
  {
    id: 'w-106',
    name: 'Lakshmi Devi',
    trade: 'Deep Cleaning',
    cooperativeName: 'Shram Shakti Mahila Cooperative',
    cooperativeId: 'coop-05',
    ncdSocietyCode: 'NCD-KA-BLR-0211',
    eShramUan: 'UAN-9902-8871-3310',
    rating: 4.8,
    reviewsCount: 92,
    distanceKm: 1.8,
    hourlyRate: 350,
    experienceYears: 5,
    isAvailable: true,
    verified: true,
    ncctCertified: true,
    ncctBadgeTitle: 'Certified Sanitation Supervisor',
    policeVerified: true,
    guaranteeCovered: true,
    skills: ['Industrial Vacuuming', 'Eco-friendly Degreasing', 'High-Pressure Wash', 'Fabric Sanitization'],
    phone: '+91 94488 12349',
    locationName: 'Domlur (1.8 km away)',
    completedJobs: 185,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Certified sanitation team leader with hospital-grade non-toxic disinfectant certification.'
  }
];

export const MOCK_COOPERATIVES = [
  { id: 'coop-01', name: 'Metro Technicians Labour Cooperative', ncdCode: 'NCD-KA-BLR-0042', district: 'Bengaluru Central', members: 420 },
  { id: 'coop-02', name: 'Kalyan Labour Workers Society', ncdCode: 'NCD-KA-BLR-0089', district: 'Bengaluru South', members: 310 },
  { id: 'coop-03', name: 'Seva Shramik Care Cooperative', ncdCode: 'NCD-KA-BLR-0105', district: 'Bengaluru East', members: 180 },
  { id: 'coop-04', name: 'National Skilled Artisans Guild', ncdCode: 'NCD-KA-BLR-0033', district: 'Bengaluru North', members: 240 },
  { id: 'coop-05', name: 'Shram Shakti Mahila Cooperative', ncdCode: 'NCD-KA-BLR-0211', district: 'Bengaluru Urban', members: 278 }
];

export const MOCK_ADMIN_METRICS = {
  platformCode: 'SYNCBRIDGE-FED-01',
  governanceBody: 'National Cooperative Council',
  totalPrimaryCooperativesAcrossIndia: '44,000+',
  totalWorkers: 1428,
  activeWorkers: 1195,
  pendingVerifications: 34,
  welfareFundBalance: '₹6,45,000',
  microPensionAccrued: '₹3,85,000',
  welfareGrowth: '+22.4%',
  totalPatronage: '₹28,40,000',
  // Official 90 / 5 / 5 Tri-Split Protocol per Section 4, Item 5
  triSplitPercentages: {
    workerWallet: 90,
    primaryCoop: 5,
    workerSocialSecurity: 5
  },
  emergencySurgeWorkerPassThrough: 100, // 100% of emergency surge goes to worker
  cooperativeGuaranteeReserve: '₹1,25,000', // 1% centralized customer protection fund
  completedBookings: 8940,
  averageRating: 4.86,
  peerArbitrationCasesActive: 3
};

export const MOCK_VERIFICATION_QUEUE: WorkerVerificationItem[] = [
  {
    id: 'verif-1',
    workerName: 'Dinesh Manjunath',
    trade: 'Electrician',
    cooperative: 'Metro Technicians Labour Cooperative',
    ncdSocietyCode: 'NCD-KA-BLR-0042',
    eShramUan: 'UAN-8921-4412-3091',
    phone: '+91 99801 32410',
    email: 'dinesh.m@gmail.com',
    experienceYears: 5,
    submittedAt: '2026-09-04 14:30',
    status: 'PENDING',
    aadhaarNumber: 'XXXX-XXXX-8921',
    certificationTitle: 'Govt ITI Wireman License (Class A)',
    ncctAccreditation: 'NCCT National Trade Certification (NSQF Level 4)',
    policeClearance: 'VERIFIED',
    hourlyRate: 350
  },
  {
    id: 'verif-2',
    workerName: 'Pooja Narayanan',
    trade: 'Caregiver & Nursing',
    cooperative: 'Seva Shramik Care Cooperative',
    ncdSocietyCode: 'NCD-KA-BLR-0105',
    eShramUan: 'UAN-7701-1290-8841',
    phone: '+91 98450 67123',
    email: 'pooja.nursing@outlook.com',
    experienceYears: 4,
    submittedAt: '2026-09-04 18:15',
    status: 'PENDING',
    aadhaarNumber: 'XXXX-XXXX-4512',
    certificationTitle: 'Red Cross Certified Home Nursing Diploma',
    ncctAccreditation: 'NCCT Healthcare & Geriatric Care Standard',
    policeClearance: 'VERIFIED',
    hourlyRate: 480
  },
  {
    id: 'verif-3',
    workerName: 'Arjun Das',
    trade: 'Plumber',
    cooperative: 'Kalyan Labour Workers Society',
    ncdSocietyCode: 'NCD-KA-BLR-0089',
    eShramUan: 'UAN-6651-9981-1209',
    phone: '+91 97312 88901',
    email: 'arjun.plumb@yahoo.com',
    experienceYears: 7,
    submittedAt: '2026-09-05 09:10',
    status: 'PENDING',
    aadhaarNumber: 'XXXX-XXXX-6701',
    certificationTitle: 'National Trade Certificate in Plumbing (NTC)',
    ncctAccreditation: 'Skill India Plumbing Council Level 3',
    policeClearance: 'VERIFIED',
    hourlyRate: 320
  },
  {
    id: 'verif-4',
    workerName: 'Farhan Sheikh',
    trade: 'Appliance Repair',
    cooperative: 'Metro Technicians Labour Cooperative',
    ncdSocietyCode: 'NCD-KA-BLR-0042',
    eShramUan: 'UAN-8891-3401-2290',
    phone: '+91 96112 34509',
    email: 'farhan.tech@gmail.com',
    experienceYears: 6,
    submittedAt: '2026-09-05 11:45',
    status: 'PENDING',
    aadhaarNumber: 'XXXX-XXXX-1142',
    certificationTitle: 'Skill India HVAC & Appliance Technician Certificate',
    ncctAccreditation: 'NCCT Technical Guild Accreditation',
    policeClearance: 'VERIFIED',
    hourlyRate: 400
  },
  {
    id: 'verif-5',
    workerName: 'Sunita Mehra',
    trade: 'Deep Cleaning',
    cooperative: 'Shram Shakti Mahila Cooperative',
    ncdSocietyCode: 'NCD-KA-BLR-0211',
    eShramUan: 'UAN-9912-4410-7781',
    phone: '+91 99002 98412',
    email: 'sunita.shram@gmail.com',
    experienceYears: 3,
    submittedAt: '2026-09-05 13:00',
    status: 'PENDING',
    aadhaarNumber: 'XXXX-XXXX-3389',
    certificationTitle: 'Professional Housekeeping & Chemical Safety Certificate',
    ncctAccreditation: 'NCCT Cooperative Work Standards',
    policeClearance: 'IN_PROGRESS',
    hourlyRate: 300
  }
];

export const MOCK_BOOKINGS: BookingItem[] = [
  {
    id: 'BK-2026-891',
    serviceCategory: 'Electrician',
    workerName: 'Ramesh Kumar',
    workerTrade: 'Electrician',
    cooperativeName: 'Metro Technicians Labour Cooperative',
    customerName: 'Priya Sundaram',
    scheduledDate: '2026-09-06',
    scheduledTime: '10:00 AM',
    status: 'CONFIRMED',
    isEmergency: false,
    totalAmount: 700,
    emergencySurgeAmount: 0,
    workerPayout: 630,  // 90%
    coopFee: 35,        // 5%
    welfareFund: 35,    // 5%
    guaranteeFund: 7,   // 1%
    location: '42, 12th Main Road, Indiranagar, Bengaluru',
    ncctBadge: 'NCCT Wireman Trade Class A'
  },
  {
    id: 'BK-2026-890',
    serviceCategory: 'Plumber',
    workerName: 'Suresh Patil',
    workerTrade: 'Plumber',
    cooperativeName: 'Kalyan Labour Workers Society',
    customerName: 'Karthik Rao',
    scheduledDate: '2026-09-05',
    scheduledTime: '03:30 PM',
    status: 'IN_PROGRESS',
    isEmergency: true,
    totalAmount: 850,
    emergencySurgeAmount: 250, // 100% of surge goes to worker
    workerPayout: 790,         // (600 * 90%) + 250 = 540 + 250 = 790
    coopFee: 30,               // 600 * 5% = 30
    welfareFund: 30,           // 600 * 5% = 30
    guaranteeFund: 6,          // 600 * 1% = 6
    location: 'Flat 302, Palm Meadows, Koramangala, Bengaluru',
    ncctBadge: 'Skill India Sanitaryware Specialist'
  },
  {
    id: 'BK-2026-885',
    serviceCategory: 'Caregiver & Nursing',
    workerName: 'Anjali Sharma',
    workerTrade: 'Caregiver',
    cooperativeName: 'Seva Shramik Care Cooperative',
    customerName: 'Meenakshi Iyer',
    scheduledDate: '2026-09-04',
    scheduledTime: '09:00 AM',
    status: 'COMPLETED',
    isEmergency: false,
    totalAmount: 1100,
    emergencySurgeAmount: 0,
    workerPayout: 990,  // 90%
    coopFee: 55,        // 5%
    welfareFund: 55,    // 5%
    guaranteeFund: 11,  // 1%
    location: 'Villa 14, Rainbow Drive, HSR Layout, Bengaluru',
    ncctBadge: 'NCCT Geriatric Care Fellow'
  }
];

export interface DemandForecastItem {
  areaCode: string;
  areaName: string;
  zone: string;
  serviceCategory: string;
  predictedDemandNextWeek: number;
  historicalWeeklyAvg: number;
  growthRatePct: number;
  demandLevel: 'CRITICAL_SURGE' | 'HIGH_DEMAND' | 'MODERATE' | 'LOW';
  confidenceScore: number;
  peakDays: string[];
  recommendedWorkerSupply: number;
  currentActiveWorkers: number;
  workerDeficit: number;
  recommendedWorkerAlert: string;
  timeSeriesBreakdown: {
    weeksAnalyzed: number;
    mostRecentWeekCount: number;
    weightedMovingAvg: number;
    trendMultiplier: number;
  };
}

export const MOCK_DEMAND_FORECASTS: DemandForecastItem[] = [
  {
    areaCode: '560038',
    areaName: 'Indiranagar',
    zone: 'East Bengaluru',
    serviceCategory: 'Electrician',
    predictedDemandNextWeek: 58,
    historicalWeeklyAvg: 38.5,
    growthRatePct: 50.6,
    demandLevel: 'CRITICAL_SURGE',
    confidenceScore: 0.94,
    peakDays: ['Saturday', 'Sunday'],
    recommendedWorkerSupply: 12,
    currentActiveWorkers: 7,
    workerDeficit: 5,
    recommendedWorkerAlert: '🚨 CRITICAL SURGE ALERT: Electrician demand in Indiranagar (560038) projected at 58 jobs (+50.6%). Deficit of 5 workers. 100% surge premium pass-through will mobilize cooperative technicians.',
    timeSeriesBreakdown: {
      weeksAnalyzed: 5,
      mostRecentWeekCount: 52,
      weightedMovingAvg: 46.2,
      trendMultiplier: 1.25
    }
  },
  {
    areaCode: '560034',
    areaName: 'Koramangala',
    zone: 'South Bengaluru',
    serviceCategory: 'Appliance Repair',
    predictedDemandNextWeek: 43,
    historicalWeeklyAvg: 32.1,
    growthRatePct: 33.9,
    demandLevel: 'HIGH_DEMAND',
    confidenceScore: 0.91,
    peakDays: ['Friday', 'Saturday'],
    recommendedWorkerSupply: 9,
    currentActiveWorkers: 6,
    workerDeficit: 3,
    recommendedWorkerAlert: '⚡ HIGH DEMAND ALERT: Elevated Appliance Repair requests in Koramangala (560034). 9 workers needed for expected weekend peak.',
    timeSeriesBreakdown: {
      weeksAnalyzed: 5,
      mostRecentWeekCount: 41,
      weightedMovingAvg: 37.8,
      trendMultiplier: 1.14
    }
  },
  {
    areaCode: '560102',
    areaName: 'HSR Layout',
    zone: 'South-East Bengaluru',
    serviceCategory: 'Plumber',
    predictedDemandNextWeek: 35,
    historicalWeeklyAvg: 28.4,
    growthRatePct: 23.2,
    demandLevel: 'HIGH_DEMAND',
    confidenceScore: 0.89,
    peakDays: ['Sunday'],
    recommendedWorkerSupply: 7,
    currentActiveWorkers: 5,
    workerDeficit: 2,
    recommendedWorkerAlert: '⚡ HIGH DEMAND ALERT: Elevated Plumber requests in HSR Layout (560102). 7 workers needed for expected Sunday surge.',
    timeSeriesBreakdown: {
      weeksAnalyzed: 5,
      mostRecentWeekCount: 34,
      weightedMovingAvg: 31.5,
      trendMultiplier: 1.11
    }
  },
  {
    areaCode: '560076',
    areaName: 'BTM Layout',
    zone: 'South Bengaluru',
    serviceCategory: 'Deep Cleaning',
    predictedDemandNextWeek: 26,
    historicalWeeklyAvg: 23.0,
    growthRatePct: 13.0,
    demandLevel: 'MODERATE',
    confidenceScore: 0.87,
    peakDays: ['Saturday', 'Sunday'],
    recommendedWorkerSupply: 6,
    currentActiveWorkers: 6,
    workerDeficit: 0,
    recommendedWorkerAlert: 'Stable demand for Deep Cleaning in BTM Layout. Baseline capacity (6 workers) is sufficient.',
    timeSeriesBreakdown: {
      weeksAnalyzed: 5,
      mostRecentWeekCount: 25,
      weightedMovingAvg: 24.1,
      trendMultiplier: 1.08
    }
  },
  {
    areaCode: '560011',
    areaName: 'Jayanagar',
    zone: 'South Bengaluru',
    serviceCategory: 'Caregiver & Nursing',
    predictedDemandNextWeek: 22,
    historicalWeeklyAvg: 20.5,
    growthRatePct: 7.3,
    demandLevel: 'MODERATE',
    confidenceScore: 0.90,
    peakDays: ['Monday', 'Tuesday'],
    recommendedWorkerSupply: 5,
    currentActiveWorkers: 5,
    workerDeficit: 0,
    recommendedWorkerAlert: 'Stable demand for Caregiver & Nursing in Jayanagar. Baseline capacity (5 workers) is sufficient.',
    timeSeriesBreakdown: {
      weeksAnalyzed: 5,
      mostRecentWeekCount: 21,
      weightedMovingAvg: 21.0,
      trendMultiplier: 1.05
    }
  }
];


export const MOCK_PEER_ARBITRATION_CASES: PeerArbitrationCase[] = [
  {
    id: 'arb-2026-01',
    workerId: 'w-101',
    workerName: 'Ramesh Kumar',
    trade: 'Electrician',
    cooperativeName: 'Metro Technicians Labour Cooperative',
    ncdCode: 'NCD-KA-BLR-0042',
    customerName: 'Aakash Verma (Indiranagar)',
    bookingId: 'BK-78401',
    disputeReason: 'Customer gave 1-star claiming concealed wiring diagnosis took 45 mins extra and caused wall plaster spalling.',
    customerRating: 1.0,
    reportedAt: '2026-09-04 14:30',
    hearingStatus: 'PENDING_HEARING',
    arbitrationCouncil: ['Suresh Patil (Plumbing Lead)', 'Meena Devi (Caregiver Rep)', 'Adv. G. Rao (Coop Legal Ombud)'],
    workerDefenseStatement: 'The customer’s flat wiring was 25 years old without conduit pipe. I warned him that drilling into damp brickwork would crack old plaster, but he insisted on instant tracer testing. I isolated the short circuit successfully.',
    customerStatement: 'The work was completed but my hallway plaster cracked. Commercial platforms normally fire or de-list the guy instantly without hearing.',
    restorativeRemedy: 'Case under Restorative Peer Review. Primary society dispatched plasterer via 1% Guarantee Fund (₹650) to repair spalling; Ramesh’s rating normalized to 4.85 without algorithmic deactivation penalty.',
    guaranteePayoutAmount: 650
  },
  {
    id: 'arb-2026-02',
    workerId: 'w-103',
    workerName: 'Anil Gowda',
    trade: 'Carpenter',
    cooperativeName: 'Kalyan Labour Workers Society',
    ncdCode: 'NCD-KA-BLR-0089',
    customerName: 'Priya Nambiar (Whitefield)',
    bookingId: 'BK-78299',
    disputeReason: 'Customer claimed hydraulic cabinet hinge was stiff after fitting and requested 100% refund.',
    customerRating: 2.0,
    reportedAt: '2026-09-03 11:15',
    hearingStatus: 'RESTORED',
    arbitrationCouncil: ['Ramesh Kumar (Electrician)', 'Kavita Shinde (Masonry Lead)', 'Shri K. Nair (Society Sec.)'],
    workerDefenseStatement: 'The hinge was factory-sealed soft-close. Required 24-hour setting tension. I offered to visit the next morning to micro-adjust, but customer filed immediate low rating.',
    customerStatement: 'Anil visited the next day and calibrated the tension screw smoothly. Cabinet is working properly now.',
    restorativeRemedy: 'Peer review committee verified mutual satisfaction. Rating restored; customer commended the restorative mediation instead of punitive gig ban.',
    guaranteePayoutAmount: 0
  },
  {
    id: 'arb-2026-03',
    workerId: 'w-106',
    workerName: 'Mohd. Imran',
    trade: 'Appliance Repair',
    cooperativeName: 'Karnataka Union Labour Federation',
    ncdCode: 'NCD-KA-MYS-0193',
    customerName: 'Deepak Saxena (Koramangala)',
    bookingId: 'BK-78114',
    disputeReason: 'Inverter AC cooling gas leaked 3 days after capacitor replacement.',
    customerRating: 1.0,
    reportedAt: '2026-09-02 18:40',
    hearingStatus: 'MEDIATED_REFUND',
    arbitrationCouncil: ['Suresh Patil', 'Adv. G. Rao', 'Lakshmi Narayanan (Appliance Guild)'],
    workerDefenseStatement: 'The copper tubing had hairline corrosion that gave away under high pressure. I replaced the capacitor correctly, but coil brazing was needed.',
    customerStatement: 'I had to pay for gas recharge twice.',
    restorativeRemedy: 'Cooperative Guarantee Fund covered the ₹1,200 gas brazing difference. Imran underwent a 1-day NCCT micro-refresher on inverter brazing; no punitive deactivation.',
    guaranteePayoutAmount: 1200
  }
];


export const MOCK_B2G_CONTRACTS: B2GContract[] = [
  {
    id: 'b2g-bbmp-01',
    institutionName: 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    department: 'Ward Infrastructure & Municipal Health Centres Maintenance',
    contractType: 'MUNICIPAL_B2G',
    status: 'ACTIVE_COMMITTED',
    monthlyVolumeHours: 3200,
    assignedWorkersCount: 48,
    totalAnnualValue: '₹2.16 Crore',
    participatingCooperatives: ['Metro Technicians Labour Cooperative', 'Kalyan Labour Workers Society'],
    paymentTermDays: 7,
    scope: 'Routine electrical safety audits, backup generator wiring, and plumbing maintenance across 28 municipal clinics and ward offices in Bengaluru East.',
    contactNodalOfficer: 'Shri R. Manjunath (Chief Executive Engineer, BBMP)',
    slaCompliancePct: 99.2
  },
  {
    id: 'b2b-kmf-02',
    institutionName: 'Karnataka Milk Federation (KMF - Nandini)',
    department: 'Central Processing Dairies & Chilling Units',
    contractType: 'COOPERATIVE_FEDERATION_B2B',
    status: 'IN_EXECUTION',
    monthlyVolumeHours: 1850,
    assignedWorkersCount: 26,
    totalAnnualValue: '₹1.28 Crore',
    participatingCooperatives: ['Metro Technicians Labour Cooperative', 'Karnataka Union Labour Federation'],
    paymentTermDays: 5,
    scope: 'Cold chain electrical repairs, motor rewind diagnostics, and sanitary pipe fitting across 6 dairy packaging units in Bengaluru & Mysore.',
    contactNodalOfficer: 'Smt. Anasuya Gowda (GM Operations, KMF)',
    slaCompliancePct: 98.7
  },
  {
    id: 'b2b-iffco-03',
    institutionName: 'IFFCO Fertilizer & Agro-Logistics Hub',
    department: 'Regional Distribution & Warehouse Maintenance',
    contractType: 'COOPERATIVE_FEDERATION_B2B',
    status: 'TENDER_AWARDED',
    monthlyVolumeHours: 1400,
    assignedWorkersCount: 18,
    totalAnnualValue: '₹92 Lakhs',
    participatingCooperatives: ['Karnataka Union Labour Federation'],
    paymentTermDays: 7,
    scope: 'Conveyor belt motor servicing, electrical panel preventive maintenance, and structural carpentry for agro-storage facilities.',
    contactNodalOfficer: 'Dr. V. K. Sharma (Regional Director, IFFCO)',
    slaCompliancePct: 97.9
  }
];


export const MOCK_WELFARE_FUND_SNAPSHOT: WelfareFundSnapshot = {
  totalCorpus: '₹4,82,50,000',
  medicalClaimsSettled: 342,
  totalMedicalPaid: '₹1,24,60,000',
  microPensionAccounts: 3840,
  accidentInsuranceActive: 4120,
  guaranteeFundReserve: '₹48,25,000',
  emergencyReliefLoansIssued: 128,
  claimsApprovalRatePct: 98.4
};

