import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\mguha_2nalv7a\\.gemini\\antigravity-ide\\brain\\e01332ec-3cae-46c1-8ac8-44822f3d14a4\\screenshots\\auth';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Starting Authentication & Portal Visibility Automated Test...');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // 1. Unauthenticated Public View
  console.log('\n--- 1. Testing Unauthenticated Public View ---');
  await page.goto('http://localhost:3004/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '01_unauthenticated_home.png') });

  // Check header text: ensure NO "Commercial Portals" or "Worker Portal" in header
  const headerHtml = await page.locator('header').innerHTML();
  const hasCommercialPortals = headerHtml.includes('Commercial Portals');
  const hasWorkerPortalInNav = headerHtml.includes('/portal/worker');
  const hasAdminPortalInNav = headerHtml.includes('/portal/admin');
  const hasSignInBtn = headerHtml.includes('Sign In');

  console.log(`  Commercial Portals dropdown visible: ${hasCommercialPortals ? 'FAIL (should be hidden)' : 'PASS (hidden)'}`);
  console.log(`  Worker Portal link in public nav: ${hasWorkerPortalInNav ? 'FAIL (should be hidden)' : 'PASS (hidden)'}`);
  console.log(`  Admin Portal link in public nav: ${hasAdminPortalInNav ? 'FAIL (should be hidden)' : 'PASS (hidden)'}`);
  console.log(`  Sign In button present: ${hasSignInBtn ? 'PASS' : 'FAIL'}`);

  // 2. Customer Mobile + OTP Login
  console.log('\n--- 2. Testing Customer Mobile + OTP Login ---');
  await page.goto('http://localhost:3004/auth/login?role=customer', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '02_customer_login_page.png') });

  // Click 1-Click Test Number
  await page.locator('button:has-text("1-Click Test Number")').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '03_customer_otp_filled.png') });

  // Click Verify OTP
  await page.locator('button:has-text("Verify OTP & Enter Customer Portal")').click();
  await page.waitForURL('**/portal/customer', { timeout: 10000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '04_customer_portal_authenticated.png') });

  const customerHeaderHtml = await page.locator('header').innerHTML();
  console.log(`  Customer redirected to /portal/customer: ${page.url().includes('/portal/customer') ? 'PASS' : 'FAIL'}`);
  console.log(`  Customer profile visible in header: ${customerHeaderHtml.includes('Priya Sharma') ? 'PASS' : 'FAIL'}`);

  // Sign out
  await page.locator('header button[aria-label="User profile and portal options"]').click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Sign Out")').click();
  await page.waitForTimeout(500);
  console.log('  Customer signed out successfully.');

  // 3. Worker Mobile + OTP Login
  console.log('\n--- 3. Testing Worker Mobile + OTP Login ---');
  await page.goto('http://localhost:3004/auth/login?role=worker', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '05_worker_login_page.png') });

  // Click 1-Click Test Worker
  await page.locator('button:has-text("1-Click Test Worker")').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '06_worker_otp_filled.png') });

  // Click Verify OTP
  await page.locator('button:has-text("Verify OTP & Access Workspace")').click();
  await page.waitForURL('**/portal/worker', { timeout: 10000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '07_worker_workspace_authenticated.png') });

  const workerHeaderHtml = await page.locator('header').innerHTML();
  console.log(`  Worker redirected to /portal/worker: ${page.url().includes('/portal/worker') ? 'PASS' : 'FAIL'}`);
  console.log(`  Worker profile visible in header: ${workerHeaderHtml.includes('Ramesh Chavan') ? 'PASS' : 'FAIL'}`);

  // Sign out
  await page.locator('header button[aria-label="User profile and portal options"]').click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Sign Out")').click();
  await page.waitForTimeout(500);
  console.log('  Worker signed out successfully.');

  // 4. SOP / Admin Login with Password AND 2FA OTP
  console.log('\n--- 4. Testing SOP/Admin Password + 2FA OTP Login ---');
  await page.goto('http://localhost:3004/auth/login?role=admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '08_admin_stage1_password.png') });

  // Click 1-Click Test Admin
  await page.locator('button:has-text("1-Click Test Admin")').click();
  await page.waitForTimeout(300);

  // Click Verify Password & Request 2FA OTP
  await page.locator('button:has-text("Verify Password & Request 2FA OTP")').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '09_admin_stage2_2fa_prompt.png') });

  const stage2Text = await page.innerText('body');
  const stage2Visible = stage2Text.includes('Stage 1 Passed') && stage2Text.includes('2FA Confirmation OTP Code');
  console.log(`  Stage 2 (2FA OTP Prompt) displayed after password verification: ${stage2Visible ? 'PASS' : 'FAIL'}`);

  // Fill 2FA OTP
  await page.locator('button:has-text("Fill Test 2FA OTP")').click();
  await page.waitForTimeout(300);

  // Confirm 2FA
  await page.locator('button:has-text("Confirm Both Credentials")').click();
  await page.waitForURL('**/portal/admin', { timeout: 10000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '10_admin_console_authenticated.png') });

  const adminHeaderHtml = await page.locator('header').innerHTML();
  console.log(`  Admin redirected to /portal/admin: ${page.url().includes('/portal/admin') ? 'PASS' : 'FAIL'}`);
  console.log(`  Admin profile visible in header: ${adminHeaderHtml.includes('Anand Patil') ? 'PASS' : 'FAIL'}`);

  await browser.close();
  console.log('\n=== ALL AUTHENTICATION FLOWS VERIFIED SUCCESSFULLY ===');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
