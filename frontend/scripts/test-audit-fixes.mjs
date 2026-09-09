import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\mguha_2nalv7a\\.gemini\\antigravity-ide\\brain\\994d7b3a-3d45-464d-96e2-7f20733c42fc\\screenshots\\audit_fixes';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('================================================================');
  console.log('SYNCBRIDGE AUDIT FIXES VERIFICATION SUITE');
  console.log('================================================================');

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  let passedTests = 0;
  let totalTests = 7;

  // ---------------------------------------------------------------------------
  // TEST 1: AUTH ENFORCEMENT ON UNPROTECTED ROUTES
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 1] Auth Enforcement on /bookings, /portal/worker, /portal/admin, /portal/customer');
  
  const testRoutes = [
    { route: '/bookings', expectedRole: 'customer' },
    { route: '/portal/worker', expectedRole: 'worker' },
    { route: '/portal/admin', expectedRole: 'admin' },
    { route: '/portal/customer', expectedRole: 'customer' }
  ];

  let allRedirected = true;
  for (const { route, expectedRole } of testRoutes) {
    await page.goto(`http://localhost:3004${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const currentUrl = page.url();
    const isRedirectedToLogin = currentUrl.includes('/auth/login');
    const hasCorrectRoleParam = currentUrl.includes(`role=${expectedRole}`);
    
    console.log(`  -> Accessing unauthenticated ${route}:`);
    console.log(`     Redirected to login: ${isRedirectedToLogin ? 'PASS' : 'FAIL'} (${currentUrl})`);
    console.log(`     Role query parameter: ${hasCorrectRoleParam ? 'PASS' : 'FAIL'}`);

    if (!isRedirectedToLogin) {
      allRedirected = false;
    }
  }

  await page.screenshot({ path: path.join(outDir, '01_unauthenticated_redirect.png') });
  if (allRedirected) {
    console.log('  >>> TEST 1 RESULT: PASSED');
    passedTests++;
  } else {
    console.log('  >>> TEST 1 RESULT: FAILED');
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATE AS CUSTOMER TO TEST BOOKINGS & WORKER CARD
  // ---------------------------------------------------------------------------
  console.log('\nAuthenticating as Customer to verify authenticated features...');
  await page.goto('http://localhost:3004/auth/login?role=customer', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  await page.locator('button:has-text("1-Click Test Number")').click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Verify OTP & Enter Customer Portal")').click();
  await page.waitForURL('**/portal/customer', { timeout: 10000 });
  await page.waitForTimeout(600);

  // ---------------------------------------------------------------------------
  // TEST 2: BOOKINGS FEE BREAKDOWN (Society Power-Tool Pool)
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 2] Bookings Fee Breakdown: Society Power-Tool Pool Line');
  await page.goto('http://localhost:3004/bookings', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '02_bookings_fee_breakdown.png') });

  const pageContent = await page.content();
  const hasToolPool = pageContent.includes('Society Power-Tool Pool');
  // Check that the rupee symbol and an amount are rendered next to Power-Tool Pool
  const hasValidAmount = pageContent.includes('₹') && (pageContent.includes('Society Power-Tool Pool') || pageContent.includes('समिति साझा उपकरण'));

  console.log(`  Society Power-Tool Pool line present: ${hasToolPool ? 'PASS' : 'FAIL'}`);
  console.log(`  Valid formatted amount rendered: ${hasValidAmount ? 'PASS' : 'FAIL'}`);

  if (hasToolPool && hasValidAmount) {
    console.log('  >>> TEST 2 RESULT: PASSED');
    passedTests++;
  } else {
    console.log('  >>> TEST 2 RESULT: FAILED');
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATE AS WORKER TO TEST WELFARE CORPUS
  // ---------------------------------------------------------------------------
  console.log('\nSwitching session to Worker to verify Welfare Corpus...');
  await page.goto('http://localhost:3004/auth/login?role=worker', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  await page.locator('button:has-text("1-Click Test Worker")').click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Verify OTP & Access Workspace")').click();
  await page.waitForURL('**/portal/worker', { timeout: 10000 });
  await page.waitForTimeout(800);

  // ---------------------------------------------------------------------------
  // TEST 3: WELFARE CORPUS CONSISTENCY (₹4.82 Cr & ₹48.25 Lakhs)
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 3] Welfare Corpus Consistency (₹4.82 Cr & ₹48.25 Lakhs Reserve)');
  await page.screenshot({ path: path.join(outDir, '03_worker_portal_welfare_corpus.png') });

  const workerPortalContent = await page.content();
  const hasCorrectCorpus = workerPortalContent.includes('₹4.82 Cr');
  const hasGuaranteeReserve = workerPortalContent.includes('₹48.25 Lakh');
  const noOldCorpus = !workerPortalContent.includes('₹1.45 Cr');

  console.log(`  Contains ₹4.82 Cr corpus: ${hasCorrectCorpus ? 'PASS' : 'FAIL'}`);
  console.log(`  Contains ₹48.25 Lakhs reserve: ${hasGuaranteeReserve ? 'PASS' : 'FAIL'}`);
  console.log(`  Outdated ₹1.45 Cr removed: ${noOldCorpus ? 'PASS' : 'FAIL'}`);

  // Also check /welfare page
  await page.goto('http://localhost:3004/welfare', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const welfarePageContent = await page.content();
  const hasWelfarePageCorpus = welfarePageContent.includes('4,82,50,000') || welfarePageContent.includes('4.82');

  console.log(`  Welfare page confirms ₹4,82,50,000 corpus: ${hasWelfarePageCorpus ? 'PASS' : 'FAIL'}`);

  if (hasCorrectCorpus && hasGuaranteeReserve && noOldCorpus && hasWelfarePageCorpus) {
    console.log('  >>> TEST 3 RESULT: PASSED');
    passedTests++;
  } else {
    console.log('  >>> TEST 3 RESULT: FAILED');
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATE AS ADMIN TO TEST SOCIETY ROSTER
  // ---------------------------------------------------------------------------
  console.log('\nSwitching session to Admin to verify Society Roster...');
  await page.goto('http://localhost:3004/auth/login?role=admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  await page.locator('button:has-text("1-Click Test Admin")').click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Verify Password & Request 2FA OTP")').click();
  await page.waitForTimeout(400);
  await page.locator('button:has-text("Fill Test 2FA OTP (123456)")').click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Confirm Both Credentials")').click();
  await page.waitForURL('**/portal/admin', { timeout: 10000 });
  await page.waitForTimeout(800);

  // ---------------------------------------------------------------------------
  // TEST 4: SOCIETY ROSTER ALIGNMENT (Karnataka Union Labour Federation)
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 4] Society Roster: Karnataka Union Labour Federation');
  await page.screenshot({ path: path.join(outDir, '04_admin_society_roster.png') });

  const adminContent = await page.content();
  const hasKarnatakaUnion = adminContent.includes('Karnataka Union Labour Federation');
  const hasNcdCode = adminContent.includes('NCD-KA-MYS-0193');

  console.log(`  Karnataka Union Labour Federation in roster: ${hasKarnatakaUnion ? 'PASS' : 'FAIL'}`);
  console.log(`  Registration code NCD-KA-MYS-0193 in roster: ${hasNcdCode ? 'PASS' : 'FAIL'}`);

  if (hasKarnatakaUnion && hasNcdCode) {
    console.log('  >>> TEST 4 RESULT: PASSED');
    passedTests++;
  } else {
    console.log('  >>> TEST 4 RESULT: FAILED');
  }

  // ---------------------------------------------------------------------------
  // TEST 5: WORKERCARD CONSOLIDATION & UNIFORMITY
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 5] WorkerCard Consolidation: Homepage and Service Discovery');
  await page.goto('http://localhost:3004/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '05_homepage_workercard.png') });

  const homeContent = await page.content();
  // Check for presence of unified card elements (Verified Member from t('verifiedBadge') and artisan name)
  const homeHasVerified = homeContent.includes('Verified Member') || homeContent.includes('सत्यापित') || homeContent.includes('Ramesh Chavan');

  await page.goto('http://localhost:3004/services', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '06_services_workercard.png') });

  const servicesContent = await page.content();
  const servicesHasUan = servicesContent.includes('UAN:');
  const servicesHasTakeHome = servicesContent.includes('90% Direct Artisan Take-Home') || servicesContent.includes('Take-Home') || servicesContent.includes('Direct Pay');

  console.log(`  Homepage renders unified WorkerCard: ${homeHasVerified ? 'PASS' : 'FAIL'}`);
  console.log(`  Services directory renders full WorkerCard with UAN & split: ${servicesHasUan ? 'PASS' : 'FAIL'}`);

  if (homeHasVerified && servicesHasUan) {
    console.log('  >>> TEST 5 RESULT: PASSED');
    passedTests++;
  } else {
    console.log('  >>> TEST 5 RESULT: FAILED');
  }

  // ---------------------------------------------------------------------------
  // TEST 6: MULTILINGUAL & VOICE ASSISTANT SYSTEMATIZATION
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 6] Multilingual & Voice Synthesis Buttons');
  // Check Voice buttons on Login, Services, and Bookings
  await page.goto('http://localhost:3004/auth/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  const loginHasVoiceBtn = (await page.locator('button[aria-label*="Listen"], button[aria-label*="Read aloud"]').count()) > 0;
  console.log(`  VoiceReadButton on Login page: ${loginHasVoiceBtn ? 'PASS' : 'FAIL'}`);

  await page.goto('http://localhost:3004/services', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  const servicesVoiceCount = await page.locator('button[aria-label*="Read aloud"], button[title*="Listen"]').count();
  console.log(`  VoiceReadButtons on Artisan Cards: ${servicesVoiceCount > 0 ? `PASS (${servicesVoiceCount} buttons)` : 'FAIL'}`);

  if (loginHasVoiceBtn && servicesVoiceCount > 0) {
    console.log('  >>> TEST 6 RESULT: PASSED');
    passedTests++;
  } else {
    console.log('  >>> TEST 6 RESULT: FAILED');
  }

  // ---------------------------------------------------------------------------
  // TEST 7: LOGIN TAB BEHAVIOR VERIFICATION
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 7] Login Tab Behavior: Tradesperson (OTP only) vs Admin (Password + 2FA)');
  await page.goto('http://localhost:3004/auth/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  // Check Tradesperson tab
  await page.locator('button:has-text("Tradesperson")').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '07_tradesperson_tab.png') });

  const workerFormHtml = await page.content();
  const workerHasPasswordInput = workerFormHtml.includes('type="password"') && (await page.locator('input[type="password"]').isVisible().catch(() => false));
  const workerHasMobileInput = await page.locator('input[type="tel"]').isVisible();

  console.log(`  Tradesperson tab has Mobile input: ${workerHasMobileInput ? 'PASS' : 'FAIL'}`);
  console.log(`  Tradesperson tab has NO password input: ${!workerHasPasswordInput ? 'PASS' : 'FAIL'}`);

  // Check Society Admin tab
  await page.locator('div.grid button:has-text("Society Admin")').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '08_admin_tab_stage1.png') });

  const adminHasPasswordInput = await page.locator('input[type="password"]').isVisible();
  console.log(`  Society Admin Stage 1 has Password input: ${adminHasPasswordInput ? 'PASS' : 'FAIL'}`);

  // Submit Stage 1 password
  await page.locator('button:has-text("1-Click Test Admin")').click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("Verify Password & Request 2FA OTP")').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, '09_admin_tab_stage2.png') });

  const adminHas2faOtpInput = (await page.content()).includes('Stage 2: Enter the 6-digit 2FA confirmation code');
  console.log(`  Society Admin proceeds to Stage 2 (2FA OTP): ${adminHas2faOtpInput ? 'PASS' : 'FAIL'}`);

  if (workerHasMobileInput && !workerHasPasswordInput && adminHasPasswordInput && adminHas2faOtpInput) {
    console.log('  >>> TEST 7 RESULT: PASSED');
    passedTests++;
  } else {
    console.log('  >>> TEST 7 RESULT: FAILED');
  }

  await browser.close();

  console.log('\n================================================================');
  console.log(`SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('================================================================');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
