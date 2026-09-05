'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  HeartHandshake, 
  Hammer, 
  Wrench, 
  Sparkles, 
  Paintbrush, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  X,
  SlidersHorizontal,
  ChevronRight,
  Send
} from 'lucide-react';
import { 
  MOCK_CATEGORIES, 
  MOCK_WORKERS, 
  ServiceCategory, 
  WorkerProfile 
} from '@/data/mockData';

// Map icon name string to Lucide component
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Zap': return Zap;
    case 'Droplets': return Droplets;
    case 'HeartHandshake': return HeartHandshake;
    case 'Hammer': return Hammer;
    case 'Wrench': return Wrench;
    case 'Sparkles': return Sparkles;
    case 'Paintbrush': return Paintbrush;
    default: return Wrench;
  }
};

export default function ServiceDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<WorkerProfile | null>(null);
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-09-07');
  const [bookingTime, setBookingTime] = useState('10:30 AM');
  const [bookingAddress, setBookingAddress] = useState('14, 2nd Cross, Indiranagar, Bengaluru');

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    return MOCK_CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Filter workers based on search and selected category
  const filteredWorkers = useMemo(() => {
    return MOCK_WORKERS.filter(worker => {
      const matchesSearch = 
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.cooperativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        selectedCategory === 'all' || 
        worker.trade.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerForBooking) return;
    
    setBookingSuccessMessage(
      `Booking request successfully dispatched to ${selectedWorkerForBooking.name}! The cooperative dispatcher will confirm via SMS within 15 minutes.`
    );
    setTimeout(() => {
      setSelectedWorkerForBooking(null);
      setBookingSuccessMessage(null);
    }, 4500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Hero & Search Section */}
      <section className="relative pt-4 pb-6 sm:py-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-medium text-cyan-300 border-cyan-500/30">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Haversine 10km Geo-Matching Enabled</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Verified Labour Cooperatives</span>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Fair Gig Services. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Direct From Worker Cooperatives.
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Book verified trade professionals within 10 km. 80% goes directly to the worker, 
            15% sustains the cooperative, and 5% funds emergency mutual aid.
          </p>
        </div>

        {/* Prominent Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-panel p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 shadow-2xl border-white/15 focus-within:border-cyan-400/60 transition-all">
            <div className="flex items-center gap-3 w-full px-3 py-2">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                placeholder="Search trades (e.g. Electrician, Inverter repair, Plumber)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-3 px-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/60 px-3 py-2 rounded-xl border border-white/5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-medium">Indiranagar (10 km)</span>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors shrink-0 shadow-lg shadow-cyan-500/20"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Trade Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap max-w-4xl mx-auto pt-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/30'
                : 'glass-panel text-slate-300 hover:text-white hover:border-cyan-400/30'
            }`}
          >
            All Services
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'all' : cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/30'
                  : 'glass-panel text-slate-300 hover:text-white hover:border-cyan-400/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Popular Cooperative Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Select a trade category to discover certified, cooperative-verified tradespeople
            </p>
          </div>
          <span className="text-xs font-medium text-cyan-400 hidden sm:inline">
            {filteredCategories.length} Categories Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCategories.map((category) => {
            const IconComponent = getCategoryIcon(category.iconName);
            const isSelected = selectedCategory.toLowerCase() === category.name.toLowerCase();

            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : category.name)}
                className={`glass-panel-interactive p-5 rounded-2xl cursor-pointer group relative overflow-hidden flex flex-col justify-between ${
                  isSelected ? 'border-cyan-400/70 ring-2 ring-cyan-400/30 bg-slate-900/80' : ''
                }`}
              >
                {/* Subtle corner gradient highlight */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent pointer-events-none rounded-tr-2xl" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/30 transition-all">
                      <IconComponent className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                      ₹{category.startingPrice}/hr
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                      <span>{category.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-slate-300 font-medium">{category.activeWorkers} verified</span>
                  </div>
                  <span className="text-[11px] text-cyan-400 group-hover:underline">
                    Browse trade →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommended Workers Nearby Section */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>10km Geo-Proximity Match</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Recommended Workers Nearby
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Available cooperative members ordered by distance, verified credentials, and customer ratings.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Cooperative Verified</span>
          </div>
        </div>

        {/* Worker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-cyan-400/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all duration-300 group"
            >
              {/* Header: Avatar, Name, Cooperative, Badge */}
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={worker.avatarUrl}
                      alt={worker.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-md group-hover:scale-105 transition-transform"
                    />
                    {worker.isAvailable && (
                      <span 
                        title="Available Now" 
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full" 
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base truncate group-hover:text-cyan-300 transition-colors">
                        {worker.name}
                      </h3>
                      <span className="text-sm font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30 shrink-0">
                        ₹{worker.hourlyRate}/hr
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-teal-300 flex items-center gap-1 mt-0.5">
                      <span>{worker.trade}</span>
                      <span>•</span>
                      <span className="text-slate-400">{worker.experienceYears}y exp</span>
                    </p>

                    <p className="text-[11px] text-slate-400 truncate mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{worker.cooperativeName}</span>
                    </p>
                  </div>
                </div>

                {/* Rating and Distance Bar */}
                <div className="flex items-center justify-between bg-slate-900/70 p-2.5 rounded-xl border border-white/5 text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{worker.rating.toFixed(1)}</span>
                    <span className="text-slate-500 font-normal">({worker.reviewsCount})</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{worker.distanceKm} km away</span>
                  </div>

                  <div className="text-slate-400">
                    <span className="text-emerald-400 font-medium">{worker.completedJobs}</span> jobs
                  </div>
                </div>

                {/* Worker Bio & Skill Chips */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {worker.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {worker.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                  {worker.skills.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md text-slate-400">
                      +{worker.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedWorkerForBooking(worker)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-semibold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-cyan-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Book Worker</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Confirmation / Transparent Escrow Modal */}
      {selectedWorkerForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-white/15 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setSelectedWorkerForBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Service Booking Request
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Book {selectedWorkerForBooking.name}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedWorkerForBooking.trade} • {selectedWorkerForBooking.cooperativeName}
              </p>
            </div>

            {bookingSuccessMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Booking Request Dispatched!</p>
                  <p className="mt-1 text-xs text-emerald-300/90">{bookingSuccessMessage}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookSubmit} className="space-y-4">
                
                {/* Transparent 80/15/5 Cooperative Split Indicator */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-400">Estimated 2-Hour Service:</span>
                    <span className="text-white font-bold text-sm">
                      ₹{selectedWorkerForBooking.hourlyRate * 2}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs border-t border-white/5 pt-2">
                    <div className="flex justify-between text-emerald-300">
                      <span>• 80% Direct Worker Payout:</span>
                      <span className="font-semibold">₹{(selectedWorkerForBooking.hourlyRate * 2 * 0.8).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-cyan-300">
                      <span>• 15% Cooperative Capital Fund:</span>
                      <span className="font-semibold">₹{(selectedWorkerForBooking.hourlyRate * 2 * 0.15).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-indigo-300">
                      <span>• 5% Worker Mutual Aid & Insurance:</span>
                      <span className="font-semibold">₹{(selectedWorkerForBooking.hourlyRate * 2 * 0.05).toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Preferred Time
                    </label>
                    <input
                      type="text"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Service Location (Address)
                  </label>
                  <input
                    type="text"
                    value={bookingAddress}
                    onChange={(e) => setBookingAddress(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs sm:text-sm"
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Job Description / Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe what needs fixing (e.g. Master bedroom switchboard spark)..."
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs sm:text-sm resize-none"
                    defaultValue="Need inspection for circuit breaker tripping and kitchen main switch repair."
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-cyan-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>Confirm & Dispatch to {selectedWorkerForBooking.name}</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2">
                    Payment held securely in cooperative escrow until service is marked completed by you.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
