import { TranslationItem } from './common';

export const authTranslations: Record<string, TranslationItem> = {
  // Login Gateway Header
  authGatewayTitle: { 
    en: 'Sign In to Your Dedicated Portal', 
    hi: 'अपने समर्पित पोर्टल में साइन इन करें', 
    kn: 'ನಿಮ್ಮ ಮೀಸಲಾದ ಪೋರ್ಟಲ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ', 
    ta: 'உங்கள் பிரத்யேக தளத்தில் உள்நுழையவும்' 
  },
  authGatewaySubtitle: { 
    en: 'SyncBridge provides role-separated environments for Customers, Tradespeople, and Societies.', 
    hi: 'सिंकब्रिज ग्राहकों, कारीगरों और समितियों के लिए समर्पित सुरक्षित कार्यक्षेत्र प्रदान करता है।', 
    kn: 'ಗ್ರಾಹಕರು, ಕಾರ್ಮಿಕರು ಮತ್ತು ಸಂಘಗಳಿಗಾಗಿ ಮೀಸಲಾದ ಸುರಕ್ಷಿತ ವ್ಯವಸ್ಥೆ.', 
    ta: 'வாடிக்கையாளர்கள், தொழிலாளர்கள் மற்றும் சங்கங்களுக்கான தனித்தனி தளம்.' 
  },
  authPersonaHeading: { 
    en: 'Select Active Persona & Access Domain:', 
    hi: 'सक्रिय प्रोफ़ाइल एवं क्षेत्र चुनें:', 
    kn: 'ಸಕ್ರಿಯ ವ್ಯಕ್ತಿತ್ವ ಮತ್ತು ಪ್ರವೇಶ ಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ:', 
    ta: 'செயலில் உள்ள சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்:' 
  },

  // Auth Modes & Roles
  authDemoMode: { en: '1-Click Evaluation Persona', hi: '1-क्लिक टेस्ट प्रोफाइल', kn: '1-ಕ್ಲಿಕ್ ಪರೀಕ್ಷಾ ಪ್ರವೇಶ', ta: '1-கிளிக் சோதனை சுயவிவரம்' },
  authOtpMode: { en: 'Mobile Phone OTP', hi: 'मोबाइल फोन ओटीपी', kn: 'ಮೊಬೈಲ್ ಫೋನ್ ಒಟಿಪಿ', ta: 'மொபைல் OTP' },
  authPasswordMode: { en: 'Admin 2FA Security', hi: 'प्रशासक 2FA सुरक्षा', kn: 'ನಿರ್ವಾಹಕ 2FA ಭದ್ರತೆ', ta: 'நிர்வாக 2FA பாதுகாப்பு' },
  authRoleCustomer: { en: 'Customer', hi: 'ग्राहक', kn: 'ಗ್ರಾಹಕರು', ta: 'வாடிக்கையாளர்' },
  authRoleWorker: { en: 'Tradesperson', hi: 'कारीगर', kn: 'ಕುಶಲಕರ್ಮಿ', ta: 'தொழிலாளி' },
  authRoleAdmin: { en: 'Society Admin', hi: 'समिति प्रशासक', kn: 'ಸಂಘದ ಆಡಳಿತಾಧಿಕಾರಿ', ta: 'சங்க நிர்வாகி' },

  // Form Fields & Buttons
  phoneInputLabel: { en: 'Mobile Phone Number:', hi: 'मोबाइल नंबर दर्ज करें:', kn: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ:', ta: 'மொபைல் எண்ணை உள்ளிடவும்:' },
  phonePlaceholder: { en: '10-digit mobile number (e.g. 98201 44552)', hi: '10 अंकों का मोबाइल नंबर', kn: '10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', ta: '10 இலக்க மொபைல் எண்' },
  otpInputLabel: { en: '6-Digit SMS Verification OTP:', hi: '6 अंकों का एसएमएस ओटीपी दर्ज करें:', kn: '6 ಅಂಕಿಗಳ ಒಟಿಪಿ ನಮೂದಿಸಿ:', ta: '6 இலக்க OTP ஐ உள்ளிடவும்:' },
  otpPlaceholder: { en: 'Enter 123456 for demo', hi: 'डेमो के लिए 123456 दर्ज करें', kn: 'ಡೆಮೊಗಾಗಿ 123456 ನಮೂದಿಸಿ', ta: 'சோதனைக்கு 123456 உள்ளிடவும்' },
  sendOtpBtn: { en: 'Send Mobile OTP', hi: 'ओटीपी भेजें', kn: 'ಒಟಿಪಿ ಕಳುಹಿಸಿ', ta: 'OTP அனுப்பு' },
  verifyOtpBtn: { en: 'Verify & Enter Portal', hi: 'सत्यापित करें एवं प्रवेश करें', kn: 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ಪ್ರವೇಶಿಸಿ', ta: 'சரிபார்த்து உள்நுழைக' },
  resendOtpBtn: { en: 'Resend OTP Code', hi: 'ओटीपी पुनः भेजें', kn: 'ಮತ್ತೆ ಒಟಿಪಿ ಕಳುಹಿಸಿ', ta: 'மீண்டும் OTP அனுப்பு' },

  // Admin 2FA Fields
  adminIdLabel: { en: 'Federation Member Admin ID:', hi: 'महासंघ प्रशासक आईडी:', kn: 'ಒಕ್ಕೂಟದ ನಿರ್ವಾಹಕ ಐಡಿ:', ta: 'கூட்டமைப்பு நிர்வாக ஐடி:' },
  adminPasswordLabel: { en: 'Secure Society Password:', hi: 'सुरक्षित समिति पासवर्ड:', kn: 'ಸಂಘದ ಪಾಸ್‌ವರ್ಡ್:', ta: 'சங்க கடவுச்சொல்:' },
  admin2faLabel: { en: 'Time-based 2FA Verification Token:', hi: '2FA सुरक्षा कोड:', kn: '2FA ಭದ್ರತಾ ಕೋಡ್:', ta: '2FA பாதுகாப்பு குறியீடு:' },
  adminLoginBtn: { en: 'Authenticate & Enter Console', hi: 'लॉग इन करें', kn: 'ಪ್ರವೇಶಿಸಿ', ta: 'உள்நுழைக' },

  // Register Gateway Page
  regGatewayTag: { en: 'Cooperative Membership & Account Creation', hi: 'सहकारी सदस्यता एवं खाता निर्माण', kn: 'ಸಹಕಾರಿ ಸದಸ್ಯತ್ವ ಮತ್ತು ನೋಂದಣಿ', ta: 'கூட்டுறவு உறுப்பினர் சேர்க்கை' },
  regGatewayTitle: { en: 'Join the Democratic Gig Network', hi: 'लोकतांत्रिक कामगार नेटवर्क से जुड़ें', kn: 'ಪ್ರಜಾಸತ್ತಾತ್ಮಕ ಕಾರ್ಮಿಕ ಜಾಲಕ್ಕೆ ಸೇರಿ', ta: 'ஜனநாயக தொழிலாளர் நெட்வொர்க்கில் இணையுங்கள்' },
  regGatewaySub: { en: 'Select your account type to begin registration with transparent pricing and worker-first protection.', hi: 'पारदर्शी दरों और सुरक्षा के साथ पंजीकरण शुरू करने के लिए अपना खाता प्रकार चुनें।', kn: 'ಪಾರದರ್ಶಕತೆ ಮತ್ತು ರಕ್ಷಣೆಯೊಂದಿಗೆ ನೋಂದಾಯಿಸಲು ನಿಮ್ಮ ಖಾತೆ ಪ್ರಕಾರವನ್ನು ಆರಿಸಿ.', ta: 'வெளிப்படையான கட்டணத்துடன் பதிவு செய்ய உங்கள் கணக்கு வகையைத் தேர்ந்தெடுக்கவும்.' },
  
  regCardCustTitle: { en: 'Customer Account', hi: 'ग्राहक खाता', kn: 'ಗ್ರಾಹಕರ ಖಾತೆ', ta: 'வாடிக்கையாளர் கணக்கு' },
  regCardCustDesc: { en: 'Book certified plumbers, electricians, technicians, and carpenters within 5 km with 1% guarantee damage recourse.', hi: '1% गारंटी सुरक्षा के साथ 5 किमी के भीतर प्रमाणित नलसाज, इलेक्ट्रीशियन और बढ़ई बुक करें।', kn: '1% ಗ್ಯಾರಂಟಿ ರಕ್ಷಣೆಯೊಂದಿಗೆ 5 ಕಿ.ಮೀ ಒಳಗೆ ಪ್ರಮಾಣೀಕೃತ ಕೆಲಸಗಾರರನ್ನು ಬುಕ್ ಮಾಡಿ.', ta: '1% உத்தரவாத பாதுகாப்புடன் 5 கி.ಮೀ எல்லைக்குள் தொழிலாளர்களை பதிவு செய்யுங்கள்.' },
  regCardCustBtn: { en: 'Create Customer Account', hi: 'ग्राहक खाता बनाएं', kn: 'ಗ್ರಾಹಕರ ಖಾತೆ ತೆರೆಯಿರಿ', ta: 'வாடிக்கையாளர் கணக்கை உருவாக்கு' },

  regCardWorkerTitle: { en: 'Worker Member Onboarding', hi: 'कारीगर सदस्य पंजीकरण', kn: 'ಕಾರ್ಮಿಕ ಸದಸ್ಯರ ನೋಂದಣಿ', ta: 'தொழிலாளர் உறுப்பினர் பதிவு' },
  regCardWorkerDesc: { en: 'Keep 90% of your earnings, get ₹5 Lakh healthcare shield, daily UPI payouts, and democratic voting rights.', hi: '90% सीधी कमाई पाएं, ₹5 लाख का स्वास्थ्य बीमा, दैनिक भुगतान और मतदान का अधिकार प्राप्त करें।', kn: 'ಗಳಿಕೆಯ 90% ಉಳಿಸಿಕೊಳ್ಳಿ, ₹5 ಲಕ್ಷ ಆರೋಗ್ಯ ರಕ್ಷಣೆ ಮತ್ತು ದೈನಂದಿನ ಪಾವತಿ ಪಡೆಯಿರಿ.', ta: '90% வருவாய், ₹5 லட்சம் மருத்துவ காப்பீடு மற்றும் தினசரி ஊதியம் பெறுங்கள்.' },
  regCardWorkerBtn: { en: 'Start 5-Step Worker Registration', hi: '5-चरणीय कारीगर पंजीकरण शुरू करें', kn: '5-ಹಂತದ ನೋಂದಣಿ ಪ್ರಾರಂಭಿಸಿ', ta: '5-படி தொழிலாளர் பதிவைத் தொடங்கு' },

  regCardSocietyTitle: { en: 'Primary Society Chapter', hi: 'प्राथमिक सहकारी समिति शाखा', kn: 'ಪ್ರಾಥಮಿಕ ಸಹಕಾರ ಸಂಘ', ta: 'தொடக்க கூட்டுறவு சங்கம்' },
  regCardSocietyDesc: { en: 'Empanel your registered labour cooperative society to govern rosters, shared power tools, and operational reserves.', hi: 'अपने सदस्यों, साझा मशीनरी बैंक और परिचालन आरक्षित कोष के प्रबंधन हेतु समिति को पंजीकृत करें।', kn: 'ನಿಮ್ಮ ಕಾರ್ಮಿಕ ಸಹಕಾರ ಸಂಘವನ್ನು ನೋಂದಾಯಿಸಿ ಮತ್ತು ಉಪಕರಣ ಬ್ಯಾಂಕ್ ನಿರ್ವಹಿಸಿ.', ta: 'தொழிலாளர் கூட்டுறவு சங்கத்தை இணைத்து கருவிகள் மற்றும் நிதியை நிர்வகிக்கவும்.' },
  regCardSocietyBtn: { en: 'Society Secretary Login', hi: 'समिति सचिव लॉगिन', kn: 'ಸಂಘದ ಕಾರ್ಯದರ್ಶಿ ಲಾಗಿನ್', ta: 'சங்க செயலாளர் உள்நுழைவு' },

  regCardB2bTitle: { en: 'B2B / B2G Institutional RFQ', hi: 'संस्थागत बी2बी / बी2जी अनुबंध', kn: 'ಸಾಂಸ್ಥಿಕ ಬಿ2ಬಿ / ಬಿ2ಜಿ ಗುತ್ತಿಗೆ', ta: 'நிறுவன பி2பி / பி2ஜி ஒப்பந்தம்' },
  regCardB2bDesc: { en: 'For Municipal Corporations, Housing Federations, and Enterprises seeking long-term facility contracts.', hi: 'नगर पालिकाओं, आवास संघों और सार्वजनिक उद्यमों के लिए दीर्घकालिक सुविधा प्रबंधन।', kn: 'ನಗರ ಪಾಲಿಕೆಗಳು ಮತ್ತು ಸಂಸ್ಥೆಗಳಿಗೆ ದೀರ್ಘಕಾಲೀನ ಸೌಲಭ್ಯ ನಿರ್ವಹಣಾ ಒಪ್ಪಂದಗಳು.', ta: 'நகராட்சிகள் மற்றும் நிறுவனங்களுக்கான நீண்டகால பராமரிப்பு ஒப்பந்தங்கள்.' },
  regCardB2bBtn: { en: 'Issue Institutional RFQ', hi: 'संस्थागत आरएफक्यू जारी करें', kn: 'ಸಾಂಸ್ಥಿಕ RFQ ಸಲ್ಲಿಸಿ', ta: 'நிறுவன RFQ சமர்ப்பிக்கவும்' },
  alreadyRegisteredPrompt: { en: 'Already have an account?', hi: 'क्या आपके पास पहले से खाता है?', kn: 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?', ta: 'ஏற்கனவே கணக்கு உள்ளதா?' },
  signInLink: { en: 'Sign in to your portal', hi: 'अपने पोर्टल में साइन इन करें', kn: 'ನಿಮ್ಮ ಪೋರ್ಟಲ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ', ta: 'உங்கள் தளத்தில் உள்நுழையவும்' }
};
