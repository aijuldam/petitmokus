import { Language } from "../lib/i18n";
import { cn } from "../lib/utils";
import logoSrc from "@assets/petitmokus-logo-128_1777320029918.png";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function Header({ language, setLanguage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 pb-4 pt-6 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={logoSrc} alt="Petit Mokus" width={48} height={48} className="rounded-full" />
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
