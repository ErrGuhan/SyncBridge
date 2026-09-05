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
}

export interface WorkerProfile {
  id: string;
  name: string;
  trade: string;
  cooperativeName: string;
  cooperativeId: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  hourlyRate: number;
  experienceYears: number;
  isAvailable: boolean;
  verified: boolean;
  skills: string[];
  phone: string;
  locationName: string;
  completedJobs: number;
  avatarUrl: string;
  bio: string;
}

export interface WorkerVerificationItem {
  id: string;
  workerName: string;
  trade: string;
  cooperative: string;
  phone: string;
  email: string;
  experienceYears: number;
  submittedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  aadhaarNumber: string;
  certificationTitle: string;
  hourlyRate: number;
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
  totalAmount: number;
  workerPayout: number; // 80%
  coopFee: number; // 15%
  welfareFund: number; // 5%
  location: string;
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
    rating: 4.9,
    reviewsCount: 142,
    distanceKm: 1.4,
    hourlyRate: 350,
    experienceYears: 8,
    isAvailable: true,
    verified: true,
    skills: ['Three-Phase Wiring', 'Inverter Systems', 'MCB Distribution', 'Smart Home Setup'],
    phone: '+91 98452 11092',
    locationName: 'Indiranagar (1.4 km away)',
    completedJobs: 320,
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    bio: 'Certified master electrician with 8+ years experience. Member of Metro Technicians Coop with full safety compliance.'
  },
  {
    id: 'w-102',
    name: 'Suresh Patil',
    trade: 'Plumber',
    cooperativeName: 'Kalyan Labour Workers Society',
    cooperativeId: 'coop-02',
    rating: 4.8,
    reviewsCount: 98,
    distanceKm: 2.2,
    hourlyRate: 300,
    experienceYears: 6,
    isAvailable: true,
    verified: true,
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
    rating: 5.0,
    reviewsCount: 84,
    distanceKm: 3.1,
    hourlyRate: 550,
    experienceYears: 7,
    isAvailable: true,
    verified: true,
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
    rating: 4.7,
    reviewsCount: 110,
    distanceKm: 4.5,
    hourlyRate: 400,
    experienceYears: 10,
    isAvailable: false,
    verified: true,
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
    rating: 4.9,
    reviewsCount: 165,
    distanceKm: 2.8,
    hourlyRate: 450,
    experienceYears: 9,
    isAvailable: true,
    verified: true,
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
    rating: 4.8,
    reviewsCount: 92,
    distanceKm: 1.8,
    hourlyRate: 350,
    experienceYears: 5,
    isAvailable: true,
    verified: true,
    skills: ['Industrial Vacuuming', 'Eco-friendly Degreasing', 'High-Pressure Wash', 'Fabric Sanitization'],
    phone: '+91 94488 12349',
    locationName: 'Domlur (1.8 km away)',
    completedJobs: 185,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Certified sanitation team leader with hospital-grade non-toxic disinfectant certification.'
  }
];

export const MOCK_COOPERATIVES = [
  { id: 'coop-01', name: 'Metro Technicians Labour Cooperative', district: 'Bengaluru Central', members: 420 },
  { id: 'coop-02', name: 'Kalyan Labour Workers Society', district: 'Bengaluru South', members: 310 },
  { id: 'coop-03', name: 'Seva Shramik Care Cooperative', district: 'Bengaluru East', members: 180 },
  { id: 'coop-04', name: 'National Skilled Artisans Guild', district: 'Bengaluru North', members: 240 },
  { id: 'coop-05', name: 'Shram Shakti Mahila Cooperative', district: 'Bengaluru Urban', members: 278 }
];

export const MOCK_ADMIN_METRICS = {
  totalWorkers: 1428,
  activeWorkers: 1195,
  pendingVerifications: 34,
  welfareFundBalance: '₹4,82,500',
  welfareGrowth: '+18.4%',
  totalPatronage: '₹24,15,000',
  triSplitPercentages: {
    workerWallet: 80,
    coopFund: 15,
    workerWelfare: 5
  },
  completedBookings: 8940,
  averageRating: 4.86
};

export const MOCK_VERIFICATION_QUEUE: WorkerVerificationItem[] = [
  {
    id: 'verif-1',
    workerName: 'Dinesh Manjunath',
    trade: 'Electrician',
    cooperative: 'Metro Technicians Labour Cooperative',
    phone: '+91 99801 32410',
    email: 'dinesh.m@gmail.com',
    experienceYears: 5,
    submittedAt: '2026-09-04 14:30',
    status: 'PENDING',
    aadhaarNumber: 'XXXX-XXXX-8921',
    certificationTitle: 'Govt ITI Wireman License (Class A)',
    hourlyRate: 350
  },
  {
    id: 'verif-2',
    workerName: 'Pooja Narayanan',
    trade: 'Caregiver & Nursing',
    cooperative: 'Seva Shramik Care Cooperative',
    phone: '+91 98450 67123',
    email: 'pooja.nursing@outlook.com',
    experienceYears: 4,
    submittedAt: '2026-09-04 18:15',
    status: 'PENDING',
    aadhaarNumber: 'XXXX-XXXX-4512',
    certificationTitle: 'Red Cross Certified Home Nursing Diploma',
    hourlyRate: 480
  },
  {
    id: 'verif-3',
    workerName: 'Arjun Das',
    trade: 'Plumber',
    cooperative: 'Kalyan Labour Workers Society',
    phone: '+91 97312 88901',
    email: 'arjun.plumb@yahoo.com',
    experienceYears: 7,
    submittedAt: '2026-09-05 09:10',
    status: 'PENDING',
    aadhaarNumber: 'XXXX-XXXX-6701',
    certificationTitle: 'National Trade Certificate in Plumbing (NTC)',
    hourlyRate: 320
  },
  {
    id: 'verif-4',
    workerName: 'Farhan Sheikh',
    trade: 'Appliance Repair',
    cooperative: 'Metro Technicians Labour Cooperative',
    phone: '+91 96112 34509',
    email: 'farhan.tech@gmail.com',
    experienceYears: 6,
    submittedAt: '2026-09-05 11:45',
    status: 'PENDING',
    aadhaarNumber: 'XXXX-XXXX-1142',
    certificationTitle: 'Skill India HVAC & Appliance Technician Certificate',
    hourlyRate: 400
  },
  {
    id: 'verif-5',
    workerName: 'Sunita Mehra',
    trade: 'Deep Cleaning',
    cooperative: 'Shram Shakti Mahila Cooperative',
    phone: '+91 99002 98412',
    email: 'sunita.shram@gmail.com',
    experienceYears: 3,
    submittedAt: '2026-09-05 13:00',
    status: 'PENDING',
    aadhaarNumber: 'XXXX-XXXX-3389',
    certificationTitle: 'Professional Housekeeping & Chemical Safety Certificate',
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
    totalAmount: 700,
    workerPayout: 560, // 80%
    coopFee: 105,      // 15%
    welfareFund: 35,   // 5%
    location: '42, 12th Main Road, Indiranagar, Bengaluru'
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
    totalAmount: 600,
    workerPayout: 480, // 80%
    coopFee: 90,       // 15%
    welfareFund: 30,   // 5%
    location: 'Flat 302, Palm Meadows, Koramangala, Bengaluru'
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
    totalAmount: 1100,
    workerPayout: 880, // 80%
    coopFee: 165,      // 15%
    welfareFund: 55,   // 5%
    location: 'Villa 14, Rainbow Drive, HSR Layout, Bengaluru'
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
    recommendedWorkerAlert: '🚨 CRITICAL SURGE ALERT: Electrician demand in Indiranagar (560038) projected at 58 jobs (+50.6%). Deficit of 5 workers. Immediate cooperative dispatch alert recommended.',
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
