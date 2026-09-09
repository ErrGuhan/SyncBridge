import { TranslationItem } from './common';

export const workerTranslations: Record<string, TranslationItem> = {
  // Worker Header
  workerPortalTitle: { 
    en: 'Artisan Cooperative Workspace', 
    hi: 'कारीगर सहकारी कार्यक्षेत्र', 
    kn: 'ಕುಶಲಕರ್ಮಿ ಸಹಕಾರಿ ಕಾರ್ಯಕ್ಷೇತ್ರ', 
    ta: 'கைவினைஞர் கூட்டுறவு பணியிடம்' 
  },
  workerVerifiedBadge: { 
    en: 'Verified Cooperative Member • Kalyan Labour Society', 
    hi: 'सत्यापित सहकारी सदस्य • कल्याण श्रम सहकारी समिति', 
    kn: 'ದೃಢೀಕೃತ ಸಹಕಾರಿ ಸದಸ್ಯ • ಕಲ್ಯಾಣ ಕಾರ್ಮಿಕ ಸಂಘ', 
    ta: 'சரிபார்க்கப்பட்ட உறுப்பினர் • கல்யாண் தொழிலாளர் சங்கம்' 
  },
  onlineStatus: { en: 'Online (Receiving Jobs)', hi: 'ऑनलाइन (काम चालू)', kn: 'ಆನ್‌ಲೈನ್ (ಕೆಲಸ ಸ್ವೀಕರಿಸಲಾಗುತ್ತಿದೆ)', ta: 'ஆன்லைன் (வேலை பெற தயார்)' },
  offlineStatus: { en: 'Offline (Resting)', hi: 'ऑफलाइन (विश्राम)', kn: 'ಆಫ್‌ಲೈನ್ (ವಿಶ್ರಾಂತಿ)', ta: 'ஆஃப்லைன் (ஓய்வு)' },
  sosModeOn: { en: 'SOS Surge Mode ON', hi: 'एसओएस मोड चालू', kn: 'SOS ಮೋಡ್ ಆನ್', ta: 'SOS பயன்முறை ஆன்' },
  sosEmergencyOptIn: { en: 'Emergency Opt-In', hi: 'आपातकालीन मोड', kn: 'ತುರ್ತು ಮೋಡ್ ಸೇರಿ', ta: 'அவசர நிலை பதிவு' },

  // Wallets & Escrow
  availableWallet: { en: 'Available 90% Wallet Balance', hi: 'उपलब्ध 90% वॉलेट बैलेंस', kn: 'ಲಭ್ಯವಿರುವ 90% ವಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್', ta: 'கிடைக்கும் 90% இருப்புத் தொகை' },
  withdrawUpi: { en: 'Instant Withdraw to UPI / Bank', hi: 'तुरंत यूपीआई / बैंक में निकालें', kn: 'ಯುಪಿಐ / ಬ್ಯಾಂಕ್‌ಗೆ ತಕ್ಷಣ ವಿತ್‌ಡ್ರಾ ಮಾಡಿ', ta: 'யுபிஐ / வங்கிக்கு உடனே மாற்றவும்' },
  activeJobEscrow: { en: 'Active Job Escrow (In Transit)', hi: 'सक्रिय एस्क्रो (प्रक्रियाधीन)', kn: 'ಸಕ್ರಿಯ ಎಸ್ಕ್ರೋ (ಪ್ರಗತಿಯಲ್ಲಿದೆ)', ta: 'செயலில் உள்ள எஸ்க்ரோ (பரிசீலனையில்)' },
  pensionCorpus: { en: 'Accrued Pension Corpus (5% Pool)', hi: 'संचित पेंशन कोष (5% हिस्सा)', kn: 'ಸಂಗ್ರಹವಾದ ಪಿಂಚಣಿ ನಿಧಿ (5% ಪಾಲು)', ta: 'திரட்டப்பட்ட ஓய்வೂதிய நிதி (5% பங்கு)' },

  // Weekly 90/5/5 Distribution
  weeklyBreakdownTitle: { en: 'Weekly Cooperative Earnings & 90/5/5 Breakdown', hi: 'साप्ताहिक सहकारी आय एवं 90/5/5 विवरण', kn: 'ವಾರದ ಸಹಕಾರಿ ಗಳಿಕೆ ಮತ್ತು 90/5/5 ವಿಭಜನೆ', ta: 'வாராந்திர கூட்டுறவு வருமானம் & 90/5/5 விவரம்' },
  workerTakeHome: { en: '90% Worker Take-Home', hi: '90% कारीगर को सीधा', kn: '90% ಕಾರ್ಮಿಕರ ಆದಾಯ', ta: '90% தொழிலாளர் ஊதியம்' },
  societyTreasuryShare: { en: '5% Society Operational Treasury', hi: '5% समिति संचालन कोष', kn: '5% ಸಂಘದ ಕಾರ್ಯಾಚರಣೆ ನಿಧಿ', ta: '5% சங்க செயல்பாட்டு நிதி' },
  mutualAidShare: { en: '5% Mutual Aid & Healthcare', hi: '5% कल्याण व स्वास्थ्य कोष', kn: '5% ಪರಸ್ಪರ ನೆರವು & ಆರೋಗ್ಯ', ta: '5% பரஸ்பர உதவி & சுகாதாரம்' },

  // Incoming Dispatch Lead
  incomingLeadTitle: { en: 'NEW INCOMING DISPATCH LEAD', hi: 'नया काम उपलब्ध है (लीड)', kn: 'ಹೊಸ ರವಾನೆ ವಿನಂತಿ ಬಂದಿದೆ', ta: 'புதிய வேலை வாய்ப்பு வந்துள்ளது' },
  listenAudioBtn: { en: 'Listen Voice Dispatch', hi: 'आवाज में सुनें', kn: 'ಧ್ವನಿ ವಿವರ ಆಲಿಸಿ', ta: 'குரல் வழியில் கேட்க' },
  pauseAudioBtn: { en: 'Pause Voice', hi: 'आवाज रोकें', kn: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ', ta: 'குரலை நிறுத்து' },
  acceptJobBtn: { en: 'Accept Job (Lock Dispatch)', hi: 'काम स्वीकारें (लॉक करें)', kn: 'ಕೆಲಸ ಸ್ವೀಕರಿಸಿ (ಲಾಕ್ ಮಾಡಿ)', ta: 'வேலையை ஏற்றுக்கொள்' },
  passJobBtn: { en: 'Pass to Peer', hi: 'साथी कारीगर को भेजें', kn: 'ಸಹೋದ್ಯೋಗಿಗೆ ವರ್ಗಾಯಿಸಿ', ta: 'மற்றவருக்கு மாற்று' },

  // Active Job in Progress
  activeJobTitle: { en: 'ACTIVE JOB IN PROGRESS', hi: 'सक्रिय काम जारी है', kn: 'ಪ್ರಗತಿಯಲ್ಲಿರುವ ಸಕ್ರಿಯ ಕೆಲಸ', ta: 'செயலில் உள்ள வேலை' },
  customerLabel: { en: 'Customer:', hi: 'ग्राहक:', kn: 'ಗ್ರಾಹಕರು:', ta: 'வாடிக்கையாளர்:' },
  locationLabel: { en: 'Location:', hi: 'स्थान:', kn: 'ಸ್ಥಳ:', ta: 'இடம்:' },
  navMapsBtn: { en: 'Navigate via Google Maps', hi: 'गूगल मैप्स पर रास्ता देखें', kn: 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ದಾರಿ ನೋಡಿ', ta: 'கூகுள் மேப்ஸில் வழிகாட்டு' },
  completeJobBtn: { en: 'Mark Completed & Request OTP', hi: 'काम पूरा घोषित करें व ओटीपी मांगें', kn: 'ಕೆಲಸ ಮುಕ್ತಾಯಗೊಳಿಸಿ & ಒಟಿಪಿ ಕೇಳಿ', ta: 'முழுமை எனக் குறித்து OTP கேட்கவும்' },

  // Heavy Power Tool Inventory
  toolInventoryTitle: { en: 'Shared Heavy Power-Tool Library', hi: 'साझा भारी उपकरण व मशीनरी बैंक', kn: 'ಹಂಚಿಕೆಯ ಭಾರೀ ಉಪಕರಣಗಳ ಭಂಡಾರ', ta: 'பகிரப்பட்ட கனரக உபகரண வங்கி' },
  toolInventorySub: { en: 'Funded democratically by the 5% Society Treasury. Free checkout for all verified guild members.', hi: '5% समिति कोष से वित्तपोषित। सभी सत्यापित सदस्यों के लिए मुफ्त उपयोग।', kn: '5% ಸಂಘದ ನಿಧಿಯಿಂದ ಬೆಂಬಲಿತ. ಎಲ್ಲಾ ಸದಸ್ಯರಿಗೆ ಉಚಿತ ಲಭ್ಯತೆ.', ta: '5% சங்க நிதியால் வாங்கப்பட்டது. அனைத்து உறுப்பினர்களுக்கும் இலவசம்.' },
  checkoutToolBtn: { en: 'Check Out Tool', hi: 'उपकरण जारी करें', kn: 'ಉಪಕರಣ ಪಡೆಯಿರಿ', ta: 'கருவியை எடுக்கவும்' },
  returnToolBtn: { en: 'Return to Society Hub', hi: 'समिति केंद्र में लौटाएं', kn: 'ಸಂಘದ ಕೇಂದ್ರಕ್ಕೆ ಹಿಂತಿರುಗಿಸಿ', ta: 'சங்க மையத்திற்கு திருப்பித் தருக' },
  toolAvailable: { en: 'Available in Locker', hi: 'लॉकर में उपलब्ध', kn: 'ಲಾಕರ್‌ನಲ್ಲಿ ಲಭ್ಯ', ta: 'லாக்கரில் உள்ளது' },
  toolInUse: { en: 'In Use by You', hi: 'आपके पास जारी', kn: 'ನಿಮ್ಮ ಬಳಿ ಇದೆ', ta: 'உங்களிடம் பயன்பாட்டில் உள்ளது' },

  // Document Vault
  vaultTitle: { en: 'Sovereign Digital Identity & Accreditation Vault', hi: 'डिजिटल पहचान व प्रमाणन दस्तावेज', kn: 'ಡಿಜಿಟಲ್ ಗುರುತು ಮತ್ತು ದಾಖಲೆಗಳ ಖಜಾನೆ', ta: 'டிஜிட்டல் அடையாளம் மற்றும் சான்றிதழ் பெட்டகம்' },
  vaultSub: { en: 'Tamper-proof documents verifiable by municipal corporations and consumers.', hi: 'सुरक्षित दस्तावेज जिन्हें नगर निगम और ग्राहक सत्यापित कर सकते हैं।', kn: 'ಗ್ರಾಹಕರು ಮತ್ತು ಪುರಸಭೆ ಪರಿಶೀಲಿಸಬಹುದಾದ ಅಧಿಕೃತ ದಾಖಲೆಗಳು.', ta: 'நகராட்சி மற்றும் வாடிக்கையாளர்கள் சரிபார்க்கக்கூடிய ஆவணங்கள்.' },
  uploadDocBtn: { en: 'Upload New Trade Certificate', hi: 'नया प्रमाण पत्र अपलोड करें', kn: 'ಹೊಸ ಪ್ರಮಾಣಪತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', ta: 'புதிய சான்றிதழைப் பதிவேற்று' },

  // Withdraw Modal
  withdrawModalTitle: { en: 'Instant UPI Wallet Settlement', hi: 'त्वरित यूपीआई वॉलेट निकासी', kn: 'ತಕ್ಷಣದ ಯುಪಿಐ ವಿತ್‌ಡ್ರಾ', ta: 'உடனடி யுபிஐ பணப் பரிமாற்றம்' },
  withdrawModalSub: { en: 'Direct API payout to your linked VPA / Bank account with zero processing fee.', hi: 'बिना किसी शुल्क के आपके लिंक्ड यूपीआई या बैंक खाते में सीधा भुगतान।', kn: 'ಯಾವುದೇ ಶುಲ್ಕವಿಲ್ಲದೆ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರ ಜಮೆ.', ta: 'கட்டணம் ஏதுமின்றி உங்கள் வங்கி கணக்கில் நேரடி வரவு.' },
  withdrawAmountLabel: { en: 'Amount to Transfer (₹):', hi: 'निकासी राशि (₹):', kn: 'ವರ್ಗಾಯಿಸಬೇಕಾದ ಮೊತ್ತ (₹):', ta: 'மாற்ற வேண்டிய தொகை (₹):' },
  linkedUpiLabel: { en: 'Linked VPA Address:', hi: 'लिंक्ड यूपीआई आईडी:', kn: 'ಲಿಂಕ್ ಮಾಡಲಾದ ಯುಪಿಐ:', ta: 'இணைக்கப்பட்ட யுபிஐ:' },
  confirmWithdrawBtn: { en: 'Transfer to UPI Now', hi: 'अभी बैंक में भेजें', kn: 'ಈಗಲೇ ವರ್ಗಾಯಿಸಿ', ta: 'இப்போதே மாற்றவும்' },
  withdrawSuccessMsg: { en: '₹{amount} successfully sent to UPI! UTR: {utr}', hi: '₹{amount} सफलतापूर्वक यूपीआई में भेजा गया! यूटीआर: {utr}', kn: '₹{amount} ಯುಪಿಐಗೆ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ! UTR: {utr}', ta: '₹{amount} யுபிஐக்கு வெற்றிகரமாக அனுப்பப்பட்டது! UTR: {utr}' }
};
