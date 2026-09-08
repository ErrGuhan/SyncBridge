import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const screenshotDir = 'C:\\Users\\mguha_2nalv7a\\.gemini\\antigravity-ide\\brain\\e01332ec-3cae-46c1-8ac8-44822f3d14a4\\screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const routes = [
  { path: '/', name: 'home' },
  { path: '/services', name: 'services' },
  { path: '/bookings', name: 'orders' },
  { path: '/portal/worker', name: 'portal_worker' },
  { path: '/portal/admin', name: 'portal_admin' },
  { path: '/portal/customer', name: 'portal_customer' },
  { path: '/portal/management', name: 'portal_management' },
  { path: '/welfare', name: 'welfare' },
  { path: '/b2b', name: 'b2b' }
];

const viewports = [
  { name: 'mobile_375', width: 375, height: 812 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'desktop_1280', width: 1280, height: 800 },
  { name: 'desktop_1440', width: 1440, height: 900 }
];

async function run() {
  console.log('Launching browser for verification layout audit...');
  const browser = await chromium.launch();
  const results = [];

  for (const route of routes) {
    console.log(`\nAuditing route: ${route.path} (${route.name})`);
    const routeReport = { route: route.path, name: route.name, issues: [] };

    for (const vp of viewports) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height }
      });

      try {
        await page.goto(`http://localhost:3004${route.path}`, { waitUntil: 'networkidle', timeout: 15000 });
      } catch {
        await page.goto(`http://localhost:3004${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      }

      // Stabilization wait
      await page.waitForTimeout(800);

      // Check horizontal overflow
      const overflowInfo = await page.evaluate(() => {
        const bodyScroll = document.body.scrollWidth;
        const windowInner = window.innerWidth;
        const htmlScroll = document.documentElement.scrollWidth;
        const maxScroll = Math.max(bodyScroll, htmlScroll);
        
        // Find elements that exceed windowInner
        const overflowingElements = [];
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > windowInner + 2) {
            overflowingElements.push({
              tag: el.tagName,
              className: (el.className || '').toString().slice(0, 80),
              right: Math.round(rect.right),
              width: Math.round(rect.width)
            });
            if (overflowingElements.length >= 5) break;
          }
        }

        return {
          hasOverflow: maxScroll > windowInner + 1,
          maxScroll,
          windowInner,
          diff: maxScroll - windowInner,
          overflowingElements
        };
      });

      // Check unspaced text runs (like '4.9320 jobs' or 'e-KYC: Verified ✓UAN')
      const textSpacingIssues = await page.evaluate(() => {
        const text = document.body.innerText || '';
        const patterns = [
          /\d\.\d{1,2}\d{2,}\s*jobs/i,            // 4.9320 jobs
          /Verified\s*✓UAN/i,                     // Verified ✓UAN
          /Cleared\s*✓[A-Za-z]/i,                 // Cleared ✓Metro
          /jobs[A-Za-z]/i                         // jobsIndiranagar
        ];
        const found = [];
        for (const p of patterns) {
          const m = text.match(p);
          if (m) found.push(m[0]);
        }
        return found;
      });

      const shotPath = path.join(screenshotDir, `${route.name}_${vp.name}_after.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      if (overflowInfo.hasOverflow) {
        routeReport.issues.push({
          viewport: vp.name,
          type: 'HORIZONTAL_OVERFLOW',
          diff: overflowInfo.diff,
          elements: overflowInfo.overflowingElements
        });
      }

      if (textSpacingIssues.length > 0) {
        routeReport.issues.push({
          viewport: vp.name,
          type: 'UNSPACED_TEXT',
          instances: textSpacingIssues
        });
      }

      console.log(`  [${vp.name}] Overflow: ${overflowInfo.hasOverflow ? `YES (+${overflowInfo.diff}px)` : 'NO'} | Unspaced text: ${textSpacingIssues.length} | Screenshot: ${shotPath}`);

      await page.close();
    }

    results.push(routeReport);
  }

  await browser.close();
  console.log('\n--- VERIFICATION AUDIT COMPLETE ---');
  console.log(JSON.stringify(results, null, 2));
}

run().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
