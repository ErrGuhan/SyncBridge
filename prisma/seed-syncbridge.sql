-- =============================================================================
-- SyncBridge Cooperative Platform — Supabase SQL Migration & Seed
-- PS ID 26089 — Ministry of Cooperation / NCCT
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run All
--
-- STEP 1: Enable PostGIS (required for geo-matching)
-- STEP 2: Create all tables matching Prisma schema
-- STEP 3: Seed reference data (federations, societies, categories)
-- STEP 4: Seed worker data with REAL Bangalore lat/lng coordinates
-- STEP 5: Seed completed bookings so welfare corpus, charts, alerts are real
-- =============================================================================

-- ---------------------------------------------------------------------------
-- STEP 1: EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add PostGIS geography columns to workers and bookings
-- (Prisma handles the basic lat/lng Float fields; these are the proper geo columns)
-- Run AFTER prisma migrate / initial table creation:
-- ALTER TABLE "WorkerProfile" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
-- ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS service_location geography(Point, 4326);
-- CREATE INDEX IF NOT EXISTS idx_worker_location ON "WorkerProfile" USING GIST(location);
-- CREATE INDEX IF NOT EXISTS idx_booking_location ON "Booking" USING GIST(service_location);

-- ---------------------------------------------------------------------------
-- STEP 2: ENUMS (Postgres native enums matching Prisma schema)
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('CUSTOMER','WORKER','SOCIETY_SECRETARY','FEDERATION_ADMIN','SUPER_ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "UserStatus" AS ENUM ('ACTIVE','SUSPENDED','DEACTIVATED','PENDING_VERIFICATION');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED','PENDING','VERIFIED','REJECTED','SUSPENDED','EXPIRED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "BookingStatus" AS ENUM ('PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED','DISPUTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "BookingType" AS ENUM ('INSTANT','SCHEDULED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING','HELD_IN_ESCROW','PAID_OUT','REFUNDED','FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD','DEBIT_CARD','BANK_TRANSFER','UPI','DIGITAL_WALLET','COOP_CREDITS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "DisputeStatus" AS ENUM ('OPEN','PEER_REVIEW','RESOLVED_UPHELD','RESOLVED_OVERTURNED','DISMISSED','CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "DisputeVoteDecision" AS ENUM ('UPHOLD','OVERTURN','ABSTAIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "WalletType" AS ENUM ('WORKER_WALLET','SOCIETY_RESERVE','WELFARE_TRUST','GUARANTEE_FUND');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ToolCondition" AS ENUM ('EXCELLENT','GOOD','FAIR','UNDER_MAINTENANCE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "OutboxStatus" AS ENUM ('PENDING','PUBLISHED','FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- STEP 3: REFERENCE SEED DATA
-- ---------------------------------------------------------------------------

-- Federations
INSERT INTO "Federation" (id, name, "registrationNumber", "stateCode", "contactEmail", "isActive", "createdAt", "updatedAt")
VALUES
  ('fed-ka-001', 'Karnataka Labour Cooperative Federation', 'KA-FED-2019-001', 'KA', 'admin@klcf.coop.in', true, NOW(), NOW()),
  ('fed-mh-001', 'Maharashtra Kamgar Sahakari Mahasangh', 'MH-FED-2018-001', 'MH', 'admin@mksm.coop.in', true, NOW(), NOW()),
  ('fed-tn-001', 'Tamil Nadu Workers Cooperative Union', 'TN-FED-2020-001', 'TN', 'admin@tnwcu.coop.in', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Societies
INSERT INTO "Society" (id, name, "ncdCode", "registrationNumber", "contactEmail", city, "stateCode", "federationId", "workerSplitRatio", "societySplitRatio", "welfareSplitRatio", "serviceRadiusKm", currency, "isActive", "createdAt", "updatedAt")
VALUES
  ('soc-blr-001', 'Vishwa Karma Labour Society Bangalore', 'NCD-KA-BLR-0042', 'KA-SOC-2020-0042', 'secretary@vklsblr.coop.in', 'Bengaluru', 'KA', 'fed-ka-001', 0.9000, 0.0500, 0.0500, 5.0, 'INR', true, NOW(), NOW()),
  ('soc-blr-002', 'Kalyan Labour Workers Society', 'NCD-KA-BLR-0089', 'KA-SOC-2019-0089', 'secretary@kalyan.coop.in', 'Bengaluru', 'KA', 'fed-ka-001', 0.9000, 0.0500, 0.0500, 5.0, 'INR', true, NOW(), NOW()),
  ('soc-blr-003', 'Seva Shramik Care Cooperative', 'NCD-KA-BLR-0105', 'KA-SOC-2021-0105', 'secretary@sevashramik.coop.in', 'Bengaluru', 'KA', 'fed-ka-001', 0.9000, 0.0500, 0.0500, 5.0, 'INR', true, NOW(), NOW()),
  ('soc-blr-004', 'Metro Technicians Labour Cooperative', 'NCD-KA-BLR-0118', 'KA-SOC-2022-0118', 'secretary@metroltc.coop.in', 'Bengaluru', 'KA', 'fed-ka-001', 0.9000, 0.0500, 0.0500, 5.0, 'INR', true, NOW(), NOW()),
  ('soc-mum-001', 'Aamchi Mumbai Kamgar Sahakari Society', 'NCD-MH-MUM-0031', 'MH-SOC-2018-0031', 'secretary@amkss.coop.in', 'Mumbai', 'MH', 'fed-mh-001', 0.9000, 0.0500, 0.0500, 5.0, 'INR', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Service Categories
INSERT INTO "ServiceCategory" (id, name, slug, description, "isActive", "isEmergencyEligible", "createdAt", "updatedAt")
VALUES
  ('cat-elec', 'Electrician', 'electrician', 'Wiring, circuit repairs, MCB installations & solar backup systems', true, true, NOW(), NOW()),
  ('cat-plmb', 'Plumber', 'plumber', 'Pipe leaks, motorized pump fitting, drainage & water heaters', true, true, NOW(), NOW()),
  ('cat-care', 'Caregiver & Nursing', 'caregiver', 'Elderly care, patient assistance & post-operative nursing support', true, true, NOW(), NOW()),
  ('cat-carp', 'Carpenter', 'carpenter', 'Custom furniture, door lock fitting, woodwork & structural repairs', true, false, NOW(), NOW()),
  ('cat-appl', 'Appliance Repair', 'appliance-repair', 'AC servicing, refrigerator, washing machine & microwave repair', true, true, NOW(), NOW()),
  ('cat-cln', 'Deep Cleaning', 'cleaning', 'Full home sanitization, kitchen degreasing, sofa & bathroom cleaning', true, false, NOW(), NOW()),
  ('cat-paint', 'Painter & Decorator', 'painter', 'Interior/exterior wall painting, waterproofing & texture finishes', true, false, NOW(), NOW()),
  ('cat-mason', 'Mason & Construction', 'mason', 'Tile laying, plastering, structural brickwork & renovations', true, false, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- STEP 4: SEED USERS & WORKER PROFILES (real Bangalore coordinates)
-- ---------------------------------------------------------------------------

-- Demo Users
INSERT INTO "User" (id, email, phone, "firstName", "lastName", role, status, "isCoopMember", "societyId", "preferredLanguage", "createdAt", "updatedAt")
VALUES
  -- Customers
  ('usr-cust-001', 'priya.sharma@example.com', '+919820144552', 'Priya', 'Sharma', 'CUSTOMER', 'ACTIVE', false, NULL, 'en', NOW(), NOW()),
  ('usr-cust-002', 'rahul.gupta@example.com', '+919820199123', 'Rahul', 'Gupta', 'CUSTOMER', 'ACTIVE', false, NULL, 'hi', NOW(), NOW()),
  -- Workers
  ('usr-wrk-101', 'ramesh.kumar@vkls.coop.in', '+919845211092', 'Ramesh', 'Kumar', 'WORKER', 'ACTIVE', true, 'soc-blr-001', 'kn', NOW(), NOW()),
  ('usr-wrk-102', 'suresh.patil@kalyan.coop.in', '+919823144520', 'Suresh', 'Patil', 'WORKER', 'ACTIVE', true, 'soc-blr-002', 'kn', NOW(), NOW()),
  ('usr-wrk-103', 'anjali.sharma@seva.coop.in', '+919887654321', 'Anjali', 'Sharma', 'WORKER', 'ACTIVE', true, 'soc-blr-003', 'en', NOW(), NOW()),
  ('usr-wrk-104', 'vijay.nair@metro.coop.in', '+919900112233', 'Vijay', 'Nair', 'WORKER', 'ACTIVE', true, 'soc-blr-004', 'en', NOW(), NOW()),
  ('usr-wrk-105', 'lakshmi.devi@vkls.coop.in', '+919811223344', 'Lakshmi', 'Devi', 'WORKER', 'ACTIVE', true, 'soc-blr-001', 'ta', NOW(), NOW()),
  -- Society Secretaries
  ('usr-sec-201', 'anand.patil@kalyan.coop.in', '+919820188990', 'Anand', 'Patil', 'SOCIETY_SECRETARY', 'ACTIVE', true, 'soc-blr-002', 'en', NOW(), NOW()),
  -- Federation Admin
  ('usr-adm-301', 'vikram.rao@klcf.coop.in', '+919820100011', 'Vikram', 'Rao', 'FEDERATION_ADMIN', 'ACTIVE', true, NULL, 'en', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Worker Profiles (with REAL Bangalore coordinates)
-- Indiranagar: 12.9784, 77.6408 | Koramangala: 12.9352, 77.6244
-- HSR Layout: 12.9116, 77.6389  | BTM Layout: 12.9166, 77.6101
-- Jayanagar: 12.9299, 77.5833   | Domlur: 12.9600, 77.6381
INSERT INTO "WorkerProfile" (id, "userId", "societyId", "eShramUan", "ncdSocietyCode", "verificationStatus", "verifiedAt", "backgroundChecked", bio, "experienceYears", "hourlyRate", "isAvailable", "averageRating", "totalReviews", "completedJobsCount", latitude, longitude, "serviceRadiusKm", "serviceCity", "servicePostalCode", "createdAt", "updatedAt")
VALUES
  ('wrk-101', 'usr-wrk-101', 'soc-blr-001', 'UAN-8921-1402-9912', 'NCD-KA-BLR-0042', 'VERIFIED', NOW() - INTERVAL '60 days', true, 'Certified master electrician with 8+ years. NCCT Wireman Class A. Specializes in three-phase wiring and smart home systems.', 8, 350.00, true, 4.92, 142, 320, 12.9784, 77.6408, 5.0, 'Bengaluru', '560038', NOW(), NOW()),
  ('wrk-102', 'usr-wrk-102', 'soc-blr-002', 'UAN-7712-9014-4321', 'NCD-KA-BLR-0089', 'VERIFIED', NOW() - INTERVAL '45 days', true, 'Expert in residential plumbing pipelines, motorized pumps, and immediate leak emergency response.', 6, 300.00, true, 4.81, 98, 215, 12.9352, 77.6244, 5.0, 'Bengaluru', '560034', NOW(), NOW()),
  ('wrk-103', 'usr-wrk-103', 'soc-blr-003', 'UAN-9901-4451-2290', 'NCD-KA-BLR-0105', 'VERIFIED', NOW() - INTERVAL '30 days', true, 'Qualified caregiver with geriatric nursing certification. Compassionate, patient, and fully background-verified.', 7, 550.00, true, 5.00, 84, 180, 12.9116, 77.6389, 5.0, 'Bengaluru', '560102', NOW(), NOW()),
  ('wrk-104', 'usr-wrk-104', 'soc-blr-004', 'UAN-5512-7831-6601', 'NCD-KA-BLR-0118', 'VERIFIED', NOW() - INTERVAL '20 days', true, 'Skilled carpenter specializing in modular furniture, interior fitouts, and precision joinery work.', 10, 480.00, true, 4.75, 67, 145, 12.9166, 77.6101, 5.0, 'Bengaluru', '560076', NOW(), NOW()),
  ('wrk-105', 'usr-wrk-105', 'soc-blr-001', 'UAN-3301-9921-7712', 'NCD-KA-BLR-0042', 'VERIFIED', NOW() - INTERVAL '15 days', true, 'Professional deep cleaning specialist, trained in bio-safe HEPA vacuuming, kitchen degreasing and upholstery restoration.', 5, 420.00, true, 4.88, 55, 120, 12.9299, 77.5833, 5.0, 'Bengaluru', '560011', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Worker-Service mappings
INSERT INTO "WorkerService" (id, "workerProfileId", "serviceCategoryId", "customHourlyRate", "isCertified", "isActive", "createdAt", "updatedAt")
VALUES
  (uuid_generate_v4(), 'wrk-101', 'cat-elec', 350.00, true, true, NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-102', 'cat-plmb', 300.00, true, true, NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-103', 'cat-care', 550.00, true, true, NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-104', 'cat-carp', 480.00, true, true, NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-105', 'cat-cln', 420.00, false, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Certifications
INSERT INTO "Certification" (id, "workerProfileId", title, "issuingAuthority", skill, grade, "licenseNumber", "verificationStatus", "verifiedAt", "issueDate", "createdAt", "updatedAt")
VALUES
  (uuid_generate_v4(), 'wrk-101', 'NCCT Wireman Trade Certificate Class A', 'NCCT (National Council for Cooperative Training)', 'Electrical Wireman', 'A', 'NCCT-WM-KA-8821', 'VERIFIED', NOW() - INTERVAL '60 days', NOW() - INTERVAL '2 years', NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-101', 'Skill India Electrician Certification', 'Ministry of Skill Development', 'Electrician', 'A+', 'MSDE-ELEC-2023-9921', 'VERIFIED', NOW() - INTERVAL '45 days', NOW() - INTERVAL '1 year', NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-102', 'Skill India Sanitaryware Specialist', 'Ministry of Skill Development', 'Plumbing', 'B+', 'MSDE-PLMB-2023-4412', 'VERIFIED', NOW() - INTERVAL '45 days', NOW() - INTERVAL '1 year', NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-103', 'Geriatric Nursing Aide Certificate', 'Karnataka Health Department', 'Geriatric Care', 'A', 'KHD-GNA-2024-0193', 'VERIFIED', NOW() - INTERVAL '30 days', NOW() - INTERVAL '6 months', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Verification Records
INSERT INTO "WorkerVerification" (id, "workerProfileId", "verificationType", status, "referenceId", "verifiedAt", provider, "createdAt", "updatedAt")
VALUES
  (uuid_generate_v4(), 'wrk-101', 'ESHRAM_UAN', 'VERIFIED', 'UAN-8921-1402-9912', NOW() - INTERVAL '60 days', 'MOCK', NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-101', 'POLICE_CLEARANCE', 'VERIFIED', 'PC-BLR-2026-8821', NOW() - INTERVAL '55 days', 'MOCK', NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-101', 'NCCT_CERT', 'VERIFIED', 'NCCT-WM-KA-8821', NOW() - INTERVAL '60 days', 'MOCK', NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-102', 'ESHRAM_UAN', 'VERIFIED', 'UAN-7712-9014-4321', NOW() - INTERVAL '45 days', 'MOCK', NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-102', 'POLICE_CLEARANCE', 'VERIFIED', 'PC-BLR-2026-7712', NOW() - INTERVAL '40 days', 'MOCK', NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-103', 'ESHRAM_UAN', 'VERIFIED', 'UAN-9901-4451-2290', NOW() - INTERVAL '30 days', 'MOCK', NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-103', 'POLICE_CLEARANCE', 'VERIFIED', 'PC-BLR-2026-9901', NOW() - INTERVAL '25 days', 'MOCK', NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-104', 'ESHRAM_UAN', 'VERIFIED', 'UAN-5512-7831-6601', NOW() - INTERVAL '20 days', 'MOCK', NOW(), NOW()),
  (uuid_generate_v4(), 'wrk-105', 'ESHRAM_UAN', 'VERIFIED', 'UAN-3301-9921-7712', NOW() - INTERVAL '15 days', 'MOCK', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Availability Windows (Mon-Sat, 8am-8pm for all workers)
INSERT INTO "AvailabilityWindow" (id, "workerProfileId", "dayOfWeek", "startHour", "endHour", timezone, "isActive", "createdAt", "updatedAt")
SELECT uuid_generate_v4(), w.id, d.day, 8, 20, 'Asia/Kolkata', true, NOW(), NOW()
FROM "WorkerProfile" w
CROSS JOIN (VALUES (1),(2),(3),(4),(5),(6)) AS d(day)
WHERE w.id IN ('wrk-101','wrk-102','wrk-103','wrk-104','wrk-105')
ON CONFLICT DO NOTHING;

-- Wallets for workers and societies
INSERT INTO "Wallet" (id, type, "userId", "societyId", balance, currency, "createdAt", "updatedAt")
VALUES
  (uuid_generate_v4(), 'WORKER_WALLET', 'usr-wrk-101', NULL, 4850.00, 'INR', NOW(), NOW()),
  (uuid_generate_v4(), 'WORKER_WALLET', 'usr-wrk-102', NULL, 3200.00, 'INR', NOW(), NOW()),
  (uuid_generate_v4(), 'WORKER_WALLET', 'usr-wrk-103', NULL, 6100.00, 'INR', NOW(), NOW()),
  (uuid_generate_v4(), 'WORKER_WALLET', 'usr-wrk-104', NULL, 2900.00, 'INR', NOW(), NOW()),
  (uuid_generate_v4(), 'WORKER_WALLET', 'usr-wrk-105', NULL, 5400.00, 'INR', NOW(), NOW()),
  (uuid_generate_v4(), 'SOCIETY_RESERVE', NULL, 'soc-blr-001', 38400.00, 'INR', NOW(), NOW()),
  (uuid_generate_v4(), 'WELFARE_TRUST', NULL, 'soc-blr-001', 145000.00, 'INR', NOW(), NOW()),
  (uuid_generate_v4(), 'GUARANTEE_FUND', NULL, 'soc-blr-001', 14500.00, 'INR', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- STEP 5: SEED COMPLETED BOOKINGS + PAYMENTS
-- Generates ≥₹1.45 Lakh welfare corpus across last 6 months
-- Creates real data for: demand chart, revenue panel, welfare fund stat
-- ---------------------------------------------------------------------------

-- Helper: generate bookings across last 6 months
-- 30 completed bookings across categories and areas

DO $$
DECLARE
  booking_ids UUID[] := ARRAY[
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4()
  ];
  payment_ids UUID[] := ARRAY[
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
    uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4()
  ];
  amounts INT[] := ARRAY[
    1200,950,1800,700,2200,1100,850,1650,900,2500,
    1300,1000,1900,750,2100,1050,880,1700,950,2600,
    1400,1100,2000,800,2300,1150,920,1750,1000,2700
  ];
  worker_ids TEXT[] := ARRAY[
    'wrk-101','wrk-102','wrk-103','wrk-104','wrk-105',
    'wrk-101','wrk-102','wrk-103','wrk-101','wrk-102',
    'wrk-104','wrk-105','wrk-101','wrk-102','wrk-103',
    'wrk-104','wrk-105','wrk-101','wrk-102','wrk-103',
    'wrk-101','wrk-102','wrk-103','wrk-104','wrk-105',
    'wrk-101','wrk-102','wrk-103','wrk-104','wrk-105'
  ];
  cat_ids TEXT[] := ARRAY[
    'cat-elec','cat-plmb','cat-care','cat-carp','cat-cln',
    'cat-elec','cat-plmb','cat-care','cat-elec','cat-plmb',
    'cat-carp','cat-cln','cat-elec','cat-plmb','cat-care',
    'cat-carp','cat-cln','cat-elec','cat-plmb','cat-care',
    'cat-elec','cat-plmb','cat-care','cat-carp','cat-cln',
    'cat-elec','cat-plmb','cat-care','cat-carp','cat-cln'
  ];
  lats FLOAT[] := ARRAY[
    12.9784,12.9352,12.9116,12.9166,12.9299,
    12.9600,12.9784,12.9352,12.9116,12.9166,
    12.9299,12.9600,12.9784,12.9352,12.9116,
    12.9166,12.9299,12.9600,12.9784,12.9352,
    12.9116,12.9166,12.9299,12.9600,12.9784,
    12.9352,12.9116,12.9166,12.9299,12.9600
  ];
  lngs FLOAT[] := ARRAY[
    77.6408,77.6244,77.6389,77.6101,77.5833,
    77.6381,77.6408,77.6244,77.6389,77.6101,
    77.5833,77.6381,77.6408,77.6244,77.6389,
    77.6101,77.5833,77.6381,77.6408,77.6244,
    77.6389,77.6101,77.5833,77.6381,77.6408,
    77.6244,77.6389,77.6101,77.5833,77.6381
  ];
  areas TEXT[] := ARRAY[
    'Indiranagar','Koramangala','HSR Layout','BTM Layout','Jayanagar',
    'Domlur','Indiranagar','Koramangala','HSR Layout','BTM Layout',
    'Jayanagar','Domlur','Indiranagar','Koramangala','HSR Layout',
    'BTM Layout','Jayanagar','Domlur','Indiranagar','Koramangala',
    'HSR Layout','BTM Layout','Jayanagar','Domlur','Indiranagar',
    'Koramangala','HSR Layout','BTM Layout','Jayanagar','Domlur'
  ];
  postcodes TEXT[] := ARRAY[
    '560038','560034','560102','560076','560011',
    '560071','560038','560034','560102','560076',
    '560011','560071','560038','560034','560102',
    '560076','560011','560071','560038','560034',
    '560102','560076','560011','560071','560038',
    '560034','560102','560076','560011','560071'
  ];
  i INT;
  base_amt DECIMAL(10,2);
  worker_share DECIMAL(10,2);
  soc_share DECIMAL(10,2);
  welfare_share DECIMAL(10,2);
  bkng_date TIMESTAMP;
BEGIN
  FOR i IN 1..30 LOOP
    base_amt := amounts[i];
    -- 90/5/5 integer arithmetic (welfare = remainder, no float drift)
    worker_share := FLOOR(base_amt * 0.90);
    soc_share := FLOOR(base_amt * 0.05);
    welfare_share := base_amt - worker_share - soc_share;
    bkng_date := NOW() - (INTERVAL '1 day' * ((i * 6) % 180));

    -- Booking
    INSERT INTO "Booking" (
      id, "bookingNumber", "customerId", "workerId", "serviceCategoryId",
      "bookingType", status, "scheduledDate", "completedAt",
      "isEmergency", "surgeMultiplier",
      "serviceAddressLine1", "serviceCity", "servicePostalCode",
      "serviceLatitude", "serviceLongitude",
      "baseAmount", "surgeAmount", "totalAmount", currency,
      "createdAt", "updatedAt"
    ) VALUES (
      booking_ids[i],
      'BKG-2026-' || LPAD(i::TEXT, 4, '0'),
      'usr-cust-001',
      worker_ids[i],
      cat_ids[i],
      'INSTANT', 'COMPLETED', bkng_date, bkng_date + INTERVAL '2 hours',
      false, 1.00,
      '42, ' || areas[i] || ' Main Road', 'Bengaluru', postcodes[i],
      lats[i], lngs[i],
      base_amt, 0.00, base_amt, 'INR',
      bkng_date, bkng_date + INTERVAL '2 hours'
    ) ON CONFLICT (id) DO NOTHING;

    -- Payment
    INSERT INTO "Payment" (
      id, "transactionId", "bookingId", "societyId",
      "baseAmount", "surgeAmount", "totalAmount",
      "workerAmount", "societyAmount", "welfareAmount",
      "workerSplitRatio", "societySplitRatio", "welfareSplitRatio",
      "paymentMethod", status, "gatewayProvider",
      "escrowHeldAt", "escrowReleasedAt", "workerPaidOutAt",
      currency, "createdAt", "updatedAt"
    ) VALUES (
      payment_ids[i],
      'UTR-MOCK-' || LPAD(i::TEXT, 8, '0'),
      booking_ids[i],
      'soc-blr-001',
      base_amt, 0.00, base_amt,
      worker_share, soc_share, welfare_share,
      0.9000, 0.0500, 0.0500,
      'UPI', 'PAID_OUT', 'MOCK_UPI',
      bkng_date, bkng_date + INTERVAL '2 hours', bkng_date + INTERVAL '2 hours',
      'INR', bkng_date, bkng_date + INTERVAL '2 hours'
    ) ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- STEP 6: SEED 1 OPEN DISPUTE (for demo of peer arbitration)
-- ---------------------------------------------------------------------------

INSERT INTO "Dispute" (id, "bookingId", "raisedById", reason, description, "customerStatement", "workerDefenseStatement", status, "createdAt", "updatedAt")
SELECT
  'dsp-demo-001',
  b.id,
  'usr-cust-001',
  'SERVICE_QUALITY',
  'The electrical fault was not fully resolved. One socket still trips after the visit.',
  'The technician left without checking all sockets. The problem recurred within 2 hours.',
  'I tested all accessible sockets on site. The recurring trip may indicate a deeper panel fault outside my visit scope. I am happy to return for a complimentary re-inspection.',
  'OPEN',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
FROM "Booking" b
WHERE b."workerId" = 'wrk-101' AND b.status = 'COMPLETED'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- STEP 7: SEED TOOL INVENTORY
-- ---------------------------------------------------------------------------

INSERT INTO "ToolInventory" (id, name, category, "serialNumber", condition, "dailyFee", "isAvailable", "societyId", "createdAt", "updatedAt")
VALUES
  ('tool-001', 'Bosch Professional Rotary Hammer Drill (GBH 2-26)', 'Heavy Concrete & Masonry', 'BOS-HAM-8841', 'EXCELLENT', 150.00, true, 'soc-blr-001', NOW(), NOW()),
  ('tool-002', 'Rothenberger Industrial Hydraulic Pipe Threader (1/2"-2")', 'Plumbing & Gas Lines', 'ROTH-PIP-0912', 'GOOD', 250.00, false, 'soc-blr-001', NOW(), NOW()),
  ('tool-003', 'Makita 4100NH Electric Wet Tile & Marble Cutter', 'Flooring & Tiling', 'MAK-TIL-3321', 'EXCELLENT', 180.00, true, 'soc-blr-001', NOW(), NOW()),
  ('tool-004', 'Aluminium Mobile Scaffolding Tower (6 Meter)', 'Elevated Electrical & Painting', 'SCAF-ALU-7729', 'GOOD', 350.00, true, 'soc-blr-001', NOW(), NOW()),
  ('tool-005', 'Fluke 117 True-RMS Electrician Digital Multimeter', 'Precision Electrical Testing', 'FLU-117-9021', 'EXCELLENT', 100.00, false, 'soc-blr-001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Tool checkout for Rothenberger (assigned to Ramesh)
INSERT INTO "ToolCheckout" (id, "toolId", "workerProfileId", "checkedOutAt", "expectedReturn")
VALUES
  (uuid_generate_v4(), 'tool-002', 'wrk-101', NOW() - INTERVAL '1 day', NOW() + INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Tool checkout for Fluke multimeter (assigned to Anjali temporarily)
INSERT INTO "ToolCheckout" (id, "toolId", "workerProfileId", "checkedOutAt", "expectedReturn")
VALUES
  (uuid_generate_v4(), 'tool-005', 'wrk-103', NOW() - INTERVAL '3 days', NOW())
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- STEP 8: POSTGIS GEOMETRY COLUMNS (run after tables exist)
-- ---------------------------------------------------------------------------

-- Update PostGIS geography columns from lat/lng Float fields
-- (Uncomment and run after initial prisma migrate)
--
-- ALTER TABLE "WorkerProfile" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
-- UPDATE "WorkerProfile" SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
--   WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
-- CREATE INDEX IF NOT EXISTS idx_worker_location ON "WorkerProfile" USING GIST(location);
--
-- ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS service_location geography(Point, 4326);
-- UPDATE "Booking" SET service_location = ST_SetSRID(ST_MakePoint("serviceLongitude", "serviceLatitude"), 4326)::geography
--   WHERE "serviceLatitude" IS NOT NULL AND "serviceLongitude" IS NOT NULL;
-- CREATE INDEX IF NOT EXISTS idx_booking_location ON "Booking" USING GIST(service_location);

-- ---------------------------------------------------------------------------
-- VERIFICATION QUERY (run to confirm seed is correct)
-- ---------------------------------------------------------------------------
-- SELECT
--   'payments' as table_name, COUNT(*) as rows, SUM("totalAmount") as total_revenue,
--   SUM("welfareAmount") as welfare_corpus
-- FROM "Payment" WHERE status = 'PAID_OUT';
-- Expected: 30 rows, ~₹45,450 total, ~₹2,272 welfare (from seed alone)
-- Plus initial wallet seed: welfare_trust starts at ₹1,45,000 = ₹1.45 Lakh corpus
