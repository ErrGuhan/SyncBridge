const fetch = globalThis.fetch;
const baseUrl = 'http://localhost:3004';

async function testAll() {
  const pages = [
    '/',
    '/services',
    '/bookings',
    '/welfare',
    '/b2b',
    '/portal/customer',
    '/portal/worker',
    '/portal/admin',
    '/register/worker',
    '/auth/login'
  ];

  console.log('================================================================');
  console.log('CHECK 1: Raw URL in Nav & Header/Footer consistency across 10 pages');
  console.log('================================================================');
  for (const p of pages) {
    const res = await fetch(baseUrl + p);
    const html = await res.text();
    const hasRawLink = />\s*\/services\?emergency=true\s*</.test(html);
    const hasEmergencyLabel = html.includes('Emergency SOS');
    console.log(p.padEnd(20), 'Status:', res.status, '| Raw link absent:', !hasRawLink, '| Emergency SOS button present:', hasEmergencyLabel);
  }

  console.log('\n================================================================');
  console.log('CHECK 2: Payout Math for BK-2026-890 & Split Sum on /bookings and /portal/customer');
  console.log('================================================================');
  for (const p of ['/bookings', '/portal/customer']) {
    const res = await fetch(baseUrl + p);
    const html = await res.text();
    const has765 = html.includes('765');
    const has790 = html.includes('790');
    console.log(p.padEnd(20), '| 765 present:', has765, '| 790 absent:', !has790);
  }

  console.log('\n================================================================');
  console.log('CHECK 3: /services?emergency=true vs /services differences');
  console.log('================================================================');
  const regServices = await (await fetch(baseUrl + '/services')).text();
  const emgServices = await (await fetch(baseUrl + '/services?emergency=true')).text();
  console.log('Normal has emergency banner:', regServices.includes('Emergency Dispatch — Priority Matching Active'));
  console.log('Emergency has emergency banner:', emgServices.includes('Emergency Dispatch — Priority Matching Active'));
  console.log('Emergency has 100% surge claim:', emgServices.includes('100% of the emergency surge premium goes directly to the worker.'));
  console.log('Emergency has surge rate badge:', emgServices.includes('Emergency Surge Rate'));

  console.log('\n================================================================');
  console.log('CHECK 4: /auth/login loads usable form');
  console.log('================================================================');
  const authRes = await fetch(baseUrl + '/auth/login');
  const authHtml = await authRes.text();
  console.log('Login status:', authRes.status);
  console.log('Has Gateway title:', authHtml.includes('Multi-Portal Authentication Gateway'));
  console.log('Has Persona Selector:', authHtml.includes('Customer') && authHtml.includes('Tradesperson') && authHtml.includes('Society Admin'));
  console.log('Has 1-Click Demo & Phone OTP buttons:', authHtml.includes('1-Click Hackathon Persona') && authHtml.includes('Mobile Phone OTP'));
  console.log('No hanging loader:', !authHtml.includes('Loading Authentication Gateway...'));

  console.log('\n================================================================');
  console.log('CHECK 5: /portal/admin features');
  console.log('================================================================');
  const adminRes = await fetch(baseUrl + '/portal/admin');
  const adminHtml = await adminRes.text();
  console.log('Admin status:', adminRes.status);
  console.log('Federation Title:', adminHtml.includes('Karnataka Primary Labour Cooperative Federation'));
  console.log('Job Volume / GMV:', adminHtml.includes('Total Federation GMV'));
  console.log('Revenue Split 90% Direct Pay:', adminHtml.includes('90% Direct Pay'));
  console.log('Member Societies Roster:', adminHtml.includes('Kalyan Labour') && adminHtml.includes('Metro Technicians'));
  console.log('Demand Forecasting:', adminHtml.includes('Demand Forecast') || adminHtml.includes('Skill Shortage Alerts'));

  console.log('\n================================================================');
  console.log('CHECK 6: Language selector & translations');
  console.log('================================================================');
  const homeRes = await fetch(baseUrl + '/');
  const homeHtml = await homeRes.text();
  console.log('Header has Change Language aria-label:', homeHtml.includes('Change Language'));
  console.log('Current language label rendered:', homeHtml.includes('English'));

  console.log('\n================================================================');
  console.log('CHECK 7: /portal/worker earnings & splitPayout match');
  console.log('================================================================');
  const workerRes = await fetch(baseUrl + '/portal/worker');
  const workerHtml = await workerRes.text();
  console.log('Worker status:', workerRes.status);
  console.log('Shows 90% direct payout:', workerHtml.includes('₹12,780') && workerHtml.includes('90%'));
  console.log('Accept / Pass actions:', workerHtml.includes('Accept Job'));
  console.log('Welfare balance connection:', workerHtml.includes('/welfare'));

  console.log('\n================================================================');
  console.log('CHECK 8: Worker card verification detail (e-KYC / UAN / police)');
  console.log('================================================================');
  console.log('Worker e-KYC on /services:', emgServices.includes('e-KYC: Verified') || regServices.includes('e-KYC: Verified'));
  console.log('Police verification cleared:', emgServices.includes('Police Verification: Cleared') || regServices.includes('Police Verification: Cleared'));
  console.log('UAN masked:', emgServices.includes('UAN:') || regServices.includes('UAN:'));

  console.log('\n================================================================');
  console.log('CHECK 9: 5 km radius copy');
  console.log('================================================================');
  console.log('Has 5 km on services:', regServices.includes('5 km'));
  console.log('Has 10 km on services:', regServices.includes('10 km') || regServices.includes('10km'));

  console.log('\n================================================================');
  console.log('CHECK 10: /register/worker metadata says 90%');
  console.log('================================================================');
  const regWorkerRes = await fetch(baseUrl + '/register/worker');
  const regWorkerHtml = await regWorkerRes.text();
  console.log('Has 90% in worker reg:', regWorkerHtml.includes('90% direct pay'));
  console.log('Has 80% in worker reg:', regWorkerHtml.includes('80% direct pay'));
  console.log('Has color-coded Accept/Decline:', regWorkerHtml.includes('Yes / Accept') && regWorkerHtml.includes('No / Decline'));
  console.log('Has Hindi Audio Assistance button:', regWorkerHtml.includes('सुनें (Audio)'));

  console.log('\n================================================================');
  console.log('CHECK 11: Data governance footer note');
  console.log('================================================================');
  console.log('Has MeghRaj Cloud:', homeHtml.includes('MeghRaj'));
  console.log('Has DPDP Act 2023:', homeHtml.includes('DPDP Act 2023'));
  console.log('Has Data Commons Model:', homeHtml.includes('Data Commons'));

  console.log('\n================================================================');
  console.log('CHECK 12: Homepage impact stats strip');
  console.log('================================================================');
  console.log('Has 44,859+ Cooperatives:', homeHtml.includes('44,859+'));
  console.log('Has 90% Direct Payout:', homeHtml.includes('90% Direct Payout'));
  console.log('Has Welfare Corpus ₹1.45 Cr+:', homeHtml.includes('₹1.45 Cr+'));
  console.log('Has 5 km radius:', homeHtml.includes('5 km'));
}

testAll().catch(console.error);
