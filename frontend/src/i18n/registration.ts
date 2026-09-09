import { TranslationItem } from './common';

export const registrationTranslations: Record<string, TranslationItem> = {
  // Form Header & Steps
  regFormTitle: { en: 'Worker Cooperative Onboarding & Skill Profiling', hi: 'कारीगर सहकारी पंजीकरण एवं कौशल प्रोफाइलिंग', kn: 'ಕಾರ್ಮಿಕ ಸಹಕಾರಿ ನೋಂದಣಿ ಮತ್ತು ಕೌಶಲ್ಯ ಪ್ರೊಫೈಲ್', ta: 'தொழிலாளர் கூட்டுறவு பதிவு & திறன் விவரம்' },
  regFormSubtitle: { en: '5-step membership onboarding under NCCT Multi-State Cooperative Framework', hi: 'एनसीईटी बहु-राज्य सहकारी ढांचे के तहत 5-चरणीय सदस्यता पंजीकरण', kn: 'NCCT ಚೌಕಟ್ಟಿನಡಿಯಲ್ಲಿ 5-ಹಂತದ ಸದಸ್ಯತ್ವ ನೋಂದಣಿ', ta: 'NCCT கட்டமைப்பின் கீழ் 5-படி உறுப்பினர் சேர்க்கை' },
  stepIndicator: { en: 'Step {current} of {total}', hi: 'चरण {current} / {total}', kn: 'ಹಂತ {current} / {total}', ta: 'படி {current} / {total}' },
  
  step1Title: { en: 'Trade & Mobile Verification', hi: 'कारीगरी व मोबाइल सत्यापन', kn: 'ವೃತ್ತಿ ಮತ್ತು ಮೊಬೈಲ್ ಪರಿಶೀಲನೆ', ta: 'தொழில் மற்றும் மொபைல் சரிபார்ப்பு' },
  step2Title: { en: 'Personal & Locality Profile', hi: 'व्यक्तिगत जानकारी व इलाका', kn: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಮತ್ತು ಸ್ಥಳ', ta: 'தனிப்பட்ட விவரங்கள் & இடம்' },
  step3Title: { en: 'Experience & Fair Wage', hi: 'अनुभव एवं प्रति घंटा दर', kn: 'ಅನುಭವ ಮತ್ತು ನ್ಯಾಯಯುತ ವೇತನ', ta: 'அனுபவம் & நியாயமான ஊதியம்' },
  step4Title: { en: 'e-Shram & Accreditation', hi: 'ई-श्रम व प्रमाण पत्र', kn: 'ಇ-ಶ್ರಮ್ ಮತ್ತು ಪ್ರಮಾಣಪತ್ರ', ta: 'இ-ஷ்ரம் & சான்றிதழ்' },
  step5Title: { en: 'Society Chapter & Pledge', hi: 'समिति शाखा एवं घोषणा', kn: 'ಸಂಘದ ಶಾಖೆ ಮತ್ತು ಪ್ರಮಾಣ', ta: 'சங்க கிளை & உறுதிமொழி' },

  // Step 1
  selectTradeHeading: { en: 'Select Your Primary Skilled Trade:', hi: 'अपना मुख्य हुनर / काम चुनें:', kn: 'ನಿಮ್ಮ ಮುಖ್ಯ ಕೌಶಲ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ:', ta: 'உங்கள் முதன்மைத் தொழிலைத் தேர்ந்தெடுக்கவும்:' },
  voiceGuidancePrompt: { en: 'Listen to step instructions in your language', hi: 'अपनी भाषा में निर्देश सुनें', kn: 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸೂಚನೆಗಳನ್ನು ಆಲಿಸಿ', ta: 'உங்கள் மொழியில் வழிமுறைகளைக் கேளுங்கள்' },
  
  // Step 2
  fullNameLabel: { en: 'Full Legal Name (as on Aadhaar):', hi: 'पूरा नाम (आधार कार्ड के अनुसार):', kn: 'ಪೂರ್ಣ ಹೆಸರು (ಆಧಾರ್ ಪ್ರಕಾರ):', ta: 'முழு பெயர் (ஆதார் படி):' },
  fullNamePlaceholder: { en: 'e.g. Ramesh Chavan', hi: 'जैसे रमेश चव्हाण', kn: 'ಉದಾ: ರಮೇಶ್ ಕುಮಾರ್', ta: 'எ.கா. ரமேஷ் குமார்' },
  cityLabel: { en: 'Operational District / City:', hi: 'कार्यरत जिला / शहर:', kn: 'ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಜಿಲ್ಲೆ / ನಗರ:', ta: 'பணிபுரியும் மாவட்டம் / நகரம்:' },
  voiceMicStart: { en: 'Speak Name', hi: 'नाम बोलें', kn: 'ಹೆಸರು ಹೇಳಿ', ta: 'பெயரை பேசுங்கள்' },
  voiceMicStop: { en: 'Stop Mic', hi: 'माइक रोकें', kn: 'ನಿಲ್ಲಿಸಿ', ta: 'நிறுத்து' },
  gpsLabel: { en: 'Local Service Geofence GPS:', hi: 'सेवा क्षेत्र जीपीएस निर्देशांक:', kn: 'ಸೇವಾ ಸ್ಥಳ ಜಿಪಿಎಸ್:', ta: 'சேவை எல்லை ஜிபிஎஸ்:' },

  // Step 3
  experienceSliderLabel: { en: 'Years of Trade Experience:', hi: 'काम का कुल अनुभव (वर्ष):', kn: 'ಒಟ್ಟು ಅನುಭವ (ವರ್ಷಗಳು):', ta: 'மொத்த அனுபவம் (ஆண்டுகள்):' },
  rateSliderLabel: { en: 'Your Desired Hourly Service Rate (₹/hr):', hi: 'आपकी प्रति घंटा मजदूरी (₹/घंटा):', kn: 'ನಿಮ್ಮ ಗಂಟೆಯ ವೇತನ (₹/ಗಂಟೆಗೆ):', ta: 'உங்கள் மணிநேர ஊதியம் (₹/மணி):' },
  breakdownNotice: { en: 'Upon completion: You keep 90% (₹{takeHome}), 5% supports the heavy tool library, and 5% funds your ₹5L health cover.', hi: 'काम पूरा होने पर: 90% (₹{takeHome}) सीधे आपको, 5% साझा औजार बैंक को और 5% आपके ₹5 लाख स्वास्थ्य बीमा में जमा होगा।', kn: 'ಕೆಲಸ ಮುಗಿದಾಗ: 90% (₹{takeHome}) ನೇರವಾಗಿ ನಿಮಗೆ, 5% ಉಪಕರಣ ಬ್ಯಾಂಕ್‌ಗೆ ಮತ್ತು 5% ನಿಮ್ಮ ₹5 ಲಕ್ಷ ಆರೋಗ್ಯ ರಕ್ಷಣೆಗೆ ಸೇರುತ್ತದೆ.', ta: 'வேலை முடிந்ததும்: 90% (₹{takeHome}) நேரடியாக உங்களுக்கு, 5% கருவி வங்கிக்கும், 5% உங்கள் ₹5 லட்சம் மருத்துவ காப்பீட்டிற்கும் செல்லும்.' },

  // Step 4
  uanLabel: { en: '12-Digit e-Shram UAN Number:', hi: '12 अंकों का ई-श्रम यूएएन नंबर:', kn: '12-ಅಂಕಿಯ ಇ-ಶ್ರಮ್ UAN ಸಂಖ್ಯೆ:', ta: '12-இலக்க இ-ஷ்ரம் UAN எண்:' },
  uanHelp: { en: 'Verifies national unorganized worker identity and social security entitlement.', hi: 'असंगठित कामगार पहचान और सरकारी सामाजिक सुरक्षा पात्रता सुनिश्चित करता है।', kn: 'ಅಸಂಘಟಿತ ಕಾರ್ಮಿಕರ ಗುರುತು ಮತ್ತು ಸಾಮಾಜಿಕ ಭದ್ರತೆಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.', ta: 'அமைப்புசாரா தொழிலாளர் அடையாளம் மற்றும் பாதுகாப்பை உறுதி செய்கிறது.' },
  uploadDocLabel: { en: 'Trade Accreditation / Police Verification PDF:', hi: 'प्रमाण पत्र या पुलिस सत्यापन दस्तावेज:', kn: 'ಪ್ರಮಾಣಪತ್ರ ಅಥವಾ ಪೊಲೀಸ್ ಪರಿಶೀಲನೆ ದಾಖಲೆ:', ta: 'தொழில் சான்றிதழ் அல்லது காவல்துறை சரிபார்ப்பு ஆவணம்:' },
  docUploadedBadge: { en: 'Document Uploaded & Attached', hi: 'दस्तावेज अपलोड हो गया', kn: 'ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ', ta: 'ஆவணம் பதிவேற்றப்பட்டது' },

  // Step 5
  societyChoiceLabel: { en: 'Choose Primary Cooperative Affiliation:', hi: 'अपनी प्राथमिक सहकारी समिति चुनें:', kn: 'ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ಸಹಕಾರ ಸಂಘವನ್ನು ಆಯ್ಕೆಮಾಡಿ:', ta: 'உங்கள் தொடக்க கூட்டுறவு சங்கத்தைத் தேர்ந்தெடுக்கவும்:' },
  societyOptionDefault: { en: 'Kalyan Labour Cooperative Society (Ward 88)', hi: 'कल्याण श्रम सहकारी समिति (वार्ड 88)', kn: 'ಕಲ್ಯಾಣ ಕಾರ್ಮಿಕ ಸಹಕಾರ ಸಂಘ (ವಾರ್ಡ್ 88)', ta: 'கல்யாண் தொழிலாளர் கூட்டுறவு சங்கம் (வார்டு 88)' },
  societyOptionCentral: { en: 'Karnataka Trade Union Federation District Pool', hi: 'कर्नाटक ट्रेड यूनियन फेडरेशन जिला पूल', kn: 'ಕರ್ನಾಟಕ ಟ್ರೇಡ್ ಯೂನಿಯನ್ ಒಕ್ಕೂಟ', ta: 'கர்நாடக தொழிற்சங்க கூட்டமைப்பு' },
  coopPledge: { en: 'Democratic Pledge: I agree to uphold the 90/5/5 cooperative distribution, serve customers fairly, and resolve disputes through democratic peer arbitration.', hi: 'लोकतांत्रिक प्रतिज्ञा: मैं 90/5/5 सहकारी वितरण का पालन करने, ग्राहकों को निष्पक्ष सेवा देने और विवादों को सहकर्मी परिषद के माध्यम से सुलझाने की शपथ लेता हूं।', kn: 'ಪ್ರಜಾಸತ್ತಾತ್ಮಕ ಪ್ರತಿಜ್ಞೆ: ನಾನು 90/5/5 ಸಹಕಾರಿ ವಿತರಣೆಯನ್ನು ಪಾಲಿಸಲು ಮತ್ತು ವಿವಾದಗಳನ್ನು ಮಧ್ಯಸ್ಥಿಕೆ ಮೂಲಕ ಪರಿಹರಿಸಲು ಒಪ್ಪುತ್ತೇನೆ.', ta: 'ஜனநாயக உறுதிமொழி: நான் 90/5/5 கூட்டுறவு பகிர்வுக்கு இணங்கி, நேர்மையாக சேவை செய்ய உறுதியளிக்கிறேன்.' },
  submitAppBtn: { en: 'Submit Application & Join Cooperative', hi: 'आवेदन जमा करें एवं सदस्य बनें', kn: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಮತ್ತು ಸದಸ್ಯರಾಗಿ', ta: 'விண்ணப்பத்தை சமர்ப்பித்து இணையுங்கள்' },

  // Success Confirmation
  successHeading: { en: 'Application Submitted to Society Secretary!', hi: 'समिति सचिव को आवेदन प्रस्तुत!', kn: 'ಸಂಘದ ಕಾರ್ಯದರ್ಶಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!', ta: 'சங்க செயலாளருக்கு விண்ணப்பம் சமர்ப்பிக்கப்பட்டது!' },
  successSub: { en: 'Your provisional worker ID is generated. You can now access your Artisan Workspace.', hi: 'आपकी अस्थायी कारीगर आईडी बन गई है। अब आप अपने कार्यक्षेत्र में जा सकते हैं।', kn: 'ನಿಮ್ಮ ಕಾರ್ಮಿಕ ಐಡಿ ರಚಿಸಲಾಗಿದೆ. ಈಗ ನಿಮ್ಮ ಕಾರ್ಯಕ್ಷೇತ್ರವನ್ನು ಪ್ರವೇಶಿಸಬಹುದು.', ta: 'உங்கள் தொழிலாளர் ஐடி உருவாக்கப்பட்டது. உங்கள் பணியிடத்தை இப்போது அணுகலாம்.' },
  openWorkspaceBtn: { en: 'Open Worker Workspace', hi: 'कारीगर कार्यक्षेत्र खोलें', kn: 'ಕಾರ್ಮಿಕ ಕಾರ್ಯಕ್ಷೇತ್ರ ತೆರೆಯಿರಿ', ta: 'தொழிலாளர் பணியிடம் திறக்கவும்' }
};
