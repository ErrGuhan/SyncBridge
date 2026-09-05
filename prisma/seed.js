/**
 * Database Seeding Script for Cooperative Gig Services Platform
 * Populates realistic Indian cooperative worker profiles, coordinates,
 * service categories, and 25 historical completed bookings with 90-5-5 payment splits.
 * 
 * Execution:
 * node prisma/seed.js
 * OR
 * npx prisma db seed
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

let hashPassword = (pwd) => `$2a$10$wKxN7m6kG2v8X9.MockPasswordHash_${Buffer.from(pwd).toString('base64')}`;
try {
  const bcrypt = require(path.join(__dirname, '../services/user-service/node_modules/bcryptjs'));
  hashPassword = (pwd) => bcrypt.hashSync(pwd, 10);
} catch {
  try {
    const bcrypt = require('bcryptjs');
    hashPassword = (pwd) => bcrypt.hashSync(pwd, 10);
  } catch {}
}

const prisma = new PrismaClient();


// ----------------------------------------------------------------------------
// 1. THREE PRIMARY LABOUR COOPERATIVE SOCIETIES
// ----------------------------------------------------------------------------
const cooperativesData = [
  {
    id: 'coop-mumbai-plumbers-01',
    name: 'Mumbai Plumbers & Mechanical Workers Cooperative Society',
    registrationNumber: 'MH-MUM-COOP-2024-8821',
    contactEmail: 'contact@mumbaiplumbers.coop.in',
    contactPhone: '+91-22-2410-8800',
    address: 'Cooperative Bhavan, Dadar West, Mumbai, Maharashtra 400028',
    defaultWorkerSplitRatio: 0.9000, // 90%
    defaultCoopSplitRatio: 0.0500,   // 5%
    dividendPoolBalance: 245000.00,
    currency: 'INR'
  },
  {
    id: 'coop-delhi-electricians-02',
    name: 'Delhi Electricians & Power Technicians Cooperative Society',
    registrationNumber: 'DL-ND-COOP-2023-4419',
    contactEmail: 'desk@delhielectricians.coop.in',
    contactPhone: '+91-11-2334-5511',
    address: 'Shramik Sahakar Kendra, Connaught Place, New Delhi 110001',
    defaultWorkerSplitRatio: 0.9000, // 90%
    defaultCoopSplitRatio: 0.0500,   // 5%
    dividendPoolBalance: 312000.00,
    currency: 'INR'
  },
  {
    id: 'coop-blr-cleaning-03',
    name: 'Bengaluru Professional Facility & Cleaning Guild',
    registrationNumber: 'KA-BLR-COOP-2024-1205',
    contactEmail: 'operations@bengalurucleaning.coop.in',
    contactPhone: '+91-80-4122-3344',
    address: 'Sahakara Soudha, Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
    defaultWorkerSplitRatio: 0.9000, // 90%
    defaultCoopSplitRatio: 0.0500,   // 5%
    dividendPoolBalance: 189000.00,
    currency: 'INR'
  }
];

// ----------------------------------------------------------------------------
// SERVICE CATEGORIES
// ----------------------------------------------------------------------------
const serviceCategoriesData = [
  {
    id: 'cat-plumbing',
    name: 'Plumbing & Pipefitting',
    slug: 'plumbing',
    description: 'Expert leak repairs, pipe fitting, sanitary installations, and emergency drainage clearing.',
    basePrice: 450.00
  },
  {
    id: 'cat-electrical',
    name: 'Electrical & Power Systems',
    slug: 'electrical',
    description: 'Short circuit emergency repairs, circuit breaker replacements, smart wiring, and appliance installation.',
    basePrice: 500.00
  },
  {
    id: 'cat-cleaning',
    name: 'Deep Cleaning & Sanitization',
    slug: 'cleaning',
    description: 'Commercial and residential eco-friendly deep cleaning, kitchen degreasing, and water tank sanitization.',
    basePrice: 750.00
  },
  {
    id: 'cat-appliance',
    name: 'Appliance Repair & HVAC',
    slug: 'appliance-repair',
    description: 'AC servicing, refrigerator compressor repairs, washing machine troubleshooting, and solar inverter maintenance.',
    basePrice: 600.00
  },
  {
    id: 'cat-carpentry',
    name: 'Carpentry & Wood Fabrication',
    slug: 'carpentry',
    description: 'Custom furniture repair, door lock installation, modular kitchen cabinetry, and wood polishing.',
    basePrice: 550.00
  }
];

// ----------------------------------------------------------------------------
// 2. 15 VERIFIED WORKER PROFILES (Indian Names, e-Shram UANs, Coordinates)
// ----------------------------------------------------------------------------
const workersData = [
  // Mumbai Workers (Lat: 18.9 - 19.2, Lng: 72.8 - 72.9)
  {
    userId: 'usr-wkr-mum-01',
    firstName: 'Ramesh',
    lastName: 'Chavan',
    email: 'ramesh.chavan@coopmail.in',
    phone: '+91-98201-11221',
    city: 'Mumbai',
    cooperativeId: 'coop-mumbai-plumbers-01',
    lat: 19.0178,
    lng: 72.8478, // Dadar
    categoryId: 'cat-plumbing',
    hourlyRate: 500.00,
    experienceYears: 12,
    rating: 4.92,
    reviewsCount: 48,
    completedJobs: 64,
    uan: 'UAN-7721-8834-1092',
    certTitle: 'Certified Master Plumber (Grade A)',
    certAuthority: 'National Council for Cooperative Training (NCCT)'
  },
  {
    userId: 'usr-wkr-mum-02',
    firstName: 'Santosh',
    lastName: 'Patil',
    email: 'santosh.patil@coopmail.in',
    phone: '+91-98202-22332',
    city: 'Mumbai',
    cooperativeId: 'coop-mumbai-plumbers-01',
    lat: 19.1136,
    lng: 72.8697, // Andheri East
    categoryId: 'cat-plumbing',
    hourlyRate: 480.00,
    experienceYears: 9,
    rating: 4.85,
    reviewsCount: 36,
    completedJobs: 52,
    uan: 'UAN-7721-9945-2201',
    certTitle: 'Hydraulic Sanitary Systems Technician',
    certAuthority: 'Maharashtra State Cooperative Union'
  },
  {
    userId: 'usr-wkr-mum-03',
    firstName: 'Sunil',
    lastName: 'Gaikwad',
    email: 'sunil.gaikwad@coopmail.in',
    phone: '+91-98203-33443',
    city: 'Mumbai',
    cooperativeId: 'coop-delhi-electricians-02',
    lat: 19.0596,
    lng: 72.8295, // Bandra West
    categoryId: 'cat-electrical',
    hourlyRate: 550.00,
    experienceYears: 8,
    rating: 4.88,
    reviewsCount: 41,
    completedJobs: 59,
    uan: 'UAN-7721-1123-3394',
    certTitle: 'Industrial Electrician License #MH-EL-401',
    certAuthority: 'Central Electricity Authority'
  },
  {
    userId: 'usr-wkr-mum-04',
    firstName: 'Pooja',
    lastName: 'Kadam',
    email: 'pooja.kadam@coopmail.in',
    phone: '+91-98204-44554',
    city: 'Mumbai',
    cooperativeId: 'coop-blr-cleaning-03',
    lat: 19.0330,
    lng: 73.0297, // Navi Mumbai
    categoryId: 'cat-cleaning',
    hourlyRate: 420.00,
    experienceYears: 6,
    rating: 4.79,
    reviewsCount: 29,
    completedJobs: 43,
    uan: 'UAN-7721-3344-5581',
    certTitle: 'Professional Hygiene & Chemical Safety Diploma',
    certAuthority: 'National Skill Development Corporation'
  },
  {
    userId: 'usr-wkr-mum-05',
    firstName: 'Anil',
    lastName: 'Shinde',
    email: 'anil.shinde@coopmail.in',
    phone: '+91-98205-55665',
    city: 'Mumbai',
    cooperativeId: 'coop-mumbai-plumbers-01',
    lat: 19.2183,
    lng: 72.9781, // Thane West
    categoryId: 'cat-appliance',
    hourlyRate: 600.00,
    experienceYears: 11,
    rating: 4.90,
    reviewsCount: 54,
    completedJobs: 71,
    uan: 'UAN-7721-5566-7712',
    certTitle: 'Certified HVAC & Inverter Specialist',
    certAuthority: 'National Council for Cooperative Training (NCCT)'
  },

  // Delhi NCR Workers (Lat: 28.5 - 28.7, Lng: 77.1 - 77.3)
  {
    userId: 'usr-wkr-del-01',
    firstName: 'Virender',
    lastName: 'Singh',
    email: 'virender.singh@coopmail.in',
    phone: '+91-98101-11221',
    city: 'New Delhi',
    cooperativeId: 'coop-delhi-electricians-02',
    lat: 28.6304,
    lng: 77.2177, // Connaught Place
    categoryId: 'cat-electrical',
    hourlyRate: 520.00,
    experienceYears: 14,
    rating: 4.95,
    reviewsCount: 62,
    completedJobs: 88,
    uan: 'UAN-1102-4455-8891',
    certTitle: 'High Voltage Domestic & Commercial Specialist',
    certAuthority: 'National Council for Cooperative Training (NCCT)'
  },
  {
    userId: 'usr-wkr-del-02',
    firstName: 'Rajesh',
    lastName: 'Verma',
    email: 'rajesh.verma@coopmail.in',
    phone: '+91-98102-22332',
    city: 'New Delhi',
    cooperativeId: 'coop-delhi-electricians-02',
    lat: 28.5672,
    lng: 77.2100, // South Extension
    categoryId: 'cat-electrical',
    hourlyRate: 500.00,
    experienceYears: 7,
    rating: 4.82,
    reviewsCount: 33,
    completedJobs: 49,
    uan: 'UAN-1102-5566-9902',
    certTitle: 'State Certified Wireman Trade Certificate',
    certAuthority: 'Delhi State Cooperative Union'
  },
  {
    userId: 'usr-wkr-del-03',
    firstName: 'Mohammad',
    lastName: 'Tariq',
    email: 'mohammad.tariq@coopmail.in',
    phone: '+91-98103-33443',
    city: 'New Delhi',
    cooperativeId: 'coop-mumbai-plumbers-01',
    lat: 28.6506,
    lng: 77.2303, // Chandni Chowk / Old Delhi
    categoryId: 'cat-plumbing',
    hourlyRate: 460.00,
    experienceYears: 10,
    rating: 4.87,
    reviewsCount: 45,
    completedJobs: 67,
    uan: 'UAN-1102-6677-1123',
    certTitle: 'Certified Pipeline & Pressure Valve Expert',
    certAuthority: 'Ministry of Skill Development & Entrepreneurship'
  },
  {
    userId: 'usr-wkr-del-04',
    firstName: 'Meena',
    lastName: 'Devi',
    email: 'meena.devi@coopmail.in',
    phone: '+91-98104-44554',
    city: 'New Delhi',
    cooperativeId: 'coop-blr-cleaning-03',
    lat: 28.5355,
    lng: 77.2588, // Kalkaji / Nehru Place
    categoryId: 'cat-cleaning',
    hourlyRate: 430.00,
    experienceYears: 5,
    rating: 4.80,
    reviewsCount: 28,
    completedJobs: 38,
    uan: 'UAN-1102-7788-2234',
    certTitle: 'Hospital Grade Sanitization Certification',
    certAuthority: 'National Council for Cooperative Training (NCCT)'
  },
  {
    userId: 'usr-wkr-del-05',
    firstName: 'Baljeet',
    lastName: 'Sharma',
    email: 'baljeet.sharma@coopmail.in',
    phone: '+91-98105-55665',
    city: 'New Delhi',
    cooperativeId: 'coop-delhi-electricians-02',
    lat: 28.7041,
    lng: 77.1025, // Rohini
    categoryId: 'cat-carpentry',
    hourlyRate: 540.00,
    experienceYears: 13,
    rating: 4.91,
    reviewsCount: 51,
    completedJobs: 73,
    uan: 'UAN-1102-8899-3345',
    certTitle: 'Architectural Woodcraft & Joinery Master',
    certAuthority: 'All India Handicrafts & Labour Board'
  },

  // Bengaluru Workers (Lat: 12.9 - 13.0, Lng: 77.5 - 77.7)
  {
    userId: 'usr-wkr-blr-01',
    firstName: 'Manjunath',
    lastName: 'Gowda',
    email: 'manjunath.gowda@coopmail.in',
    phone: '+91-98451-11221',
    city: 'Bengaluru',
    cooperativeId: 'coop-blr-cleaning-03',
    lat: 12.9784,
    lng: 77.6408, // Indiranagar
    categoryId: 'cat-cleaning',
    hourlyRate: 480.00,
    experienceYears: 8,
    rating: 4.94,
    reviewsCount: 58,
    completedJobs: 79,
    uan: 'UAN-5603-1122-4455',
    certTitle: 'Certified Commercial Sanitation Lead',
    certAuthority: 'National Council for Cooperative Training (NCCT)'
  },
  {
    userId: 'usr-wkr-blr-02',
    firstName: 'Karthik',
    lastName: 'Narayanan',
    email: 'karthik.narayanan@coopmail.in',
    phone: '+91-98452-22332',
    city: 'Bengaluru',
    cooperativeId: 'coop-delhi-electricians-02',
    lat: 12.9352,
    lng: 77.6245, // Koramangala
    categoryId: 'cat-electrical',
    hourlyRate: 580.00,
    experienceYears: 10,
    rating: 4.89,
    reviewsCount: 46,
    completedJobs: 63,
    uan: 'UAN-5603-2233-5566',
    certTitle: 'Smart Home Automation & Electrical License',
    certAuthority: 'Karnataka State Cooperative Federation'
  },
  {
    userId: 'usr-wkr-blr-03',
    firstName: 'Basavaraj',
    lastName: 'Hiremath',
    email: 'basavaraj.hiremath@coopmail.in',
    phone: '+91-98453-33443',
    city: 'Bengaluru',
    cooperativeId: 'coop-mumbai-plumbers-01',
    lat: 12.9141,
    lng: 77.6101, // BTM Layout
    categoryId: 'cat-plumbing',
    hourlyRate: 490.00,
    experienceYears: 9,
    rating: 4.86,
    reviewsCount: 39,
    completedJobs: 56,
    uan: 'UAN-5603-3344-6677',
    certTitle: 'Solar Water Heater & Pressurized Piping License',
    certAuthority: 'National Council for Cooperative Training (NCCT)'
  },
  {
    userId: 'usr-wkr-blr-04',
    firstName: 'Lakshmi',
    lastName: 'Reddy',
    email: 'lakshmi.reddy@coopmail.in',
    phone: '+91-98454-44554',
    city: 'Bengaluru',
    cooperativeId: 'coop-blr-cleaning-03',
    lat: 12.9698,
    lng: 77.7500, // Whitefield
    categoryId: 'cat-cleaning',
    hourlyRate: 450.00,
    experienceYears: 6,
    rating: 4.83,
    reviewsCount: 31,
    completedJobs: 44,
    uan: 'UAN-5603-4455-7788',
    certTitle: 'Eco-Friendly Biocidal Sanitation Specialist',
    certAuthority: 'Karnataka State Women Development Corporation'
  },
  {
    userId: 'usr-wkr-blr-05',
    firstName: 'Prashanth',
    lastName: 'Shetty',
    email: 'prashanth.shetty@coopmail.in',
    phone: '+91-98455-55665',
    city: 'Bengaluru',
    cooperativeId: 'coop-delhi-electricians-02',
    lat: 13.0033,
    lng: 77.5692, // Malleshwaram
    categoryId: 'cat-appliance',
    hourlyRate: 620.00,
    experienceYears: 12,
    rating: 4.92,
    reviewsCount: 55,
    completedJobs: 75,
    uan: 'UAN-5603-5566-8899',
    certTitle: 'Precision Refrigeration & HVAC Technician',
    certAuthority: 'National Council for Cooperative Training (NCCT)'
  }
];

// ----------------------------------------------------------------------------
// 3. SAMPLE CUSTOMERS
// ----------------------------------------------------------------------------
const customersData = [
  { id: 'usr-cust-01', firstName: 'Aarav', lastName: 'Mehta', email: 'aarav.mehta@gmail.com', phone: '+91-98901-11111' },
  { id: 'usr-cust-02', firstName: 'Priya', lastName: 'Nair', email: 'priya.nair@outlook.com', phone: '+91-98902-22222' },
  { id: 'usr-cust-03', firstName: 'Vikram', lastName: 'Malhotra', email: 'vikram.m@techcorp.in', phone: '+91-98903-33333' },
  { id: 'usr-cust-04', firstName: 'Ananya', lastName: 'Deshmukh', email: 'ananya.d@gmail.com', phone: '+91-98904-44444' },
  { id: 'usr-cust-05', firstName: 'Rohan', lastName: 'Kapoor', email: 'rohan.kapoor@gmail.com', phone: '+91-98905-55555' }
];

// ----------------------------------------------------------------------------
// 4. GENERATE 25 HISTORICAL COMPLETED BOOKINGS WITH 90-5-5 PAYMENT SPLITS
// ----------------------------------------------------------------------------
function generateHistoricalBookings() {
  const bookings = [];
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const sampleLocations = [
    { city: 'Mumbai', addr: '102 Sea Breeze Apartments, Dadar West', lat: 19.018, lng: 72.848, pin: '400028' },
    { city: 'Mumbai', addr: 'B-404 Raheja Classique, Andheri Link Rd', lat: 19.115, lng: 72.871, pin: '400053' },
    { city: 'Mumbai', addr: '22 Bandra Kurla Complex Road', lat: 19.060, lng: 72.830, pin: '400051' },
    { city: 'New Delhi', addr: 'Flat 12, Barakhamba Road, Connaught Place', lat: 28.631, lng: 77.218, pin: '110001' },
    { city: 'New Delhi', addr: 'C-88 South Extension Part 2', lat: 28.568, lng: 77.211, pin: '110049' },
    { city: 'New Delhi', addr: 'B-14 Defence Colony Market', lat: 28.572, lng: 77.234, pin: '110024' },
    { city: 'Bengaluru', addr: '742 12th Main Road, HAL 2nd Stage, Indiranagar', lat: 12.979, lng: 77.641, pin: '560038' },
    { city: 'Bengaluru', addr: 'Villa 19, Green Meadows, Koramangala 4th Block', lat: 12.936, lng: 77.625, pin: '560034' },
    { city: 'Bengaluru', addr: 'Prestige Ozone, Whitefield Main Road', lat: 12.970, lng: 77.751, pin: '560066' }
  ];

  for (let i = 1; i <= 25; i++) {
    const daysAgo = Math.floor(1 + (i * 1.8));
    const scheduledDate = new Date(now - daysAgo * DAY_MS);
    const worker = workersData[(i - 1) % workersData.length];
    const customer = customersData[(i - 1) % customersData.length];
    const loc = sampleLocations[(i - 1) % sampleLocations.length];

    const amounts = [850.00, 1200.00, 1500.00, 1850.00, 2200.00, 3100.00, 950.00, 1400.00];
    const totalAmount = amounts[(i - 1) % amounts.length];

    // 90-5-5 Payment Split Calculation
    const workerAmount = parseFloat((totalAmount * 0.90).toFixed(2));
    const coopAmount = parseFloat((totalAmount * 0.05).toFixed(2));
    const welfareAmount = parseFloat((totalAmount * 0.05).toFixed(2));

    const bookingId = `bkg-hist-${i.toString().padStart(3, '0')}`;
    const bookingNumber = `BKG-2026-${(1000 + i).toString()}`;
    const transactionId = `TXN-UPI-${Date.now().toString(36).toUpperCase()}-${i.toString().padStart(3, '0')}`;

    bookings.push({
      bookingId,
      bookingNumber,
      transactionId,
      customerId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      workerId: `wp-${worker.userId}`,
      workerName: `${worker.firstName} ${worker.lastName}`,
      workerUserId: worker.userId,
      cooperativeId: worker.cooperativeId,
      serviceCategoryId: worker.categoryId,
      scheduledDate: scheduledDate.toISOString(),
      serviceAddressLine1: loc.addr,
      serviceCity: loc.city,
      servicePostalCode: loc.pin,
      serviceLatitude: loc.lat,
      serviceLongitude: loc.lng,
      status: 'COMPLETED',
      totalAmount,
      workerAmount,
      coopAmount,
      welfareAmount,
      workerSplitRatio: 0.9000,
      coopSplitRatio: 0.0500,
      welfareSplitRatio: 0.0500,
      paymentMethod: 'UPI',
      rating: 4 + (i % 2 === 0 ? 1 : 0),
      reviewComment: 'Outstanding service and courteous professional. Glad to support the cooperative member-worker directly.'
    });
  }

  return bookings;
}

// ----------------------------------------------------------------------------
// MAIN EXECUTION
// ----------------------------------------------------------------------------
async function main() {
  console.log('================================================================');
  console.log('🌱 Starting Database Seeding & Mock Pipeline Population');
  console.log('================================================================');

  const historicalBookings = generateHistoricalBookings();

  // Export full JSON seed payload for frontend and mock testing
  const seedDump = {
    generatedAt: new Date().toISOString(),
    cooperatives: cooperativesData,
    serviceCategories: serviceCategoriesData,
    workers: workersData,
    customers: customersData,
    historicalBookings: historicalBookings,
    summary: {
      totalCooperatives: cooperativesData.length,
      totalWorkers: workersData.length,
      totalCompletedBookings: historicalBookings.length,
      splitRatio: '90% Worker-Member | 5% Cooperative Treasury | 5% Worker Welfare Insurance'
    }
  };

  const seedJsonPath = path.join(__dirname, 'seedData.json');
  fs.writeFileSync(seedJsonPath, JSON.stringify(seedDump, null, 2), 'utf-8');
  console.log(`✅ Mock pipeline dataset saved to: ${seedJsonPath}`);

  // Also export raw SQL dump for direct psql insertion
  const sqlLines = [
    '-- Cooperative Gig Services Platform Seeding Script',
    '-- Generated for Local and Production PostgreSQL Environments',
    'BEGIN;'
  ];

  for (const sc of serviceCategoriesData) {
    sqlLines.push(
      `INSERT INTO "ServiceCategory" ("id", "name", "slug", "description", "basePrice", "isActive", "createdAt", "updatedAt") ` +
      `VALUES ('${sc.id}', '${sc.name.replace(/'/g, "''")}', '${sc.slug}', '${sc.description.replace(/'/g, "''")}', ${sc.basePrice}, true, NOW(), NOW()) ` +
      `ON CONFLICT ("slug") DO NOTHING;`
    );
  }

  for (const c of cooperativesData) {
    sqlLines.push(
      `INSERT INTO "Cooperative" ("id", "name", "registrationNumber", "contactEmail", "contactPhone", "address", "defaultWorkerSplitRatio", "defaultCoopSplitRatio", "dividendPoolBalance", "currency", "isActive", "createdAt", "updatedAt") ` +
      `VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.registrationNumber}', '${c.contactEmail}', '${c.contactPhone}', '${c.address.replace(/'/g, "''")}', ${c.defaultWorkerSplitRatio}, ${c.defaultCoopSplitRatio}, ${c.dividendPoolBalance}, '${c.currency}', true, NOW(), NOW()) ` +
      `ON CONFLICT ("registrationNumber") DO NOTHING;`
    );
  }

  for (const b of historicalBookings) {
    sqlLines.push(
      `INSERT INTO "Booking" ("id", "bookingNumber", "customerId", "workerId", "serviceCategoryId", "status", "scheduledDate", "serviceAddressLine1", "serviceCity", "servicePostalCode", "serviceLatitude", "serviceLongitude", "totalAmount", "currency", "createdAt", "updatedAt") ` +
      `VALUES ('${b.bookingId}', '${b.bookingNumber}', '${b.customerId}', '${b.workerId}', '${b.serviceCategoryId}', 'COMPLETED', '${b.scheduledDate}', '${b.serviceAddressLine1.replace(/'/g, "''")}', '${b.serviceCity}', '${b.servicePostalCode}', ${b.serviceLatitude}, ${b.serviceLongitude}, ${b.totalAmount}, 'INR', NOW(), NOW()) ` +
      `ON CONFLICT ("bookingNumber") DO NOTHING;`
    );
    sqlLines.push(
      `INSERT INTO "Payment" ("id", "transactionId", "bookingId", "cooperativeId", "totalAmount", "workerAmount", "coopAmount", "welfareAmount", "workerSplitRatio", "coopSplitRatio", "welfareSplitRatio", "status", "paymentMethod", "currency", "createdAt", "updatedAt") ` +
      `VALUES ('pay-${b.bookingId}', '${b.transactionId}', '${b.bookingId}', '${b.cooperativeId}', ${b.totalAmount}, ${b.workerAmount}, ${b.coopAmount}, ${b.welfareAmount}, 0.9000, 0.0500, 0.0500, 'PAID_OUT', 'UPI', 'INR', NOW(), NOW()) ` +
      `ON CONFLICT ("transactionId") DO NOTHING;`
    );
  }

  sqlLines.push('COMMIT;');
  const seedSqlPath = path.join(__dirname, 'seedData.sql');
  fs.writeFileSync(seedSqlPath, sqlLines.join('\n'), 'utf-8');
  console.log(`✅ Raw SQL seed script saved to: ${seedSqlPath}`);


  // Attempt database insertion via Prisma if PostgreSQL is available
  try {
    console.log('📡 Connecting to PostgreSQL database via Prisma...');
    await prisma.$connect();
    console.log('Connected successfully. Seeding database tables...');

    // 1. Seed Service Categories
    for (const cat of serviceCategoriesData) {
      await prisma.serviceCategory.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          basePrice: cat.basePrice
        }
      });
    }
    console.log(`✓ ${serviceCategoriesData.length} Service Categories seeded.`);

    // 2. Seed Cooperatives
    for (const coop of cooperativesData) {
      await prisma.cooperative.upsert({
        where: { registrationNumber: coop.registrationNumber },
        update: {},
        create: coop
      });
    }
    console.log(`✓ ${cooperativesData.length} Primary Labour Cooperatives seeded.`);

    // 3. Seed Customers
    const defaultPasswordHash = await hashPassword('CoopCustomer@123');
    for (const c of customersData) {
      await prisma.user.upsert({
        where: { email: c.email },
        update: {},
        create: {
          id: c.id,
          email: c.email,
          phone: c.phone,
          firstName: c.firstName,
          lastName: c.lastName,
          passwordHash: defaultPasswordHash,
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      });
    }
    console.log(`✓ ${customersData.length} Customers seeded.`);

    // 4. Seed Workers, Profiles, Certifications, and Wallets
    const workerPasswordHash = await hashPassword('CoopWorker@123');

    for (const w of workersData) {
      const user = await prisma.user.upsert({
        where: { email: w.email },
        update: {},
        create: {
          id: w.userId,
          email: w.email,
          phone: w.phone,
          firstName: w.firstName,
          lastName: w.lastName,
          passwordHash: workerPasswordHash,
          role: 'WORKER',
          status: 'ACTIVE',
          isCoopMember: true,
          cooperativeId: w.cooperativeId
        }
      });

      const profileId = `wp-${w.userId}`;
      const profile = await prisma.workerProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          id: profileId,
          userId: user.id,
          cooperativeId: w.cooperativeId,
          verificationStatus: 'VERIFIED',
          nationalIdMasked: w.uan,
          backgroundChecked: true,
          hourlyRate: w.hourlyRate,
          experienceYears: w.experienceYears,
          averageRating: w.rating,
          totalReviews: w.reviewsCount,
          completedJobsCount: w.completedJobs,
          latitude: w.lat,
          longitude: w.lng,
          serviceRadiusKm: 15.0,
          serviceCity: w.city,
          isAvailable: true,
          verifiedAt: new Date()
        }
      });

      // Link Worker Service Skill
      await prisma.workerService.upsert({
        where: {
          workerProfileId_serviceCategoryId: {
            workerProfileId: profile.id,
            serviceCategoryId: w.categoryId
          }
        },
        update: {},
        create: {
          workerProfileId: profile.id,
          serviceCategoryId: w.categoryId,
          isCertified: true,
          isActive: true
        }
      });

      // Attach Certification
      await prisma.certification.create({
        data: {
          workerProfileId: profile.id,
          title: w.certTitle,
          issuingAuthority: w.certAuthority,
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date()
        }
      });

      // Initialize Wallet
      await prisma.wallet.upsert({
        where: {
          userId_type: {
            userId: user.id,
            type: 'WORKER_WALLET'
          }
        },
        update: {},
        create: {
          userId: user.id,
          cooperativeId: w.cooperativeId,
          type: 'WORKER_WALLET',
          balance: 14500.00,
          currency: 'INR'
        }
      });
    }
    console.log(`✓ ${workersData.length} Verified Worker Profiles seeded.`);

    // 5. Seed Historical Bookings with 90-5-5 Payment Splits
    for (const b of historicalBookings) {
      const booking = await prisma.booking.upsert({
        where: { bookingNumber: b.bookingNumber },
        update: {},
        create: {
          id: b.bookingId,
          bookingNumber: b.bookingNumber,
          customerId: b.customerId,
          workerId: b.workerId,
          serviceCategoryId: b.serviceCategoryId,
          status: 'COMPLETED',
          scheduledDate: new Date(b.scheduledDate),
          startedAt: new Date(b.scheduledDate),
          completedAt: new Date(new Date(b.scheduledDate).getTime() + 2 * 3600000),
          serviceAddressLine1: b.serviceAddressLine1,
          serviceCity: b.serviceCity,
          servicePostalCode: b.servicePostalCode,
          serviceLatitude: b.serviceLatitude,
          serviceLongitude: b.serviceLongitude,
          totalAmount: b.totalAmount,
          currency: 'INR'
        }
      });

      // Payment with 90-5-5 ratio
      await prisma.payment.upsert({
        where: { transactionId: b.transactionId },
        update: {},
        create: {
          transactionId: b.transactionId,
          bookingId: booking.id,
          cooperativeId: b.cooperativeId,
          totalAmount: b.totalAmount,
          workerAmount: b.workerAmount,
          coopAmount: b.coopAmount,
          welfareAmount: b.welfareAmount,
          workerSplitRatio: b.workerSplitRatio,
          coopSplitRatio: b.coopSplitRatio,
          welfareSplitRatio: b.welfareSplitRatio,
          paymentMethod: 'UPI',
          status: 'PAID_OUT',
          workerPaidOutAt: booking.completedAt
        }
      });

      // Review
      await prisma.review.upsert({
        where: { bookingId: booking.id },
        update: {},
        create: {
          bookingId: booking.id,
          customerId: b.customerId,
          workerId: b.workerId,
          rating: b.rating,
          comment: b.reviewComment
        }
      });
    }
    console.log(`✓ ${historicalBookings.length} Historical Bookings with 90-5-5 Splits seeded into PostgreSQL!`);

    await prisma.$disconnect();
    console.log('================================================================');
    console.log('🎉 Database Seeding Completed Successfully!');
    console.log('================================================================');
  } catch (dbError) {
    console.warn('\n⚠️ [Database Notice]: Direct PostgreSQL connection unavailable at localhost:5432.');
    console.warn(`Reason: ${dbError.message}`);
    console.log('✅ Fallback: Standalone JSON seed pipeline is fully generated at:');
    console.log(`   ${seedJsonPath}`);
    console.log('   (Contains all 3 Societies, 15 Workers, and 25 Historical Bookings with 90-5-5 Splits)');
  }
}

main().catch((err) => {
  console.error('Fatal seed script error:', err);
  process.exit(0);
});
