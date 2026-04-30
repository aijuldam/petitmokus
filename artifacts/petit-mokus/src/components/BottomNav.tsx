import { cn } from "../lib/utils";
import { Language, dictionary } from "../lib/i18n";
import { Volume2, Music, BookOpen, Puzzle } from "lucide-react";

export type TabType = 'sounds' | 'music' | 'stories' | 'games';

interface BottomNavProps {
  currentTab: TabType;
  setTab: (tab: TabType) => void;
  language: Language;
}

export function BottomNav({ currentTab, setTab, language }: BottomNavProps) {
  const ui = dictionary.ui;

  const tabs = [
    { id: 'sounds'  as const, label: ui.sounds[language],  icon: Volume2  },
    { id: 'music'   as const, label: ui.music[language],   icon: Music    },
    { id: 'games'   as const, label: ui.games[language],   icon: Puzzle   },
    { id: 'stories' as const, label: ui.stories[language], icon: BookOpen, soon: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 pb-safe pt-2 px-6 shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-between items-center pb-4">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              data-testid={`nav-tab-${tab.id}`}
              onClick={() => setTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-20 h-16 gap-1"
            >
              <div 
                className={cn(
                  "flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300",
                  isActive ? "bg-primary/20 text-primary" : "text-muted-foreground"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span 
                className={cn(
                  "text-xs font-bold transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
              {tab.soon && (
                <span className="absolute -top-1 -right-2 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {ui.soon[language]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
