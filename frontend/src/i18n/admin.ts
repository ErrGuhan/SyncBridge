import { TranslationItem } from './common';

export const adminTranslations: Record<string, TranslationItem> = {
  // Federation Header
  adminFederationTag: { 
    en: 'Cooperative Federation Operations Console • NCCT Affiliated', 
    hi: 'सहकारी महासंघ संचालन कंसोल • एनसीईटी संबद्ध', 
    kn: 'ಸಹಕಾರಿ ಒಕ್ಕೂಟದ ಕಾರ್ಯಾಚರಣೆ ಕನ್ಸೋಲ್ • NCCT ಸಂಯೋಜಿತ', 
    ta: 'கூட்டுறவு கூட்டமைப்பு செயல்பாட்டு தளம் • NCCT இணைவு' 
  },
  adminFederationTitle: { 
    en: 'Karnataka Primary Labour Cooperative Federation', 
    hi: 'कर्नाटक प्राथमिक श्रम सहकारी महासंघ', 
    kn: 'ಕರ್ನಾಟಕ ಪ್ರಾಥಮಿಕ ಕಾರ್ಮಿಕ ಸಹಕಾರ ಒಕ್ಕೂಟ', 
    ta: 'கர்நாடக தொடக்க தொழிலாளர் கூட்டுறவு கூட்டமைப்பு' 
  },
  quorumActive: { 
    en: 'Federation Quorum Active', 
    hi: 'महासंघ कोरम सक्रिय', 
    kn: 'ಒಕ್ಕೂಟದ ಕೋರಂ ಸಕ್ರಿಯ', 
    ta: 'கூட்டமைப்பு குழுமம் செயலில்' 
  },
  totalGmvLabel: { 
    en: 'Total Federation GMV', 
    hi: 'कुल महासंघ व्यापार (GMV)', 
    kn: 'ಒಟ್ಟು ಒಕ್ಕೂಟದ ಜಿಎಂವಿ', 
    ta: 'மொத்த வர்த்தக மதிப்பு (GMV)' 
  },

  // Tabs
  tabOverview: { en: 'Federation Overview & Revenue', hi: 'महासंघ अवलोकन एवं राजस्व', kn: 'ಒಕ್ಕೂಟದ ಅವಲೋಕನ ಮತ್ತು ಆದಾಯ', ta: 'கூட்டமைப்பு கண்ணோட்டம் & வருவாய்' },
  tabForecasting: { en: 'AI Demand Forecasting', hi: 'एआई मांग पूर्वानुमान', kn: 'AI ಬೇಡಿಕೆ ಮುನ್ಸೂಚನೆ', ta: 'AI தேவை முன்கணிப்பு' },
  tabDisputes: { en: 'Peer Arbitration Queue', hi: 'सहकर्मी मध्यस्थता कतार', kn: 'ಮಧ್ಯಸ್ಥಿಕೆ ಸಾಲು', ta: 'மத்தியஸ்த வரிசை' },
  tabVerifications: { en: 'e-KYC Verifications', hi: 'ई-केवाईसी सत्यापन', kn: 'ಇ-ಕೆವೈಸಿ ಪರಿಶೀಲನೆಗಳು', ta: 'மின்-கேஒய்சி சரிபார்ப்பு' },
  tabTools: { en: 'Equipment Fleet', hi: 'साझा उपकरण भंडार', kn: 'ಉಪಕರಣಗಳ ದಾಸ್ತಾನು', ta: 'உபகரணங்கள் இருப்பு' },

  // Overview Metrics Cards
  metricGmvValue: { en: '₹4.82 Cr', hi: '₹4.82 करोड़', kn: '₹4.82 ಕೋಟಿ', ta: '₹4.82 கோடி' },
  metricGmvSubtitle: { en: '90% directly disbursed to artisan accounts via instant UPI settlement', hi: '90% सीधे यूपीआई द्वारा कारीगरों के खातों में वितरित', kn: '90% ನೇರವಾಗಿ ಕಾರ್ಮಿಕರ ಖಾತೆಗಳಿಗೆ ಜಮೆಯಾಗಿದೆ', ta: '90% தொழிலாளர்களின் கணக்குகளுக்கு நேரடியாக வழங்கப்பட்டது' },
  metricActiveArtisans: { en: 'Active Accredited Members', hi: 'सक्रिय मान्यता प्राप्त सदस्य', kn: 'ಸಕ್ರಿಯ ಮಾನ್ಯತೆ ಪಡೆದ ಸದಸ್ಯರು', ta: 'செயலில் உள்ள அங்கீகரிக்கப்பட்ட உறுப்பினர்கள்' },
  metricPrimarySocieties: { en: 'Primary Labour Societies Digitized', hi: 'डिजिटाइज़्ड प्राथमिक श्रम समितियां', kn: 'ಡಿಜಿಟಲೀಕೃತ ಪ್ರಾಥಮಿಕ ಸಂಘಗಳು', ta: 'டிஜிட்டல் தொடக்க சங்கங்கள்' },
  metricWelfareCorpus: { en: 'Welfare Fund Corpus Balance', hi: 'कल्याण कोष आरक्षित शेष', kn: 'ಕಲ್ಯಾಣ ನಿಧಿಯ ಒಟ್ಟು ಮೊತ್ತ', ta: 'நல நிதி இருப்புத் தொகை' },

  // e-KYC Verifications Queue
  verifyQueueTitle: { en: 'Artisan e-KYC & Trade Accreditation Queue', hi: 'कारीगर ई-केवाईसी एवं प्रमाणन कतार', kn: 'ಕಾರ್ಮಿಕರ ಇ-ಕೆವೈಸಿ ಮತ್ತು ಪ್ರಮಾಣೀಕರಣ ಸಾಲು', ta: 'தொழிலாளர் மின்-கேஒய்சி சரிபார்ப்பு வரிசை' },
  verifyQueueSub: { en: 'Democratic review of trade licenses, government e-Shram UANs, and police certificates.', hi: 'व्यावसायिक लाइसेंस, ई-श्रम यूएएन और चरित्र सत्यापन की लोकतांत्रिक समीक्षा।', kn: 'ವೃತ್ತಿಪರ ಪರವಾನಗಿಗಳು ಮತ್ತು ಇ-ಶ್ರಮ್ ಪರಿಶೀಲನೆ.', ta: 'தொழில் உரிமங்கள் மற்றும் இ-ஷ்ரம் சரிபார்ப்பு.' },
  btnApproveWorker: { en: 'Approve Member Accreditation', hi: 'सदस्यता स्वीकृत करें', kn: 'ಮಾನ್ಯತೆ ಅನುಮೋದಿಸಿ', ta: 'உறுப்பினர் சேர்க்கையை ஏற்றுக்கொள்' },
  btnRejectWorker: { en: 'Request Re-verification', hi: 'पुनः सत्यापन का अनुरोध करें', kn: 'ಮರು ಪರಿಶೀಲನೆಗೆ ವಿನಂತಿಸಿ', ta: 'மறு சரிபார்ப்பு கோருக' },
  viewDocsModalBtn: { en: 'Inspect Verification Vault', hi: 'दस्तावेज देखें', kn: 'ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ', ta: 'ஆவணங்களை சரிபார்க்கவும்' },

  // Peer Arbitration Queue
  arbitrationTitle: { en: 'Democratic Peer Arbitration & Restorative Justice Queue', hi: 'सहकर्मी मध्यस्थता एवं न्याय परिषद', kn: 'ಪ್ರಜಾಸತ್ತಾತ್ಮಕ ಸಹೋದ್ಯೋಗಿ ಮಧ್ಯಸ್ಥಿಕೆ ಸಾಲು', ta: 'சக தொழிலாளர் மத்தியஸ்தம் & நீதி சபை' },
  arbitrationSub: { en: 'Zero algorithmic bans. Customer disputes and ratings are evaluated by fellow master artisans.', hi: 'शून्य मनमाना खाता प्रतिबंध। विवादों का निपटारा साथी वरिष्ठ कारीगरों द्वारा।', kn: 'ಯಾವುದೇ ಅಲ್ಗಾರಿದಮಿಕ್ ನಿರ್ಬಂಧಗಳಿಲ್ಲ. ಹಿರಿಯ ಕಾರ್ಮಿಕರಿಂದ ನ್ಯಾಯಯುತ ನಿರ್ಧಾರ.', ta: 'அல்காரிதம் மூலம் தன்னிச்சையான முடக்கம் இல்லை. சக தொழிலாளர்களால் தீர்ப்பு.' },
  btnRestoreStanding: { en: 'Restore Standing (Overrule Deactivation)', hi: 'प्रतिबंध हटाएं (खाता बहाल करें)', kn: 'ಖಾತೆ ಮರುಸ್ಥಾಪಿಸಿ', ta: 'கணக்கை மீட்டெடு (முடக்கத்தை ரத்து செய்)' },
  btnApproveGuarantee: { en: 'Approve 1% Customer Guarantee Remedy', hi: '1% ग्राहक भरपाई स्वीकृत करें', kn: '1% ಗ್ರಾಹಕ ಪರಿಹಾರ ಅನುಮೋದಿಸಿ', ta: '1% வாடிக்கையாளர் இழப்பீட்டை ஏற்றுக்கொள்' },

  // AI Demand Forecasting
  forecastTitle: { en: 'Geospatial AI Demand Forecasting & Pre-Dispatch Mobilization', hi: 'भू-स्थानिक एआई मांग पूर्वानुमान एवं तैयारी', kn: 'ಭೌಗೋಳಿಕ AI ಬೇಡಿಕೆ ಮುನ್ಸೂಚನೆ', ta: 'புவிசார் AI தேவை முன்கணிப்பு' },
  forecastSub: { en: 'Predicts high-density weekend spikes across municipal wards using historical cooperative telemetry.', hi: 'ऐतिहासिक डेटा के आधार पर आगामी सप्ताहांत में मांग का सटीक पूर्वानुमान।', kn: 'ಐತಿಹಾಸಿಕ ಮಾಹಿತಿಯನ್ನು ಬಳಸಿಕೊಂಡು ವಾರಾಂತ್ಯದ ಬೇಡಿಕೆಯನ್ನು ಊಹಿಸುತ್ತದೆ.', ta: 'முந்தைய தரவுகளைக் கொண்டு வார இறுதி தேவையை முன்கணிக்கிறது.' },
  btnBroadcastAlert: { en: 'Broadcast Mobilization Alert', hi: 'कारीगरों को चेतावनी भेजें', kn: 'ಎಚ್ಚರಿಕೆಯ ಸಂದೇಶ ಕಳುಹಿಸಿ', ta: 'தயார்நிலை எச்சரிக்கையை அனுப்பு' },
  alertDispatchedSuccess: { en: 'Alert broadcasted to all local guild members!', hi: 'सभी स्थानीय कारीगरों को संदेश भेजा गया!', kn: 'ಎಲ್ಲಾ ಸ್ಥಳೀಯ ಕಾರ್ಮಿಕರಿಗೆ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ!', ta: 'அனைத்து உள்ளூர் தொழிலாளர்களுக்கும் எச்சரிக்கை அனுப்பப்பட்டது!' }
};
