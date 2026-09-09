'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCoopData } from '../context/CoopDataContext';
import { calculateCoopSplit } from '@/lib/splitUtils';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  Droplets, 
  Zap, 
  Sparkles, 
  Wind, 
  Hammer, 
  CheckCircle2 
} from 'lucide-react';
import { BookingItem, WorkerProfile } from '@/data/mockData';

// ----------------------------------------------------------------------------
// PROFESSIONAL CATEGORY METADATA & REFINED ICONS
// ----------------------------------------------------------------------------
const professionalCategories = [
  {
    id: 'plumbing',
    translationKey: 'plumbing',
    descKey: 'plumbingDesc',
    icon: Droplets,
    colorClass: 'text-blue-600 bg-blue-50 border-blue-200 group-hover:bg-blue-600 group-hover:text-white',
    tileGradient: 'from-blue-500 to-indigo-600',
    startingRate: '₹450/hr',
    activeWorkers: 12,
    isEmergencyEligible: true
  },
  {
    id: 'electrical',
    translationKey: 'electrical',
    descKey: 'electricalDesc',
    icon: Zap,
    colorClass: 'text-amber-600 bg-amber-50 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
    tileGradient: 'from-amber-500 to-orange-600',
    startingRate: '₹500/hr',
    activeWorkers: 18,
    isEmergencyEligible: true
  },
  {
    id: 'cleaning',
    translationKey: 'cleaning',
    descKey: 'cleaningDesc',
    icon: Sparkles,
    colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
    tileGradient: 'from-emerald-500 to-teal-600',
    startingRate: '₹420/hr',
    activeWorkers: 15,
    isEmergencyEligible: false
  },
  {
    id: 'appliance-repair',
    translationKey: 'appliance',
    descKey: 'applianceDesc',
    icon: Wind,
    colorClass: 'text-cyan-600 bg-cyan-50 border-cyan-200 group-hover:bg-cyan-600 group-hover:text-white',
    tileGradient: 'from-cyan-500 to-blue-600',
    startingRate: '₹550/hr',
    activeWorkers: 9,
    isEmergencyEligible: true
  },
  {
    id: 'carpentry',
    translationKey: 'carpentry',
    descKey: 'carpentryDesc',
    icon: Hammer,
    colorClass: 'text-orange-700 bg-orange-50 border-orange-200 group-hover:bg-orange-700 group-hover:text-white',
    tileGradient: 'from-amber-700 to-yellow-800',
    startingRate: '₹520/hr',
    activeWorkers: 11,
    isEmergencyEligible: false
  }
];

export default function ServiceDiscovery() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { workers, createOrder } = useCoopData();
  const searchParams = useSearchParams();

  const urlCategory = searchParams?.get('category');
  const urlQuery = searchParams?.get('q');
  const isEmergency = searchParams?.get('emergency') === 'true';
  const isAiDirected = searchParams?.get('ai') === 'true';
  const aiProblem = searchParams?.get('desc') || searchParams?.get('problem') || '';

  const [customCategory, setCustomCategory] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState<string | null>(null);
  const [bookingWorker, setBookingWorker] = useState<WorkerProfile | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<BookingItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Geolocation State (Default: Central Bengaluru / Indiranagar)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string; isGpsActive: boolean }>({
    lat: 12.9716,
    lng: 77.5946,
    label: 'Indiranagar / Bengaluru (Default)',
    isGpsActive: false
  });
  const [isLocating, setIsLocating] = useState(false);
  const [apiWorkers, setApiWorkers] = useState<WorkerProfile[] | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const selectedCategory = customCategory ?? (urlCategory || 'all');
  const searchQuery = customQuery ?? (urlQuery || '');

  const setSelectedCategory = (cat: string) => setCustomCategory(cat);
  const setSearchQuery = (q: string) => setCustomQuery(q);

  // Trigger browser Geolocation
  const requestLiveGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: `GPS: ${pos.coords.latitude.toFixed(3)}°N, ${pos.coords.longitude.toFixed(3)}°E`,
          isGpsActive: true
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setIsLocating(false);
        alert('Could not access live location. Continuing with Bengaluru geofence.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Fetch real workers from GIS endpoint /api/workers/nearby
  React.useEffect(() => {
    let isMounted = true;
    async function fetchNearby() {
      setIsLoadingApi(true);
      try {
        const catParam = selectedCategory !== 'all' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
        const res = await fetch(`/api/workers/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}${catParam}&radiusKm=15`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
            const mapped: WorkerProfile[] = json.data.map((w: any) => ({
              id: w.id,
              name: w.name,
              trade: w.trade,
              cooperativeName: w.cooperativeName,
              eShramUan: w.eShramUan || 'UAN-8821-XXXX-9912',
              hourlyRate: w.hourlyRate || 400,
              rating: w.rating || 4.8,
              completedJobs: w.completedJobs || 120,
              distanceKm: w.distanceKm ?? 1.5,
              locationName: w.distanceLabel || `${w.distanceKm ?? 1.5} km away`,
              phone: w.phone || '+91 98765 43210',
              isAvailable: w.isAvailable ?? true
            }));
            setApiWorkers(mapped);
          }
        }
      } catch (err) {
        console.warn('Error fetching nearby workers, using local store:', err);
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    }
    fetchNearby();
    return () => { isMounted = false; };
  }, [userLocation.lat, userLocation.lng, selectedCategory]);

  // Merge apiWorkers (if available) with workers from CoopDataContext
  const activeWorkerPool = apiWorkers && apiWorkers.length > 0 ? apiWorkers : workers;

  // Filter & Prioritize Workers dynamically
  const filteredWorkers = useMemo(() => {
    const list = activeWorkerPool.filter((worker) => {
      const matchesCat =
        selectedCategory === 'all' ||
        worker.trade.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'plumbing' && worker.trade.includes('Plumber')) ||
        (selectedCategory === 'electrical' && worker.trade.includes('Electrician')) ||
        (selectedCategory === 'cleaning' && worker.trade.includes('Cleaner')) ||
        (selectedCategory === 'appliance-repair' && worker.trade.includes('Appliance')) ||
        (selectedCategory === 'carpentry' && worker.trade.includes('Carpenter'));

      const matchesSearch =
        !searchQuery ||
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (worker.locationName || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });

    // In Emergency mode: prioritize available workers first, then sort by proximity (distanceKm ascending)
    if (isEmergency) {
      return [...list].sort((a, b) => {
        if (a.isAvailable && !b.isAvailable) return -1;
        if (!a.isAvailable && b.isAvailable) return 1;
        return (a.distanceKm || 5) - (b.distanceKm || 5);
      });
    }

    return list;
  }, [activeWorkerPool, selectedCategory, searchQuery, isEmergency]);

  const confirmBooking = async () => {
    if (!bookingWorker) return;
    setIsSubmitting(true);
    const surgeAmount = isEmergency ? 250 : 0;
    const grossTotal = bookingWorker.hourlyRate + surgeAmount;

    // Send to backend /api/bookings
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user?.id || 'cust-anon-001',
          customerName: user?.name || 'Priya Sharma',
          workerId: bookingWorker.id,
          bookingType: isEmergency ? 'INSTANT' : 'SCHEDULED',
          isEmergency,
          baseAmount: bookingWorker.hourlyRate,
          surgeAmount,
          serviceLatitude: userLocation.lat,
          serviceLongitude: userLocation.lng,
          serviceAddressLine1: 'Indiranagar 100ft Rd',
          serviceCity: 'Bengaluru',
          servicePostalCode: '560038',
          issueDescription: aiProblem || (isEmergency ? 'Emergency SOS' : 'General Service')
        })
      });
    } catch (err) {
      console.warn('Booking API call error, continuing with local order:', err);
    }

    // Also update CoopDataContext
    const order = createOrder({
      workerId: bookingWorker.id,
      workerName: bookingWorker.name,
      workerTrade: bookingWorker.trade,
      cooperativeName: bookingWorker.cooperativeName,
      customerName: user?.name || 'Priya Sharma',
      customerAddress: 'Indiranagar 2nd Stage, Ward 88, Bengaluru',
      totalAmount: grossTotal,
      issueDescription: aiProblem
        ? `AI DIAGNOSIS DIRECT: ${aiProblem} (Verified trade requirement: ${bookingWorker.trade})`
        : isEmergency
        ? `EMERGENCY DISPATCH: Urgent on-demand service for ${bookingWorker.trade} (100% surge premium passes directly to worker)`
        : `Standard service appointment for ${bookingWorker.trade}`,
      isEmergency: isEmergency,
      serviceCategory: selectedCategory !== 'all' ? selectedCategory : bookingWorker.trade
    });
    setConfirmedOrder(order);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      
      {/* -------------------------------------------------------------------- */}
      {/* EMERGENCY PRIORITY DISPATCH BANNER (WHEN ?emergency=true) */}
      {/* -------------------------------------------------------------------- */}
      {isEmergency && (
        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-500 shadow-md space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-600 fill-rose-600" />
                <h2 className="text-base sm:text-lg font-extrabold text-rose-950 tracking-tight">
                  {t('emergencyBannerTitle')}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-600 text-white shadow-xs">
                5 km Geofenced Perimeter • Redis Lock Mutex
              </span>
              <Link
                href="/services"
                className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline ml-1"
              >
                {t('exitEmergencyMode')}
              </Link>
            </div>
          </div>

          <div className="p-3.5 bg-white/95 rounded-xl border border-rose-200 text-xs text-rose-950 font-medium leading-relaxed shadow-2xs">
            ⚡ <strong className="text-rose-900 font-bold">{t('emergencySurgeClaim')}</strong>{' '}
            Zero platform commission, zero corporate clawback. Nearest on-duty cooperative trade members are prioritized by real-time GPS proximity.
          </div>

          <div className="flex items-center gap-2 text-xs text-rose-800 font-semibold flex-wrap">
            <span>Supported Emergency Trades:</span>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">⚡ Electrical</span>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">💧 Plumbing</span>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">❄️ HVAC / Appliance</span>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 1. SEARCH & CONTROLS (UNIFIED, CLEAN TOP BAR) */}
      {/* -------------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t('servicesTitle')}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t('servicesSubtitle')}
            </p>
          </div>

          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('payoutBannerBadge')}</span>
          </div>
        </div>

        {/* Unified Search & GPS Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 ml-3 text-slate-400 stroke-[2] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholderServices')}
              className="w-full py-2.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 py-1 text-slate-400 hover:text-slate-600 rounded-md text-xs font-semibold mr-2"
              >
                {t('cancel')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 sm:max-w-xs shrink-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${userLocation.isGpsActive ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
            <span className="truncate font-medium flex-1 text-slate-800" title={userLocation.label}>
              {userLocation.label}
            </span>
            <button
              onClick={requestLiveGps}
              disabled={isLocating}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 shrink-0 ml-1 cursor-pointer disabled:opacity-50"
            >
              {isLocating ? t('detectingLocation') : t('useGpsBtn')}
            </button>
          </div>
        </div>

        {/* Clean Trade Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {t('catAllServices')} ({workers.length})
          </button>
          {professionalCategories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{t(c.translationKey)}</span>
                {isEmergency && c.isEmergencyEligible && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. VERIFIED WORKER LIST */}
      {/* -------------------------------------------------------------------- */}
      <div className="space-y-4">
        {isAiDirected && aiProblem && (
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-indigo-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">AI Diagnostic Query: </span>
                <span className="text-slate-700 font-medium">&quot;{aiProblem}&quot;</span>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-indigo-700 border border-indigo-200 shrink-0 self-start sm:self-auto">
              Pre-filled Diagnosis Active
            </span>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              {isEmergency ? t('emergencyBannerTitle') : t('statusAvailable')}
            </h3>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {filteredWorkers.length} near you
            </span>
          </div>

          <span className="text-xs text-slate-500 hidden sm:inline font-medium">
            {t('activePerimeterLabel')}
          </span>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl space-y-2">
            <p className="font-bold text-slate-800 text-base">{t('noArtisansFound')}</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try selecting another trade, expanding your search term, or switching back to &apos;All Trades&apos;.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              {t('clearFiltersBtn')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWorkers.map((worker) => {
              const isResponder = isEmergency && worker.isAvailable;
              return (
                <div
                  key={worker.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 ${
                    isResponder
                      ? 'border-rose-300 ring-1 ring-rose-300/40 bg-gradient-to-b from-rose-50/20 to-white'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {/* Worker Identity & Credential Summary */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3.5">
                      <div className="relative">
                        <div className="w-13 h-13 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-lg shadow-2xs">
                          {worker.name.charAt(0)}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Online" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-base truncate">
                            {worker.name}
                          </h4>
                          {isResponder && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full">
                              <Zap className="w-3 h-3 fill-rose-600 text-rose-600" />
                              SOS Responder
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          {worker.trade} • {worker.cooperativeName}
                        </p>

                        <div className="text-xs text-slate-500 flex items-center gap-x-2 mt-1.5 flex-wrap">
                          <span className="flex items-center text-amber-600 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                            {worker.rating}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span>{worker.completedJobs} jobs done</span>
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center font-medium text-slate-700">
                            <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                            {worker.locationName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Consolidated Sleek Verification Badge */}
                    <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-700">
                      <div className="flex items-center gap-1.5 font-medium text-emerald-800">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{t('verifiedBadge')}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
                        UAN: {worker.eShramUan ? worker.eShramUan.replace(/(\d{4})-(\d{4})-(\d{4})/, '$1-XXXX-$3') : 'XXXX-XXXX-3821'}
                      </span>
                    </div>
                  </div>

                  {/* Pricing & Booking Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                    <div>
                      {isEmergency ? (
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold text-rose-700">₹{worker.hourlyRate + 250}</span>
                            <span className="text-xs text-slate-400 line-through">₹{worker.hourlyRate}</span>
                            <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-200">
                              SOS Rate
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-700 font-semibold block">
                            {t('emergencySurgePremium')} ₹250
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-slate-900">₹{worker.hourlyRate}</span>
                            <span className="text-xs text-slate-500">{t('perHour')}</span>
                          </div>
                          <span className="text-[11px] text-emerald-700 font-semibold block">
                            {t('shareWorker')} ₹{Math.round(worker.hourlyRate * 0.90)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${worker.phone}`}
                        className="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        aria-label={`Call ${worker.name}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{t('callWorker')}</span>
                      </a>

                      <button
                        onClick={() => setBookingWorker(worker)}
                        className={`h-10 px-4 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all ${
                          isEmergency
                            ? 'bg-rose-600 hover:bg-rose-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {isEmergency && <Zap className="w-3.5 h-3.5 fill-white" />}
                        <span>{isEmergency ? 'Instant SOS' : t('bookNow')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4. CLEAN CONFIRMATION DRAWER */}
      {/* -------------------------------------------------------------------- */}
      {bookingWorker && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {isEmergency ? `🚨 ${t('confirmModalTitle')}` : t('confirmModalTitle')}
              </h3>
              <button
                onClick={() => setBookingWorker(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 font-medium"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {bookingWorker.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{bookingWorker.name}</p>
                <p className="text-xs text-slate-500">{bookingWorker.trade} • {bookingWorker.cooperativeName}</p>
              </div>
              <span className="font-bold text-slate-900 text-sm">₹{bookingWorker.hourlyRate}/hr</span>
            </div>

            {isEmergency && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  <span>{t('emergencySurgePremium')} ₹250</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  <strong>{t('emergencySurgeClaim')}</strong>
                </p>
              </div>
            )}

            {/* Financial Transparency Breakdown */}
            {(() => {
              const surge = isEmergency ? 250 : 0;
              const gross = bookingWorker.hourlyRate + surge;
              const split = calculateCoopSplit(gross);
              return (
                <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-900 pb-1 border-b border-slate-200">
                    <span>{t('grossTotalPayable')}</span>
                    <span>₹{gross}.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>{t('shareWorker')}</span>
                    <span>₹{split.workerPayout}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>{t('shareSociety')}</span>
                    <span>₹{split.coopFee}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>{t('shareWelfare')}</span>
                    <span>₹{split.welfareFund}.00</span>
                  </div>
                </div>
              );
            })()}

            {confirmedOrder ? (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>{t('confirmedHeading')}</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    Order Reference: <strong className="font-mono">{confirmedOrder.id}</strong>
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t('confirmedSubtitle')}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setBookingWorker(null);
                      setConfirmedOrder(null);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {t('close')}
                  </button>
                  <Link
                    href="/bookings"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white text-center shadow-xs transition-colors"
                  >
                    {t('trackLiveBtn')} →
                  </Link>
                </div>
              </div>
            ) : (
              <button
                onClick={confirmBooking}
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                } ${
                  isEmergency
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10'
                }`}
              >
                <span>{isSubmitting ? t('submittingDispatch') : t('confirmAndDispatchBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
