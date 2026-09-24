'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCoopData } from '@/context/CoopDataContext';
import { calculateEmergencySplit } from '@/lib/splitUtils';
import { 
  Zap, 
  Droplets, 
  Flame, 
  Key, 
  Wind, 
  Hammer, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Radio, 
  Clock, 
  Mic, 
  MicOff, 
  Check, 
  Sparkles, 
  UserCheck, 
  RotateCcw,
  Navigation
} from 'lucide-react';
import { WorkerProfile, BookingItem } from '@/data/mockData';

// ----------------------------------------------------------------------------
// CRITICAL EMERGENCY PRESETS
// ----------------------------------------------------------------------------
interface EmergencyPreset {
  id: string;
  category: string;
  trade: string;
  titleKey: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  baseRate: number;
  surgeAmount: number;
  colorClass: string;
  badgeBg: string;
  typicalETA: string;
}

const EMERGENCY_PRESETS: EmergencyPreset[] = [
  {
    id: 'emg-elec-1',
    category: 'electrical',
    trade: 'Master Electrician',
    titleKey: 'electrical',
    title: 'Electrical Spark / Power Outage',
    description: 'Switchboard sparking, main breaker tripped, smoking meter box, or burning wire odor.',
    icon: Zap,
    baseRate: 450,
    surgeAmount: 250,
    colorClass: 'text-amber-600 border-amber-300 bg-amber-50/60 hover:bg-amber-50',
    badgeBg: 'bg-amber-100 text-amber-800',
    typicalETA: '8–12 mins'
  },
  {
    id: 'emg-plumb-2',
    category: 'plumbing',
    trade: 'Licensed Plumber',
    titleKey: 'plumbing',
    title: 'Burst Pipe / Severe Flooding',
    description: 'High-pressure pipe burst, main line fracture, non-stop tank overflow, or severe water damage.',
    icon: Droplets,
    baseRate: 450,
    surgeAmount: 250,
    colorClass: 'text-blue-600 border-blue-300 bg-blue-50/60 hover:bg-blue-50',
    badgeBg: 'bg-blue-100 text-blue-800',
    typicalETA: '10–14 mins'
  },
  {
    id: 'emg-gas-3',
    category: 'gas',
    trade: 'Gas Safety Specialist',
    titleKey: 'appliance',
    title: 'LPG Gas Leak / Kitchen Danger',
    description: 'Gas cylinder odor, leaking brass regulator, pipeline hissing, or stove flame backfire.',
    icon: Flame,
    baseRate: 500,
    surgeAmount: 250,
    colorClass: 'text-rose-600 border-rose-300 bg-rose-50/60 hover:bg-rose-50',
    badgeBg: 'bg-rose-100 text-rose-800',
    typicalETA: '6–10 mins'
  },
  {
    id: 'emg-lock-4',
    category: 'carpentry',
    trade: 'Master Locksmith',
    titleKey: 'carpentry',
    title: 'Lockout / Broken Key in Latch',
    description: 'Child/elderly locked inside room, key broken off in main cylinder, or deadbolt jammed.',
    icon: Key,
    baseRate: 400,
    surgeAmount: 250,
    colorClass: 'text-emerald-700 border-emerald-300 bg-emerald-50/60 hover:bg-emerald-50',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    typicalETA: '10–15 mins'
  },
  {
    id: 'emg-ac-5',
    category: 'appliance-repair',
    trade: 'HVAC Technician',
    titleKey: 'appliance',
    title: 'AC Smoke / Liquid on Mains',
    description: 'Split AC smoking or dripping water directly onto power sockets/stabilizer.',
    icon: Wind,
    baseRate: 550,
    surgeAmount: 250,
    colorClass: 'text-cyan-700 border-cyan-300 bg-cyan-50/60 hover:bg-cyan-50',
    badgeBg: 'bg-cyan-100 text-cyan-800',
    typicalETA: '12–16 mins'
  },
  {
    id: 'emg-struct-6',
    category: 'carpentry',
    trade: 'Civil & Masonry Specialist',
    titleKey: 'carpentry',
    title: 'Ceiling Fall / Structural Hazard',
    description: 'Heavy ceiling plaster cracked and falling, broken railing, or door frame collapsed.',
    icon: Hammer,
    baseRate: 500,
    surgeAmount: 250,
    colorClass: 'text-orange-700 border-orange-300 bg-orange-50/60 hover:bg-orange-50',
    badgeBg: 'bg-orange-100 text-orange-800',
    typicalETA: '15–20 mins'
  }
];

type FlowStep = 'PROBLEM' | 'LOGIN' | 'LOCATION' | 'CONFIRM' | 'TRACKING';

export default function EmergencyPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, isAuthenticated, loginWithPhoneOtp } = useAuth();
  const { workers, createOrder } = useCoopData();

  // Navigation / Workflow State
  const [currentStep, setCurrentStep] = useState<FlowStep>('PROBLEM');

  // Step 1: Problem Selection & Urgency
  const [selectedPreset, setSelectedPreset] = useState<EmergencyPreset>(EMERGENCY_PRESETS[0]);
  const [customDescription, setCustomDescription] = useState<string>('');
  const [urgencyLevel, setUrgencyLevel] = useState<'CRITICAL' | 'HIGH'>('CRITICAL');
  const [isListening, setIsListening] = useState<boolean>(false);
  const speechRecognitionRef = useRef<any>(null);

  // Step 2: Mobile Number Login / Verification
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phone || '9820144552');
  const [customerName, setCustomerName] = useState<string>(user?.name || 'Priya Sharma');
  const [otpCode, setOtpCode] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);

  // Step 3: Location (GPS & Geocoding)
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    landmark: string;
    isGpsActive: boolean;
  }>({
    lat: 12.9716,
    lng: 77.5946,
    address: 'Indiranagar 100ft Road, Stage 1',
    landmark: 'Opposite Metro Pillar 128',
    isGpsActive: false
  });
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);

  // Step 4 & 5: Dispatch & Tracking State
  const [isSubmittingDispatch, setIsSubmittingDispatch] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingItem | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<'BROADCASTING' | 'ACCEPTED' | 'EN_ROUTE'>('BROADCASTING');
  const [assignedWorker, setAssignedWorker] = useState<WorkerProfile | null>(null);
  const [countdownMinutes, setCountdownMinutes] = useState<number>(8);

  // Auto-fill user contact when authenticated
  useEffect(() => {
    if (user?.phone) {
      setPhoneNumber(user.phone.replace(/\D/g, '').slice(-10));
    }
    if (user?.name) {
      setCustomerName(user.name);
    }
  }, [user]);

  // Voice speech-to-text initialization
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your current browser.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    speechRecognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;

    // Language mapping
    if (language === 'hi') recognition.lang = 'hi-IN';
    else if (language === 'kn') recognition.lang = 'kn-IN';
    else if (language === 'ta') recognition.lang = 'ta-IN';
    else recognition.lang = 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCustomDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  // Request live browser GPS
  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation((prev) => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: `GPS: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E (Indiranagar / Bengaluru East)`,
          isGpsActive: true
        }));
        setIsDetectingGps(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setIsDetectingGps(false);
        setUserLocation((prev) => ({ ...prev, isGpsActive: false }));
        alert('Could not access live GPS. Reverting to Indiranagar Co-op Geofence (12.9716, 77.5946).');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Step 2 Login Verification
  const handleSendOtp = () => {
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpError(null);
    setIsOtpSent(true);
    setOtpCode('123456'); // Pre-fill instant test OTP for high-urgency zero friction
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    setOtpError(null);

    const clean = phoneNumber.replace(/\D/g, '');
    const code = otpCode.trim() || '123456';

    const res = await loginWithPhoneOtp(clean, code, 'CUSTOMER', {
      name: customerName
    });

    setIsVerifyingOtp(false);
    if (res.success) {
      setCurrentStep('LOCATION');
    } else {
      setOtpError(res.error || 'Invalid OTP code.');
    }
  };

  // Find optimal nearby certified worker
  const recommendedWorker = useMemo(() => {
    const match = workers.find(
      (w) =>
        w.isAvailable &&
        (w.trade.toLowerCase().includes(selectedPreset.category.toLowerCase()) ||
          selectedPreset.trade.toLowerCase().includes(w.trade.toLowerCase()))
    );
    return match || workers[0];
  }, [workers, selectedPreset]);

  // Financial Split calculation (100% surge pass-through to worker)
  const pricing = useMemo(() => {
    const base = selectedPreset.baseRate;
    const surge = selectedPreset.surgeAmount;
    const split = calculateEmergencySplit(base, surge);
    return {
      base,
      surge,
      total: base + surge,
      split
    };
  }, [selectedPreset]);

  // Step 4: Confirm Order & Broadcast
  const handleConfirmEmergencyDispatch = async () => {
    setIsSubmittingDispatch(true);

    const fullIssueDesc = customDescription
      ? `EMERGENCY SOS: ${selectedPreset.title} — ${customDescription} (Urgency: ${urgencyLevel})`
      : `EMERGENCY SOS: ${selectedPreset.title} — ${selectedPreset.description}`;

    const bookingPayload = {
      customerId: user?.id || `usr-cust-${phoneNumber.slice(-6)}`,
      customerName: user?.name || customerName,
      customerPhone: user?.phone || `+91 ${phoneNumber.slice(-10)}`,
      workerId: recommendedWorker.id,
      bookingType: 'INSTANT',
      isEmergency: true,
      serviceCategoryId: selectedPreset.category,
      baseAmount: pricing.base,
      surgeAmount: pricing.surge,
      serviceLatitude: userLocation.lat,
      serviceLongitude: userLocation.lng,
      serviceAddressLine1: `${userLocation.address}${userLocation.landmark ? ` (${userLocation.landmark})` : ''}`,
      serviceCity: 'Bengaluru',
      servicePostalCode: '560038',
      issueDescription: fullIssueDesc
    };

    // 1. Post to API /api/bookings
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
    } catch (err) {
      console.warn('Booking API call failed, continuing with client state:', err);
    }

    // 2. Create in CoopDataContext for cross-role visibility
    const createdOrder = createOrder({
      workerId: recommendedWorker.id,
      workerName: recommendedWorker.name,
      workerTrade: recommendedWorker.trade,
      cooperativeName: recommendedWorker.cooperativeName,
      customerName: customerName,
      customerAddress: `${userLocation.address}, ${userLocation.landmark}`,
      totalAmount: pricing.total,
      issueDescription: fullIssueDesc,
      isEmergency: true,
      serviceCategory: selectedPreset.category
    });

    // 3. Broadcast to workers (Web event & LocalStorage)
    try {
      if (typeof window !== 'undefined') {
        const eventDetail = {
          bookingId: createdOrder.id,
          trade: recommendedWorker.trade,
          customerName,
          customerPhone: phoneNumber,
          location: userLocation.address,
          coordinates: { lat: userLocation.lat, lng: userLocation.lng },
          payout: pricing.split.workerPayout,
          dispatchedAt: new Date().toISOString()
        };
        localStorage.setItem('syncbridge_last_emergency_dispatch', JSON.stringify(eventDetail));
        window.dispatchEvent(new CustomEvent('syncbridge_emergency_dispatch', { detail: eventDetail }));
      }
    } catch (e) {
      console.warn('Notification broadcast error:', e);
    }

    setConfirmedBooking(createdOrder);
    setAssignedWorker(recommendedWorker);
    setIsSubmittingDispatch(false);
    setCurrentStep('TRACKING');

    // Simulate artisan acceptance on live radar after 2.8s
    setTimeout(() => {
      setDispatchStatus('ACCEPTED');
    }, 2800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* -------------------------------------------------------------------- */}
      {/* TOP EMERGENCY BANNER & STATUS */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-rose-500 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
              <Zap className="w-6 h-6 text-white fill-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-white text-rose-700">
                  Priority SOS
                </span>
                <span className="text-xs text-rose-100 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Live Geofenced Dispatch Active
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                Emergency Trade Response
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 w-fit">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>100% Emergency Surge Passes to Artisan</span>
          </div>
        </div>

        {/* 5-Step Logic Flow Stepper */}
        <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs font-bold">
          <div className={`py-1.5 px-1 rounded-lg transition-all ${currentStep === 'PROBLEM' ? 'bg-white text-rose-700 shadow-xs' : 'text-rose-100/80 bg-white/10'}`}>
            1. Problem
          </div>
          <div className={`py-1.5 px-1 rounded-lg transition-all ${currentStep === 'LOGIN' ? 'bg-white text-rose-700 shadow-xs' : 'text-rose-100/80 bg-white/10'}`}>
            2. Mobile Login
          </div>
          <div className={`py-1.5 px-1 rounded-lg transition-all ${currentStep === 'LOCATION' ? 'bg-white text-rose-700 shadow-xs' : 'text-rose-100/80 bg-white/10'}`}>
            3. Location
          </div>
          <div className={`py-1.5 px-1 rounded-lg transition-all ${currentStep === 'CONFIRM' ? 'bg-white text-rose-700 shadow-xs' : 'text-rose-100/80 bg-white/10'}`}>
            4. Confirm
          </div>
          <div className={`py-1.5 px-1 rounded-lg transition-all ${currentStep === 'TRACKING' ? 'bg-white text-rose-700 shadow-xs' : 'text-rose-100/80 bg-white/10'}`}>
            5. Live Radar
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* STEP 1: EMERGENCY SEARCH & SELECT PROBLEM */}
      {/* -------------------------------------------------------------------- */}
      {currentStep === 'PROBLEM' && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Step 1: Select Your Emergency Issue
              </h2>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Avg Response: &lt; 15 mins
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Tap the urgent hazard or speak/type below to immediately alert the nearest certified artisan.
            </p>
          </div>

          {/* Quick Problem Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {EMERGENCY_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/50 shadow-md ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`p-2.5 rounded-xl border ${preset.colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-rose-600 text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {preset.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <span>{preset.trade}</span>
                    <span className="text-rose-600 font-bold">~{preset.typicalETA}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Voice Input & Custom Emergency Description */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Specific Situation Notes or Voice Audio:</span>
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isListening ? 'Listening (Speak now)...' : 'Tap to Speak'}</span>
              </button>
            </label>

            <textarea
              rows={2}
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="e.g. Living room switchboard sparking with sparks hitting carpet. Need technician immediately."
              className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all resize-none"
            />
          </div>

          {/* Urgency Selector */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-bold text-slate-700">Urgency Level:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUrgencyLevel('CRITICAL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  urgencyLevel === 'CRITICAL'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🚨 Critical (&lt; 15 mins)
              </button>
              <button
                type="button"
                onClick={() => setUrgencyLevel('HIGH')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  urgencyLevel === 'HIGH'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ⚡ Urgent (&lt; 45 mins)
              </button>
            </div>
          </div>

          {/* Action to proceed to Login */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/services"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Back to Regular Catalog
            </Link>

            <button
              type="button"
              onClick={() => setCurrentStep('LOGIN')}
              className="min-h-[48px] px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all active:scale-95"
            >
              <span>Continue to Mobile Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* STEP 2: MOBILE NUMBER LOGIN */}
      {/* -------------------------------------------------------------------- */}
      {currentStep === 'LOGIN' && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Step 2: Emergency Contact &amp; Mobile Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                The dispatched artisan will call this number immediately while en route.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep('PROBLEM')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          {/* If already authenticated */}
          {isAuthenticated && user?.phone ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                    <p className="text-xs text-emerald-800 font-mono font-semibold">{user.phone}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  Verified Contact
                </span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('LOCATION')}
                  className="min-h-[44px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                >
                  <span>Use This Contact &amp; Proceed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPhoneNumber('')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                >
                  Use a different number
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-md space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Your Full Name:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">10-Digit Mobile Number:</label>
                <div className="flex gap-2">
                  <span className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold flex items-center">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98201 44552"
                    className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-slate-300 font-mono font-semibold focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold whitespace-nowrap transition-colors"
                  >
                    {isOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {isOtpSent && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Enter 6-Digit SMS OTP:</span>
                    <button
                      type="button"
                      onClick={() => setOtpCode('123456')}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline"
                    >
                      Instant Demo OTP: 123456
                    </button>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center text-lg tracking-widest font-mono font-black p-2.5 rounded-xl border border-slate-300 bg-white"
                  />

                  {otpError && (
                    <p className="text-xs text-rose-600 font-semibold">{otpError}</p>
                  )}

                  <button
                    type="button"
                    disabled={isVerifyingOtp}
                    onClick={handleVerifyOtp}
                    className="w-full min-h-[44px] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
                  >
                    {isVerifyingOtp ? (
                      <span>Verifying Mobile Security...</span>
                    ) : (
                      <>
                        <span>Verify &amp; Proceed to Location</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* STEP 3: LOCATION (GPS & ADDRESS) */}
      {/* -------------------------------------------------------------------- */}
      {currentStep === 'LOCATION' && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Step 3: Service Address &amp; GPS Coordinates
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Exact geolocation ensures the dispatched artisan reaches your doorstep in minutes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep('LOGIN')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          {/* GPS Auto-Detect Button */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Navigation className={`w-5 h-5 ${isDetectingGps ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">
                  {userLocation.isGpsActive ? 'Live GPS Locked' : 'Auto-Detect via Device GPS'}
                </p>
                <p className="text-[11px] text-blue-700 font-mono">
                  {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isDetectingGps}
              onClick={handleRequestGps}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isDetectingGps ? 'Locating...' : 'Detect My GPS'}</span>
            </button>
          </div>

          {/* Address Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Street / Area Address:</label>
              <input
                type="text"
                value={userLocation.address}
                onChange={(e) => setUserLocation({ ...userLocation, address: e.target.value })}
                placeholder="e.g. 100ft Road, Stage 1, Indiranagar"
                className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Building / Flat / Landmark (Crucial for Speed):</label>
              <input
                type="text"
                value={userLocation.landmark}
                onChange={(e) => setUserLocation({ ...userLocation, landmark: e.target.value })}
                placeholder="e.g. Flat 304, Sai Heritage Apt, Opposite Pillar 128"
                className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>
          </div>

          {/* Geofence Proximity Indicator */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified 5 km Dispatch Perimeter: 12 Active Artisans on duty</span>
            </div>
            <span className="font-bold text-emerald-800">Bengaluru Co-op Hub</span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep('CONFIRM')}
              className="min-h-[48px] px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all active:scale-95"
            >
              <span>Review &amp; Confirm Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* STEP 4: CONFIRM ORDER & DISPATCH */}
      {/* -------------------------------------------------------------------- */}
      {currentStep === 'CONFIRM' && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Step 4: Confirm Emergency Callout
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Review verified dispatch specifications before broadcasting to nearby workers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep('LOCATION')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          {/* Dispatch Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Incident &amp; Trade Assignment
              </span>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                <span>{selectedPreset.title}</span>
              </div>
              <p className="text-slate-600">{selectedPreset.trade} • {urgencyLevel} Priority</p>
              {customDescription && (
                <p className="text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200 mt-1">
                  &quot;{customDescription}&quot;
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Target Address &amp; Contact
              </span>
              <p className="font-bold text-slate-900">{userLocation.address}</p>
              <p className="text-slate-600">{userLocation.landmark || 'Indiranagar 100ft Rd'}</p>
              <p className="text-slate-800 font-mono font-semibold pt-1">
                📞 {customerName} (+91 {phoneNumber.slice(-10)})
              </p>
            </div>
          </div>

          {/* Transparent Cooperative Pricing (100% surge to worker) */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Transparent Emergency Tariff
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                100% Surge to Artisan
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Standard Base Callout (1 Hour):</span>
                <span className="font-mono">₹{pricing.base}</span>
              </div>
              <div className="flex items-center justify-between text-rose-300 font-semibold">
                <span>Emergency Surge Premium (100% to Worker):</span>
                <span className="font-mono">+₹{pricing.surge}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-base font-bold text-white">
                <span>Total Amount Payable upon arrival:</span>
                <span className="text-emerald-400 font-mono text-lg">₹{pricing.total}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cooperative Guarantee: You will not be charged now. Payment is verified digitally via UPI or Cash directly to the artisan upon safe completion.
            </p>
          </div>

          {/* Primary SOS Confirm Action */}
          <button
            type="button"
            disabled={isSubmittingDispatch}
            onClick={handleConfirmEmergencyDispatch}
            className="w-full min-h-[54px] rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-lg shadow-rose-600/30 transition-all active:scale-98 disabled:opacity-60"
          >
            {isSubmittingDispatch ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Broadcasting to Geofenced Network...</span>
              </div>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-white animate-pulse" />
                <span>CONFIRM &amp; DISPATCH EMERGENCY ARTISAN</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </section>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* STEP 5: LIVE RADAR & NOTIFICATION TRACKING */}
      {/* -------------------------------------------------------------------- */}
      {currentStep === 'TRACKING' && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-3">
            {/* Pulsing Radar Visual */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping duration-1000" />
              <span className="absolute inset-2 rounded-full bg-rose-500/30 animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 relative z-10">
                <Radio className="w-8 h-8 animate-spin duration-3000" />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
                {dispatchStatus === 'BROADCASTING' ? 'Broadcasting SOS Signal' : 'Artisan En Route'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {dispatchStatus === 'BROADCASTING'
                  ? 'Alerting Nearby Certified Artisans...'
                  : 'Dispatch Accepted & Locked!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                {dispatchStatus === 'BROADCASTING'
                  ? 'Broadcasting to 8 active cooperative members within your 5 km perimeter.'
                  : 'Your artisan has accepted your SOS callout and is traveling towards your location.'}
              </p>
            </div>
          </div>

          {/* Assigned Worker Card */}
          {assignedWorker && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                    {assignedWorker.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{assignedWorker.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        NCCT Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {assignedWorker.trade} • {assignedWorker.cooperativeName}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      ⭐ {assignedWorker.rating} rating ({assignedWorker.completedJobs}+ safe callouts)
                    </p>
                  </div>
                </div>

                {/* Direct Calling & Action */}
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${assignedWorker.phone}`}
                    className="min-h-[44px] px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Artisan Direct</span>
                  </a>
                </div>
              </div>

              {/* Countdown & Live ETA */}
              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Arrival</span>
                  <p className="text-lg font-extrabold text-rose-600">~{countdownMinutes} Minutes</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Dispatch Radius</span>
                  <p className="text-lg font-extrabold text-slate-900">{assignedWorker.distanceKm || 1.4} km away</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <Link
              href="/bookings"
              className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
            >
              Track in Order History
            </Link>

            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to dismiss this emergency callout?')) {
                  setCurrentStep('PROBLEM');
                }
              }}
              className="text-slate-500 hover:text-rose-600 font-semibold"
            >
              Cancel Emergency Request
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
