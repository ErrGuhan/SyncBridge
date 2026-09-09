import { TranslationItem } from './common';

export const bookingsTranslations: Record<string, TranslationItem> = {
  // Page Header & Filters
  bookingsTitle: { 
    en: 'Active Bookings & Trade Orders', 
    hi: 'सक्रिय बुकिंग व ऑर्डर्स', 
    kn: 'ಸಕ್ರಿಯ ಬುಕಿಂಗ್ ಮತ್ತು ಆರ್ಡರ್‌ಗಳು', 
    ta: 'செயலில் உள்ள முன்பதிவுகள்' 
  },
  bookingsSubtitle: { 
    en: 'Real-time dispatch tracking with transparent 90/5/5 cooperative dividend accounting.', 
    hi: 'पारदर्शी 90/5/5 लाभांश ब्योरे के साथ रीयल-टाइम ट्रैकिंग।', 
    kn: 'ಪಾರದರ್ಶಕ 90/5/5 ಲೆಕ್ಕಪತ್ರದೊಂದಿಗೆ ನೈಜ-ಸಮಯದ ಟ್ರ್ಯಾಕಿಂಗ್.', 
    ta: 'வெளிப்படையான 90/5/5 கணக்குடன் நேரடி கண்காணிப்பு.' 
  },
  activeTrackingHeader: {
    en: 'Active Order Live Tracking',
    hi: 'सक्रिय ऑर्डर का सीधा प्रसारण',
    kn: 'ಸಕ್ರಿಯ ಆದೇಶದ ನೇರ ಟ್ರ್ಯಾಕಿಂಗ್',
    ta: 'நேரடி கண்காணிப்பு'
  },
  filterAll: { en: 'All Orders', hi: 'सभी ऑर्डर्स', kn: 'ಎಲ್ಲಾ ಆದೇಶಗಳು', ta: 'அனைத்து ஆர்டர்கள்' },
  filterActive: { en: 'In Progress', hi: 'प्रगति पर', kn: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ', ta: 'செயலில் உள்ளது' },
  filterCompleted: { en: 'Completed', hi: 'पूर्ण हो चुके', kn: 'ಪೂರ್ಣಗೊಂಡಿದೆ', ta: 'நிறைவடைந்தது' },
  filterDisputed: { en: 'Disputed / In Review', hi: 'विवाद / समीक्षाधीन', kn: 'ವಿವಾದಿತ / ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ', ta: 'சர்ச்சை / பரிசீலனை' },

  // Job Status Tracker (Red / Yellow / Green)
  trackerStatusRed: {
    en: 'Locating Available Member-Worker...',
    hi: 'निकटतम उपलब्ध कारीगर खोज रहे हैं...',
    kn: 'ಲಭ್ಯವಿರುವ ಸದಸ್ಯ-ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    ta: 'கிடைக்கும் தொழிலாளியைத் தேடுகிறது...'
  },
  trackerStatusYellow: {
    en: 'Member-Worker is En Route',
    hi: 'कारीगर आपके पते के लिए निकल चुके हैं',
    kn: 'ಕಾರ್ಮಿಕರು ದಾರಿಯಲ್ಲಿದ್ದಾರೆ',
    ta: 'தொழிலாளி வருகிறார்'
  },
  trackerStatusGreen: {
    en: 'Service Completed & Settled',
    hi: 'सेवा सफलतापूर्वक पूर्ण और भुगतान संपन्न',
    kn: 'ಸೇವೆ ಪೂರ್ಣಗೊಂಡಿದೆ ಮತ್ತು ಇತ್ಯರ್ಥವಾಗಿದೆ',
    ta: 'சேவை நிறைவடைந்து தீர்வு காணப்பட்டது'
  },
  trackerSearchingSub: {
    en: 'Broadcasting to verified trade guild members within 5 km. Redis distributed mutex prevents multi-dispatch collision.',
    hi: '5 किमी के दायरे में सत्यापित कारीगरों को संदेश भेजा गया है। रेडीस लॉक से दोहरा प्रेषण रोका जाता है।',
    kn: '5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಪರಿಶೀಲಿಸಿದ ಸದಸ್ಯರಿಗೆ ರವಾನಿಸಲಾಗುತ್ತಿದೆ.',
    ta: '5 கி.மீ எல்லைக்குள் சான்றளிக்கப்பட்ட தொழிலாளர்களுக்கு அனுப்பப்படுகிறது.'
  },
  trackerEtaArrival: {
    en: 'Estimated Arrival: ~{mins} mins',
    hi: 'अनुमानित आगमन: ~{mins} मिनट',
    kn: 'ಅಂದಾಜು ಆಗಮನ: ~{mins} ನಿಮಿಷಗಳು',
    ta: 'வருகை நேரம்: ~{mins} நிமிடங்கள்'
  },
  trackerSecurityOtp: {
    en: 'Share this 4-digit PIN with worker upon arrival:',
    hi: 'कारीगर के आने पर यह 4-अंकों का पिन बताएं:',
    kn: 'ಕಾರ್ಮಿಕರು ಬಂದಾಗ ಈ 4-ಅಂಕಿಯ ಪಿನ್ ತಿಳಿಸಿ:',
    ta: 'தொழிலாளி வந்ததும் இந்த 4 இலக்க பின்னை தெரிவிக்கவும்:'
  },
  trackerSettledNote: {
    en: '90% directly settled to artisan UPI wallet. 10% allocated to society reserve and welfare healthcare trust.',
    hi: '90% सीधे कारीगर के यूपीआई खाते में जमा। 10% समिति आरक्षित कोष और कल्याण ट्रस्ट में सुरक्षित।',
    kn: '90% ನೇರವಾಗಿ ಕಾರ್ಮಿಕರ ಯುಪಿಐ ವಾಲೆಟ್‌ಗೆ ಜಮೆಯಾಗಿದೆ. 10% ಸಂಘ ಮತ್ತು ಕಲ್ಯಾಣ ನಿಧಿಗೆ ಸೇರಿದೆ.',
    ta: '90% நேரடியாக தொழிலாளரின் யுபிஐ கணக்கில் சேர்கிறது. 10% சங்க இருப்பு மற்றும் நல நிதிக்கு ஒதுக்கப்படுகிறது.'
  },

  // Actions on Bookings
  btnViewReceipt: { en: 'Co-op Receipt', hi: 'सहकारी रसीद', kn: 'ಸಹಕಾರಿ ರಶೀದಿ', ta: 'கூட்டுறவு ரசீது' },
  btnRaiseDispute: { en: 'Peer Arbitration', hi: 'सहकर्मी मध्यस्थता', kn: 'ಮಧ್ಯಸ್ಥಿಕೆ ಕೋರಿಕೆ', ta: 'மத்தியஸ்தம் கோரு' },
  btnCompleteJob: { en: 'Mark Completed', hi: 'काम पूरा घोषित करें', kn: 'ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಗುರುತಿಸಿ', ta: 'முடிந்தது எனக் குறிக்கவும்' },

  // Receipt Modal
  receiptTitle: { en: 'Official Cooperative Settlement Receipt', hi: 'आधिकारिक सहकारी निपटान रसीद', kn: 'ಅಧಿಕೃತ ಸಹಕಾರಿ ಇತ್ಯರ್ಥ ರಶೀದಿ', ta: 'அதிகாரப்பூர்வ கூட்டுறவு தீர்வு ரசீது' },
  receiptInvoiceNo: { en: 'Invoice #:', hi: 'चालान संख्या:', kn: 'ಇನ್‌ವಾಯ್ಸ್ ಸಂಖ್ಯೆ:', ta: 'விலைப்பட்டியல் எண்:' },
  receiptDate: { en: 'Date of Service:', hi: 'सेवा की तारीख:', kn: 'ಸೇವೆಯ ದಿನಾಂಕ:', ta: 'சேவை தேதி:' },
  receiptCustomer: { en: 'Billed To:', hi: 'ग्राहक का नाम:', kn: 'ಗ್ರಾಹಕರ ವಿವರ:', ta: 'வாடிக்கையாளர்:' },
  receiptWorker: { en: 'Accredited Artisan:', hi: 'प्रमाणित कारीगर:', kn: 'ಪ್ರಮಾಣೀಕೃತ ಕಾರ್ಮಿಕ:', ta: 'சான்றளிக்கப்பட்ட தொழிலாளி:' },
  receiptTotalPaid: { en: 'Total Paid Amount:', hi: 'कुल भुगतान राशि:', kn: 'ಒಟ್ಟು ಪಾವತಿಸಿದ ಮೊತ್ತ:', ta: 'செலுத்தப்பட்ட மொத்தத் தொகை:' },
  receiptDownloadBtn: { en: 'Print / Download PDF', hi: 'प्रिंट / पीडीएफ डाउनलोड करें', kn: 'ಮುದ್ರಿಸಿ / ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ', ta: 'அச்சிடு / PDF பதிவிறக்கு' },

  // Restorative Dispute Modal
  disputeModalTitle: { en: 'File for Peer Restorative Arbitration', hi: 'सहकर्मी मध्यस्थता के लिए आवेदन करें', kn: 'ಸಹೋದ್ಯೋಗಿ ಮಧ್ಯಸ್ಥಿಕೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ', ta: 'சக தொழிலாளர் மத்தியஸ்தத்திற்கு விண்ணப்பிக்கவும்' },
  disputeModalSub: { 
    en: 'Your case will be evaluated by an independent council of senior artisans backed by the 1% Mutual Guarantee Fund.', 
    hi: 'आपके मामले की समीक्षा 1% ग्राहक गारंटी कोष द्वारा समर्थित वरिष्ठ कारीगरों की स्वतंत्र परिषद करेगी।', 
    kn: 'ನಿಮ್ಮ ಪ್ರಕರಣವನ್ನು 1% ಗ್ಯಾರಂಟಿ ನಿಧಿಯ ಬೆಂಬಲದೊಂದಿಗೆ ಹಿರಿಯ ಕಾರ್ಮಿಕರ ಮಂಡಳಿಯು ಪರಿಶೀಲಿಸುತ್ತದೆ.', 
    ta: 'உங்கள் கோரிக்கை 1% உத்தரவாத நிதியால் ஆதரிக்கப்படும் மூத்த தொழிலாளர் குழுவால் பரிசீலிக்கப்படும்.' 
  },
  disputeReasonLabel: { en: 'Reason for Concern:', hi: 'शिकायत का कारण:', kn: 'ಆಕ್ಷೇಪಣೆಯ ಕಾರಣ:', ta: 'காரணம்:' },
  disputeReasonQuality: { en: 'Quality of work did not match cooperative standard', hi: 'काम की गुणवत्ता सहकारी मानक के अनुरूप नहीं थी', kn: 'ಕೆಲಸದ ಗುಣಮಟ್ಟ ಮಾನದಂಡಕ್ಕೆ ತಕ್ಕಂತಿರಲಿಲ್ಲ', ta: 'வேலையின் தரம் கூட்டுறவு தரத்திற்கு இணங்கவில்லை' },
  disputeReasonDamage: { en: 'Accidental damage occurred (Claim under 1% Guarantee)', hi: 'काम के दौरान नुकसान हुआ (1% गारंटी दावा)', kn: 'ಆಕಸ್ಮಿಕ ಹಾನಿ ಸಂಭವಿಸಿದೆ (1% ಗ್ಯಾರಂಟಿ)', ta: 'எதிர்பாராத சேதம் ஏற்பட்டது (1% உத்தரவாதம்)' },
  disputeReasonPricing: { en: 'Incorrect parts pricing or unauthorized surcharge', hi: 'सामग्री का गलत मूल्य या अनधिकृत शुल्क', kn: 'ತಪ್ಪಾದ ಭಾಗಗಳ ಬೆಲೆ ಅಥವಾ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕ', ta: 'தவறான உதிரிபாகங்கள் விலை அல்லது கூடுதல் கட்டணம்' },
  disputeStatementLabel: { en: 'Provide Detailed Statement:', hi: 'विस्तृत विवरण दें:', kn: 'ವಿವರವಾದ ಹೇಳಿಕೆ ನೀಡಿ:', ta: 'விவரமான அறிக்கை:' },
  disputeStatementPlaceholder: { en: 'Describe what happened and your desired resolution...', hi: 'बताएं क्या समस्या हुई और आप कैसा समाधान चाहते हैं...', kn: 'ಏನಾಯಿತು ಮತ್ತು ನೀವು ಯಾವ ಪರಿಹಾರ ಬಯಸುತ್ತೀರಿ ಎಂದು ವಿವರಿಸಿ...', ta: 'என்ன நடந்தது மற்றும் விரும்பிய தீர்வை விவரிக்கவும்...' },
  disputeSubmitBtn: { en: 'Submit to Peer Council', hi: 'परिषद को भेजें', kn: 'ಮಂಡಳಿಗೆ ಸಲ್ಲಿಸಿ', ta: 'மத்தியஸ்த சபைக்கு சமர்ப்பி' },
  disputeSuccessMsg: { en: 'Dispute filed successfully. Assigned to Peer Council #8.', hi: 'शिकायत दर्ज हो गई है। सहकर्मी परिषद #8 को सौंपी गई।', kn: 'ವಿವಾದ ದಾಖಲಾಗಿದೆ. ಮಂಡಳಿ #8 ಕ್ಕೆ ನಿಯೋಜಿಸಲಾಗಿದೆ.', ta: 'சர்ச்சை பதிவு செய்யப்பட்டது. சபை #8 க்கு ஒதுக்கப்பட்டது.' },
  noBookingsFound: { en: 'No bookings found in this category.', hi: 'इस श्रेणी में कोई बुकिंग नहीं मिली।', kn: 'ಈ ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಆದೇಶಗಳಿಲ್ಲ.', ta: 'இந்த பிரிவில் முன்பதிவுகள் இல்லை.' }
};
