'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { 
  Phone, 
  User, 
  MapPin, 
  Check, 
  Mic, 
  MicOff, 
  Camera, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  Award,
  Navigation
} from 'lucide-react';

export default function WorkerRegistrationForm() {
  const { t } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Form State
  const [formData, setFormData] = useState({
    phone: '',
    otp: '4821',
    trade: 'Electrician',
    tradeIcon: '💡',
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

  // Available Trades with Big Visual Tap Buttons
  const trades = [
    { id: 'Electrician', label: 'Electrician (बिजली)', icon: '💡', desc: 'Wiring, switches, circuits' },
    { id: 'Plumber', label: 'Plumber (नल मिस्त्री)', icon: '🚰', desc: 'Pipes, leakage, taps' },
    { id: 'Cleaner', label: 'Cleaning (सफाई)', icon: '🧹', desc: 'Home sanitization, water tank' },
    { id: 'Appliance', label: 'AC & Appliance (एसी/फ्रिज)', icon: '❄️', desc: 'AC gas, washing machine' },
    { id: 'Carpenter', label: 'Carpenter (बढ़ई)', icon: '🪚', desc: 'Doors, furniture, locks' }
  ];

  // Voice Dictation Simulation for Names
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

  // Voice Dictation Simulation for City
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

  // One-Tap GPS Detection
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
      <div className="space-y-6 py-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 border-[3px] border-black flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          🎉
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            Registration Submitted!
          </h2>
          <p className="text-base font-bold text-slate-700">
            बधाई हो! आपकी सदस्यता अर्ज़ी स्वीकार कर ली गई है।
          </p>
        </div>

        {/* Status Card with Fallback Society Secretary Approval */}
        <div className="accessible-card p-5 text-left bg-amber-50 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-ping" />
            <span className="font-black text-sm uppercase tracking-wider text-amber-900">
              Under Primary Cooperative Secretary Review
            </span>
          </div>

          <div className="space-y-1.5 text-sm font-bold text-slate-800">
            <p><strong>Member Name:</strong> {formData.fullName || 'Member Worker'}</p>
            <p><strong>Trade:</strong> {formData.tradeIcon} {formData.trade}</p>
            <p><strong>UAN Number:</strong> {formData.uanNumber}</p>
            <p><strong>Cooperative:</strong> Mumbai Plumbers & Technical Workers Co-op</p>
          </div>

          <div className="p-3 bg-white border-2 border-black rounded-xl text-xs font-bold text-slate-700">
            🛡️ <strong>Zero Disruption Guarantee:</strong> Even if government e-Shram servers are slow, your local Primary Cooperative Secretary will verify your credentials within 24 hours.
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/services"
            className="min-h-[52px] w-full rounded-2xl bg-black text-white font-black text-lg border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
          >
            Go to Home Screen
          </Link>
          <Link
            href="/dashboard"
            className="min-h-[52px] w-full rounded-2xl bg-white text-black font-black text-base border-2 border-black flex items-center justify-center hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Open Cooperative Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto py-2">
      {/* -------------------------------------------------------------------- */}
      {/* PROGRESS PILLS & STEP INDICATOR */}
      {/* -------------------------------------------------------------------- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-black">
          <span>Question {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
        </div>

        {/* Visual Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full border border-black transition-all ${
                i <= step ? 'bg-black' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* SCREEN 1: PHONE NUMBER (Large Dial Font + OTP Mock) */}
      {/* -------------------------------------------------------------------- */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-4xl">📱</span>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              What is your mobile number?
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-700">
              अपना मोबाइल नंबर दर्ज करें (OTP भेजा जाएगा)
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-white border-[3px] border-black rounded-2xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-black text-lg px-2 border-r-2 border-black">🇮🇳 +91</span>
              <input
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                placeholder="98200 12345"
                className="w-full py-2.5 px-2 text-2xl font-black text-black tracking-wider outline-none bg-transparent placeholder:text-slate-400"
                autoFocus
              />
            </div>
            <p className="text-xs font-bold text-slate-600">
              💡 No password needed. We verify you through SMS OTP.
            </p>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCREEN 2: SELECT SKILL (Large Tap-to-Select Cards, Zero Dropdowns) */}
      {/* -------------------------------------------------------------------- */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-4xl">🛠️</span>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              What is your main skill?
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-700">
              अपना हुनर चुनें (एक कार्ड पर टैप करें)
            </p>
          </div>

          <div className="space-y-2.5">
            {trades.map((tItem) => {
              const isSelected = formData.trade === tItem.id;
              return (
                <button
                  key={tItem.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, trade: tItem.id, tradeIcon: tItem.icon })}
                  className={`w-full min-h-[64px] p-3.5 rounded-2xl border-[3px] border-black text-left flex items-center justify-between transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'bg-amber-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black'
                      : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{tItem.icon}</span>
                    <div>
                      <p className="text-lg text-black font-black leading-tight">{tItem.label}</p>
                      <p className="text-xs text-slate-700">{tItem.desc}</p>
                    </div>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full border-2 border-black flex items-center justify-center ${
                      isSelected ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCREEN 3: NAME & LOCATION (Voice Dictation Mic & One-Tap GPS) */}
      {/* -------------------------------------------------------------------- */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-4xl">🗣️</span>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              What is your name & city?
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-700">
              अपना नाम बोलें या लिखें (माइक दबाकर बोल सकते हैं)
            </p>
          </div>

          <div className="space-y-4">
            {/* Full Name with Mic */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Full Name / पूरा नाम
              </label>
              <div className="flex items-center gap-2 bg-white border-2 border-black rounded-2xl p-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <User className="w-6 h-6 ml-2 text-black" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rameshwar Chavan"
                  className="flex-1 py-2.5 px-2 text-lg font-bold text-black outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={handleVoiceName}
                  className={`min-h-[48px] min-w-[48px] rounded-xl border-2 border-black flex items-center justify-center font-black ${
                    isListeningName
                      ? 'bg-red-600 text-white animate-voice-pulse'
                      : 'bg-amber-400 hover:bg-amber-500 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                  aria-label="Tap to speak name"
                >
                  {isListeningName ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 stroke-[2.5]" />}
                </button>
              </div>
              {isListeningName && (
                <p className="text-xs font-black text-red-600 animate-pulse">
                  🎙️ Listening... Speak your name clearly (बोलें...)
                </p>
              )}
            </div>

            {/* City / Area with GPS Button & Mic */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                City / Area / इलाका
              </label>
              <div className="flex items-center gap-2 bg-white border-2 border-black rounded-2xl p-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <MapPin className="w-6 h-6 ml-2 text-black" />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Dadar, Mumbai"
                  className="flex-1 py-2.5 px-2 text-lg font-bold text-black outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={handleVoiceCity}
                  className={`min-h-[48px] min-w-[48px] rounded-xl border-2 border-black flex items-center justify-center font-black ${
                    isListeningCity
                      ? 'bg-red-600 text-white animate-voice-pulse'
                      : 'bg-amber-400 hover:bg-amber-500 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                  aria-label="Tap to speak city"
                >
                  {isListeningCity ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 stroke-[2.5]" />}
                </button>
              </div>

              {/* One-Tap GPS Detection Button */}
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="w-full min-h-[48px] py-2 px-3 rounded-xl border-2 border-black bg-slate-100 hover:bg-slate-200 font-black text-sm flex items-center justify-center gap-2 active:translate-y-[1px]"
              >
                <Navigation className={`w-4 h-4 text-blue-600 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'Detecting GPS...' : '📍 Use My Current Location (GPS से पता पाएं)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCREEN 4: EXPERIENCE & DAILY HOURLY RATE (Large + / - Stepper) */}
      {/* -------------------------------------------------------------------- */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-4xl">💰</span>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Experience & Hourly Rate
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-700">
              अपना अनुभव और प्रति घंटा मेहनताना तय करें
            </p>
          </div>

          {/* Stepper 1: Years of Experience */}
          <div className="accessible-card p-4 space-y-2 bg-white">
            <label className="text-xs font-black uppercase text-slate-600">Years of Experience / अनुभव</label>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, experienceYears: Math.max(1, prev.experienceYears - 1) }))}
                className="w-14 h-14 rounded-2xl border-2 border-black bg-slate-100 font-black text-2xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
              >
                −
              </button>
              <div className="text-center">
                <span className="text-3xl font-black text-black">{formData.experienceYears}</span>
                <span className="text-sm font-bold text-slate-700 block">Years</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, experienceYears: prev.experienceYears + 1 }))}
                className="w-14 h-14 rounded-2xl border-2 border-black bg-amber-400 font-black text-2xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
              >
                +
              </button>
            </div>
          </div>

          {/* Stepper 2: Hourly Rate */}
          <div className="accessible-card p-4 space-y-2 bg-white">
            <label className="text-xs font-black uppercase text-slate-600">Desired Rate / प्रति घंटा दर</label>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, hourlyRate: Math.max(200, prev.hourlyRate - 50) }))}
                className="w-14 h-14 rounded-2xl border-2 border-black bg-slate-100 font-black text-2xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
              >
                −
              </button>
              <div className="text-center">
                <span className="text-3xl font-black text-black">₹{formData.hourlyRate}</span>
                <span className="text-sm font-bold text-emerald-700 block font-black">
                  You get 90% (₹{Math.round(formData.hourlyRate * 0.9)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, hourlyRate: prev.hourlyRate + 50 }))}
                className="w-14 h-14 rounded-2xl border-2 border-black bg-emerald-400 font-black text-2xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCREEN 5: CAMERA / DOCUMENT VERIFICATION */}
      {/* -------------------------------------------------------------------- */}
      {step === 5 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-4xl">📸</span>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Aadhaar & e-Shram Card
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-700">
              पहचान पत्र की फोटो लें या UAN नंबर लिखें
            </p>
          </div>

          <div className="space-y-4">
            {/* e-Shram UAN Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                e-Shram UAN Number / ई-श्रम नंबर
              </label>
              <input
                type="text"
                value={formData.uanNumber}
                onChange={(e) => setFormData({ ...formData, uanNumber: e.target.value })}
                placeholder="1009-XXXX-XXXX"
                className="w-full py-3 px-3 text-xl font-black text-black border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white"
              />
            </div>

            {/* Camera Photo Upload Button */}
            <div
              onClick={() => setFormData((prev) => ({ ...prev, documentUploaded: !prev.documentUploaded }))}
              className={`p-6 border-[3px] border-dashed border-black rounded-2xl text-center cursor-pointer transition-all ${
                formData.documentUploaded ? 'bg-emerald-50' : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-300 border-2 border-black flex items-center justify-center text-black mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Camera className="w-8 h-8" />
              </div>
              <p className="font-black text-base text-black">
                {formData.documentUploaded ? '✓ Photo Uploaded Successfully' : 'Tap to Take Photo of Card'}
              </p>
              <p className="text-xs font-bold text-slate-600 mt-1">
                कैमरे से आधार या ई-श्रम कार्ड की साफ फोटो लें
              </p>
            </div>

            {/* Cooperative Offline Review Guarantee */}
            <div className="p-3 bg-yellow-50 border-2 border-black rounded-xl text-xs font-bold text-black flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Govt Server Fallback:</strong> If the e-Shram database is offline, your application is directly routed to your local Cooperative Secretary for manual approval.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* NAVIGATION CONTROLS (At least 52px tall, minimum 48x48px touch targets) */}
      {/* -------------------------------------------------------------------- */}
      <div className="pt-4 flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 min-h-[54px] rounded-2xl border-[2.5px] border-black bg-white hover:bg-slate-100 font-black text-base text-black flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span>Back</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 min-h-[54px] rounded-2xl border-[2.5px] border-black bg-black text-white hover:bg-slate-800 font-black text-base flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
        >
          <span>{step === totalSteps ? 'Submit Membership (जमा करें)' : 'Next (आगे बढ़ें)'}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
