'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useVoiceAssistant() {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const getLanguageTag = useCallback((): string => {
    switch (language) {
      case 'hi': return 'hi-IN';
      case 'kn': return 'kn-IN';
      case 'ta': return 'ta-IN';
      default: return 'en-IN';
    }
  }, [language]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingText(null);
    }
  }, []);

  const speak = useCallback((text: string, options?: SpeakOptions) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser environment.');
      return;
    }

    if (!text || !text.trim()) return;

    // If already speaking this exact text, toggle stop
    if (isSpeaking && currentSpeakingText === text) {
      stop();
      return;
    }

    // Cancel any previous utterance
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.lang = options?.lang || getLanguageTag();
    utterance.rate = options?.rate ?? 0.95;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingText(null);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
      setCurrentSpeakingText(null);
    };

    // Small timeout ensures clean speech start in browsers with synth queue issues
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [getLanguageTag, isSpeaking, currentSpeakingText, stop]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    currentSpeakingText,
    isSupported,
    getLanguageTag
  };
}
