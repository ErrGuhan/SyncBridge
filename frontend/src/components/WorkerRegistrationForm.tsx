'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCoopData } from '@/context/CoopDataContext';
import { 
  User, 
  MapPin, 
  Check, 
  X,
  Mic, 
  MicOff, 
  Camera, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Navigation,
  CheckCircle2,
  Volume2,
  Zap,
  Droplets,
  Sparkles,
  Wind,
  Hammer
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function WorkerRegistrationForm() {
  const { t, language } = useLanguage();
  const { submitWorkerApplication } = useCoopData();
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    phone: '',
    trade: 'Electrician',
    fullName: '',
    city: 'Mumbai',
    gpsCoordinates: '19.0760° N, 72.8777° E',
    experienceYears: 5,
    hourlyRate: 500,
    uanNumber: '1009-8821-4419',
    documentUploaded: false
  });

  const [isListeningName, setIsListeningName] = useState<boolean>(false);
  const [isListeningCity, setIsListeningCity] = useState<boolean>(false);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [hasExistingCoop, setHasExistingCoop] = useState<boolean>(true);

  const getVoiceLang = () => {
    if (language === 'hi') return 'hi-IN';
    if (language === 'kn') return 'kn-IN';
    if (language === 'ta') return 'ta-IN';
    return 'en-IN';
  };

  const playVoicePrompt = (text: string, lang?: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingText(text);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang || getVoiceLang();
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const trades = [
    { 
      id: 'Electrician', 
      label: 'Electrician', 
      native: 'इलेक्ट्रीशियन (बिजली मिस्त्री)', 
      desc: 'Wiring, MCBs, inverter systems, switches',
      voiceText: 'इलेक्ट्रीशियन। बिजली, वायरिंग, एमसीबी और पंखे का काम।',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50 border-amber-200 hover:border-amber-400',
      activeColor: 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/30'
    },
    { 
      id: 'Plumber', 
      label: 'Plumber', 
      native: 'प्लंबर (नल मिस्त्री)', 
      desc: 'Pipes, fittings, drainage, leakage',
      voiceText: 'प्लंबर। पानी का रिसाव, नल की मरम्मत और पाइप फिटिंग।',
      icon: Droplets,
      color: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400',
      activeColor: 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-400/30'
    },
    { 
      id: 'Cleaner', 
      label: 'Cleaning & Sanitation', 
      native: 'सफाई सेवा (सफाई कर्मी)', 
      desc: 'Deep home sanitization, water tank wash',
      voiceText: 'सफाई सेवा। घर की गहरी सफाई और पानी की टंकी की धुलाई।',
      icon: Sparkles,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      activeColor: 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-400/30'
    },
    { 
      id: 'Appliance', 
      label: 'HVAC & Appliance', 
      native: 'एसी व उपकरण मरम्मत', 
      desc: 'AC servicing, refrigerator, washing machine',
      voiceText: 'एसी और उपकरण मरम्मत। एसी गैस, फ्रिज और वाशिंग मशीन।',
      icon: Wind,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200 hover:border-cyan-400',
      activeColor: 'bg-cyan-50/80 border-cyan-500 ring-2 ring-cyan-400/30'
    },
    { 
      id: 'Carpenter', 
      label: 'Carpentry & Fabrication', 
      native: 'बढ़ई (लकड़ी का काम)', 
      desc: 'Furniture, lock fittings, cabinetry',
      voiceText: 'बढ़ई। दरवाजे का ताला, लकड़ी का काम और फर्नीचर मरम्मत।',
      icon: Hammer,
      color: 'text-orange-700 bg-orange-50 border-orange-200 hover:border-orange-400',
      activeColor: 'bg-orange-50/80 border-orange-500 ring-2 ring-orange-400/30'
    }
  ];

  const handleVoiceName = () => {
    if (isListeningName) {
      setIsListeningName(false);
      return;
    }
    setIsListeningName(true);
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, fullName: 'Rameshwar Chavan' }));
      setIsListeningName(false);
    }, 2000);
  };

  const handleVoiceCity = () => {
    if (isListeningCity) {
      setIsListeningCity(false);
      return;
    }
    setIsListeningCity(true);
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, city: 'Dadar West, Mumbai' }));
      setIsListeningCity(false);
    }, 1800);
  };

  const handleDetectGps = () => {
    setIsDetectingGps(true);
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        city: 'Bandra West, Mumbai',
        gpsCoordinates: '19.0596° N, 72.8295° E'
      }));
      setIsDetectingGps(false);
    }, 1200);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      submitWorkerApplication({
        fullName: formData.fullName || 'Member Worker',
        phone: formData.phone ? `+91 ${formData.phone}` : '+91 98201 99001',
        trade: formData.trade,
        city: formData.city,
        uanNumber: formData.uanNumber || '1009-8821-4419',
        hourlyRate: formData.hourlyRate,
        experienceYears: formData.experienceYears,
        certificationTitle: formData.documentUploaded ? 'Verified Trade Certificate (Govt e-Shram)' : 'Self-Assessed Skill Evaluation'
      });
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto py-8 text-center space-y-6 animate-in fade-in duration-200">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900">
            {t('successHeading')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('successSub')}
          </p>
        </div>

        {/* Verification Status Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-left space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Review Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Pending Secretary Verification
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-semibold text-slate-900">{formData.fullName || 'Member Worker'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trade:</span>
              <span className="font-semibold text-slate-900">{formData.trade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">e-Shram UAN:</span>
              <span className="font-semibold text-slate-900">{formData.uanNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cooperative Chapter:</span>
              <span className="font-semibold text-slate-900">Mumbai Labour Cooperative Union</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            🛡️ <strong>Offline Verification Fallback:</strong> If national databases experience downtime, your documents are verified in-person by your Primary Cooperative Secretary within 24 hours.
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href="/portal/worker"
            className="h-11 w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center shadow-xs transition-colors"
          >
            {t('openWorkspaceBtn')}
          </Link>
          <Link
            href="/services"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center transition-colors"
          >
            Explore Client Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-4 space-y-6">
      
      {/* Audio Guide Playing Feedback */}
      {speakingText && (
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-2 animate-pulse">
          <Volume2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Audio Guide: Playing spoken instructions...</span>
        </div>
      )}

      {/* Stepper Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>{t('stepIndicator', { current: step, total: totalSteps })}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
        </div>

        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* SCREEN 1: PHONE NUMBER */}
      {/* -------------------------------------------------------------------- */}
      {step === 1 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                What is your mobile phone number?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                We verify you securely via SMS OTP. No passwords required.
              </p>
            </div>

            <button
              type="button"
              onClick={() => playVoicePrompt('कृपया अपना मोबाइल नंबर दर्ज करें। हम आपको एसएमएस ओटीपी भेजेंगे।')}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto border border-blue-200"
              title="Listen in Hindi"
            >
              <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>सुनें (Audio)</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Mobile Number (मोबाइल नंबर)</label>
            <div className="flex items-center border border-slate-300 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all overflow-hidden">
              <span className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-700 font-medium text-sm">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                placeholder="98201 12345"
                className="flex-1 px-3 py-2.5 text-base font-semibold text-slate-900 outline-none"
                autoFocus
              />
            </div>
            <p className="text-xs text-slate-400">
              OTP will be sent to this number upon proceeding.
            </p>
          </div>

          {/* Accessible Color-Coded Yes/No Pattern (Accessibility Requirement) */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">
              Are you currently a member of a Primary Labour Cooperative? (सहकारी समिति सदस्यता)
            </label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setHasExistingCoop(true)}
                className={`h-11 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  hasExistingCoop
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-400/30'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Yes / Accept (हाँ)</span>
              </button>
              <button
                type="button"
                onClick={() => setHasExistingCoop(false)}
                className={`h-11 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  !hasExistingCoop
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-400/30'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                }`}
              >
                <X className="w-4 h-4 stroke-[2.5]" />
                <span>No / Decline (नहीं)</span>
              </button>
            </div>
            {!hasExistingCoop && (
              <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
                ℹ️ We will automatically assign you to your nearest district cooperative chapter (e.g. Kalyan / Metro Technicians).
              </p>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCREEN 2: SELECT TRADE (ICON-FIRST & COLOR CODED) */}
      {/* -------------------------------------------------------------------- */}
      {step === 2 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Select your skilled trade
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Choose your primary cooperative specialization.
              </p>
            </div>

            <button
              type="button"
              onClick={() => playVoicePrompt('अपनी हुनर या पेशा चुनें। जैसे इलेक्ट्रीशियन, प्लंबर, सफाई या बढ़ई।')}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto border border-blue-200"
              title="Listen in Hindi"
            >
              <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>सुनें (Audio)</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {trades.map((tItem) => {
              const isSelected = formData.trade === tItem.id;
              const Icon = tItem.icon;
              return (
                <div
                  key={tItem.id}
                  onClick={() => setFormData({ ...formData, trade: tItem.id })}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? `${tItem.activeColor} shadow-xs`
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon First Visual Identifier */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${tItem.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{tItem.label}</span>
                        <span className="text-xs text-slate-500 font-semibold">({tItem.native})</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{tItem.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Audio Preview Cue Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playVoicePrompt(tItem.voiceText);
                      }}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition-colors"
                      title={`Listen: ${tItem.label}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCREEN 3: NAME & LOCATION */}
      {/* -------------------------------------------------------------------- */}
      {step === 3 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Your Name & Work Location
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Type or use voice dictation to enter your profile details.
              </p>
            </div>

            <button
              type="button"
              onClick={() => playVoicePrompt('कृपया अपना नाम और कार्य क्षेत्र दर्ज करें या बोलकर बताएं।')}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto border border-blue-200"
              title="Listen in Hindi"
            >
              <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>सुनें (Audio)</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Name (पूरा नाम)</label>
              <div className="flex items-center border border-slate-300 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-1">
                <User className="w-4 h-4 ml-2 text-slate-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rameshwar Chavan"
                  className="flex-1 px-2.5 py-1.5 text-sm text-slate-900 font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={handleVoiceName}
                  className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    isListeningName
                      ? 'bg-rose-600 text-white animate-voice-wave'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  aria-label="Speak name"
                >
                  {isListeningName ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{isListeningName ? 'Listening...' : 'Voice'}</span>
                </button>
              </div>
            </div>

            {/* City / Service Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">City / Operational Area (शहर / इलाका)</label>
              <div className="flex items-center border border-slate-300 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-1">
                <MapPin className="w-4 h-4 ml-2 text-slate-400" />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Dadar West, Mumbai"
                  className="flex-1 px-2.5 py-1.5 text-sm text-slate-900 font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={handleVoiceCity}
                  className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    isListeningCity
                      ? 'bg-rose-600 text-white animate-voice-wave'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  aria-label="Speak location"
                >
                  {isListeningCity ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{isListeningCity ? 'Listening...' : 'Voice'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className={`w-3.5 h-3.5 text-blue-600 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'Calibrating Coordinates...' : 'Detect Current GPS Location'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCREEN 4: EXPERIENCE & HOURLY RATE */}
      {/* -------------------------------------------------------------------- */}
      {step === 4 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Trade Experience & Hourly Rate
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Set your target rate. You receive 90% of every completed job.
              </p>
            </div>

            <button
              type="button"
              onClick={() => playVoicePrompt('अपना अनुभव और प्रति घंटा दर तय करें। हर काम का 90 प्रतिशत सीधा आपको मिलेगा।')}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto border border-blue-200"
              title="Listen in Hindi"
            >
              <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>सुनें (Audio)</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Experience Stepper */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <label className="text-xs font-semibold text-slate-600">Years of Experience (कार्य अनुभव)</label>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, experienceYears: Math.max(1, prev.experienceYears - 1) }))}
                  className="w-10 h-10 rounded-lg border border-slate-300 bg-white font-bold text-lg flex items-center justify-center hover:bg-slate-50"
                >
                  −
                </button>
                <div className="text-center">
                  <span className="text-2xl font-bold text-slate-900">{formData.experienceYears}</span>
                  <span className="text-xs text-slate-500 block">Years Experience</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, experienceYears: prev.experienceYears + 1 }))}
                  className="w-10 h-10 rounded-lg border border-slate-300 bg-white font-bold text-lg flex items-center justify-center hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Rate Stepper */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <label className="text-xs font-semibold text-slate-600">Target Hourly Rate (प्रति घंटा शुल्क)</label>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, hourlyRate: Math.max(200, prev.hourlyRate - 50) }))}
                  className="w-10 h-10 rounded-lg border border-slate-300 bg-white font-bold text-lg flex items-center justify-center hover:bg-slate-50"
                >
                  −
                </button>
                <div className="text-center">
                  <span className="text-2xl font-bold text-slate-900">₹{formData.hourlyRate}</span>
                  <span className="text-xs text-emerald-700 font-bold block">
                    Your 90% Take-Home: ₹{Math.round(formData.hourlyRate * 0.9)}/hr
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, hourlyRate: prev.hourlyRate + 50 }))}
                  className="w-10 h-10 rounded-lg border border-slate-300 bg-white font-bold text-lg flex items-center justify-center hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCREEN 5: VERIFICATION DOCUMENTS */}
      {/* -------------------------------------------------------------------- */}
      {step === 5 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Verification & Trade Credentials
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Provide your e-Shram UAN or upload photo identification.
              </p>
            </div>

            <button
              type="button"
              onClick={() => playVoicePrompt('अपना ई-श्रम यूएएन नंबर या पहचान पत्र अपलोड करें।')}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto border border-blue-200"
              title="Listen in Hindi"
            >
              <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>सुनें (Audio)</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">{t('uanLabel')}</label>
              <input
                type="text"
                value={formData.uanNumber}
                onChange={(e) => setFormData({ ...formData, uanNumber: e.target.value })}
                placeholder="1009-XXXX-XXXX"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <p className="text-[11px] text-slate-400">{t('uanHelp')}</p>
            </div>

            <div
              onClick={() => setFormData((prev) => ({ ...prev, documentUploaded: !prev.documentUploaded }))}
              className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                formData.documentUploaded
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-slate-50 border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <Camera className="w-5 h-5" />
              </div>
              <p className="font-semibold text-xs text-slate-800">
                {formData.documentUploaded ? `✓ ${t('docUploadedBadge')}` : t('uploadDocLabel')}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, PNG or PDF formats</p>
            </div>

            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Govt Verification Safeguard:</strong> In case of portal latency, your onboarding is immediately routed to your local Primary Cooperative Secretary for manual verification.
              </span>
            </div>

            {/* Color-Coded Iconographic Yes/No Acceptance (Accessibility Requirement) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 block">
                {t('societyChoiceLabel')}
              </label>
              <p className="text-[11px] text-slate-500">
                {t('coopPledge')}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setTermsAccepted(true)}
                  className={`h-12 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    termsAccepted
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-400/30'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>Accept (स्वीकार)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTermsAccepted(false)}
                  className={`h-12 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    !termsAccepted
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-400/30'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                  }`}
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                  <span>Decline (अस्वीकार)</span>
                </button>
              </div>
              {!termsAccepted && (
                <p className="text-[11px] text-rose-700 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  ⚠️ If declined, your registration requires in-person verification at the Primary Cooperative Society branch.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
        >
          <span>{step === totalSteps ? t('submitAppBtn') : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
