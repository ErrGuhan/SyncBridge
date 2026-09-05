const http = require('http');
const https = require('https');

async function testUrl(url, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https:');
    const mod = isHttps ? https : http;
    const u = new URL(url);
    const req = mod.request({
      hostname: u.hostname,
      port: u.port || (isHttps ? 443 : 80),
      path: u.pathname + u.search,
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: data.slice(0, 80) }));
    });
    req.on('error', (err) => resolve({ status: 0, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, error: 'TIMEOUT' }); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  const tests = [
    { name: 'Gateway Health (3000)', url: 'http://localhost:3000/health' },
    { name: 'User Service Health (3001)', url: 'http://localhost:3001/health' },
    { name: 'Booking Service Health (3002)', url: 'http://localhost:3002/health' },
    { name: 'Payment Service Health (3003)', url: 'http://localhost:3003/health' },
    { name: 'Frontend Homepage (3004)', url: 'http://localhost:3004/' },
    { name: 'Frontend AI Diagnose Route', url: 'http://localhost:3004/api/ai/diagnose', method: 'POST', body: { problemDescription: 'Water tap leaking in kitchen' } },
    { name: 'Frontend Demand Forecast Route', url: 'http://localhost:3004/api/demand-forecast' },
    { name: 'Supabase JWKS', url: 'https://qniqutaavdjnutnprjdk.supabase.co/auth/v1/.well-known/jwks.json' }
  ];

  console.log('--- AUDIT CHECK RESULTS ---');
  for (const t of tests) {
    const res = await testUrl(t.url, t.method || 'GET', t.body);
    const pass = res.status === 200;
    console.log(`${pass ? '✅ [PASS 200]' : '❌ [FAIL ' + res.status + ']'} ${t.name}: ${res.error || res.data}`);
  }
})();
