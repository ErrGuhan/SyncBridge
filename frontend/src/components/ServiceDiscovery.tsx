'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Mic, 
  MicOff, 
  Search, 
  MapPin, 
  Phone, 
  Star, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_WORKERS, WorkerProfile } from '@/data/mockData';

// ----------------------------------------------------------------------------
// CULTURALLY RECOGNIZABLE VECTOR ILLUSTRATIONS FOR LOW-LITERACY RECOGNITION
// ----------------------------------------------------------------------------

function DrippingTapIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto fill-none stroke-black stroke-[3.5] stroke-linecap-round stroke-linejoin-round" aria-hidden="true">
      {/* Tap Body & Handle */}
      <path d="M40 20 H60 V28 H40 Z" fill="#FBBF24" />
      <path d="M50 28 V40" />
      <path d="M25 40 H68 C74 40 78 45 78 52 V60 H62 V52 C62 50 60 48 58 48 H25 V40 Z" fill="#E2E8F0" />
      <path d="M62 60 H78 V66 H62 Z" fill="#CBD5E1" />
      {/* Water Droplet */}
      <path d="M70 76 C70 76 64 84 64 88 A6 6 0 0 0 76 88 C76 84 70 76 70 76 Z" fill="#0284C7" stroke="#000" />
    </svg>
  );
}

function GlowingBulbIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto fill-none stroke-black stroke-[3.5] stroke-linecap-round stroke-linejoin-round" aria-hidden="true">
      {/* Filament & Bulb Glow */}
      <circle cx="50" cy="45" r="26" fill="#FEF08A" />
      <path d="M40 38 L46 48 L54 48 L60 38" stroke="#D97706" strokeWidth="2.5" />
      {/* Screw Base */}
      <path d="M38 68 H62 V74 H38 Z" fill="#94A3B8" />
      <path d="M41 74 H59 V79 H41 Z" fill="#64748B" />
      <path d="M45 79 H55 V83 H45 Z" fill="#000" />
      {/* Radiating Light Rays */}
      <path d="M50 10 V16" stroke="#F59E0B" strokeWidth="4" />
      <path d="M20 25 L25 29" stroke="#F59E0B" strokeWidth="4" />
      <path d="M80 25 L75 29" stroke="#F59E0B" strokeWidth="4" />
      <path d="M12 48 H18" stroke="#F59E0B" strokeWidth="4" />
      <path d="M82 48 H88" stroke="#F59E0B" strokeWidth="4" />
    </svg>
  );
}

function SweepingBroomIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto fill-none stroke-black stroke-[3.5] stroke-linecap-round stroke-linejoin-round" aria-hidden="true">
      {/* Wooden Stick */}
      <line x1="72" y1="16" x2="42" y2="56" stroke="#B45309" strokeWidth="6" />
      {/* Broom Head Straws */}
      <path d="M38 52 L54 62 L38 88 C32 89 22 84 18 78 L38 52 Z" fill="#FDE047" />
      <line x1="42" y1="64" x2="26" y2="84" stroke="#A16207" strokeWidth="2.5" />
      <line x1="46" y1="67" x2="33" y2="86" stroke="#A16207" strokeWidth="2.5" />
      {/* Clean Sparkles */}
      <path d="M75 60 L78 68 L86 71 L78 74 L75 82 L72 74 L64 71 L72 68 Z" fill="#38BDF8" stroke="#000" strokeWidth="2" />
      <circle cx="82" cy="46" r="3" fill="#38BDF8" />
    </svg>
  );
}

function ApplianceFanIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto fill-none stroke-black stroke-[3.5] stroke-linecap-round stroke-linejoin-round" aria-hidden="true">
      {/* AC Unit Body */}
      <rect x="16" y="24" width="68" height="34" rx="6" fill="#F1F5F9" />
      <line x1="24" y1="46" x2="76" y2="46" stroke="#000" strokeWidth="3" />
      <rect x="66" y="32" width="10" height="6" rx="2" fill="#22C55E" />
      {/* Cold Breeze Waves */}
      <path d="M26 66 C30 72 36 72 40 66 C44 60 50 60 54 66" stroke="#0284C7" strokeWidth="3" />
      <path d="M46 76 C50 82 56 82 60 76 C64 70 70 70 74 76" stroke="#0284C7" strokeWidth="3" />
      {/* Wrench */}
      <path d="M72 64 L86 78 C89 81 87 86 83 86 L79 82 L75 84 L72 79 Z" fill="#F59E0B" stroke="#000" strokeWidth="2" />
    </svg>
  );
}

function WoodSawIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto fill-none stroke-black stroke-[3.5] stroke-linecap-round stroke-linejoin-round" aria-hidden="true">
      {/* Timber Wood Plank */}
      <rect x="14" y="60" width="72" height="22" rx="3" fill="#D97706" />
      <line x1="20" y1="71" x2="80" y2="71" stroke="#92400E" strokeWidth="2" />
      {/* Hand Saw Blade */}
      <path d="M30 30 L74 54 L30 54 Z" fill="#CBD5E1" />
      <path d="M30 54 L34 50 L38 54 L42 50 L46 54 L50 50 L54 54 L58 50 L62 54 L66 50 L70 54 L74 54" stroke="#000" strokeWidth="3" />
      {/* Wooden Handle */}
      <rect x="20" y="22" width="16" height="24" rx="4" fill="#B45309" />
      <circle cx="28" cy="34" r="4" fill="#FFF" />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// VISUAL SERVICE CATEGORIES METADATA
// ----------------------------------------------------------------------------
const visualCategories = [
  {
    id: 'plumbing',
    translationKey: 'plumbing',
    descKey: 'plumbingDesc',
    component: DrippingTapIllustration,
    bgColor: 'bg-sky-100',
    borderColor: 'border-sky-500',
    badgeColor: 'bg-sky-600',
    rate: '₹450/hr'
  },
  {
    id: 'electrical',
    translationKey: 'electrical',
    descKey: 'electricalDesc',
    component: GlowingBulbIllustration,
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-500',
    badgeColor: 'bg-yellow-600',
    rate: '₹500/hr'
  },
  {
    id: 'cleaning',
    translationKey: 'cleaning',
    descKey: 'cleaningDesc',
    component: SweepingBroomIllustration,
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-500',
    badgeColor: 'bg-emerald-600',
    rate: '₹420/hr'
  },
  {
    id: 'appliance-repair',
    translationKey: 'appliance',
    descKey: 'applianceDesc',
    component: ApplianceFanIllustration,
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-500',
    badgeColor: 'bg-cyan-600',
    rate: '₹550/hr'
  },
  {
    id: 'carpentry',
    translationKey: 'carpentry',
    descKey: 'carpentryDesc',
    component: WoodSawIllustration,
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-500',
    badgeColor: 'bg-orange-600',
    rate: '₹520/hr'
  }
];

export default function ServiceDiscovery() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('plumbing');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [bookingWorker, setBookingWorker] = useState<WorkerProfile | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Carousel swipe ref & drag coordinates
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Handle Touch Swipe Gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        // Swiped Left -> scroll next
        carouselRef.current?.scrollBy({ left: 240, behavior: 'smooth' });
      } else {
        // Swiped Right -> scroll prev
        carouselRef.current?.scrollBy({ left: -240, behavior: 'smooth' });
      }
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Voice Search Mockup (Simulates speech-to-text on budget phone)
  const toggleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    // Simulate auto-dictation
    setTimeout(() => {
      setSearchQuery('Plumber Dadar');
      setSelectedCategory('plumbing');
      setIsListening(false);
    }, 2200);
  };

  // Filter Workers based on active category
  const filteredWorkers = useMemo(() => {
    return MOCK_WORKERS.filter((worker) => {
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
        (worker.locationName || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);


  const handleQuickBook = (worker: WorkerProfile) => {
    setBookingWorker(worker);
  };

  const confirmBooking = () => {
    if (!bookingWorker) return;
    setBookingSuccess(`Job requested! ${bookingWorker.name} has been alerted.`);
    setTimeout(() => {
      setBookingWorker(null);
      setBookingSuccess(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* 1. HEADER & HIGH-CONTRAST VOICE SEARCH BAR */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-3">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-snug">
            {t('findServiceTitle')}
          </h1>
          <p className="text-sm sm:text-base font-bold text-slate-700 mt-1">
            {t('findServiceSubtitle')}
          </p>
        </div>

        {/* Large Voice Search Input Bar */}
        <div className="flex items-center gap-2 bg-white border-2 border-black rounded-2xl p-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Search className="w-6 h-6 ml-2 text-black stroke-[2.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type or tap mic (e.g. Plumber, Electrician)..."
            className="flex-1 py-3 px-2 text-base sm:text-lg font-bold text-black placeholder:text-slate-500 outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-2 text-black font-black text-lg hover:bg-slate-100 rounded-lg min-h-[44px] min-w-[44px]"
            >
              ✕
            </button>
          )}
          {/* Tap to Speak Microphone Button */}
          <button
            onClick={toggleVoiceSearch}
            className={`min-h-[48px] min-w-[48px] px-3.5 py-2 rounded-xl border-2 border-black flex items-center justify-center font-black transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-voice-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-emerald-500 text-black hover:bg-emerald-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            }`}
            aria-label={t('tapToSpeak')}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 animate-pulse" />
            ) : (
              <Mic className="w-6 h-6 stroke-[2.5]" />
            )}
          </button>
        </div>

        {isListening && (
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-2.5 text-center text-red-700 font-extrabold text-sm flex items-center justify-center gap-2 animate-pulse">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
            {t('listening')} Speak now (बोलें...)
          </div>
        )}
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 2. GESTURE-BASED TOUCH SWIPE CAROUSEL (LARGE VISUAL CARDS) */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-black text-sm text-black">
            <span>{t('swipePrompt')}</span>
          </div>

          {/* Touch-Friendly Swipe Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="min-h-[44px] min-w-[44px] rounded-xl border-2 border-black bg-white hover:bg-slate-100 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
              aria-label="Previous services"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="min-h-[44px] min-w-[44px] rounded-xl border-2 border-black bg-white hover:bg-slate-100 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
              aria-label="Next services"
            >
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Horizontal Swipe Carousel Container */}
        <div
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="swipe-carousel flex gap-3.5 py-2 px-1 overflow-x-auto select-none"
        >
          {visualCategories.map((cat) => {
            const IconIllustration = cat.component;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`swipe-slide flex-shrink-0 cursor-pointer p-4 rounded-2xl border-[3px] border-black transition-all text-center flex flex-col justify-between ${
                  isSelected
                    ? `${cat.bgColor} shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] scale-[1.02]`
                    : 'bg-white hover:bg-slate-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {/* Large Culturally Recognized Vector Illustration */}
                <div className="py-2">
                  <IconIllustration />
                </div>

                {/* Bold Large Service Name */}
                <div className="space-y-1 my-2">
                  <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-tight">
                    {t(cat.translationKey)}
                  </h3>
                  <p className="text-xs font-bold text-slate-700 leading-snug line-clamp-2">
                    {t(cat.descKey)}
                  </p>
                </div>

                {/* Pricing & Selection Footer */}
                <div className="pt-2 border-t-2 border-black/10 flex items-center justify-between mt-auto">
                  <span className="text-sm font-black text-black bg-white px-2 py-0.5 rounded-md border border-black">
                    {cat.rate}
                  </span>
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-lg border border-black ${
                      isSelected ? 'bg-black text-white' : 'bg-amber-300 text-black'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : 'Tap to Choose'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 3. VERIFIED WORKER LIST FOR SELECTED CATEGORY */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <h2 className="text-xl font-black text-black flex items-center gap-2">
            <span>👷 Available Member-Workers</span>
            <span className="text-xs font-extrabold bg-black text-white px-2 py-0.5 rounded-full">
              {filteredWorkers.length}
            </span>
          </h2>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md border border-emerald-500">
            {t('payoutBadge')}
          </span>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-black rounded-2xl">
            <p className="font-extrabold text-black text-base">No workers found in this category.</p>
            <p className="text-xs font-bold text-slate-600 mt-1">Try tapping another service card above.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="accessible-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white"
              >
                {/* Worker Avatar & Identity */}
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-200 border-2 border-black flex items-center justify-center text-2xl font-black shadow-sm overflow-hidden flex-shrink-0">
                    {worker.avatarUrl ? (
                      <img src={worker.avatarUrl} alt={worker.name} className="w-full h-full object-cover" />
                    ) : (
                      worker.name.charAt(0)
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-lg text-black">{worker.name}</span>
                      <span className="text-[11px] font-black bg-emerald-500 text-black px-1.5 py-0.2 rounded border border-black">
                        ✓ Verified Co-op
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <span className="flex items-center text-amber-600 font-extrabold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-0.5" />
                        {worker.rating}
                      </span>
                      <span>•</span>
                      <span>{worker.completedJobs} jobs</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-0.5" /> {worker.locationName}
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-blue-700">{worker.cooperativeName}</div>
                  </div>
                </div>


                {/* 1-Tap Booking & Direct Calling Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <a
                    href={`tel:${worker.phone}`}
                    className="flex-1 sm:flex-initial min-h-[48px] min-w-[48px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-black text-black font-black text-sm flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
                    aria-label={`Call ${worker.name}`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </a>

                  <button
                    onClick={() => handleQuickBook(worker)}
                    className="flex-1 sm:flex-initial min-h-[48px] px-4 py-2 rounded-xl bg-black text-white hover:bg-slate-800 font-black text-sm border-2 border-black flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] active:translate-y-[1px]"
                  >
                    <span>{t('bookNow')} (₹{worker.hourlyRate})</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 4. MODAL: ONE-TAP 1-STEP CONFIRMATION DRAWER */}
      {/* -------------------------------------------------------------------- */}
      {bookingWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-white border-[3px] border-black rounded-3xl p-5 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="text-xl font-black text-black">Confirm Booking</h3>
              <button
                onClick={() => setBookingWorker(null)}
                className="min-h-[44px] min-w-[44px] font-black text-xl hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-amber-50 border-2 border-black rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-amber-200 border-2 border-black flex items-center justify-center text-xl font-black">
                🤝
              </div>
              <div>
                <p className="font-black text-base text-black">{bookingWorker.name}</p>
                <p className="text-xs font-bold text-slate-700">{bookingWorker.trade} • {bookingWorker.cooperativeName}</p>
                <p className="text-xs font-extrabold text-emerald-700">₹{bookingWorker.hourlyRate} / hour</p>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span>Worker Payout (90%):</span>
                <span className="font-extrabold text-black">₹{Math.round(bookingWorker.hourlyRate * 0.9)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cooperative Reserve (5%):</span>
                <span className="font-extrabold text-black">₹{Math.round(bookingWorker.hourlyRate * 0.05)}</span>
              </div>
              <div className="flex justify-between">
                <span>Worker Welfare & Insurance (5%):</span>
                <span className="font-extrabold text-black">₹{Math.round(bookingWorker.hourlyRate * 0.05)}</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-emerald-500 text-white font-black text-center p-3 rounded-xl border-2 border-black">
                {bookingSuccess}
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setBookingWorker(null)}
                  className="flex-1 min-h-[48px] rounded-xl border-2 border-black bg-slate-100 font-black text-black hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="flex-1 min-h-[48px] rounded-xl border-2 border-black bg-emerald-500 hover:bg-emerald-600 font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
                >
                  Confirm (पुष्टि करें)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
