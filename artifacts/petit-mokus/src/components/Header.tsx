import { Language, dictionary } from "../lib/i18n";
import { cn } from "../lib/utils";
import logoSrc from "@assets/petitmokus-logo-128_1777320029918.png";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function Header({ language, setLanguage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 py-4 px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <img src={logoSrc} alt="Petit Mokus" width={48} height={48} className="rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight leading-tight">Petit Mokus</h1>
            <p className="text-[11px] text-foreground/45 font-medium tracking-wide leading-none mt-0.5">Little Moments Matter</p>
          </div>
        </div>

        <p className="hidden md:block flex-1 text-sm text-foreground/55 font-medium leading-snug">
          {dictionary.ui.tagline[language]}
        </p>

        <div className="flex bg-muted rounded-full p-1 border border-border/50 shrink-0">
          {(['EN', 'FR', 'HU', 'DE'] as Language[]).map(lang => (
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
      </div>
    </header>
  );
}
