'use client';

import React from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';

interface VoiceReadButtonProps {
  text: string;
  label?: string;
  lang?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'badge' | 'button';
  title?: string;
}

export default function VoiceReadButton({
  text,
  label,
  lang,
  className = '',
  size = 'sm',
  variant = 'icon',
  title = 'Listen aloud'
}: VoiceReadButtonProps) {
  const { speak, stop, isSpeaking, currentSpeakingText, isSupported } = useVoiceAssistant();

  const isCurrentSpeaking = isSpeaking && currentSpeakingText === text;

  if (!isSupported) {
    return null; // Gracefully degrade if browser doesn't support Web Speech API
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentSpeaking) {
      stop();
    } else {
      speak(text, { lang });
    }
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] p-1',
    sm: 'w-7 h-7 text-xs p-1.5',
    md: 'w-8 h-8 text-xs p-2',
    lg: 'w-10 h-10 text-sm p-2.5'
  }[size];

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];

  if (variant === 'badge' || label) {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={title}
        aria-label={isCurrentSpeaking ? `Stop reading aloud` : `Listen: ${label || text.slice(0, 30)}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
          isCurrentSpeaking
            ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400/40 animate-pulse'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80 hover:border-slate-300'
        } ${className}`}
      >
        {isCurrentSpeaking ? (
          <VolumeX className={`${iconSizes} shrink-0 animate-bounce`} />
        ) : (
          <Volume2 className={`${iconSizes} shrink-0 text-blue-600`} />
        )}
        <span>{label || (isCurrentSpeaking ? 'Listening...' : 'Listen')}</span>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={title}
        aria-label={isCurrentSpeaking ? `Stop reading aloud` : `Listen: ${text.slice(0, 30)}`}
        className={`h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
          isCurrentSpeaking
            ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400/40'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
        } ${className}`}
      >
        {isCurrentSpeaking ? (
          <VolumeX className="w-3.5 h-3.5 text-white animate-pulse" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-blue-600" />
        )}
        <span>{isCurrentSpeaking ? 'Stop Reading' : (label || 'Read Aloud')}</span>
      </button>
    );
  }

  // Default: icon button
  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      aria-label={isCurrentSpeaking ? 'Stop speech' : `Read aloud: ${text.slice(0, 30)}`}
      className={`rounded-lg flex items-center justify-center transition-all ${sizeClasses} ${
        isCurrentSpeaking
          ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/50 animate-pulse'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200/60'
      } ${className}`}
    >
      {isCurrentSpeaking ? (
        <VolumeX className={iconSizes} />
      ) : (
        <Volume2 className={iconSizes} />
      )}
    </button>
  );
}
