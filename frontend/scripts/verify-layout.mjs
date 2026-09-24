import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:3004';
const SCREENSHOTS_DIR = path.join(__dirname, '..', '.playwright-results', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Comprehensive Device Profiles
const VIEWPORTS = [
  { name: 'Mobile Mini (320x568)', width: 320, height: 568, isMobile: true },
  { name: 'Mobile Standard (375x667)', width: 375, height: 667, isMobile: true },
  { name: 'Mobile Modern (393x852)', width: 393, height: 852, isMobile: true },
  { name: 'Mobile Android (412x915)', width: 412, height: 915, isMobile: true },
  { name: 'Tablet Portrait (768x1024)', width: 768, height: 1024, isMobile: false },
  { name: 'Tablet Landscape (1024x768)', width: 1024, height: 768, isMobile: false },
  { name: 'Laptop HD (1366x768)', width: 1366, height: 768, isMobile: false },
  { name: 'Desktop Full HD (1920x1080)', width: 1920, height: 1080, isMobile: false },
  { name: 'Ultra-Wide 2K (2560x1440)', width: 2560, height: 1440, isMobile: false }
];

const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/services', name: 'Services' },
  { path: '/bookings', name: 'Bookings' },
  { path: '/welfare', name: 'Welfare Trust' },
  { path: '/b2b', name: 'B2B Enterprise' },
  { path: '/federation', name: 'Federation Dashboard' },
  { path: '/portal/worker', name: 'Worker Portal' },
  { path: '/portal/admin', name: 'Admin Console' },
  { path: '/auth/login', name: 'Login & Identity' },
  { path: '/emergency', name: 'Emergency SOS Flow' }
];

async function runLayoutAudit() {
  console.log(`\n===============================================================`);
  console.log(`  SyncBridge Playwright Responsive Layout & Alignment Audit`);
  console.log(`  Target: ${BASE_URL}`);
  console.log(`  Viewports: ${VIEWPORTS.length} | Routes: ${ROUTES.length}`);
  console.log(`===============================================================\n`);

  const browser = await chromium.launch({ headless: true });
  const results = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const viewport of VIEWPORTS) {
    console.log(`\n[Viewport] Testing: ${viewport.name} (${viewport.width}x${viewport.height})`);

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      userAgent: viewport.isMobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    for (const route of ROUTES) {
      totalTests++;
      const fullUrl = `${BASE_URL}${route.path}`;

      try {
        await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 15000 });
        // Allow CSS animations and layouts to settle
        await page.waitForTimeout(300);

        // Check horizontal overflow
        const overflowDetails = await page.evaluate((expectedWidth) => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
          const clientWidth = docEl.clientWidth;
          const windowInnerWidth = window.innerWidth;
          
          const hasOverflow = scrollWidth > windowInnerWidth + 1; // 1px threshold for sub-pixel anti-aliasing

          let offendingElements = [];
          if (hasOverflow) {
            const allElements = Array.from(document.querySelectorAll('*'));
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > windowInnerWidth + 1) {
                const tag = el.tagName.toLowerCase();
                const id = el.id ? `#${el.id}` : '';
                const classes = el.className && typeof el.className === 'string' ? `.${el.className.split(' ').slice(0, 3).join('.')}` : '';
                offendingElements.push({
                  selector: `${tag}${id}${classes}`,
                  right: Math.round(rect.right),
                  width: Math.round(rect.width),
                  overflowBy: Math.round(rect.right - windowInnerWidth)
                });
                if (offendingElements.length >= 5) break; // sample up to 5
              }
            }
          }

          return {
            hasOverflow,
            scrollWidth,
            clientWidth,
            windowInnerWidth,
            offendingElements
          };
        }, viewport.width);

        // Small touch target verification on mobile
        let touchTargetIssues = [];
        if (viewport.isMobile) {
          touchTargetIssues = await page.evaluate(() => {
            const interactive = Array.from(document.querySelectorAll('button, a[href]'));
            const badTargets = [];
            for (const el of interactive) {
              const rect = el.getBoundingClientRect();
              // Only check visible elements
              if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.top < window.innerHeight) {
                if (rect.height < 28 || rect.width < 28) {
                  const tag = el.tagName.toLowerCase();
                  const text = (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 20);
                  badTargets.push({ tag, text, width: Math.round(rect.width), height: Math.round(rect.height) });
                  if (badTargets.length >= 4) break;
                }
              }
            }
            return badTargets;
          });
        }

        const isPassed = !overflowDetails.hasOverflow;

        if (isPassed) {
          passedTests++;
          console.log(`  ✓ [PASS] ${route.name.padEnd(22)} (scrollW: ${overflowDetails.scrollWidth}px / innerW: ${viewport.width}px)`);
        } else {
          failedTests++;
          console.log(`  ✗ [FAIL] ${route.name.padEnd(22)} (scrollW: ${overflowDetails.scrollWidth}px > innerW: ${viewport.width}px by +${overflowDetails.scrollWidth - viewport.width}px)`);
          if (overflowDetails.offendingElements.length > 0) {
            console.log(`    Offending elements:`, overflowDetails.offendingElements);
          }
        }

        // Save reference screenshots for key viewports
        if ((viewport.width === 375 || viewport.width === 1024 || viewport.width === 1920) && (route.path === '/' || route.path === '/federation' || route.path === '/b2b')) {
          const cleanName = `${route.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.width}w.png`;
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, cleanName), fullPage: false });
        }

        results.push({
          viewport: viewport.name,
          route: route.name,
          path: route.path,
          status: isPassed ? 'PASS' : 'FAIL',
          overflowDetails,
          touchTargetIssues,
          consoleErrorsCount: consoleErrors.length
        });

      } catch (err) {
        failedTests++;
        console.log(`  ✗ [ERROR] ${route.name.padEnd(22)}: ${err.message}`);
        results.push({
          viewport: viewport.name,
          route: route.name,
          path: route.path,
          status: 'ERROR',
          error: err.message
        });
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n===============================================================`);
  console.log(`  AUDIT SUMMARY`);
  console.log(`  Total Evaluated: ${totalTests}`);
  console.log(`  Passed:          ${passedTests}`);
  console.log(`  Failed:          ${failedTests}`);
  console.log(`  Success Rate:    ${Math.round((passedTests / totalTests) * 100)}%`);
  console.log(`===============================================================\n`);

  // Write detailed JSON report
  const reportPath = path.join(__dirname, '..', '.playwright-results', 'layout-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalTests,
    passedTests,
    failedTests,
    successRate: Math.round((passedTests / totalTests) * 100),
    results
  }, null, 2));

  console.log(`Detailed audit report written to: ${reportPath}`);

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runLayoutAudit().catch(err => {
  console.error('Fatal audit runner error:', err);
  process.exit(1);
});
