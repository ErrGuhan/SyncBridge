import { TranslationItem } from './common';

export const servicesTranslations: Record<string, TranslationItem> = {
  // Page Heading & Controls
  servicesTitle: { 
    en: 'Cooperative Trade Directory', 
    hi: 'सहकारी कारीगर निर्देशिका', 
    kn: 'ಸಹಕಾರಿ ವೃತ್ತಿಪರರ ಡೈರೆಕ್ಟರಿ', 
    ta: 'கூட்டுறவு தொழிலாளர் அடைவு' 
  },
  servicesSubtitle: { 
    en: 'Book certified trade workers directly within 5 km. 90% direct artisan pay.', 
    hi: '5 किमी के भीतर प्रमाणित कामगार सीधे बुक करें। 90% सीधा भुगतान।', 
    kn: '5 ಕಿ.ಮೀ ಒಳಗೆ ಪ್ರಮಾಣೀಕೃತ ಕಾರ್ಮಿಕರನ್ನು ನೇರವಾಗಿ ಕಾಯ್ದಿರಿಸಿ. 90% ನೇರ ಪಾವತಿ.', 
    ta: '5 கி.மீ எல்லைக்குள் சான்றளிக்கப்பட்ட தொழிலாளர்களை பதிவு செய்யுங்கள். 90% நேரடி ஊதியம்.' 
  },
  payoutBannerBadge: {
    en: '90% paid directly to artisan',
    hi: '90% सीधा कारीगर को भुगतान',
    kn: '90% ನೇರವಾಗಿ ಕುಶಲಕರ್ಮಿಗಳಿಗೆ ಪಾವತಿಸಲಾಗಿದೆ',
    ta: '90% நேரடியாக தொழிலாளிக்கு செலுத்தப்படுகிறது'
  },
  searchPlaceholderServices: {
    en: 'Search trade, artisan, or locality (e.g. Plumber, Ramesh, Indiranagar)...',
    hi: 'काम, कारीगर या इलाका खोजें (जैसे प्लंबर, रमेश, इंदिरानगर)...',
    kn: 'ವೃತ್ತಿ, ಕೆಲಸಗಾರ ಅಥವಾ ಸ್ಥಳ ಹುಡುಕಿ (ಉದಾ: ಪ್ಲಂಬರ್, ರಮೇಶ್, ಇಂದಿರಾನಗರ)...',
    ta: 'தொழில், தொழிலாளி அல்லது இடம் தேடுங்கள் (எ.கா. பிளம்பர், ரமேஷ்)...'
  },
  useGpsBtn: {
    en: 'Detect GPS',
    hi: 'जीपीएस पता करें',
    kn: 'ಜಿಪಿಎಸ್ ಪತ್ತೆಹಚ್ಚಿ',
    ta: 'ஜிபிஎஸ் கண்டறி'
  },
  detectingLocation: {
    en: 'Detecting Location...',
    hi: 'स्थान खोज रहे हैं...',
    kn: 'ಸ್ಥಳ ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ...',
    ta: 'இருப்பிடம் கண்டறியப்படுகிறது...'
  },
  activePerimeterLabel: {
    en: '5 km Radius Active',
    hi: '5 किमी दायरा सक्रिय',
    kn: '5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿ ಸಕ್ರಿಯ',
    ta: '5 கி.ಮೀ சுற்றளவு செயலில்'
  },

  // Emergency Mode
  emergencyBannerTitle: { 
    en: 'Emergency Priority Dispatch Active', 
    hi: 'आपातकालीन प्रेषण — प्राथमिकता मिलान सक्रिय', 
    kn: 'ತುರ್ತು ರವಾನೆ — ಆದ್ಯತೆಯ ಹೊಂದಾಣಿಕೆ ಸಕ್ರಿಯವಾಗಿದೆ', 
    ta: 'அவசர அனுப்புதல் — முன்னுரிமை பொருத்தம் செயலில் உள்ளது' 
  },
  emergencySurgeClaim: { 
    en: '100% of the emergency surge premium goes directly to the worker — the cooperative and welfare fund take zero cut on emergency callouts.', 
    hi: 'आपातकालीन सर्ज प्रीमियम का 100% सीधे कामगार को जाता है — सहकारी समिति और कल्याण कोष आपातकालीन कॉल पर शून्य कटौती करते हैं।', 
    kn: 'ತುರ್ತು ಸರ್ಜ್ ಪ್ರೀಮಿಯಂನ 100% ನೇರವಾಗಿ ಕಾರ್ಮಿಕರಿಗೆ ಹೋಗುತ್ತದೆ — ಸಹಕಾರ ಸಂಘ ಮತ್ತು ಕಲ್ಯಾಣ ನಿಧಿಯು ತುರ್ತು ಸೇವೆಗೆ ಯಾವುದೇ ಕಡಿತ ಮಾಡುವುದಿಲ್ಲ.', 
    ta: 'அவசர கூடுதல் கட்டணத்தின் 100% நேரடியாக தொழிலாளிக்கே செல்கிறது — கூட்டுறவு சங்கம் அவசர அழைப்புகளில் எந்தப் பங்கும் எடுப்பதில்லை.' 
  },
  exitEmergencyMode: { 
    en: 'Exit Emergency Mode', 
    hi: 'सामान्य मोड पर लौटें', 
    kn: 'ತುರ್ತು ಮೋಡ್‌ನಿಂದ ನಿರ್ಗಮಿಸಿ', 
    ta: 'அவசர பயன்முறையிலிருந்து வெளியேறு' 
  },
  emergencySupportedTrades: {
    en: 'Supported Emergency Trades:',
    hi: 'सहायता प्राप्त आपातकालीन सेवाएं:',
    kn: 'ಬೆಂಬಲಿತ ತುರ್ತು ಸೇವೆಗಳು:',
    ta: 'ஆதரிக்கப்படும் அவசர சேவைகள்:'
  },
  emergencyPerimeterNote: {
    en: '5 km Geofenced Perimeter • Redis Lock Mutex Active',
    hi: '5 किमी जीपीएस दायरा • रेडीस लॉक सक्रिय',
    kn: '5 ಕಿ.ಮೀ ಜಿಯೋಫೆನ್ಸ್ • ರೆಡಿಸ್ ಲಾಕ್ ಸಕ್ರಿಯ',
    ta: '5 கி.மீ எல்லை • ரெடிஸ் லாக் செயலில் உள்ளது'
  },

  // Category Tabs
  catAllServices: { en: 'All Trades', hi: 'सभी कार्य', kn: 'ಎಲ್ಲಾ ಸೇವೆಗಳು', ta: 'அனைத்து சேவைகள்' },
  activeArtisansCount: { en: '{count} artisans active', hi: '{count} कारीगर उपलब्ध', kn: '{count} ಕುಶಲಕರ್ಮಿಗಳು ಲಭ್ಯ', ta: '{count} தொழிலாளர்கள் தயார்' },
  startingRateLabel: { en: 'From {rate}', hi: '{rate} से', kn: '{rate} ರಿಂದ', ta: '{rate} முதல்' },

  // Worker Profile Card
  statusAvailable: { en: 'Available Now', hi: 'अभी उपलब्ध', kn: 'ಈಗ ಲಭ್ಯವಿದೆ', ta: 'இப்போது கிடைக்கும்' },
  statusBusy: { en: 'On Dispatch', hi: 'काम पर व्यस्त', kn: 'ಕೆಲಸದಲ್ಲಿದ್ದಾರೆ', ta: 'பணியில் உள்ளார்' },
  statusOffline: { en: 'Offline', hi: 'ऑफलाइन', kn: 'ಆಫ್‌ಲೈನ್', ta: 'ஆஃப்லைன்' },
  distanceAway: { en: '{km} km away', hi: '{km} किमी दूर', kn: '{km} ಕಿ.ಮೀ ದೂರ', ta: '{km} கி.மீ தொலைவில்' },
  memberSince: { en: 'Member since {year}', hi: '{year} से सदस्य', kn: '{year} ರಿಂದ ಸದಸ್ಯರು', ta: '{year} முதல் உறுப்பினர்' },
  reviewsCount: { en: '({count} peer reviews)', hi: '({count} सहकर्मी समीक्षाएं)', kn: '({count} ವಿಮರ್ಶೆಗಳು)', ta: '({count} மதிப்பீடுகள்)' },
  skillsBadge: { en: 'Specialities:', hi: 'विशेषताएं:', kn: 'ವಿಶೇಷತೆಗಳು:', ta: 'சிறப்புகள்:' },
  bookArtisanBtn: { en: 'Book Direct', hi: 'सीधे बुक करें', kn: 'ನೇರವಾಗಿ ಕಾಯ್ದಿರಿಸಿ', ta: 'நேரடியாக பதிவு செய்' },

  // Booking Confirmation Modal
  confirmModalTitle: { en: 'Confirm Direct Dispatch', hi: 'सीधे प्रेषण की पुष्टि करें', kn: 'ನೇರ ರವಾನೆಯನ್ನು ದೃಢೀಕರಿಸಿ', ta: 'நேரடி அனுப்புதலை உறுதி செய்' },
  confirmModalSubtitle: { en: 'Instant lock with transparent 90/5/5 cooperative dividend accounting', hi: 'पारदर्शी 90/5/5 सहकारी लाभांश ब्योरे के साथ तत्काल पुष्टि', kn: 'ಪಾರದರ್ಶಕ 90/5/5 ಲೆಕ್ಕಪತ್ರದೊಂದಿಗೆ ತಕ್ಷಣ ದೃಢೀಕರಿಸಿ', ta: 'வெளிப்படையான 90/5/5 கூட்டுறவு கணக்குடன் உடனடி உறுதி' },
  serviceDetailsHeading: { en: 'Service Details', hi: 'सेवा विवरण', kn: 'ಸೇವಾ ವಿವರಗಳು', ta: 'சேவை விவரங்கள்' },
  artisanLabel: { en: 'Artisan:', hi: 'कारीगर:', kn: 'ಕುಶಲಕರ್ಮಿ:', ta: 'கைவினைஞர்:' },
  societyLabel: { en: 'Society Chapter:', hi: 'स्थानीय सहकारी समिति:', kn: 'ಸಹಕಾರ ಸಂಘ:', ta: 'கூட்டுறவு சங்கம்:' },
  serviceLocationLabel: { en: 'Service Address:', hi: 'सेवा का पता:', kn: 'ಸೇವಾ ವಿಳಾಸ:', ta: 'சேவை முகவரி:' },
  issueDescLabel: { en: 'Issue Summary:', hi: 'समस्या विवरण:', kn: 'ಸಮಸ್ಯೆಯ ವಿವರ:', ta: 'சிக்கல் சுருக்கம்:' },
  breakdownHeading: { en: 'Transparent Financial Distribution (90/5/5)', hi: 'पारदर्शी वित्तीय वितरण (90/5/5)', kn: 'ಪಾರದರ್ಶಕ ಆರ್ಥಿಕ ವಿತರಣೆ (90/5/5)', ta: 'வெளிப்படையான நிதிப் பகிர்வு (90/5/5)' },
  shareWorker: { en: '90% Direct Artisan Take-Home:', hi: '90% सीधा कारीगर की जेब में:', kn: '90% ನೇರ ಕುಶಲಕರ್ಮಿ ಆದಾಯ:', ta: '90% தொழிலாளர் நேரடி வருவாய்:' },
  shareSociety: { en: '5% Society Power-Tool Pool:', hi: '5% समिति साझा उपकरण बैंक:', kn: '5% ಸಂಘದ ಯಂತ್ರೋಪಕರಣ ನಿಧಿ:', ta: '5% சங்கத்தின் கருவி நிதி:' },
  shareWelfare: { en: '5% Mutual Aid & Healthcare Shield:', hi: '5% सामाजिक सुरक्षा व स्वास्थ्य कोष:', kn: '5% ಸಾಮಾಜಿಕ ಭದ್ರತೆ & ಆರೋಗ್ಯ ನಿಧಿ:', ta: '5% சமூக நலன் & சுகாதார கவசம்:' },
  emergencySurgePremium: { en: 'Emergency Surge (100% to artisan):', hi: 'आपातकालीन सर्ज (100% कारीगर को):', kn: 'ತುರ್ತು ಸರ್ಜ್ (100% ಕಾರ್ಮಿಕರಿಗೆ):', ta: 'அவசர கூடுதல் தொகை (100% தொழிலாளிக்கு):' },
  grossTotalPayable: { en: 'Total Payable Amount:', hi: 'कुल देय राशि:', kn: 'ಒಟ್ಟು ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ:', ta: 'செலுத்த வேண்டிய மொத்தத் தொகை:' },
  confirmAndDispatchBtn: { en: 'Confirm & Dispatch Artisan', hi: 'पुष्टि करें एवं कारीगर भेजें', kn: 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ಕೆಲಸಗಾರರನ್ನು ಕಳುಹಿಸಿ', ta: 'உறுதி செய்து தொழிலாளியை அனுப்பு' },
  submittingDispatch: { en: 'Locking Dispatch Mutex...', hi: 'कारीगर आवंटित हो रहा है...', kn: 'ರವಾನೆ ಲಾಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ...', ta: 'அனுப்புதல் உறுதி செய்யப்படுகிறது...' },

  // Confirmed Order View
  confirmedHeading: { en: 'Dispatch Confirmed & Locked!', hi: 'प्रेषण की पुष्टि हुई और लॉक हो गया!', kn: 'ರವಾನೆ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ!', ta: 'அனுப்புதல் உறுதி செய்யப்பட்டது!' },
  confirmedSubtitle: { en: 'Your artisan has been assigned. Follow their live arrival status below.', hi: 'कारीगर को काम सौंप दिया गया है। नीचे उनका लाइव आगमन देखें।', kn: 'ನಿಮ್ಮ ಕೆಲಸಗಾರರನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ. ಅವರ ಆಗಮನವನ್ನು ಕೆಳಗೆ ಗಮನಿಸಿ.', ta: 'தொழிலாளி நியமிக்கப்பட்டுள்ளார். நேரடி வருகையை கீழே காண்க.' },
  trackLiveBtn: { en: 'Track in My Orders', hi: 'मेरे ऑर्डर्स में ट्रैक करें', kn: 'ನನ್ನ ಆದೇಶಗಳಲ್ಲಿ ಗಮನಿಸಿ', ta: 'என் ஆர்டர்களில் கண்காணிக்கவும்' },
  bookAnotherBtn: { en: 'Book Another Trade', hi: 'दूसरा काम बुक करें', kn: 'ಮತ್ತೊಂದು ಕೆಲಸ ಕಾಯ್ದಿರಿಸಿ', ta: 'வேறொரு சேவையை பதிவு செய்' },
  noArtisansFound: { en: 'No artisans match your criteria in this 5 km area.', hi: 'इस 5 किमी क्षेत्र में कोई कारीगर नहीं मिला।', kn: 'ಈ 5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಯಾವುದೇ ಕೆಲಸಗಾರರು ಕಂಡುಬಂದಿಲ್ಲ.', ta: 'இந்த 5 கி.மீ எல்லைக்குள் தொழிலாளர்கள் கிடைக்கவில்லை.' },
  clearFiltersBtn: { en: 'Reset Search Filters', hi: 'फिल्टर रीसेट करें', kn: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ', ta: 'வடிகட்டிகளை மீட்டமை' }
};
