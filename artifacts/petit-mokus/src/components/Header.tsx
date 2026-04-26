import { Language } from "../lib/i18n";
import { cn } from "../lib/utils";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function Header({ language, setLanguage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 pb-4 pt-6 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
            <path d="M75 55C85 45 85 25 70 20C65 15 50 25 50 35C45 30 35 25 25 30C15 35 15 50 20 60C10 70 20 90 35 85C40 85 45 80 50 75C55 80 65 90 75 85C85 80 85 65 75 55Z" fill="currentColor" opacity="0.8"/>
            <circle cx="35" cy="45" r="3" fill="#6B4E41"/>
            <circle cx="65" cy="45" r="3" fill="#6B4E41"/>
            <path d="M48 55Q50 58 52 55" stroke="#6B4E41" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Petit Mokus</h1>
      </div>
      
      <div className="flex bg-muted rounded-full p-1 border border-border/50">
        {(['EN', 'FR', 'HU'] as Language[]).map(lang => (
          <button
            key={lang}
            data-testid={`lang-toggle-${lang}`}
            onClick={() => setLanguage(lang)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-300",
              language === lang 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {lang}
          </button>
        ))}
      </div>
    </header>
  );
}
