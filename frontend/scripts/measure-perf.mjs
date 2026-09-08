import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3004';
const routes = ['/', '/services', '/bookings', '/portal/customer', '/portal/worker', '/portal/admin'];

async function measureRoute(browser, route) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  let totalTransferBytes = 0;
  let jsBytes = 0;
  let cssBytes = 0;
  let requestCount = 0;

  page.on('response', async (res) => {
    requestCount++;
    try {
      const headers = res.headers();
      const len = parseInt(headers['content-length'] || '0', 10);
      const url = res.url();
      totalTransferBytes += len;
      if (url.endsWith('.js') || url.includes('/_next/static/chunks/')) jsBytes += len;
      if (url.endsWith('.css')) cssBytes += len;
    } catch {}
  });

  const start = performance.now();
  await page.goto(`${BASE_URL}${route}`, { waitUntil: 'load', timeout: 20000 });
  const loadTime = performance.now() - start;

  // Web Vitals & Navigation Timings from browser
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      const perfEntries = performance.getEntriesByType('navigation')[0];
      const navTiming = perfEntries ? {
        ttfb: Math.round(perfEntries.responseStart - perfEntries.requestStart),
        domInteractive: Math.round(perfEntries.domInteractive),
        domContentLoaded: Math.round(perfEntries.domContentLoadedEventEnd),
        duration: Math.round(perfEntries.duration)
      } : {};

      // Measure LCP using PerformanceObserver
      let lcp = 0;
      let cls = 0;

      try {
        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) lcp = Math.round(lastEntry.startTime);
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {}

      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) cls += entry.value;
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch {}

      setTimeout(() => {
        resolve({
          navTiming,
          lcp,
          cls: parseFloat(cls.toFixed(4))
        });
      }, 500);
    });
  });

  await page.close();

  return {
    route,
    loadTimeMs: Math.round(loadTime),
    ttfbMs: metrics.navTiming?.ttfb || 0,
    domInteractiveMs: metrics.navTiming?.domInteractive || 0,
    domContentLoadedMs: metrics.navTiming?.domContentLoaded || 0,
    lcpMs: metrics.lcp || 0,
    cls: metrics.cls,
    requestCount,
    totalTransferKb: Math.round(totalTransferBytes / 1024),
    jsKb: Math.round(jsBytes / 1024),
    cssKb: Math.round(cssBytes / 1024)
  };
}

async function measureApi(endpoint) {
  const start = performance.now();
  const res = await fetch(`${BASE_URL}${endpoint}`);
  const duration = Math.round(performance.now() - start);
  const data = await res.json();
  return {
    endpoint,
    status: res.status,
    durationMs: duration
  };
}

async function main() {
  console.log('--- STARTING PERFORMANCE MEASUREMENT BASELINE ---');
  const browser = await chromium.launch();

  console.log('\nMeasuring UI Routes...');
  const routeResults = [];
  for (const r of routes) {
    const res = await measureRoute(browser, r);
    routeResults.push(res);
    console.log(`[${r}] TTFB: ${res.ttfbMs}ms | DomInteractive: ${res.domInteractiveMs}ms | LCP: ${res.lcpMs}ms | CLS: ${res.cls} | Requests: ${res.requestCount}`);
  }

  await browser.close();

  console.log('\nMeasuring API Endpoints...');
  const apis = ['/api/workers/nearby?lat=12.9716&lng=77.5946', '/api/demand-forecast', '/api/admin/metrics'];
  const apiResults = [];
  for (const a of apis) {
    const res = await measureApi(a);
    apiResults.push(res);
    console.log(`[${a}] Status: ${res.status} | Latency: ${res.durationMs}ms`);
  }

  console.log('\n--- BASELINE METRICS SUMMARY JSON ---');
  console.log(JSON.stringify({ routes: routeResults, apis: apiResults }, null, 2));
}

main().catch(err => {
  console.error('Measurement failed:', err);
  process.exit(1);
});
