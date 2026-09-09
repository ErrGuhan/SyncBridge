export interface TranslationItem {
  en: string;
  hi: string;
  kn: string;
  ta: string;
}

export const commonTranslations: Record<string, TranslationItem> = {
  // Navigation
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
  openWorkspace: { en: 'Open Worker Workspace', hi: 'कारीगर कार्यक्षेत्र खोलें', kn: 'ಕಾರ್ಮಿಕ ಕಾರ್ಯಕ್ಷೇತ್ರ ತೆರೆಯಿರಿ', ta: 'தொழிலாளர் பணியிடம் திறக்கவும்' },
  openAdminConsole: { en: 'Open Admin Console', hi: 'प्रशासक कंसोल खोलें', kn: 'ನಿರ್ವಾಹಕ ಕನ್ಸೋಲ್ ತೆರೆಯಿರಿ', ta: 'நிர்வாக கன்சோல் திறக்கவும்' },
  openCustomerPortal: { en: 'Open Customer Portal', hi: 'ग्राहक पोर्टल खोलें', kn: 'ಗ್ರಾಹಕ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ', ta: 'வாடிக்கையாளர் தளம் திறக்கவும்' },

  // Header & Controls
  appName: { en: 'SyncBridge Co-op', hi: 'सिंकब्रिज सहकारी', kn: 'ಸಿಂಕ್‌ಬ್ರಿಡ್ಜ್ ಸಹಕಾರಿ', ta: 'சின்க்பிரிட்ஜ் கூட்டுறவு' },
  memberOwned: { en: '100% Worker-Member Owned', hi: '100% कामगार स्वामित्व', kn: '100% ಕಾರ್ಮಿಕರ ಒಡೆತನ', ta: '100% தொழிலாளர் உரிமை' },
  emergencyHelp: { en: 'Emergency SOS', hi: 'आपातकालीन सहायता (SOS)', kn: 'ತುರ್ತು ಸಹಾಯ (SOS)', ta: 'அவசர உதவி (SOS)' },
  emergencySOS: { en: 'Emergency SOS', hi: 'आपातकालीन सहायता (SOS)', kn: 'ತುರ್ತು ಸಹಾಯ (SOS)', ta: 'அவசர உதவி (SOS)' },
  emergencyLabel: { en: 'Emergency', hi: 'आपातकाल', kn: 'ತುರ್ತು', ta: 'அவசரம்' },
  tapToSpeak: { en: 'Tap to Speak', hi: 'बोलने के लिए दबाएं', kn: 'ಮಾತನಾಡಲು ಒತ್ತಿರಿ', ta: 'பேச தட்டவும்' },
  listening: { en: 'Listening...', hi: 'सुन रहे हैं...', kn: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ...', ta: 'கேட்கிறது...' },
  changeLanguage: { en: 'Change Language', hi: 'भाषा बदलें', kn: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ', ta: 'மொழியை மாற்றவும்' },
  activeLanguages: { en: 'Active Languages', hi: 'सक्रिय भाषाएं', kn: 'ಸಕ್ರಿಯ ಭಾಷೆಗಳು', ta: 'செயலில் உள்ள மொழிகள்' },
  upcomingLanguages: { en: 'Upcoming (Eighth Schedule)', hi: 'शीघ्र आ रही भाषाएं (आठवीं अनुसूची)', kn: 'ಮುಂಬರುವ ಭಾಷೆಗಳು (ಎಂಟನೇ ಅನುಸೂಚಿ)', ta: 'வரவிருக்கும் மொழிகள் (எட்டாவது அட்டவணை)' },
  bhashiniNote: { en: 'Bhashini AI translation integration active', hi: 'भाषिणी एआई अनुवाद एकीकरण सक्रिय', kn: 'ಭಾಷಿಣಿ AI ಅನುವಾದ ಸಕ್ರಿಯವಾಗಿದೆ', ta: 'பாஷினி AI மொழிபெயர்ப்பு ஒருங்கிணைப்பு செயலில் உள்ளது' },

  // Universal Actions
  bookNow: { en: 'Book Now', hi: 'अभी बुक करें', kn: 'ಈಗಲೇ ಕಾಯ್ದಿರಿಸಿ', ta: 'இப்போதே பதிவு செய்' },
  confirm: { en: 'Confirm', hi: 'पुष्टि करें', kn: 'ದೃಢೀಕರಿಸಿ', ta: 'உறுதி செய்' },
  cancel: { en: 'Cancel', hi: 'रद्द करें', kn: 'ರದ್ದುಮಾಡಿ', ta: 'ரத்து செய்' },
  close: { en: 'Close', hi: 'बंद करें', kn: 'ಮುಚ್ಚಿ', ta: 'மூடு' },
  save: { en: 'Save', hi: 'सहेजें', kn: 'ಉಳಿಸಿ', ta: 'சேமி' },
  submit: { en: 'Submit', hi: 'जमा करें', kn: 'ಸಲ್ಲಿಸಿ', ta: 'சமர்ப்பி' },
  search: { en: 'Search', hi: 'खोजें', kn: 'ಹುಡುಕಿ', ta: 'தேடு' },
  viewAll: { en: 'View All', hi: 'सभी देखें', kn: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ', ta: 'அனைத்தையும் காண்க' },
  back: { en: 'Back', hi: 'पीछे', kn: 'ಹಿಂದೆ', ta: 'பின்னால்' },
  next: { en: 'Next', hi: 'आगे', kn: 'ಮುಂದೆ', ta: 'அடுத்து' },
  verifiedBadge: { en: 'Verified Member', hi: 'सत्यापित सदस्य', kn: 'ದೃಢೀಕೃತ ಸದಸ್ಯ', ta: 'சரிபார்க்கப்பட்ட உறுப்பினர்' },
  perHour: { en: '/hour', hi: '/घंटा', kn: '/ಗಂಟೆಗೆ', ta: '/மணிநேரம்' },
  callWorker: { en: 'Call Worker', hi: 'कामगार को कॉल करें', kn: 'ಕಾರ್ಮಿಕರಿಗೆ ಕರೆ ಮಾಡಿ', ta: 'தொழிலாளியை அழைக்கவும்' },
  workerOnWay: { en: 'Worker is on the way!', hi: 'कामगार रास्ते में है!', kn: 'ಕಾರ್ಮಿಕರು ದಾರಿಯಲ್ಲಿದ್ದಾರೆ!', ta: 'தொழிலாளி வருகிறார்!' },
  jobCompleted: { en: 'Job Completed Safely', hi: 'काम सुरक्षित रूप से पूरा हुआ', kn: 'ಕೆಲಸ ಪೂರ್ಣಗೊಂಡಿದೆ', ta: 'வேலை பாதுகாப்பாக முடிந்தது' },
  waitingWorker: { en: 'Finding Nearby Worker...', hi: 'पास के कामगार को ढूंढ रहे हैं...', kn: 'ಹತ್ತಿರದ ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...', ta: 'அருகிலுள்ள தொழிலாளியைத் தேடுகிறது...' },
  payoutBadge: { en: '90% directly to worker', hi: '90% सीधा कामगार को', kn: '90% ನೇರವಾಗಿ ಕಾರ್ಮಿಕರಿಗೆ', ta: '90% நேரடியாக தொழிலாளிக்கு' },
  loading: { en: 'Loading...', hi: 'लोड हो रहा है...', kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...', ta: 'ஏற்றுகிறது...' },
  success: { en: 'Success', hi: 'सफल', kn: 'ಯಶಸ್ವಿ', ta: 'வெற்றி' },

  // Footer & Compliance
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

  // Common Roles
  roleCustomer: { en: 'Customer', hi: 'ग्राहक', kn: 'ಗ್ರಾಹಕರು', ta: 'வாடிக்கையாளர்' },
  roleWorker: { en: 'Tradesperson', hi: 'कारीगर', kn: 'ಕುಶಲಕರ್ಮಿ', ta: 'தொழிலாளி' },
  roleAdmin: { en: 'Society Admin', hi: 'समिति प्रशासक', kn: 'ಸಂಘದ ಆಡಳಿತಾಧಿಕಾರಿ', ta: 'சங்க நிர்வாகி' },
  roleManagement: { en: 'Operations Team', hi: 'संचालन टीम', kn: 'ಕಾರ್ಯಾಚರಣಾ ತಂಡ', ta: 'செயல்பாட்டு குழு' },
  roleDeveloper: { en: 'Technical Console', hi: 'तकनीकी कंसोल', kn: 'ತಾಂತ್ರಿಕ ಕನ್ಸೋಲ್', ta: 'தொழில்நுட்ப தளம்' }
};
