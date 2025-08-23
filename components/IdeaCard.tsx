import React from 'react';
import type { ProjectIdea } from '../types';
import { SpeakButton } from './SpeakButton';
import { useLanguage } from '../contexts/LanguageContext';


interface IdeaCardProps {
  idea: ProjectIdea;
  index: number;
}

const cardColors = [
  'bg-[#DA2C38]', // Red
  'bg-[#226F54]', // Green
  'bg-[#43291F]', // Brown
  'bg-[#87C38F]', // Light Green
  'bg-[#DA2C38]', // Red (repeated for 5th item)
];

const textColors = [
  'text-white',
  'text-white',
  'text-white',
  'text-[#43291F]',
  'text-white',
];


export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index }) => {
  const { language } = useLanguage();
  const bgColor = cardColors[index % cardColors.length];
  const textColor = textColors[index % textColors.length];
  
  return (
    <div className={`flex flex-col p-6 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ${bgColor} ${textColor}`}>
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-display uppercase text-2xl font-bold mb-2 flex-grow tracking-wide">{idea.title}</h3>
        <SpeakButton textToSpeak={`${idea.title}. ${idea.description}`} lang={language} />
      </div>
      <p className="text-base leading-relaxed">{idea.description}</p>
    </div>
  );
};
