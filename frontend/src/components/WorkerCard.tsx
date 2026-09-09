'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Star, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Zap 
} from 'lucide-react';
import { WorkerProfile } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import VoiceReadButton from '@/components/VoiceReadButton';

interface WorkerCardProps {
  worker: WorkerProfile;
  variant?: 'compact' | 'full';
  isEmergency?: boolean;
  onBook?: (worker: WorkerProfile) => void;
  bookingHref?: string;
}

export default function WorkerCard({
  worker,
  variant = 'full',
  isEmergency = false,
  onBook,
  bookingHref = '/services'
}: WorkerCardProps) {
  const { t, language } = useLanguage();

  const isResponder = isEmergency && worker.isAvailable;
  const effectiveRate = isEmergency ? worker.hourlyRate + 250 : worker.hourlyRate;
  const workerPayout = Math.round(effectiveRate * 0.90);

  // Generate localized voice text for accessibility
  const getVoiceSummary = (): string => {
    if (language === 'hi') {
      return `${worker.name}। ${worker.trade}, ${worker.cooperativeName}। रेटिंग ${worker.rating}, ${worker.completedJobs} काम पूर्ण। स्थान: ${worker.locationName}। दर: ₹${effectiveRate} प्रति घंटा।`;
    }
    if (language === 'kn') {
      return `${worker.name}. ${worker.trade}, ${worker.cooperativeName}. ರೇಟಿಂಗ್ ${worker.rating}, ${worker.completedJobs} ಕೆಲಸಗಳು ಮುಗಿದಿವೆ. ಸ್ಥಳ: ${worker.locationName}. ದರ: ಗಂಟೆಗೆ ₹${effectiveRate}.`;
    }
    if (language === 'ta') {
      return `${worker.name}. ${worker.trade}, ${worker.cooperativeName}. மதிப்பீடு ${worker.rating}, ${worker.completedJobs} பணிகள் முடிந்தது. இடம்: ${worker.locationName}. கட்டணம்: மணிக்கு ₹${effectiveRate}.`;
    }
    return `${worker.name}. ${worker.trade} from ${worker.cooperativeName}. Rating ${worker.rating} stars with ${worker.completedJobs} jobs completed in ${worker.locationName}. Rate: ₹${effectiveRate} per hour.`;
  };

  const maskedUan = worker.eShramUan 
    ? worker.eShramUan.replace(/(\d{4})-(\d{4})-(\d{4})/, '$1-XXXX-$3') 
    : '4192-XXXX-3821';

  // -------------------------------------------------------------------------
  // COMPACT VARIANT (Used on Homepage showcase)
  // -------------------------------------------------------------------------
  if (variant === 'compact') {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-4">
        {/* Top Row: Avatar, Identity, and Voice Read */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-100">
              {worker.name.charAt(0)}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Online" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-bold text-slate-900 text-sm truncate">{worker.name}</h3>
              <VoiceReadButton text={getVoiceSummary()} size="xs" />
            </div>
            <p className="text-xs text-slate-600 font-semibold truncate">{worker.trade}</p>
            <p className="text-xs text-slate-400 truncate">{worker.cooperativeName}</p>
          </div>
        </div>

        {/* Rating, Jobs & Location Row (Unified • separator) */}
        <div className="flex items-center gap-x-2 flex-wrap text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center text-amber-600 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
            {worker.rating}
          </span>
          <span className="text-slate-300">•</span>
          <span>{t('jobsDone', { count: worker.completedJobs })}</span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center text-slate-500 truncate">
            <MapPin className="w-3 h-3 mr-0.5 text-slate-400 shrink-0" />
            {worker.locationName}
          </span>
        </div>

        {/* Single Clean Verification Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium text-slate-700">{t('verifiedBadge')}</span>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <span className="text-base font-bold text-slate-900">₹{worker.hourlyRate}</span>
            <span className="text-xs text-slate-500 ml-1">{t('perHour')}</span>
          </div>

          {onBook ? (
            <button
              type="button"
              onClick={() => onBook(worker)}
              className="min-h-[40px] px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>{t('bookNow')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href={bookingHref}
              className="min-h-[40px] px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>{t('bookNow')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // FULL VARIANT (Used on Service Discovery directory)
  // -------------------------------------------------------------------------
  return (
    <div
      className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 ${
        isResponder
          ? 'border-rose-300 ring-1 ring-rose-300/40 bg-gradient-to-b from-rose-50/20 to-white'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      {/* Worker Identity & Credential Summary */}
      <div className="space-y-3">
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <div className="w-13 h-13 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-lg shadow-2xs">
              {worker.name.charAt(0)}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Online" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
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
              <VoiceReadButton text={getVoiceSummary()} size="xs" />
            </div>

            <p className="text-xs font-semibold text-slate-600 mt-0.5 truncate">
              {worker.trade} <span className="text-slate-300 mx-1">•</span> {worker.cooperativeName}
            </p>

            <div className="text-xs text-slate-500 flex items-center gap-x-2 mt-1.5 flex-wrap">
              <span className="flex items-center text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                {worker.rating}
              </span>
              <span className="text-slate-300">•</span>
              <span>{t('jobsDone', { count: worker.completedJobs })}</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center font-medium text-slate-700 truncate">
                <MapPin className="w-3 h-3 mr-0.5 text-slate-400 shrink-0" />
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
            UAN: {maskedUan}
          </span>
        </div>
      </div>

      {/* Pricing & Booking Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div>
          {isEmergency ? (
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-rose-700">₹{effectiveRate}</span>
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
                <span className="text-xs text-slate-500 ml-0.5">{t('perHour')}</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                {t('shareWorker')} ₹{workerPayout}
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

          {onBook ? (
            <button
              type="button"
              onClick={() => onBook(worker)}
              className={`h-10 px-4 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all ${
                isEmergency
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <span>{isEmergency ? t('dispatchNow') : t('bookNow')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href={bookingHref}
              className={`h-10 px-4 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all ${
                isEmergency
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <span>{isEmergency ? t('dispatchNow') : t('bookNow')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
