import { TranslationItem } from './common';

export const welfareTranslations: Record<string, TranslationItem> = {
  // Page Header
  welfareHeading: { 
    en: 'Cooperative Mutual Aid & Social Welfare Trust', 
    hi: 'सहकारी पारस्परिक सहायता एवं कल्याण कोष', 
    kn: 'ಸಹಕಾರಿ ಪರಸ್ಪರ ನೆರವು ಮತ್ತು ಕಲ್ಯಾಣ ನಿಧಿ', 
    ta: 'கூட்டுறவு பரஸ்பர உதவி மற்றும் சமூக நல நிதி' 
  },
  welfareSub: { 
    en: 'Every completed job automatically channels 5% into this transparent social security corpus.', 
    hi: 'हर पूर्ण काम का 5% सीधे इस पारदर्शी सामाजिक सुरक्षा कोष में जाता है।', 
    kn: 'ಪ್ರತಿಯೊಂದು ಪೂರ್ಣಗೊಂಡ ಕೆಲಸದ 5% ನೇರವಾಗಿ ಈ ಸಾಮಾಜಿಕ ಭದ್ರತಾ ನಿಧಿಗೆ ಜಮೆಯಾಗುತ್ತದೆ.', 
    ta: 'ஒவ்வொரு நிறைவடைந்த வேலையிலிருந்தும் 5% இந்த சமூக பாதுகாப்பு நிதியில் சேர்கிறது.' 
  },

  // Metrics
  metricTotalCorpus: { en: 'Total Collective Corpus', hi: 'कुल सामूहिक कल्याण कोष', kn: 'ಒಟ್ಟು ಕಲ್ಯಾಣ ನಿಧಿ', ta: 'மொத்த கூட்டு நல நிதி' },
  metricAuditedReserve: { en: 'Audited & Verified Reserves', hi: 'ऑडिटेड व सत्यापित आरक्षित निधि', kn: 'ಲೆಕ್ಕಪರಿಶೋಧಿತ ಮೀಸಲು ನಿಧಿ', ta: 'தணிக்கை செய்யப்பட்ட இருப்பு' },
  metricMedicalClaims: { en: 'Medical Claims Settled', hi: 'स्वीकृत चिकित्सा दावे', kn: 'ಇತ್ಯರ್ಥವಾದ ವೈದ್ಯಕೀಯ ಕ್ಲೈಮ್‌ಗಳು', ta: 'தீர்க்கப்பட்ட மருத்துவ உரிமைகோரல்கள்' },
  metricCashlessDisbursed: { en: '{amount} disbursed cashless', hi: '{amount} कैशलेस भुगतान किया गया', kn: '{amount} ನಗದು ರಹಿತವಾಗಿ ವಿತರಿಸಲಾಗಿದೆ', ta: '{amount} பணமில்லாமல் வழங்கப்பட்டது' },
  metricMicroPension: { en: 'Micro-Pension Members', hi: 'माइक्रो-पेंशन सदस्य', kn: 'ಕಿರು-ಪಿಂಚಣಿ ಸದಸ್ಯರು', ta: 'சிறு-ஓய்வூதிய உறுப்பினர்கள்' },
  metricCoopMatch: { en: 'With 50% cooperative match', hi: '50% सहकारी अंशदान के साथ', kn: '50% ಸಹಕಾರಿ ಹೊಂದಾಣಿಕೆಯೊಂದಿಗೆ', ta: '50% கூட்டுறவு பங்களிப்புடன்' },
  metricGuaranteeFund: { en: '1% Customer Guarantee Fund', hi: '1% ग्राहक गारंटी कोष', kn: '1% ಗ್ರಾಹಕ ಖಾತರಿ ನಿಧಿ', ta: '1% வாடிக்கையாளர் உத்தரவாத நிதி' },
  metricDamageRecourse: { en: 'Instant customer damage recourse', hi: 'ग्राहकों के नुकसान की तुरंत भरपाई', kn: 'ತಕ್ಷಣದ ಗ್ರಾಹಕ ಹಾನಿ ಪರಿಹಾರ', ta: 'உடனடி வாடிக்கையாளர் இழப்பீடு' },

  // 4 Core Pillars
  pillarsTag: { en: 'Democratic Protections', hi: 'लोकतांत्रिक सामाजिक सुरक्षा', kn: 'ಪ್ರಜಾಸತ್ತಾತ್ಮಕ ರಕ್ಷಣೆಗಳು', ta: 'ஜனநாயகப் பாதுகாப்புகள்' },
  pillarsTitle: { en: 'Four Core Pillars of Cooperative Mutual Aid', hi: 'सहकारी सहायता के चार मुख्य स्तंभ', kn: 'ಸಹಕಾರಿ ಪರಸ್ಪರ ನೆರವಿನ ನಾಲ್ಕು ಮುಖ್ಯ ಆಧಾರಸ್ತಂಭಗಳು', ta: 'கூட்டுறவு பரஸ்பர உதவியின் நான்கு முக்கிய தூண்கள்' },
  
  pillar1Title: { en: '₹5 Lakhs Family Health Shield', hi: '₹5 लाख पारिवारिक स्वास्थ्य सुरक्षा कवच', kn: '₹5 ಲಕ್ಷ ಕುಟುಂಬ ಆರೋಗ್ಯ ರಕ್ಷಣೆ', ta: '₹5 லட்சம் குடும்ப சுகாதார கவசம்' },
  pillar1Badge: { en: 'Cashless Hospitalization', hi: 'कैशलेस अस्पताल भर्ती', kn: 'ನಗದು ರಹಿತ ಆಸ್ಪತ್ರೆ ದಾಖಲಾತಿ', ta: 'பணமில்லா மருத்துவமனை சேர்க்கை' },
  pillar1Desc: { 
    en: 'Covers primary member, spouse, and dependent children across 850+ empanelled government and cooperative healthcare facilities. Pre-existing conditions covered after 90 days.', 
    hi: '850+ संबद्ध सरकारी व सहकारी अस्पतालों में सदस्य, जीवनसाथी और बच्चों के लिए कैशलेस इलाज। 90 दिनों बाद पुरानी बीमारियां भी शामिल।', 
    kn: '850+ ನೋಂದಾಯಿತ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಸದಸ್ಯರು, ಸಂಗಾತಿ ಮತ್ತು ಮಕ್ಕಳಿಗೆ ನಗದು ರಹಿತ ಚಿಕಿತ್ಸೆ. 90 ದಿನಗಳ ನಂತರ ಹಳೆಯ ಕಾಯಿಲೆಗಳಿಗೂ ರಕ್ಷಣೆ.', 
    ta: '850+ இணைக்கப்பட்ட மருத்துவமனைகளில் உறுப்பினர், துணைவர் மற்றும் குழந்தைகளுக்கு பணமில்லா சிகிச்சை.' 
  },
  pillar1Rate: { en: 'Claims Approval Rate: 98.4%', hi: 'दावा स्वीकृति दर: 98.4%', kn: 'ಕ್ಲೈಮ್ ಅನುಮೋದನೆ ದರ: 98.4%', ta: 'உரிமைகோரல் ஒப்புதல் விகிதம்: 98.4%' },

  pillar2Title: { en: 'Occupational Accident & Disability Cover', hi: 'व्यावसायिक दुर्घटना व दिव्यांगता सुरक्षा', kn: 'ಉದ್ಯೋಗ ಅಪಘಾತ ಮತ್ತು ಅಂಗವೈಕಲ್ಯ ರಕ್ಷಣೆ', ta: 'தொழில் விபத்து & ஊனமுற்றோர் பாதுகாப்பு' },
  pillar2Badge: { en: 'Immediate Relief Grant', hi: 'तत्काल राहत सहायता', kn: 'ತಕ್ಷಣದ ಪರಿಹಾರ ಅನುದಾನ', ta: 'உடனடி நிவாரண உதவி' },
  pillar2Desc: { 
    en: 'Zero-delay emergency disbursement up to ₹3,00,000 for work-related injuries, tool accidents, or temporary incapacitation, with weekly stipend replacement.', 
    hi: 'कार्यस्थल पर चोट या दुर्घटना की स्थिति में बिना देरी ₹3,00,000 तक की तत्काल सहायता और साप्ताहिक गुजारा भत्ता।', 
    kn: 'ಕೆಲಸದ ಸ್ಥಳದಲ್ಲಿ ಅಪಘಾತ ಸಂಭವಿಸಿದರೆ ₹3,00,000 ವರೆಗೆ ತಕ್ಷಣದ ನೆರವು ಮತ್ತು ವಾರದ ಭತ್ಯೆ.', 
    ta: 'பணி தொடர்பான காயங்களுக்கு ₹3,00,000 வரை உடனடி உதவி மற்றும் வாராந்திர ஊதியம்.' 
  },
  pillar2Rate: { en: 'Disbursement SLA: Under 4 hours', hi: 'सहायता समय सीमा: 4 घंटे से कम', kn: 'ವಿತರಣಾ ಸಮಯ: 4 ಗಂಟೆಗಳ ಒಳಗೆ', ta: 'வழங்கல் கால அளவு: 4 மணி நேரத்திற்குள்' },

  pillar3Title: { en: 'Co-contributory Micro-Pension', hi: 'सह-अंशदायी माइक्रो-पेंशन योजना', kn: 'ಸಹ-ಕೊಡುಗೆಯ ಕಿರು-ಪಿಂಚಣಿ', ta: 'கூட்டுப் பங்களிப்பு சிறு-ஓய்வூதியம்' },
  pillar3Badge: { en: '50% Federation Match', hi: '50% सहकारी महासंघ अंशदान', kn: '50% ಒಕ್ಕೂಟದ ಹೊಂದಾಣಿಕೆ', ta: '50% கூட்டமைப்பு பங்கு' },
  pillar3Desc: { 
    en: 'For every ₹100 a member deposits into their retirement corpus, the Federation contributes ₹50 directly from the society surplus pool, compounding tax-exempt.', 
    hi: 'कारीगर द्वारा पेंशन में जमा किए गए हर ₹100 पर महासंघ अपने मुनाफे से ₹50 अतिरिक्त जोड़ता है, जिससे बुढ़ापे में सम्मानजनक पेंशन मिलती है।', 
    kn: 'ಸದಸ್ಯರು ತಮ್ಮ ನಿವೃತ್ತಿ ನಿಧಿಗೆ ಜಮೆ ಮಾಡುವ ಪ್ರತಿ ₹100 ಕ್ಕೆ ಒಕ್ಕೂಟವು ₹50 ಹೆಚ್ಚುವರಿಯಾಗಿ ನೀಡುತ್ತದೆ.', 
    ta: 'ஓய்வூதிய நிதியில் உறுப்பினர் செலுத்தும் ஒவ்வொரு ₹100 க்கும் கூட்டமைப்பு ₹50 கூடுதலாக சேர்க்கிறது.' 
  },
  pillar3Rate: { en: 'Annual Yield: 8.2% Compound', hi: 'वार्षिक प्रतिफल: 8.2% चक्रवृद्धि', kn: 'ವಾರ್ಷಿಕ ಇಳುವರಿ: 8.2% ಸಂಯುಕ್ತ', ta: 'ஆண்டு வருவாய்: 8.2% கூட்டு வட்டி' },

  pillar4Title: { en: '1% Customer Guarantee Fund', hi: '1% ग्राहक संरक्षण गारंटी कोष', kn: '1% ಗ್ರಾಹಕ ಗ್ಯಾರಂಟಿ ನಿಧಿ', ta: '1% வாடிக்கையாளர் உத்தரவாத நிதி' },
  pillar4Badge: { en: 'Mutual Damage Recourse', hi: 'नुकसान की सीधी भरपाई', kn: 'ಹಾನಿ ಪರಿಹಾರ ವ್ಯವಸ್ಥೆ', ta: 'நேரடி சேத இழப்பீடு' },
  pillar4Desc: { 
    en: 'Protects customers against accidental property damage or incomplete work. Claims are inspected by peer arbitration and settled cashless from this dedicated trust.', 
    hi: 'यदि काम के दौरान कोई नुकसान होता है, तो सहकर्मी परिषद की जांच के बाद इस विशेष कोष से ग्राहक को तुरंत भरपाई की जाती है।', 
    kn: 'ಆಕಸ್ಮಿಕ ಹಾನಿಯ ಸಂದರ್ಭದಲ್ಲಿ ಗ್ರಾಹಕರಿಗೆ ರಕ್ಷಣೆ. ಮಧ್ಯಸ್ಥಿಕೆ ಮಂಡಳಿಯ ತೀರ್ಪಿನ ನಂತರ ತಕ್ಷಣ ಪರಿಹಾರ.', 
    ta: 'பணியின் போது சொத்து சேதம் ஏற்பட்டால், மத்தியஸ்த விசாரணைக்குப் பின் இந்த நிதியிலிருந்து இழப்பீடு வழங்கப்படும்.' 
  },
  pillar4Rate: { en: 'Average Settlement: 24 hours', hi: 'औसत निपटान समय: 24 घंटे', kn: 'ಸರಾಸರಿ ಇತ್ಯರ್ಥ ಸಮಯ: 24 ಗಂಟೆಗಳು', ta: 'சராசரி தீர்வு: 24 மணி நேரம்' },

  // Pension Calculator
  calcTag: { en: 'Interactive Wealth Simulator', hi: 'इंटरएक्टिव बचत कैलकुलेटर', kn: 'ಸಂವಾದಾತ್ಮಕ ಉಳಿತಾಯ ಕ್ಯಾಲ್ಕುಲೇಟರ್', ta: 'ஊடாடும் சேமிப்பு கால்குலேட்டர்' },
  calcTitle: { en: 'Calculate Your Micro-Pension Growth', hi: 'अपनी माइक्रो-पेंशन वृद्धि का अनुमान लगाएं', kn: 'ನಿಮ್ಮ ಕಿರು-ಪಿಂಚಣಿ ಬೆಳವಣಿಗೆಯನ್ನು ಲೆಕ್ಕಹಾಕಿ', ta: 'உங்கள் சிறு-ஓய்வூதிய வளர்ச்சியை கணக்கிடுங்கள்' },
  calcSub: { en: 'See how small monthly contributions compound with a 50% cooperative match', hi: 'देखें कैसे 50% सहकारी अंशदान से छोटी बचत बड़ा सुरक्षित कोष बनती है', kn: '50% ಸಹಕಾರಿ ಹೊಂದಾಣಿಕೆಯೊಂದಿಗೆ ಸಣ್ಣ ಮಾಸಿಕ ಉಳಿತಾಯ ಹೇಗೆ ಬೆಳೆಯುತ್ತದೆ ಎಂಬುದನ್ನು ನೋಡಿ', ta: '50% கூட்டுறவு பங்களிப்புடன் சிறிய சேமிப்பு எவ்வாறு வளர்கிறது என்பதைப் பாருங்கள்' },
  monthlyWorkerContrib: { en: 'Monthly Worker Contribution:', hi: 'कारीगर का मासिक अंशदान:', kn: 'ಕಾರ್ಮಿಕರ ಮಾಸಿಕ ಕೊಡುಗೆ:', ta: 'தொழிலாளியின் மாதாந்திர பங்களிப்பு:' },
  monthlyCoopMatch: { en: '50% Cooperative Federation Match Added:', hi: '50% सहकारी महासंघ द्वारा जोड़ा गया:', kn: '50% ಸಹಕಾರಿ ಒಕ್ಕೂಟದ ಪಾಲು:', ta: '50% கூட்டுறவு கூட்டமைப்பு பங்கு சேர்க்கப்பட்டது:' },
  monthlyTotalSavings: { en: 'Total Monthly Inflow to Pension Corpus:', hi: 'पेंशन खाते में कुल मासिक जमा:', kn: 'ಮಾಸಿಕ ಒಟ್ಟು ಉಳಿತಾಯ:', ta: 'மாதாந்திர மொத்த சேமிப்பு:' },
  estimatedCorpus15Years: { en: 'Estimated Retirement Corpus in 15 Years:', hi: '15 वर्षों में अनुमानित सेवानिवृत्ति कोष:', kn: '15 ವರ್ಷಗಳಲ್ಲಿ ಅಂದಾಜು ನಿವೃತ್ತಿ ನಿಧಿ:', ta: '15 ஆண்டுகளில் மதிப்பிடப்பட்ட ஓய்வூதிய நிதி:' },
  startContributingBtn: { en: 'Enroll in Micro-Pension Today', hi: 'आज ही माइक्रो-पेंशन शुरू करें', kn: 'ಇಂದೇ ಕಿರು-ಪಿಂಚಣಿಗೆ ನೋಂದಾಯಿಸಿ', ta: 'இன்றே சிறு-ஓய்வூதியத்தில் இணையுங்கள்' }
};
