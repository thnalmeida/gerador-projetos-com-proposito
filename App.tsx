import React, { useState, useCallback } from 'react';
import { generateIdeas } from './services/geminiService';
import type { ProjectIdea } from './types';
import { Header } from './components/Header';
import { IdeaCard } from './components/IdeaCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { GithubIcon } from './components/GithubIcon';
import { useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { SpeechToTextButton } from './components/SpeechToTextButton';

const App: React.FC = () => {
  const { t, language } = useLanguage();
  const [name, setName] = useState<string>('');
  const [passions, setPassions] = useState<string>('');
  const [skills, setSkills] = useState<string>('');
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const handleGenerateIdeas = useCallback(async () => {
    if (!passions || !skills) {
      setError(t('errorEmptyFields'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setIdeas([]);
    setIsGenerated(false);

    try {
      const generatedIdeas = await generateIdeas(passions, skills, language);
      setIdeas(generatedIdeas);
      setIsGenerated(true);
    } catch (e) {
      setError(t('errorGeneric'));
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [passions, skills, language, t]);

  const appendToPassions = (text: string) => setPassions(prev => (prev ? prev + ' ' : '') + text);
  const appendToSkills = (text: string) => setSkills(prev => (prev ? prev + ' ' : '') + text);

  return (
    <div className="min-h-screen bg-[#F4F0BB] text-[#43291F] font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        
        <main className="mt-8 bg-white/40 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-white/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-bold mb-2 text-[#226F54]">
                  {t('yourNameLabel')}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('yourNamePlaceholder')}
                  className="w-full px-4 py-2 bg-[#F4F0BB]/60 border-2 border-[#87C38F] rounded-lg focus:ring-2 focus:ring-[#226F54] focus:border-[#226F54] transition duration-200 placeholder:text-[#43291F]/50"
                />
              </div>
              <div className="relative">
                <label htmlFor="passions" className="block text-sm font-bold mb-2 text-[#226F54]">
                  {t('passionsLabel')}
                </label>
                <textarea
                  id="passions"
                  value={passions}
                  onChange={(e) => setPassions(e.target.value)}
                  placeholder={t('passionsPlaceholder')}
                  rows={4}
                  className="w-full px-4 py-2 pr-12 bg-[#F4F0BB]/60 border-2 border-[#87C38F] rounded-lg focus:ring-2 focus:ring-[#226F54] focus:border-[#226F54] transition duration-200 placeholder:text-[#43291F]/50"
                />
                <SpeechToTextButton onTranscript={appendToPassions} lang={language} />
              </div>
              <div className="relative">
                <label htmlFor="skills" className="block text-sm font-bold mb-2 text-[#226F54]">
                  {t('skillsLabel')}
                </label>
                <textarea
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder={t('skillsPlaceholder')}
                  rows={4}
                  className="w-full px-4 py-2 pr-12 bg-[#F4F0BB]/60 border-2 border-[#87C38F] rounded-lg focus:ring-2 focus:ring-[#226F54] focus:border-[#226F54] transition duration-200 placeholder:text-[#43291F]/50"
                />
                <SpeechToTextButton onTranscript={appendToSkills} lang={language} />
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-[#87C38F]/30 rounded-lg p-6 text-center">
              <h3 className="font-display uppercase text-3xl font-bold text-[#226F54] tracking-wider">{t('readyTitle')}</h3>
              <p className="mt-2 mb-6 text-sm text-[#43291F]/80">
                {t('readyDescription')}
              </p>
              <button
                onClick={handleGenerateIdeas}
                disabled={isLoading}
                className="font-display uppercase tracking-wide w-full max-w-xs px-8 py-3 bg-[#DA2C38] text-white font-bold rounded-lg shadow-md hover:bg-[#b9252f] disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                {isLoading ? t('generatingButton') : t('generateButton')}
              </button>
            </div>
          </div>
        </main>
        
        {error && <div className="mt-6 text-center text-[#DA2C38] bg-red-100 p-4 rounded-lg">{error}</div>}

        <div className="mt-10">
          {isLoading && <LoadingSpinner />}
          {isGenerated && ideas.length > 0 && (
            <div>
              <h2 className="font-display uppercase text-4xl font-bold text-center text-[#226F54] mb-8 tracking-wider">
                {t('ideasHeader')}{name ? `, ${name}` : ''}!
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea, index) => (
                  <IdeaCard key={index} idea={idea} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="w-full max-w-4xl mx-auto mt-12 text-center text-[#43291F]/70 flex flex-col sm:flex-row justify-between items-center gap-4">
        <LanguageSwitcher />
        <a href="https://github.com/google/generative-ai-docs/tree/main/app-integration/building-a-web-app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#DA2C38] transition-colors">
          <GithubIcon />
          <span>{t('viewOnGithub')}</span>
        </a>
      </footer>
    </div>
  );
};

export default App;