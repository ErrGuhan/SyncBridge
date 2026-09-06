'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  // Navigation (Harmonized Header & Mobile Nav)
  navHome: { en: 'Home', hi: 'मुख्य पृष्ठ', kn: 'ಮುಖಪುಟ', ta: 'முகப்பு' },
  navServices: { en: 'Services', hi: 'सेवाएं', kn: 'ಸೇವೆಗಳು', ta: 'சேவைகள்' },
  navSearch: { en: 'Services', hi: 'सेवाएं', kn: 'ಸೇವೆಗಳು', ta: 'சேவைகள்' },
  navOrders: { en: 'My Orders', hi: 'मेरे ऑर्डर्स', kn: 'ನನ್ನ ಆದೇಶಗಳು', ta: 'என் ஆர்டர்கள்' },
  navJobs: { en: 'My Orders', hi: 'मेरे ऑर्डर्स', kn: 'ನನ್ನ ಆದೇಶಗಳು', ta: 'என் ஆர்டர்கள்' },
  navWorker: { en: 'Worker Portal', hi: 'कारीगर पोर्टल', kn: 'ಕಾರ್ಮಿಕ ಪೋರ್ಟಲ್', ta: 'தொழிலாளர் போர்டல்' },
  navAdmin: { en: 'Federation Admin', hi: 'फेडरेशन एडमिन', kn: 'ಒಕ್ಕೂಟದ ನಿರ್ವಾಹಕ', ta: 'கூட்டமைப்பு நிர்வாகம்' },
  navSignIn: { en: 'Sign In', hi: 'साइन इन', kn: 'ಸೈನ್ ಇನ್', ta: 'உள்நுழைக' },
  navWelfare: { en: 'Welfare Fund', hi: 'कल्याण कोष', kn: 'ಕಲ್ಯಾಣ ನಿಧಿ', ta: 'நல நிதி' },
  navProfile: { en: 'Profile', hi: 'प्रोफ़ाइल', kn: 'ಪ್ರೊಫೈಲ್', ta: 'சுயವಿವರம்' },

  // Header & Controls
  appName: { en: 'SyncBridge Co-op', hi: 'सिंकब्रिज सहकारी', kn: 'ಸಿಂಕ್‌ಬ್ರಿಡ್ಜ್ ಸಹಕಾರಿ', ta: 'சின்க்பிரிட்ஜ் கூட்டுறவு' },
  memberOwned: { en: '100% Worker-Member Owned', hi: '100% कामगार स्वामित्व', kn: '100% ಕಾರ್ಮಿಕರ ಒಡೆತನ', ta: '100% தொழிலாளர் உரிமை' },
  emergencyHelp: { en: 'Emergency SOS', hi: 'आपातकालीन सहायता (SOS)', kn: 'ತುರ್ತು ಸಹಾಯ (SOS)', ta: 'அவசர உதவி (SOS)' },
  emergencySOS: { en: 'Emergency SOS', hi: 'आपातकालीन सहायता (SOS)', kn: 'ತುರ್ತು ಸಹಾಯ (SOS)', ta: 'அவசர உதவி (SOS)' },
  tapToSpeak: { en: 'Tap to Speak', hi: 'बोलने के लिए दबाएं', kn: 'ಮಾತನಾಡಲು ಒತ್ತಿರಿ', ta: 'பேச தட்டவும்' },
  listening: { en: 'Listening...', hi: 'सुन रहे हैं...', kn: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ...', ta: 'கேட்கிறது...' },

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
  statsCoops: { en: 'Primary Cooperatives Digitized', hi: 'प्राथमिक सहकारी समितियां डिजिटाइज़्ड', kn: 'ಡಿಜಿಟಲೀಕೃತ ಪ್ರಾಥಮಿಕ ಸಹಕಾರ ಸಂಘಗಳು', ta: 'டிஜிட்டல் கூட்டுறவு சங்கங்கள்' },
  statsRetention: { en: '90% Direct Payout', hi: '90% सीधा भुगतान', kn: '90% ನೇರ ಪಾವತಿ', ta: '90% நேரடி ஊதியம்' },
  statsCorpus: { en: 'Mutual Aid Welfare Corpus', hi: 'पारस्परिक सहायता कल्याण कोष', kn: 'ಪರಸ್ಪರ ನೆರವಿನ ಕಲ್ಯಾಣ ನಿಧಿ', ta: 'பரஸ்பர நல நிதி' },
  statsRadius: { en: '5 km Geofenced Radius', hi: '5 किमी सेवा दायरा', kn: '5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿ', ta: '5 கி.மீ உள்ளூர் ஆரம்' },

  // Service Discovery
  findServiceTitle: { en: 'What help do you need?', hi: 'आपको क्या मदद चाहिए?', kn: 'ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?', ta: 'உங்களுக்கு என்ன உதவி வேண்டும்?' },
  findServiceSubtitle: { en: 'Tap a big card or speak to book directly with verified member-workers', hi: 'सत्यापित कामगारों से सीधे बात करने के लिए कार्ड दबाएं', kn: 'ಪರಿಶೀಲಿಸಿದ ಸದಸ್ಯ-ಕಾರ್ಮಿಕರನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಲು ಕಾರ್ಡ್ ಒತ್ತಿರಿ', ta: 'சரிபார்க்கப்பட்ட தொழிலாளர்களை முன்பதிவு செய்ய கார்டைத் தட்டவும்' },
  swipePrompt: { en: '👉 Swipe left/right to see more services', hi: '👉 और सेवाएं देखने के लिए बाएं/दाएं स्वाइप करें', kn: '👉 ಇನ್ನಷ್ಟು ಸೇವೆಗಳಿಗಾಗಿ ಎಡಕ್ಕೆ/ಬಲಕ್ಕೆ ಸ್ವೈಪ್ ಮಾಡಿ', ta: '👉 கூடுதல் சேவைகளைக் காண இடது/வலதுபுறம் ஸ்வைப் செய்யவும்' },

  // Services
  plumbing: { en: 'Plumber', hi: 'प्लंबर (नल मिस्त्री)', kn: 'ಪ್ಲಂಬರ್ (ಕೊಳವೆ ಕೆಲಸ)', ta: 'பிளம்பர் (குழாய்)' },
  plumbingDesc: { en: 'Water leak, tap repair, pipe fitting', hi: 'पानी का रिसाव, नल की मरम्मत, पाइप फिटिंग', kn: 'ನೀರು ಸೋರಿಕೆ, ಕೊಳಾಯಿ ದುರಸ್ತಿ', ta: 'தண்ணீர் கசிவு, குழாய் பழுது' },
  electrical: { en: 'Electrician', hi: 'इलेक्ट्रीशियन (बिजली)', kn: 'ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ (ವಿದ್ಯುತ್)', ta: 'எலக்ட்ரீசியன் (மின்சாரம்)' },
  electricalDesc: { en: 'Short circuit, wiring, fan, switches', hi: 'शॉर्ट सर्किट, वायरिंग, पंखा, स्विच', kn: 'ವೈರಿಂಗ್, ಫ್ಯಾನ್, ಸ್ವಿಚ್ ರಿಪೇರಿ', ta: 'ஷார்ட் சர்க்யூட், வயரிங், சுவிட்ச்' },
  cleaning: { en: 'Cleaner', hi: 'सफाई कर्मी', kn: 'ಸ್ವಚ್ಛತಾ ಕೆಲಸಗಾರ', ta: 'சுத்தம் செய்பவர்' },
  cleaningDesc: { en: 'House deep cleaning, water tank wash', hi: 'घर की गहरी सफाई, पानी की टंकी धोना', kn: 'ಮನೆ ಸ್ವಚ್ಛತೆ, ನೀರಿನ ತೊಟ್ಟಿ ಸ್ವಚ್ಛತೆ', ta: 'வீடு முழு சுத்தம், தொட்டி சுத்தம்' },
  appliance: { en: 'AC & Appliance', hi: 'एसी और फ्रिज मरम्मत', kn: 'ಎಸಿ & ಉಪಕರಣ ರಿಪೇರಿ', ta: 'ஏசி & உபகரண பழுது' },
  applianceDesc: { en: 'AC gas fill, fridge & washing machine', hi: 'एसी गैस, फ्रिज और वाशिंग मशीन', kn: 'ಎಸಿ ಗ್ಯಾಸ್, ಫ್ರಿಡ್ಜ್, ವಾಷಿಂಗ್ ಮೆಷಿನ್', ta: 'ஏசி கேஸ், பிரிட்ஜ் பழுது' },
  carpentry: { en: 'Carpenter', hi: 'बढ़ई (लकड़ी का काम)', kn: 'ಬಡಗಿ (ಮರದ ಕೆಲಸ)', ta: 'தச்சர் (மர வேலை)' },
  carpentryDesc: { en: 'Door lock, furniture fix, wood work', hi: 'दरवाजे का ताला, फर्नीचर मरम्मत', kn: 'ಬಾಗಿಲು ಲಾಕ್, ಪೀಠೋಪಕರಣ ಕೆಲಸ', ta: 'கதவு பூட்டு, மர சாமான்கள்' },

  // Action Buttons
  bookNow: { en: 'Book Now', hi: 'अभी बुक करें', kn: 'ಈಗಲೇ ಕಾಯ್ದಿರಿಸಿ', ta: 'இப்போதே பதிவு செய்' },
  perHour: { en: '/hour', hi: '/घंटा', kn: '/ಗಂಟೆಗೆ', ta: '/மணிநேரம்' },
  callWorker: { en: 'Call Worker', hi: 'कामगार को कॉल करें', kn: 'ಕಾರ್ಮಿಕರಿಗೆ ಕರೆ ಮಾಡಿ', ta: 'தொழிலாளியை அழைக்கவும்' },
  workerOnWay: { en: 'Worker is on the way!', hi: 'कामगार रास्ते में है!', kn: 'ಕಾರ್ಮಿಕರು ದಾರಿಯಲ್ಲಿದ್ದಾರೆ!', ta: 'தொழிலாளி வருகிறார்!' },
  jobCompleted: { en: 'Job Completed Safely', hi: 'काम सुरक्षित रूप से पूरा हुआ', kn: 'ಕೆಲಸ ಪೂರ್ಣಗೊಂಡಿದೆ', ta: 'வேலை பாதுகாப்பாக முடிந்தது' },
  waitingWorker: { en: 'Finding Nearby Worker...', hi: 'पास के कामगार को ढूंढ रहे हैं...', kn: 'ಹತ್ತಿರದ ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...', ta: 'அருகிலுள்ள தொழிலாளியைத் தேடுகிறது...' },
  payoutBadge: { en: '90% directly to worker', hi: '90% सीधा कामगार को', kn: '90% ನೇರವಾಗಿ ಕಾರ್ಮಿಕರಿಗೆ', ta: '90% நேரடியாக தொழிலாளிக்கு' }
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('syncbridge_lang') as Language;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'ta')) {
        setLanguageState(saved);
      }
    } catch {
      // ignore storage error
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('syncbridge_lang', lang);
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
