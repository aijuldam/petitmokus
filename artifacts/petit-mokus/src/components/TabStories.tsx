import { Language, dictionary } from "../lib/i18n";

interface TabStoriesProps {
  language: Language;
}

export function TabStories({ language }: TabStoriesProps) {
  const ui = dictionary.ui;

  return (
    <div className="flex flex-col items-center justify-center p-6 pb-32 max-w-md mx-auto min-h-[60vh] text-center">
      <div className="w-48 h-48 mb-8 relative">
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
        {/* Sleeping squirrel SVG */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 drop-shadow-md">
          <path d="M75 60C85 50 85 30 70 25C65 20 50 30 50 40C45 35 35 30 25 35C15 40 15 55 20 65C10 75 20 95 35 90C40 90 45 85 50 80C55 85 65 95 75 90C85 85 85 70 75 60Z" fill="#D6A495" opacity="0.9"/>
          {/* Closed eyes */}
          <path d="M30 50Q35 55 40 50" stroke="#6B4E41" strokeWidth="2" strokeLinecap="round"/>
          <path d="M60 50Q65 55 70 50" stroke="#6B4E41" strokeWidth="2" strokeLinecap="round"/>
          {/* Zzz */}
          <text x="75" y="30" fill="#6B4E41" fontSize="10" fontWeight="bold" opacity="0.6">Z</text>
          <text x="85" y="20" fill="#6B4E41" fontSize="8" fontWeight="bold" opacity="0.4">z</text>
          <text x="92" y="12" fill="#6B4E41" fontSize="6" fontWeight="bold" opacity="0.2">z</text>
        </svg>
      </div>
      
      <h2 className="text-3xl font-extrabold text-foreground mb-3">{ui.storiesTitle[language]}</h2>
      <p className="text-lg text-muted-foreground mb-8">{ui.storiesSub[language]}</p>
      
      <div className="px-6 py-2 bg-secondary/20 text-secondary-foreground font-bold rounded-full inline-block">
        {ui.soon[language]}
      </div>
    </div>
  );
}
