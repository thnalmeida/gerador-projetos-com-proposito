import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: 'pt' | 'en') => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLanguageChange('pt')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          language === 'pt' ? 'bg-[#226F54] text-white' : 'bg-transparent text-[#43291F]/70 hover:bg-[#87C38F]/30'
        }`}
        aria-pressed={language === 'pt'}
      >
        PT
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          language === 'en' ? 'bg-[#226F54] text-white' : 'bg-transparent text-[#43291F]/70 hover:bg-[#87C38F]/30'
        }`}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
    </div>
  );
};
