import React, { useState, useEffect, useCallback } from 'react';
import { MicrophoneIcon } from './MicrophoneIcon';
import { useLanguage } from '../contexts/LanguageContext';

// Type definitions for Web Speech API to fix TypeScript errors
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

interface SpeechToTextButtonProps {
  onTranscript: (transcript: string) => void;
  lang: string;
}

// Add SpeechRecognition and webkitSpeechRecognition to the window object type.
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

// Check for SpeechRecognition API
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognitionAPI;

export const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({ onTranscript, lang }) => {
  const { t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.warn("Speech recognition not supported by this browser.");
      return;
    }

    const rec = new SpeechRecognitionAPI();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = lang;

    rec.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      onTranscript(transcript);
    };

    rec.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    rec.onend = () => {
      setIsListening(false);
    };
    
    setRecognition(rec);
  }, [lang, onTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    }
  }, [isListening, recognition]);
  
  if (!isSpeechRecognitionSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
        isListening ? 'bg-[#DA2C38] text-white animate-pulse' : 'bg-transparent text-[#43291F]/50 hover:bg-[#87C38F]/30'
      }`}
      title={isListening ? t('listening') : t('dictate')}
    >
      <MicrophoneIcon className="h-5 w-5" />
    </button>
  );
};
