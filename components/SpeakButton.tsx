import React, { useState, useEffect } from 'react';
import { SpeakerIcon } from './SpeakerIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface SpeakButtonProps {
  textToSpeak: string;
  lang: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({ textToSpeak, lang }) => {
  const { t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeechSynthesisSupported = 'speechSynthesis' in window;

  // Effect for cleanup on unmount
  useEffect(() => {
    return () => {
      // If the component unmounts, stop any ongoing speech synthesis.
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!isSpeechSynthesisSupported) {
      console.warn("Speech synthesis not supported by this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      // onend will fire and set isSpeaking to false
    } else {
      window.speechSynthesis.cancel(); // Cancel any previous speech
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        console.error("Speech synthesis error:", event.error);
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };
  
  if (!isSpeechSynthesisSupported) {
    return null;
  }

  return (
    <button
      onClick={handleSpeak}
      className={`p-2 rounded-full transition-colors ${
        isSpeaking ? 'bg-[#87C38F] text-[#43291F]' : 'bg-transparent hover:bg-white/30'
      }`}
      aria-label={t('speak')}
      title={t('speak')}
    >
      <SpeakerIcon className="h-5 w-5" />
    </button>
  );
};
