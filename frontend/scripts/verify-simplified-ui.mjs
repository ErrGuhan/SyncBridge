import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\mguha_2nalv7a\\.gemini\\antigravity-ide\\brain\\e01332ec-3cae-46c1-8ac8-44822f3d14a4\\screenshots\\simplified_ui';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targets = [
  { path: '/', name: '01_home_clean' },
  { path: '/services', name: '02_services_clean' },
  { path: '/services?emergency=true', name: '03_services_emergency' },
  { path: '/bookings', name: '04_bookings_clean' }
];

const viewports = [
  { name: 'mobile_375', width: 375, height: 812 },
  { name: 'desktop_1440', width: 1440, height: 900 }
];

async function main() {
  console.log('🚀 Starting Simplified UI Visual Verification...');
  const browser = await chromium.launch();

  for (const target of targets) {
    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      try {
        await page.goto(`http://localhost:3004${target.path}`, { waitUntil: 'networkidle', timeout: 15000 });
      } catch {
        await page.goto(`http://localhost:3004${target.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      }
      await page.waitForTimeout(600);

      // Check overflow
      const overflow = await page.evaluate(() => {
        return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) > window.innerWidth;
      });

      const shotPath = path.join(outDir, `${target.name}_${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`📸 [${vp.name}] ${target.path} -> ${path.basename(shotPath)} (Overflow: ${overflow ? 'FAIL' : 'PASS'})`);
      await page.close();
    }
  }

  await browser.close();
  console.log('🎉 Simplified UI Visual Verification completed successfully!');
}

main().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});
