'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Mic, 
  MicOff, 
  MapPin, 
  Star, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Droplets,
  Zap,
  Sparkles,
  Wind,
  Hammer,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { MOCK_WORKERS, WorkerProfile } from '@/data/mockData';

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
    activeWorkers: 12
  },
  {
    id: 'electrical',
    translationKey: 'electrical',
    descKey: 'electricalDesc',
    icon: Zap,
    colorClass: 'text-amber-600 bg-amber-50 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
    tileGradient: 'from-amber-500 to-orange-600',
    startingRate: '₹500/hr',
    activeWorkers: 18
  },
  {
    id: 'cleaning',
    translationKey: 'cleaning',
    descKey: 'cleaningDesc',
    icon: Sparkles,
    colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
    tileGradient: 'from-emerald-500 to-teal-600',
    startingRate: '₹420/hr',
    activeWorkers: 15
  },
  {
    id: 'appliance-repair',
    translationKey: 'appliance',
    descKey: 'applianceDesc',
    icon: Wind,
    colorClass: 'text-cyan-600 bg-cyan-50 border-cyan-200 group-hover:bg-cyan-600 group-hover:text-white',
    tileGradient: 'from-cyan-500 to-blue-600',
    startingRate: '₹550/hr',
    activeWorkers: 9
  },
  {
    id: 'carpentry',
    translationKey: 'carpentry',
    descKey: 'carpentryDesc',
    icon: Hammer,
    colorClass: 'text-orange-700 bg-orange-50 border-orange-200 group-hover:bg-orange-700 group-hover:text-white',
    tileGradient: 'from-amber-700 to-yellow-800',
    startingRate: '₹520/hr',
    activeWorkers: 11
  }
];

export default function ServiceDiscovery() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('plumbing');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [bookingWorker, setBookingWorker] = useState<WorkerProfile | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Voice Search Mockup
  const toggleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setTimeout(() => {
      setSearchQuery('Plumber Dadar');
      setSelectedCategory('plumbing');
      setIsListening(false);
    }, 2200);
  };

  // Filter Workers
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

  const confirmBooking = () => {
    if (!bookingWorker) return;
    setBookingSuccess(`Booking request confirmed! ${bookingWorker.name} has received your order.`);
    setTimeout(() => {
      setBookingWorker(null);
      setBookingSuccess(null);
    }, 3800);
  };

  return (
    <div className="space-y-8">
      
      {/* -------------------------------------------------------------------- */}
      {/* 1. SEARCH & HEADING */}
      {/* -------------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('findServiceTitle')}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Select a trade category below or speak to find verified member-workers.
            </p>
          </div>

          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>90% of fee paid directly to worker</span>
          </div>
        </div>

        {/* Professional Search Input Bar */}
        <div className="relative flex items-center bg-white border border-slate-200 rounded-xl shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-1.5">
          <Search className="w-5 h-5 ml-2.5 text-slate-400 stroke-[2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by trade, skill or area (e.g., Plumber, Andheri)..."
            className="flex-1 py-2 px-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md text-sm font-medium mr-1"
            >
              ✕
            </button>
          )}
          {/* Subtle Microphone Button */}
          <button
            onClick={toggleVoiceSearch}
            className={`h-9 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-voice-wave'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            aria-label="Voice Search"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-slate-600" />}
            <span className="hidden xs:inline">{isListening ? 'Listening...' : 'Voice'}</span>
          </button>
        </div>

        {isListening && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-center text-xs font-medium text-rose-700 flex items-center justify-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>Listening... Speak your requested service or area now (बोलें...)</span>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. REFINED HORIZONTAL CAROUSEL OF SERVICE CATEGORIES */}
      {/* -------------------------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Service Categories
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollCarousel('left')}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs transition-colors"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs transition-colors"
              aria-label="Next categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="smooth-carousel pb-2 select-none"
        >
          {professionalCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`smooth-carousel-item p-4 rounded-xl border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-blue-50/40 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : cat.colorClass
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {cat.startingRate}
                  </span>
                </div>

                <div className="mt-3.5 space-y-0.5">
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    {t(cat.translationKey)}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {t(cat.descKey)}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {cat.activeWorkers} verified workers
                  </span>
                  <span className={`font-semibold ${isSelected ? 'text-blue-600' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    {isSelected ? 'Active' : 'Select'} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 3. VERIFIED WORKER LIST FOR SELECTED CATEGORY */}
      {/* -------------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Verified Cooperative Workers
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {filteredWorkers.length} available
            </span>
          </div>

          <span className="text-xs font-medium text-slate-500">
            Within your service radius
          </span>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
            <p className="font-semibold text-slate-700 text-sm">No workers found in this category.</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting another trade or clearing search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-3"
              >
                {/* Worker Identity & Badges */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-700 font-bold text-lg">
                    {worker.avatarUrl ? (
                      <img src={worker.avatarUrl} alt={worker.name} className="w-full h-full object-cover" />
                    ) : (
                      worker.name.charAt(0)
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm sm:text-base truncate">
                        {worker.name}
                      </span>
                      <span className="inline-flex items-center text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                        ✓ Co-op Certified
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-0.5" />
                        {worker.rating}
                      </span>
                      <span>•</span>
                      <span>{worker.completedJobs} jobs</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                        {worker.locationName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium truncate pt-0.5">
                      {worker.cooperativeName}
                    </p>
                  </div>
                </div>

                {/* Pricing & Direct Booking Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-bold text-slate-900">₹{worker.hourlyRate}</span>
                    <span className="text-xs text-slate-500 font-normal">/hr</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">90% directly to worker</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${worker.phone}`}
                      className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      aria-label={`Call ${worker.name}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>

                    <button
                      onClick={() => setBookingWorker(worker)}
                      className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4. CLEAN CONFIRMATION DRAWER */}
      {/* -------------------------------------------------------------------- */}
      {bookingWorker && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Confirm Service Booking</h3>
              <button
                onClick={() => setBookingWorker(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 font-medium"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {bookingWorker.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{bookingWorker.name}</p>
                <p className="text-xs text-slate-500">{bookingWorker.trade} • {bookingWorker.cooperativeName}</p>
              </div>
              <span className="font-bold text-slate-900 text-sm">₹{bookingWorker.hourlyRate}/hr</span>
            </div>

            {/* Financial Transparency Breakdown */}
            <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>90% Direct Worker Take-Home:</span>
                <span>₹{Math.round(bookingWorker.hourlyRate * 0.9)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>5% Primary Cooperative Society:</span>
                <span>₹{Math.round(bookingWorker.hourlyRate * 0.05)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>5% Mutual Aid & Welfare Insurance:</span>
                <span>₹{Math.round(bookingWorker.hourlyRate * 0.05)}</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl text-center">
                {bookingSuccess}
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setBookingWorker(null)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Confirm Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
