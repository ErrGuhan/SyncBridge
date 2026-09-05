'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'ta';

interface TranslationMap {
  [key: string]: {
    en: string;
    hi: string;
    ta: string;
  };
}

export const translations: TranslationMap = {
  // Navigation
  navHome: { en: 'Home', hi: 'मुख्य पृष्ठ', ta: 'முகப்பு' },
  navSearch: { en: 'Find Help', hi: 'सेवा खोजें', ta: 'சேவை தேடு' },
  navJobs: { en: 'My Jobs', hi: 'मेरे काम', ta: 'என் வேலைகள்' },
  navProfile: { en: 'Profile', hi: 'प्रोफ़ाइल', ta: 'சுயவிவரம்' },

  // Header & Controls
  appName: { en: 'SyncBridge Co-op', hi: 'सिंकब्रिज सहकारी', ta: 'சின்க்பிரிட்ஜ் கூட்டுறவு' },
  memberOwned: { en: '100% Worker Owned', hi: '100% कामगार स्वामित्व', ta: '100% தொழிலாளர் உரிமை' },
  emergencyHelp: { en: 'Emergency Help', hi: 'आपातकालीन सहायता', ta: 'அவசர உதவி' },
  tapToSpeak: { en: 'Tap to Speak', hi: 'बोलने के लिए दबाएं', ta: 'பேச தட்டவும்' },
  listening: { en: 'Listening...', hi: 'सुन रहे हैं...', ta: 'கேட்கிறது...' },

  // Service Discovery
  findServiceTitle: { en: 'What help do you need?', hi: 'आपको क्या मदद चाहिए?', ta: 'உங்களுக்கு என்ன உதவி வேண்டும்?' },
  findServiceSubtitle: { en: 'Tap a big card or speak to book directly with verified member-workers', hi: 'सत्यापित कामगारों से सीधे बात करने के लिए कार्ड दबाएं', ta: 'சரிபார்க்கப்பட்ட தொழிலாளர்களை முன்பதிவு செய்ய கார்டைத் தட்டவும்' },
  swipePrompt: { en: '👉 Swipe left/right to see more services', hi: '👉 और सेवाएं देखने के लिए बाएं/दाएं स्वाइप करें', ta: '👉 கூடுதல் சேவைகளைக் காண இடது/வலதுபுறம் ஸ்வைப் செய்யவும்' },

  // Services
  plumbing: { en: 'Plumber', hi: 'प्लंबर (नल मिस्त्री)', ta: 'பிளம்பர் (குழாய்)' },
  plumbingDesc: { en: 'Water leak, tap repair, pipe fitting', hi: 'पानी का रिसाव, नल की मरम्मत, पाइप फिटिंग', ta: 'தண்ணீர் கசிவு, குழாய் பழுது' },
  electrical: { en: 'Electrician', hi: 'इलेक्ट्रीशियन (बिजली)', ta: 'எலக்ட்ரீசியன் (மின்சாரம்)' },
  electricalDesc: { en: 'Short circuit, wiring, fan, switches', hi: 'शॉर्ट सर्किट, वायरिंग, पंखा, स्विच', ta: 'ஷார்ட் சர்க்யூட், வயரிங், சுவிட்ச்' },
  cleaning: { en: 'Cleaner', hi: 'सफाई कर्मी', ta: 'சுத்தம் செய்பவர்' },
  cleaningDesc: { en: 'House deep cleaning, water tank wash', hi: 'घर की गहरी सफाई, पानी की टंकी धोना', ta: 'வீடு முழு சுத்தம், தொட்டி சுத்தம்' },
  appliance: { en: 'AC & Appliance', hi: 'एसी और फ्रिज मरम्मत', ta: 'ஏசி & உபகரண பழுது' },
  applianceDesc: { en: 'AC gas fill, fridge & washing machine', hi: 'एसी गैस, फ्रिज और वाशिंग मशीन', ta: 'ஏசி கேஸ், பிரிட்ஜ் பழுது' },
  carpentry: { en: 'Carpenter', hi: 'बढ़ई (लकड़ी का काम)', ta: 'தச்சர் (மர வேலை)' },
  carpentryDesc: { en: 'Door lock, furniture fix, wood work', hi: 'दरवाजे का ताला, फर्नीचर मरम्मत', ta: 'கதவு பூட்டு, மர சாமான்கள்' },

  // Action Buttons
  bookNow: { en: 'Book Now', hi: 'अभी बुक करें', ta: 'இப்போதே பதிவு செய்' },
  perHour: { en: '/hour', hi: '/घंटा', ta: '/மணிநேரம்' },
  callWorker: { en: 'Call Worker', hi: 'कामगार को कॉल करें', ta: 'தொழிலாளியை அழைக்கவும்' },
  workerOnWay: { en: 'Worker is on the way!', hi: 'कामगार रास्ते में है!', ta: 'தொழிலாளி வருகிறார்!' },
  jobCompleted: { en: 'Job Completed Safely', hi: 'काम सुरक्षित रूप से पूरा हुआ', ta: 'வேலை பாதுகாப்பாக முடிந்தது' },
  waitingWorker: { en: 'Finding Nearby Worker...', hi: 'पास के कामगार को ढूंढ रहे हैं...', ta: 'அருகிலுள்ள தொழிலாளியைத் தேடுகிறது...' },
  payoutBadge: { en: '90% directly to worker', hi: '90% सीधा कामगार को', ta: '90% நேரடியாக தொழிலாளிக்கு' }
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
