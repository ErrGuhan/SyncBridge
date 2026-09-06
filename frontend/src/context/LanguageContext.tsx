'use client';

import React, { createContext, useContext } from 'react';

export type Language = 'en' | 'hi' | 'kn' | 'ta';

interface TranslationMap {
  [key: string]: {
    en: string;
    hi: string;
    kn: string;
    ta: string;
  };
}

export const translations: TranslationMap = {
  // Navigation & Header
  navHome: { en: 'Home', hi: 'मुख्य पृष्ठ', kn: 'ಮುಖಪುಟ', ta: 'முகப்பு' },
  navServices: { en: 'Services', hi: 'सेवाएं', kn: 'ಸೇವೆಗಳು', ta: 'சேவைகள்' },
  navSearch: { en: 'Services', hi: 'सेवाएं', kn: 'ಸೇವೆಗಳು', ta: 'சேவைகள்' },
  navOrders: { en: 'My Orders', hi: 'मेरे ऑर्डर्स', kn: 'ನನ್ನ ಆದೇಶಗಳು', ta: 'என் ஆர்டர்கள்' },
  navJobs: { en: 'My Orders', hi: 'मेरे ऑर्डर्स', kn: 'ನನ್ನ ಆದೇಶಗಳು', ta: 'என் ஆர்டர்கள்' },
  navWorker: { en: 'Worker Portal', hi: 'कारीगर पोर्टल', kn: 'ಕಾರ್ಮಿಕ ಪೋರ್ಟಲ್', ta: 'தொழிலாளர் போர்டல்' },
  navAdmin: { en: 'Federation Admin', hi: 'फेडरेशन एडमिन', kn: 'ಒಕ್ಕೂಟದ ನಿರ್ವಾಹಕ', ta: 'கூட்டமைப்பு நிர்வாகம்' },
  navCustomer: { en: 'Customer Hub', hi: 'ग्राहक हब', kn: 'ಗ್ರಾಹಕ ಹಬ್', ta: 'வாடிக்கையாளர் மையம்' },
  navManagement: { en: 'Operations Team', hi: 'संचालन टीम', kn: 'ಕಾರ್ಯಾಚರಣೆ ತಂಡ', ta: 'செயல்பாட்டுக் குழு' },
  navDeveloper: { en: 'Technical Console', hi: 'तकनीकी कंसोल', kn: 'ತಾಂತ್ರಿಕ ಕನ್ಸೋಲ್', ta: 'தொழில்நுட்ப முனையம்' },
  navSignIn: { en: 'Sign In', hi: 'साइन इन', kn: 'ಸೈನ್ ಇನ್', ta: 'உள்நுழைக' },
  navSignOut: { en: 'Sign Out', hi: 'साइन आउट', kn: 'ಸೈನ್ ಔಟ್', ta: 'வெளியேறு' },
  navWelfare: { en: 'Welfare Fund', hi: 'कल्याण कोष', kn: 'ಕಲ್ಯಾಣ ನಿಧಿ', ta: 'நல நிதி' },
  navB2B: { en: 'B2B Contracts', hi: 'संस्थागत अनुबंध', kn: 'ಸಂಸ್ಥೆಯ ಒಪ್ಪಂದಗಳು', ta: 'நிறுவன ஒப்பந்தங்கள்' },
  navProfile: { en: 'Profile', hi: 'प्रोफ़ाइल', kn: 'ಪ್ರೊಫೈಲ್', ta: 'சுயவிವರம்' },
  portalsLabel: { en: 'Portals', hi: 'पोर्टल्स', kn: 'ಪೋರ್ಟಲ್‌ಗಳು', ta: 'தளங்கள்' },

  // Header & Controls
  appName: { en: 'SyncBridge Co-op', hi: 'सिंकब्रिज सहकारी', kn: 'ಸಿಂಕ್‌ಬ್ರಿಡ್ಜ್ ಸಹಕಾರಿ', ta: 'சின்க்பிரிட்ஜ் கூட்டுறவு' },
  memberOwned: { en: '100% Worker-Member Owned', hi: '100% कामगार स्वामित्व', kn: '100% ಕಾರ್ಮಿಕರ ಒಡೆತನ', ta: '100% தொழிலாளர் உரிமை' },
  emergencyHelp: { en: 'Emergency SOS', hi: 'आपातकालीन सहायता (SOS)', kn: 'ತುರ್ತು ಸಹಾಯ (SOS)', ta: 'ಅவசர உதவி (SOS)' },
  emergencySOS: { en: 'Emergency SOS', hi: 'आपातकालीन सहायता (SOS)', kn: 'ತುರ್ತು ಸಹಾಯ (SOS)', ta: 'ಅவசர உதவி (SOS)' },
  tapToSpeak: { en: 'Tap to Speak', hi: 'बोलने के लिए दबाएं', kn: 'ಮಾತನಾಡಲು ಒತ್ತಿರಿ', ta: 'பேச தட்டவும்' },
  listening: { en: 'Listening...', hi: 'सुन रहे हैं...', kn: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ...', ta: 'கேட்கிறது...' },
  changeLanguage: { en: 'Change Language', hi: 'भाषा बदलें', kn: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ', ta: 'மொழியை மாற்றவும்' },
  activeLanguages: { en: 'Active Languages', hi: 'सक्रिय भाषाएं', kn: 'ಸಕ್ರಿಯ ಭಾಷೆಗಳು', ta: 'செயலில் உள்ள மொழிகள்' },

  // Footer & Governance
  footerFederationTitle: { en: 'SyncBridge Cooperative Federation', hi: 'सिंकब्रिज सहकारी महासंघ', kn: 'ಸಿಂಕ್‌ಬ್ರಿಡ್ಜ್ ಸಹಕಾರ ಒಕ್ಕೂಟ', ta: 'சின்க்பிரிட்ஜ் கூட்டுறவு கூட்டமைப்பு' },
  footerMemberOwned: { en: '100% Worker-Member Owned', hi: '100% कामगार-सदस्य स्वामित्व', kn: '100% ಕಾರ್ಮಿಕ ಸದಸ್ಯರ ಒಡೆತನ', ta: '100% தொழிலாளர் உறுப்பினர் உரிமை' },
  footerAuditedCharter: { en: 'Audited 90/5/5 Charter', hi: 'ऑडिटेड 90/5/5 चार्टर', kn: 'ಲೆಕ್ಕಪರಿಶೋಧಿತ 90/5/5 ಸನ್ನದು', ta: 'தணிக்கை செய்யப்பட்ட 90/5/5 சாசனம்' },
  footerWorkerTakeHome: { en: 'Worker Take-Home', hi: 'कारीगर की आय', kn: 'ಕಾರ್ಮಿಕರ ಆದಾಯ', ta: 'தொழிலாளர் வருவாய்' },
  footerSocietyReserve: { en: 'Society Reserve', hi: 'समिति आरक्षित कोष', kn: 'ಸಂಘದ ಮೀಸಲು', ta: 'சங்க இருப்பு நிதி' },
  footerWelfareTrust: { en: 'Welfare Trust', hi: 'कल्याण ट्रस्ट', kn: 'ಕಲ್ಯಾಣ ನಿಧಿ', ta: 'நல அறக்கட்டளை' },
  footerHostedOn: { en: 'Hosted on MeghRaj (GI Cloud)', hi: 'मेघराज (सरकारी क्लाउड) पर होस्टेड', kn: 'ಮೇಘ್‌ರಾಜ್ (ಸರ್ಕಾರಿ ಕ್ಲೌಡ್) ನಲ್ಲಿ ಆತಿಥ್ಯ', ta: 'மேக்ராஜ் (அரசு கிளவுட்) இல் வழங்கப்படுகிறது' },
  footerDPDP: { en: 'DPDP Act 2023 Compliant', hi: 'DPDP अधिनियम 2023 अनुपालित', kn: 'DPDP ಕಾಯಿದೆ 2023 ಅನುಸರಣೆ', ta: 'DPDP சட்டம் 2023 இணக்கமானது' },
  footerDataCommons: { en: 'Cooperative Data Commons', hi: 'सहकारी डेटा कॉमन्स', kn: 'ಸಹಕಾರಿ ಡೇಟಾ ಕಾಮನ್ಸ್', ta: 'கூட்டுறவு தரவு பொதுவகம்' },
  footerMinistryNote: { en: 'NCCT / Ministry of Cooperation, Govt. of India', hi: 'एनसीसीटी / सहकारिता मंत्रालय, भारत सरकार', kn: 'ಎನ್‌ಸಿಸಿಟಿ / ಸಹಕಾರ ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರ', ta: 'NCCT / கூட்டுறவு அமைச்சகம், இந்திய அரசு' },

  // Homepage Hero & Impact
  heroHeadline: { 
    en: '90% Payout to Workers. Zero Corporate Cut.', 
    hi: 'कामगारों को 90% भुगतान। शून्य बिचौलिया कमीशन।', 
    kn: 'ಕಾರ್ಮಿಕರಿಗೆ 90% ಪಾವತಿ. ಶೂನ್ಯ ಕಾರ್ಪೊರೇಟ್ ಕಡಿತ.', 
    ta: 'தொழிலாளர்களுக்கு 90% ஊதியம். இடைத்தரகர் பூஜ்ஜியம்.' 
  },
  heroSub: { 
    en: 'Book skilled trade artisans directly without extractive platform middlemen. Fair transparent pricing, same-day settlement, and ₹5 Lakh mutual aid health coverage for every member.', 
    hi: 'शोषक बिचौलियों के बिना सीधे कुशल कामगारों को बुक करें। पारदर्शी मूल्य निर्धारण, उसी दिन भुगतान और ₹5 लाख का पारस्परिक स्वास्थ्य कवर।', 
    kn: 'ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ನುರಿತ ವೃತ್ತಿಪರರನ್ನು ಕಾಯ್ದಿರಿಸಿ. ಪಾರದರ್ಶಕ ಬೆಲೆ, ಅದೇ ದಿನದ ಇತ್ಯರ್ಥ ಮತ್ತು ಪ್ರತಿಯೊಬ್ಬ ಸದಸ್ಯರಿಗೂ ₹5 ಲಕ್ಷ ಆರೋಗ್ಯ ರಕ್ಷಣೆ.', 
    ta: 'இடைத்தரகர்கள் இன்றி திறமையான தொழிலாளர்களை நேரடியாக பதிவு செய்யுங்கள். வெளிப்படையான கட்டணம், உடனடி தீர்வு மற்றும் ₹5 லட்சம் சுகாதார பாதுகாப்பு.' 
  },
  searchPlaceholder: {
    en: 'Search trade, skill, or area (e.g. Electrician, Plumbing, Dadar)...',
    hi: 'काम, हुनर या इलाका खोजें (जैसे इलेक्ट्रीशियन, प्लंबर, दादर)...',
    kn: 'ವೃತ್ತಿ, ಕೌಶಲ್ಯ ಅಥವಾ ಸ್ಥಳವನ್ನು ಹುಡುಕಿ (ಉದಾ: ಎಲೆಕ್ಟ್ರಿಷಿಯನ್, ಕೊಳಾಯಿ, ಇಂದಿರಾನಗರ)...',
    ta: 'தொழில் அல்லது பகுதியைத் தேடுங்கள் (எ.கா. எலக்ட்ரீசியன், பிளம்பிங்)...'
  },
  findArtisanBtn: { en: 'Find Artisan', hi: 'कारीगर खोजें', kn: 'ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಿ', ta: 'கைவினைஞரைக் கண்டுபிடி' },
  popularServices: { en: 'Popular Services', hi: 'लोकप्रिय सेवाएं', kn: 'ಜನಪ್ರಿಯ ಸೇವೆಗಳು', ta: 'பிரபலமான சேவைகள்' },

  // 4-Stat Strip
  statsCoops: { en: 'Primary Cooperatives Digitized', hi: 'प्राथमिक सहकारी समितियां डिजिटाइज़्ड', kn: 'ಡಿಜಿಟಲೀಕೃತ ಪ್ರಾಥಮಿಕ ಸಹಕಾರ ಸಂಘಗಳು', ta: 'டிஜிட்டல் கூட்டுறவு சங்கங்கள்' },
  statsRetention: { en: '90% Direct Payout', hi: '90% सीधा भुगतान', kn: '90% ನೇರ ಪಾವತಿ', ta: '90% நேரடி ஊதியம்' },
  statsCorpus: { en: 'Mutual Aid Welfare Corpus', hi: 'पारस्परिक सहायता कल्याण कोष', kn: 'ಪರಸ್ಪರ ನೆರವಿನ ಕಲ್ಯಾಣ ನಿಧಿ', ta: 'பரಸ್ಪರ நல நிதி' },
  statsRadius: { en: '5 km Geofenced Radius', hi: '5 किमी सेवा दायरा', kn: '5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿ', ta: '5 கி.ಮೀ உள்ளூர் ஆரம்' },

  // Services Directory
  servicesTitle: { en: 'Cooperative Trade Directory', hi: 'सहकारी कारीगर निर्देशिका', kn: 'ಸಹಕಾರಿ ವೃತ್ತಿಪರರ ಡೈರೆಕ್ಟರಿ', ta: 'கூட்டுறவு தொழிலாளர் அடைவு' },
  servicesSubtitle: { en: 'Book certified trade workers directly within 5 km. 90% direct artisan pay.', hi: '5 किमी के भीतर प्रमाणित कामगार सीधे बुक करें। 90% सीधा भुगतान।', kn: '5 ಕಿ.ಮೀ ಒಳಗೆ ಪ್ರಮಾಣೀಕೃತ ಕಾರ್ಮಿಕರನ್ನು ನೇರವಾಗಿ ಕಾಯ್ದಿರಿಸಿ. 90% ನೇರ ಪಾವತಿ.', ta: '5 கி.மீ எல்லைக்குள் சான்றளிக்கப்பட்ட தொழிலாளர்களை பதிவு செய்யுங்கள். 90% நேரடி ஊதியம்.' },
  findServiceTitle: { en: 'What help do you need?', hi: 'आपको क्या मदद चाहिए?', kn: 'ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?', ta: 'உங்களுக்கு என்ன உதவி வேண்டும்?' },
  findServiceSubtitle: { en: 'Tap a card or speak to book directly with verified member-workers', hi: 'सत्यापित कामगारों से सीधे जुड़ने के लिए कार्ड दबाएं या बोलें', kn: 'ಪರಿಶೀಲಿಸಿದ ಸದಸ್ಯ-ಕಾರ್ಮಿಕರನ್ನು ಸಂಪರ್ಕಿಸಲು ಕಾರ್ಡ್ ಒತ್ತಿರಿ', ta: 'சரிபார்க்கப்பட்ட தொழிலாளர்களை முன்பதிவு செய்ய கார்டைத் தட்டவும்' },
  swipePrompt: { en: '👉 Swipe left/right to see more services', hi: '👉 और सेवाएं देखने के लिए बाएं/दाएं स्वाइप करें', kn: '👉 ಇನ್ನಷ್ಟು ಸೇವೆಗಳಿಗಾಗಿ ಎಡಕ್ಕೆ/ಬಲಕ್ಕೆ ಸ್ವೈಪ್ ಮಾಡಿ', ta: '👉 கூடுதல் சேவைகளைக் காண இடது/வலதுபுறம் ஸ்வைப் செய்யவும்' },

  // Emergency Mode
  emergencyBannerTitle: { en: 'Emergency Dispatch — Priority Matching Active', hi: 'आपातकालीन प्रेषण — प्राथमिकता मिलान सक्रिय', kn: 'ತುರ್ತು ರವಾನೆ — ಆದ್ಯತೆಯ ಹೊಂದಾಣಿಕೆ ಸಕ್ರಿಯವಾಗಿದೆ', ta: 'அவசர அனுப்புதல் — முன்னுரிமை பொருத்தம் செயலில் உள்ளது' },
  emergencySurgeClaim: { 
    en: '100% of the emergency surge premium goes directly to the worker — the cooperative and welfare fund take zero cut on emergency callouts.', 
    hi: 'आपातकालीन सर्ज प्रीमियम का 100% सीधे कामगार को जाता है — सहकारी समिति और कल्याण कोष आपातकालीन कॉल पर शून्य कटौती करते हैं।', 
    kn: 'ತುರ್ತು ಸರ್ಜ್ ಪ್ರೀಮಿಯಂನ 100% ನೇರವಾಗಿ ಕಾರ್ಮಿಕರಿಗೆ ಹೋಗುತ್ತದೆ — ಸಹಕಾರ ಸಂಘ ಮತ್ತು ಕಲ್ಯಾಣ ನಿಧಿಯು ತುರ್ತು ಸೇವೆಗೆ ಯಾವುದೇ ಕಡಿತ ಮಾಡುವುದಿಲ್ಲ.', 
    ta: 'அவசர கூடுதல் கட்டணத்தின் 100% நேரடியாக தொழிலாளிக்கே செல்கிறது — கூட்டுறவு சங்கம் அவசர அழைப்புகளில் எந்தப் பங்கும் எடுப்பதில்லை.' 
  },
  exitEmergencyMode: { en: 'Exit Emergency Mode', hi: 'सामान्य मोड पर लौटें', kn: 'ತುರ್ತು ಮೋಡ್‌ನಿಂದ ನಿರ್ಗಮಿಸಿ', ta: 'அவசர பயன்முறையிலிருந்து வெளியேறு' },
  emergencySurgeBadge: { en: 'Emergency Surge Rate', hi: 'आपातकालीन सर्ज दर', kn: 'ತುರ್ತು ಸರ್ಜ್ ದರ', ta: 'அவசர கூடுதல் கட்டணம்' },

  // Trade Categories
  plumbing: { en: 'Plumber', hi: 'प्लंबर (नल मिस्त्री)', kn: 'ಪ್ಲಂಬರ್ (ಕೊಳವೆ ಕೆಲಸ)', ta: 'பிளம்பர் (குழாய்)' },
  plumbingDesc: { en: 'Water leak, tap repair, pipe fitting', hi: 'पानी का रिसाव, नल की मरम्मत, पाइप फिटिंग', kn: 'ನೀರು ಸೋರಿಕೆ, ಕೊಳಾಯಿ ದುರಸ್ತಿ', ta: 'தண்ணீர் கசிவு, குழாய் பழுது' },
  electrical: { en: 'Electrician', hi: 'इलेक्ट्रीशियन (बिजली)', kn: 'ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ (ವಿದ್ಯುತ್)', ta: 'ಎலக்ட்್ರೀಸಿಯನ್ (மின்சாரம்)' },
  electricalDesc: { en: 'Short circuit, wiring, fan, switches', hi: 'शॉर्ट सर्किट, वायरिंग, पंखा, स्विच', kn: 'ವೈರಿಂಗ್, ಫ್ಯಾನ್, ಸ್ವಿಚ್ ರಿಪೇರಿ', ta: 'ஷார்ட் சர்க்யூட், வயரிங், சுவிட்ச்' },
  cleaning: { en: 'Cleaner', hi: 'सफाई कर्मी', kn: 'ಸ್ವಚ್ಛತಾ ಕೆಲಸಗಾರ', ta: 'சுத்தம் செய்பவர்' },
  cleaningDesc: { en: 'House deep cleaning, water tank wash', hi: 'घर की गहरी सफाई, पानी की टंकी धोना', kn: 'ಮನೆ ಸ್ವಚ್ಛತೆ, ನೀರಿನ ತೊಟ್ಟಿ ಸ್ವಚ್ಛತೆ', ta: 'வீடு முழு சுத்தம், தொட்டி சுத்தம்' },
  appliance: { en: 'AC & Appliance', hi: 'एसी और फ्रिज मरम्मत', kn: 'ಎಸಿ & ಉಪಕರಣ ರಿಪೇರಿ', ta: 'ஏசி & உபகரண பழுது' },
  applianceDesc: { en: 'AC gas fill, fridge & washing machine', hi: 'एसी गैस, फ्रिज और वाशिंग मशीन', kn: 'ಎಸಿ ಗ್ಯಾಸ್, ಫ್ರಿಡ್ಜ್, ವಾಷಿಂಗ್ ಮೆಷಿನ್', ta: 'ஏசி கேஸ், பிரிட்ஜ் பழுது' },
  carpentry: { en: 'Carpenter', hi: 'बढ़ई (लकड़ी का काम)', kn: 'ಬಡಗಿ (ಮರದ ಕೆಲಸ)', ta: 'தச்சர் (மர வேலை)' },
  carpentryDesc: { en: 'Door lock, furniture fix, wood work', hi: 'दरवाजे का ताला, फर्नीचर मरम्मत', kn: 'ಬಾಗಿಲು ಲಾಕ್, ಪೀಠೋಪಕರಣ ಕೆಲಸ', ta: 'கதவு பூட்டு, மர சாமான்கள்' },

  // Portals
  portalWorkerTitle: { en: 'Artisan Cooperative Workspace', hi: 'कारीगर सहकारी कार्यक्षेत्र', kn: 'ಕುಶಲಕರ್ಮಿ ಸಹಕಾರಿ ಕಾರ್ಯಕ್ಷೇತ್ರ', ta: 'கைவினைஞர் கூட்டுறவு பணியிடம்' },
  portalAdminTitle: { en: 'Federation Operations & Governance', hi: 'महासंघ संचालन एवं लोकतांत्रिक शासन', kn: 'ಒಕ್ಕೂಟದ ಕಾರ್ಯಾಚರಣೆ ಮತ್ತು ಆಡಳಿತ', ta: 'கூட்டமைப்பு செயல்பாடுகள் மற்றும் ஆளுமை' },
  portalCustomerTitle: { en: 'Customer Service Hub', hi: 'ग्राहक सेवा केंद्र', kn: 'ಗ್ರಾಹಕ ಸೇವಾ ಕೇಂದ್ರ', ta: 'வாடிக்கையாளர் சேவை மையம்' },

  // B2B Portal Keys
  b2bBannerTag: { en: 'Institutional Demand & Public Enterprise Contracts', hi: 'संस्थागत मांग और सार्वजनिक अनुबंध', kn: 'ಸಾಂಸ್ಥಿಕ ಬೇಡಿಕೆ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಒಪ್ಪಂದಗಳು', ta: 'நிறுவன தேவை மற்றும் பொதுத்துறை ஒப்பந்தங்கள்' },
  b2bTitle: { en: 'Institutional Anchor Demand & B2B / B2G Facility Management', hi: 'संस्थागत मुख्य मांग एवं बी2बी / बी2जी सुविधा प्रबंधन', kn: 'ಸಾಂಸ್ಥಿಕ ಪ್ರಮುಖ ಬೇಡಿಕೆ ಮತ್ತು ಬಿ2ಬಿ / ಬಿ2ಜಿ ಸೌಲಭ್ಯ ನಿರ್ವಹಣೆ', ta: 'நிறுவன தேவை மற்றும் பி2பி / பி2ஜி வசதி மேலாண்மை' },
  b2bSubtitle: { en: 'Public-Private-Cooperative Partnerships anchoring primary labour cooperatives with long-term, high-volume maintenance contracts.', hi: 'प्राथमिक श्रम सहकारी समितियों को दीर्घकालिक, उच्च-मात्रा रखरखाव अनुबंधों से जोड़ने वाली साझेदारी।', kn: 'ಪ್ರಾಥಮಿಕ ಕಾರ್ಮಿಕ ಸಹಕಾರ ಸಂಘಗಳಿಗೆ ದೀರ್ಘಕಾಲೀನ, ಹೆಚ್ಚಿನ ಪ್ರಮಾಣದ ನಿರ್ವಹಣಾ ಒಪ್ಪಂದಗಳು.', ta: 'தொடக்க தொழிலாளர் கூட்டுறவு சங்கங்களுக்கு நீண்டகால, அதிக அளவிலான பராமரிப்பு ஒப்பந்தங்கள்.' },
  b2bStatHours: { en: 'Guaranteed Demand Baseline', hi: 'गारंटीकृत मांग आधार', kn: 'ಖಾತರಿಯ ಬೇಡಿಕೆ ಆಧಾರ', ta: 'உத்தரவாத தேவை அடிப்படை' },
  b2bStatSLA: { en: '7-Day Payout SLA', hi: '7-दिवसीय भुगतान एसएलए', kn: '7 ದಿನಗಳ ಪಾವತಿ ಎಸ್‌ಎಲ್‌ಎ', ta: '7-நாள் தீர்வு காலக்கெடு' },
  b2bStatCompliance: { en: 'SLA Compliance', hi: 'एसएलए अनुपालन', kn: 'ಎಸ್‌ಎಲ್‌ಎ ಅನುಸರಣೆ', ta: 'ஒப்பந்த இணக்கம்' },
  b2bLedgerTitle: { en: 'Active Municipal & Cooperative Frameworks', hi: 'सक्रिय नगरपालिका एवं सहकारी अनुबंध', kn: 'ಸಕ್ರಿಯ ಪುರಸಭೆ ಮತ್ತು ಸಹಕಾರಿ ಒಪ್ಪಂದಗಳು', ta: 'செயலில் உள்ள நகராட்சி மற்றும் கூட்டுறவு ஒப்பந்தங்கள்' },
  b2bIssueRfq: { en: 'Issue an Institutional Maintenance RFQ', hi: 'संस्थागत रखरखाव आरएफक्यू जारी करें', kn: 'ಸಾಂಸ್ಥಿಕ ನಿರ್ವಹಣಾ RFQ ಸಲ್ಲಿಸಿ', ta: 'நிறுவன பராமரிப்பு RFQ சமர்ப்பிக்கவும்' },
  b2bSubmitRfq: { en: 'Submit Institutional RFQ', hi: 'आरएफक्यू सबमिट करें', kn: 'RFQ ಸಲ್ಲಿಸಿ', ta: 'RFQ ಸಮர்ப்பிக்கவும்' },

  // Customer Portal Keys
  customerHubBadge: { en: 'Customer Service Hub • 1% Guarantee Recourse Active', hi: 'ग्राहक सेवा केंद्र • 1% गारंटी सुरक्षा सक्रिय', kn: 'ಗ್ರಾಹಕ ಸೇವಾ ಕೇಂದ್ರ • 1% ಗ್ಯಾರಂಟಿ ಸಕ್ರಿಯ', ta: 'வாடிக்கையாளர் மையம் • 1% உத்தரவாதம் செயலில்' },
  welcomeCustomer: { en: 'Welcome back', hi: 'वापसी पर स्वागत है', kn: 'ಮರಳಿ ಸುಸ್ವಾಗತ', ta: 'மீண்டும் நல்வரவு' },
  customerSub: { en: 'Directly book certified cooperative tradespeople within 5 km. Every booking provides 90% direct pay to the artisan with zero platform markups.', hi: '5 किमी के भीतर प्रमाणित सहकारी कारीगर बुक करें। हर बुकिंग से 90% सीधा भुगतान कारीगर को जाता है।', kn: '5 ಕಿ.ಮೀ ಒಳಗೆ ಪ್ರಮಾಣೀಕೃತ ಕುಶಲಕರ್ಮಿಗಳನ್ನು ಬುಕ್ ಮಾಡಿ. ಪ್ರತಿ ಬುಕಿಂಗ್ 90% ನೇರ ಪಾವತಿ ನೀಡುತ್ತದೆ.', ta: '5 கி.மீ எல்லைக்குள் சான்றளிக்கப்பட்ட தொழிலாளர்களை பதிவு செய்யுங்கள். 90% நேரடி ஊதியம்.' },
  allOrdersBtn: { en: 'All Orders', hi: 'सभी ऑर्डर्स', kn: 'ಎಲ್ಲಾ ಆರ್ಡರ್‌ಗಳು', ta: 'அனைத்து முன்பதிவுகள்' },
  geminiAssistantTitle: { en: 'Gemini AI Home Diagnostic Assistant', hi: 'जेमिनी एआई गृह निदान सहायक', kn: 'ಜೆಮಿನಿ AI ಗೃಹ ತಪಾಸಣಾ ಸಹಾಯಕ', ta: 'ஜெமினி AI வீட்டு பழுது கண்டறியும் உதவியாளர்' },
  geminiAssistantSub: { en: 'Describe or snap a photo of any household issue to instantly diagnose the trade, tools, and fair quote range.', hi: 'समस्या का वर्णन करें या फोटो खींचें — सही कारीगर और निष्पक्ष दर तुरंत जानें।', kn: 'ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ ಅಥವಾ ಫೋಟೋ ತೆಗೆಯಿರಿ — ಸರಿಯಾದ ಕೆಲಸಗಾರ ಮತ್ತು ದರ ತಿಳಿಯಿರಿ.', ta: 'சிக்கலை விவரிக்கவும் அல்லது புகைப்படம் எடுக்கவும் — சரியான தொழிலாளியை உடனே அறியலாம்.' },

  // Worker Portal Keys
  workerVerifiedBadge: { en: 'Verified Cooperative Member • Kalyan Labour Society', hi: 'सत्यापित सहकारी सदस्य • कल्याण श्रम सहकारी समिति', kn: 'ದೃಢೀಕೃತ ಸಹಕಾರಿ ಸದಸ್ಯ • ಕಲ್ಯಾಣ ಕಾರ್ಮಿಕ ಸಂಘ', ta: 'சரிபார்க்கப்பட்ட உறுப்பினர் • கல்யாண் தொழிலாளர் சங்கம்' },
  onlineStatus: { en: 'Online (Receiving Jobs)', hi: 'ऑनलाइन (काम प्राप्त हो रहा है)', kn: 'ಆನ್‌ಲೈನ್ (ಕೆಲಸ ಸ್ವೀಕರಿಸಲಾಗುತ್ತಿದೆ)', ta: 'ஆன்லைன் (வேலை பெற தயாராக)' },
  offlineStatus: { en: 'Offline', hi: 'ऑफलाइन', kn: 'ಆಫ್‌ಲೈನ್', ta: 'ஆஃப்லைன்' },
  sosModeOn: { en: 'SOS Mode ON', hi: 'एसओएस मोड चालू', kn: 'SOS ಮೋಡ್ ಆನ್', ta: 'SOS பயன்முறை ஆன்' },
  sosEmergencyOptIn: { en: 'Emergency Opt-In', hi: 'आपातकालीन मोड', kn: 'ತುರ್ತು ಮೋಡ್ ಸೇರಿ', ta: 'அவசர நிலை பதிவு' },
  availableWallet: { en: 'Available 90% Wallet Balance', hi: 'उपलब्ध 90% वॉलेट बैलेंस', kn: 'ಲಭ್ಯವಿರುವ 90% ವಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್', ta: 'கிடைக்கும் 90% இருப்புத் தொகை' },
  withdrawUpi: { en: 'Instant Withdraw to UPI / Bank', hi: 'तुरंत यूपीआई / बैंक में निकालें', kn: 'ಯುಪಿಐ / ಬ್ಯಾಂಕ್‌ಗೆ ತಕ್ಷಣ ವಿತ್‌ಡ್ರಾ ಮಾಡಿ', ta: 'யுபிஐ / வங்கிக்கு உடனே மாற்றவும்' },
  activeJobEscrow: { en: 'Active Job Escrow (In Transit)', hi: 'सक्रिय एस्क्रो (प्रक्रियाधीन)', kn: 'ಸಕ್ರಿಯ ಎಸ್ಕ್ರೋ (ಪ್ರಗತಿಯಲ್ಲಿದೆ)', ta: 'செயலில் உள்ள எஸ்க்ரோ (பரிசீலனையில்)' },
  pensionCorpus: { en: 'Accrued Pension Corpus (5% Pool)', hi: 'संचित पेंशन कोष (5% हिस्सा)', kn: 'ಸಂಗ್ರಹವಾದ ಪಿಂಚಣಿ ನಿಧಿ (5% ಪಾಲು)', ta: 'திரட்டப்பட்ட ஓய்வூதிய நிதி (5% பங்கு)' },
  weeklyBreakdownTitle: { en: 'Weekly Cooperative Earnings & 90/5/5 Breakdown', hi: 'साप्ताहिक सहकारी आय एवं 90/5/5 विवरण', kn: 'ವಾರದ ಸಹಕಾರಿ ಗಳಿಕೆ ಮತ್ತು 90/5/5 ವಿಭಜನೆ', ta: 'வாராந்திர கூட்டுறவு வருமானம் & 90/5/5 விவரம்' },
  workerTakeHome: { en: '90% Worker Take-Home', hi: '90% कारीगर को सीधा', kn: '90% ಕಾರ್ಮಿಕರ ಆದಾಯ', ta: '90% தொழிலாளர் ஊதியம்' },
  societyTreasuryShare: { en: '5% Society Operational Treasury', hi: '5% समिति संचालन कोष', kn: '5% ಸಂಘದ ಕಾರ್ಯಾಚರಣೆ ನಿಧಿ', ta: '5% சங்க செயல்பாட்டு நிதி' },
  mutualAidShare: { en: '5% Mutual Aid & Healthcare', hi: '5% कल्याण व स्वास्थ्य कोष', kn: '5% ಪರಸ್ಪರ ನೆರವು & ಆರೋಗ್ಯ', ta: '5% பரஸ்பர உதவி & சுகாதாரம்' },
  activeJobTitle: { en: 'ACTIVE JOB IN PROGRESS', hi: 'सक्रिय काम जारी है', kn: 'ಪ್ರಗತಿಯಲ್ಲಿರುವ ಸಕ್ರಿಯ ಕೆಲಸ', ta: 'செயலில் உள்ள வேலை' },
  acceptJobBtn: { en: 'Accept Job (Lock Dispatch)', hi: 'काम स्वीकारें (लॉक करें)', kn: 'ಕೆಲಸ ಸ್ವೀಕರಿಸಿ (ಲಾಕ್ ಮಾಡಿ)', ta: 'வேலையை ஏற்றுக்கொள்' },
  passJobBtn: { en: 'Pass to Peer', hi: 'साथी कारीगर को भेजें', kn: 'ಸಹೋದ್ಯೋಗಿಗೆ ವರ್ಗಾಯಿಸಿ', ta: 'மற்றவருக்கு மாற்று' },
  completeJobBtn: { en: 'Mark Completed', hi: 'काम पूरा घोषित करें', kn: 'ಕೆಲಸ ಮುಕ್ತಾಯಗೊಳಿಸಿ', ta: 'முழுமை எனக் குறிக்கவும்' },

  // Admin Portal Keys
  adminFederationTag: { en: 'Cooperative Federation Operations Console • NCCT Affiliated', hi: 'सहकारी महासंघ संचालन कंसोल • एनसीईटी संबद्ध', kn: 'ಸಹಕಾರಿ ಒಕ್ಕೂಟದ ಕಾರ್ಯಾಚರಣೆ ಕನ್ಸೋಲ್ • NCCT ಸಂಯೋಜಿತ', ta: 'கூட்டுறவு கூட்டமைப்பு செயல்பாட்டு தளம் • NCCT இணைவு' },
  adminFederationTitle: { en: 'Karnataka Primary Labour Cooperative Federation', hi: 'कर्नाटक प्राथमिक श्रम सहकारी महासंघ', kn: 'ಕರ್ನಾಟಕ ಪ್ರಾಥಮಿಕ ಕಾರ್ಮಿಕ ಸಹಕಾರ ಒಕ್ಕೂಟ', ta: 'கர்நாடக தொடக்க தொழிலாளர் கூட்டுறவு கூட்டமைப்பு' },
  quorumActive: { en: 'Federation Quorum Active', hi: 'महासंघ कोरम सक्रिय', kn: 'ಒಕ್ಕೂಟದ ಕೋರಂ ಸಕ್ರಿಯ', ta: 'கூட்டமைப்பு குழுமம் செயலில்' },
  tabOverview: { en: 'Federation Overview & Revenue', hi: 'महासंघ अवलोकन एवं राजस्व', kn: 'ಒಕ್ಕೂಟದ ಅವಲೋಕನ ಮತ್ತು ಆದಾಯ', ta: 'கூட்டமைப்பு கண்ணோட்டம் & வருவாய்' },
  tabForecasting: { en: 'AI Demand Forecasting', hi: 'एआई मांग पूर्वानुमान', kn: 'AI ಬೇಡಿಕೆ ಮುನ್ಸೂಚನೆ', ta: 'AI தேவை முன்கணிப்பு' },
  tabDisputes: { en: 'Peer Arbitration Queue', hi: 'सहकर्मी मध्यस्थता कतार', kn: 'ಮಧ್ಯಸ್ಥಿಕೆ ಸಾಲು', ta: 'மத்தியஸ்த வரிசை' },
  tabVerifications: { en: 'e-KYC Verifications', hi: 'ई-केवाईसी सत्यापन', kn: 'ಇ-ಕೆವೈಸಿ ಪರಿಶೀಲನೆಗಳು', ta: 'மின்-கேஒய்சி சரிபார்ப்பு' },
  tabTools: { en: 'Equipment Fleet', hi: 'साझा उपकरण भंडार', kn: 'ಉಪಕರಣಗಳ ದಾಸ್ತಾನು', ta: 'உபகரணங்கள் இருப்பு' },
  totalGmvLabel: { en: 'Total Federation GMV', hi: 'कुल महासंघ व्यापार (GMV)', kn: 'ಒಟ್ಟು ಒಕ್ಕೂಟದ ಜಿಎಂವಿ', ta: 'மொத்த வர்த்தக மதிப்பு (GMV)' },

  // Auth Login Keys
  authGatewayTitle: { en: 'Sign In to Your Dedicated Portal', hi: 'अपने समर्पित पोर्टल में साइन इन करें', kn: 'ನಿಮ್ಮ ಮೀಸಲಾದ ಪೋರ್ಟಲ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ', ta: 'உங்கள் போர்ட்டலில் உள்நுழைக' },
  authGatewaySubtitle: { en: 'SyncBridge provides role-separated environments for Customers, Tradespeople, and Societies.', hi: 'सिंकब्रिज ग्राहकों, कारीगरों और समितियों के लिए समर्पित कार्यक्षेत्र प्रदान करता है।', kn: 'ಗ್ರಾಹಕರು, ಕಾರ್ಮಿಕರು ಮತ್ತು ಸಂಘಗಳಿಗಾಗಿ ಮೀಸಲಾದ ವ್ಯವಸ್ಥೆ.', ta: 'வாடிக்கையாளர்கள், தொழிலாளர்கள் மற்றும் சங்கங்களுக்கான தனித்தனி தளம்.' },
  authPersonaHeading: { en: 'Select Active Persona & Access Domain:', hi: 'सक्रिय प्रोफ़ाइल एवं क्षेत्र चुनें:', kn: 'ಸಕ್ರಿಯ ವ್ಯಕ್ತಿತ್ವ ಮತ್ತು ಪ್ರವೇಶ ಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ:', ta: 'செயலில் உள்ள சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்:' },
  authDemoMode: { en: '1-Click Hackathon Persona', hi: '1-क्लिक डेमो प्रोफाइल', kn: '1-ಕ್ಲಿಕ್ ಡೆಮೊ ಪ್ರವೇಶ', ta: '1-கிளிக் டெமோ சுயவிவரம்' },
  authOtpMode: { en: 'Mobile Phone OTP', hi: 'मोबाइल फोन ओटीपी', kn: 'ಮೊಬೈಲ್ ಫೋನ್ ಒಟಿಪಿ', ta: 'மொபைல் OTP' },
  authPasswordMode: { en: 'Email & Password', hi: 'ईमेल एवं पासवर्ड', kn: 'ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್', ta: 'மின்னஞ்சல் & கடவுச்சொல்' },
  authRoleCustomer: { en: 'Customer', hi: 'ग्राहक', kn: 'ಗ್ರಾಹಕರು', ta: 'வாடிக்கையாளர்' },
  authRoleWorker: { en: 'Tradesperson', hi: 'कारीगर', kn: 'ಕುಶಲಕರ್ಮಿ', ta: 'தொழிலாளி' },
  authRoleAdmin: { en: 'Society Admin', hi: 'समिति प्रशासक', kn: 'ಸಂಘದ ಆಡಳಿತಾಧಿಕಾರಿ', ta: 'சங்க நிர்வாகி' },
  authRoleManagement: { en: 'Operations Team', hi: 'संचालन टीम', kn: 'ಕಾರ್ಯಾಚರಣಾ ತಂಡ', ta: 'செயல்பாட்டு குழு' },
  authRoleDev: { en: 'Technical Console', hi: 'तकनीकी कंसोल', kn: 'ತಾಂತ್ರಿಕ ಕನ್ಸೋಲ್', ta: 'தொழில்நுட்ப தளம்' },

  // Action Buttons & Badges
  bookNow: { en: 'Book Now', hi: 'अभी बुक करें', kn: 'ಈಗಲೇ ಕಾಯ್ದಿರಿಸಿ', ta: 'இப்போதே பதிவு செய்' },
  perHour: { en: '/hour', hi: '/घंटा', kn: '/ಗಂಟೆಗೆ', ta: '/மணிநேரம்' },
  callWorker: { en: 'Call Worker', hi: 'कामगार को कॉल करें', kn: 'ಕಾರ್ಮಿಕರಿಗೆ ಕರೆ ಮಾಡಿ', ta: 'தொழிலாளியை அழைக்கவும்' },
  workerOnWay: { en: 'Worker is on the way!', hi: 'कामगार रास्ते में है!', kn: 'ಕಾರ್ಮಿಕರು ದಾರಿಯಲ್ಲಿದ್ದಾರೆ!', ta: 'தொழிலாளி வருகிறார்!' },
  jobCompleted: { en: 'Job Completed Safely', hi: 'काम सुरक्षित रूप से पूरा हुआ', kn: 'ಕೆಲಸ ಪೂರ್ಣಗೊಂಡಿದೆ', ta: 'வேலை பாதுகாப்பாக முடிந்தது' },
  waitingWorker: { en: 'Finding Nearby Worker...', hi: 'पास के कामगार को ढूंढ रहे हैं...', kn: 'ಹತ್ತಿರದ ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...', ta: 'அருகிலுள்ள தொழிலாளியைத் தேடுகிறது...' },
  payoutBadge: { en: '90% directly to worker', hi: '90% सीधा कामगार को', kn: '90% ನೇರವಾಗಿ ಕಾರ್ಮಿಕರಿಗೆ', ta: '90% நேரடியாக தொழிலாளிக்கு' },

  // Economic Difference Section
  coopDiffTitle: { en: 'The Cooperative Economic Difference', hi: 'सहकारी आर्थिक लाभ व पारदर्शिता', kn: 'ಸಹಕಾರ ಆರ್ಥಿಕ ವ್ಯತ್ಯಾಸ ಮತ್ತು ಪಾರದರ್ಶಕತೆ', ta: 'கூட்டுறவு பொருளாதார வேறுபாடு' },
  coopDiffDesc: { en: 'Transparent financial distribution where capital serves labour, not corporate intermediaries.', hi: 'पारदर्शी वित्तीय वितरण जहां पूंजी कामगार की सेवा करती है, बिचौलियों की नहीं।', kn: 'ಬಂಡವಾಳವು ಕಾರ್ಮಿಕರಿಗೆ ನೇರವಾಗಿ ತಲುಪುವ ಪಾರದರ್ಶಕ ಆರ್ಥಿಕ ಮಾದರಿ.', ta: 'கார்ப்பரேட் இடைத்தரகர்கள் இன்றி உழைப்புக்கே முன்னுரிமை அளிக்கும் பகிர்வு.' },
  directCompTitle: { en: 'Direct Worker Compensation', hi: 'सीधा कारीगर पारिश्रमिक', kn: 'ನೇರ ಕಾರ್ಮಿಕ ಸಂಭಾವನೆ', ta: 'நேரடி தொழிலாளர் ஊதியம்' },
  directCompDesc: { en: 'Settled immediately via UPI to the member\'s wallet upon completion. Zero commission clawbacks.', hi: 'काम पूरा होते ही सीधे यूपीआई द्वारा कामगार के खाते में। शून्य कमीशन कटौती।', kn: 'ಕೆಲಸ ಪೂರ್ಣಗೊಂಡ ತಕ್ಷಣ ಯುಪಿಐ ಮೂಲಕ ನೇರ ಜಮೆ. ಶೂನ್ಯ ಕಮಿಷನ್ ಕಡಿತ.', ta: 'வேலை முடிந்ததும் யுபிஐ மூலம் உடனடி தீர்வு. கமிஷன் பிடித்தம் இல்லை.' },
  societyTreasuryTitle: { en: 'Primary Society Treasury', hi: 'प्राथमिक समिति खजाना कोष', kn: 'ಪ್ರಾಥಮಿಕ ಸಂಘದ ಬೊಕ್ಕಸ', ta: 'தொடக்க சங்க இருப்பு நிதி' },
  societyTreasuryDesc: { en: 'Retained democratically by the local chapter for shared heavy power tool libraries and ops.', hi: 'साझा भारी मशीनरी व उपकरण बैंक के लिए स्थानीय समिति द्वारा संरक्षित।', kn: 'ಭಾರೀ ಯಂತ್ರೋಪಕರಣಗಳು ಮತ್ತು ನಿರ್ವಹಣೆಗಾಗಿ ಸ್ಥಳೀಯ ಸಂಘದಿಂದ ಉಳಿತಾಯ.', ta: 'பகிரப்பட்ட கருவிகள் மற்றும் இயக்கத்திற்காக உள்ளூர் சங்கத்தால் சேமிக்கப்படுகிறது.' },
  welfareShieldTitle: { en: 'Welfare & Health Shield', hi: 'कल्याण व स्वास्थ्य सुरक्षा', kn: 'ಕಲ್ಯಾಣ ಮತ್ತು ಆರೋಗ್ಯ ರಕ್ಷಣೆ', ta: 'நலன் மற்றும் சுகாதார கவசம்' },
  welfareShieldDesc: { en: 'Funds ₹5 Lakh emergency medical hospitalization, disability cover, and a 1% customer guarantee reserve.', hi: '₹5 लाख तक का अस्पताल व स्वास्थ्य बीमा, दुर्घटना कवर और 1% ग्राहक गारंटी।', kn: '₹5 ಲಕ್ಷ ತುರ್ತು ವೈದ್ಯಕೀಯ ವಿಮೆ, ಅಂಗವೈಕಲ್ಯ ರಕ್ಷಣೆ ಮತ್ತು 1% ಗ್ರಾಹಕ ಗ್ಯಾರಂಟಿ.', ta: '₹5 லட்சம் அவசர மருத்துவ காப்பீடு மற்றும் 1% வாடிக்கையாளர் உத்தரவாதம்.' },

  // Verified Artisans Section
  verifiedArtisansTitle: { en: 'Verified Cooperative Artisans', hi: 'सत्यापित सहकारी कारीगर', kn: 'ಪರಿಶೀಲಿಸಿದ ಸಹಕಾರಿ ಕುಶಲಕರ್ಮಿಗಳು', ta: 'சரிபார்க்கப்பட்ட கூட்டுறவு கைவினைஞர்கள்' },
  verifiedArtisansSub: { en: 'Top-rated tradespeople available in your district right now.', hi: 'आपके जिले में इस समय उपलब्ध सर्वश्रेष्ठ रेटेड कारीगर।', kn: 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ಉನ್ನತ ದರ್ಜೆಯ ವೃತ್ತಿಪರರು.', ta: 'உங்கள் பகுதியில் தற்போது கிடைக்கும் சிறந்த தொழிலாளர்கள்.' },
  viewAllArtisans: { en: 'View all 65+ artisans', hi: 'सभी 65+ कारीगर देखें', kn: 'ಎಲ್ಲಾ 65+ ಕುಶಲಕರ್ಮಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ', ta: 'அனைத்து 65+ தொழிலாளர்களையும் காண்க' },

  // Onboarding Banner
  joinAsWorkerTitle: { en: 'Are you a skilled trade worker or cooperative society?', hi: 'क्या आप कुशल कारीगर या सहकारी समिति हैं?', kn: 'ನೀವು ನುರಿತ ಕೆಲಸಗಾರರೇ ಅಥವಾ ಸಹಕಾರ ಸಂಘವೇ?', ta: 'நீங்கள் திறமையான தொழிலாளியா அல்லது கூட்டுறவு சங்கமா?' },
  joinAsWorkerDesc: { en: 'Join SyncBridge today. Keep 90% of your earnings, get ₹5 Lakh health insurance, and be an owner in your trade.', hi: 'आज ही सिंकब्रिज से जुड़ें। 90% कमाई अपने पास रखें और ₹5 लाख का स्वास्थ्य बीमा पाएं।', kn: 'ಇಂದೇ ಸಿಂಕ್‌ಬ್ರಿಡ್ಜ್‌ಗೆ ಸೇರಿ. ನಿಮ್ಮ ಗಳಿಕೆಯ 90% ಉಳಿಸಿಕೊಳ್ಳಿ ಮತ್ತು ₹5 ಲಕ್ಷ ಆರೋಗ್ಯ ವಿಮೆ ಪಡೆಯಿರಿ.', ta: 'இன்றே சின்க்பிரிட்ஜில் இணையுங்கள். 90% வருவாயைப் பெறுங்கள், ₹5 லட்சம் மருத்துவ காப்பீடு பெறுங்கள்.' },
  registerAsWorkerBtn: { en: 'Register as Member-Worker', hi: 'सदस्य-कारीगर के रूप में जुड़ें', kn: 'ಸದಸ್ಯ-ಕಾರ್ಮಿಕರಾಗಿ ನೋಂದಾಯಿಸಿ', ta: 'உறுப்பினர்-தொழிலாளராக பதிவு செய்யவும்' },

  // Bookings & Tracking
  bookingsTitle: { en: 'Active Bookings & Trade Orders', hi: 'सक्रिय बुकिंग व ऑर्डर्स', kn: 'ಸಕ್ರಿಯ ಬುಕಿಂಗ್ ಮತ್ತು ಆರ್ಡರ್‌ಗಳು', ta: 'செயலில் உள்ள முன்பதிவுகள்' },
  bookingsSubtitle: { en: 'Real-time dispatch tracking with transparent 90/5/5 cooperative dividend accounting.', hi: 'पारदर्शी 90/5/5 लाभांश ब्योरे के साथ रीयल-टाइम ट्रैकिंग।', kn: 'ಪಾರದರ್ಶಕ 90/5/5 ಲೆಕ್ಕಪತ್ರದೊಂದಿಗೆ ನೈಜ-ಸಮಯದ ಟ್ರ್ಯಾಕಿಂಗ್.', ta: 'வெளிப்படையான 90/5/5 கணக்குடன் நேரடி கண்காணிப்பு.' },
  disputeArbitration: { en: 'Dispute / Peer Arbitration', hi: 'विवाद / सहकर्मी मध्यस्थता', kn: 'ವಿವಾದ / ಮಧ್ಯಸ್ಥಿಕೆ', ta: 'சர்ச்சை / மத்தியஸ்தம்' },

  // Welfare Portal
  welfareHeading: { en: 'Cooperative Mutual Aid & Social Welfare Trust', hi: 'सहकारी पारस्परिक सहायता एवं कल्याण कोष', kn: 'ಸಹಕಾರಿ ಪರಸ್ಪರ ನೆರವು ಮತ್ತು ಕಲ್ಯಾಣ ನಿಧಿ', ta: 'கூட்டுறவு பரஸ்பர உதவி மற்றும் சமூக நல நிதி' },
  welfareSub: { en: 'Every completed job automatically channels 5% into this transparent social security corpus.', hi: 'हर पूर्ण काम का 5% सीधे इस पारदर्शी सामाजिक सुरक्षा कोष में जाता है।', kn: 'ಪ್ರತಿಯೊಂದು ಪೂರ್ಣಗೊಂಡ ಕೆಲಸದ 5% ನೇರವಾಗಿ ಈ ಸಾಮಾಜಿಕ ಭದ್ರತಾ ನಿಧಿಗೆ ಜಮೆಯಾಗುತ್ತದೆ.', ta: 'ஒவ்வொரு நிறைவடைந்த வேலையிலிருந்தும் 5% இந்த சமூக பாதுகாப்பு நிதியில் சேர்கிறது.' },
  totalCorpusLabel: { en: 'Total Welfare Corpus', hi: 'कुल कल्याण कोष', kn: 'ಒಟ್ಟು ಕಲ್ಯಾಣ ನಿಧಿ', ta: 'மொத்த நல நிதி' },
  healthShieldCap: { en: 'Family Health Shield', hi: 'परिवार स्वास्थ्य कवच', kn: 'ಕುಟುಂಬ ಆರೋಗ್ಯ ರಕ್ಷಣೆ', ta: 'குடும்ப சுகாதார கவசம்' },

  // B2B Contracts Portal
  b2bHeading: { en: 'B2B & Government Institutional Services', hi: 'संस्थागत एवं सरकारी अनुबंध सेवाएं', kn: 'ಸಂಸ್ಥೆ ಮತ್ತು ಸರ್ಕಾರಿ ಗುತ್ತಿಗೆ ಸೇವೆಗಳು', ta: 'நிறுவன மற்றும் அரசு சேவை ஒப்பந்தங்கள்' },
  b2bSub: { en: 'Hire verified cooperative labour clusters with GeM integration and SLA guarantees.', hi: 'GeM एकीकरण और SLA गारंटी के साथ प्रमाणित सहकारी कामगारों को अनुबंधित करें।', kn: 'GeM ಸಂಯೋಜನೆ ಮತ್ತು SLA ಗ್ಯಾರಂಟಿಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿದ ಸಹಕಾರಿ ಕಾರ್ಮಿಕರನ್ನು ನೇಮಿಸಿ.', ta: 'GeM மற்றும் SLA உத்தரவாதத்துடன் சான்றளிக்கப்பட்ட தொழிலாளர்களை அமர்த்தவும்.' },
  requestQuote: { en: 'Request Contract Proposal', hi: 'अनुबंध प्रस्ताव मांगें', kn: 'ಗುತ್ತಿಗೆ ಪ್ರಸ್ತಾವನೆ ವಿನಂತಿಸಿ', ta: 'ஒப்பந்த முன்மொழிவைக் கோருங்கள்' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

const LANG_STORE_EVENT = 'syncbridge_lang_update';

function subscribeToLang(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(LANG_STORE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(LANG_STORE_EVENT, callback);
  };
}

function getStoredLangSnapshot(): Language {
  try {
    const saved = localStorage.getItem('syncbridge_lang') as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'kn' || saved === 'ta')) {
      return saved;
    }
  } catch {
    // ignore storage error
  }
  return 'en';
}

function getServerLangSnapshot(): Language {
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = React.useSyncExternalStore<Language>(subscribeToLang, getStoredLangSnapshot, getServerLangSnapshot);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem('syncbridge_lang', lang);
      window.dispatchEvent(new Event(LANG_STORE_EVENT));
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || item.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
