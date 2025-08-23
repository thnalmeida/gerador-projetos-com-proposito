import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Header: React.FC = () => {
  const { t } = useLanguage();
  return (
    <header className="text-center">
      <h1 className="font-display uppercase text-5xl sm:text-6xl md:text-7xl font-bold text-[#226F54] tracking-wider">
        {t('headerTitle')}
      </h1>
      <p className="mt-3 max-w-2xl mx-auto text-lg text-[#43291F]/90">
        {t('headerSubtitle')}
      </p>
    </header>
  );
};
