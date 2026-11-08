import { Language, dictionary } from "../lib/i18n";
import { LanguageSelector } from "./LanguageSelector";
import { SuiteSwitcher } from "./SuiteSwitcher";
import { stopAllAudio } from "../lib/audio";
import { suiteCopy, suiteHomeHref } from "../lib/suite";
import logoSrc from "@assets/petitmokus-logo-128_1777320029918.png";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function Header({ language, setLanguage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 py-4 px-6 max-[359px]:px-4">
      <div className="flex items-center justify-between gap-4 max-[359px]:gap-2">
        <div className="flex items-center gap-3 shrink-0 max-[359px]:gap-2">
          {/* The homepage, same tab, one normal tap (NAV-6: no parent gate).
              The header sits outside the play area. */}
          <a
            href={suiteHomeHref(language)}
            aria-label={suiteCopy(language).home}
            onClick={stopAllAudio}
            className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img src={logoSrc} alt="" width={48} height={48} className="rounded-full" />
          </a>
          <div>
            <h1 className="text-2xl max-[359px]:text-lg font-bold text-foreground tracking-tight leading-tight">Petit Mokus</h1>
            <p className="text-[11px] text-foreground/45 font-medium tracking-wide leading-none mt-0.5">Little Moments Matter</p>
          </div>
        </div>

        <p className="hidden md:block flex-1 text-sm text-foreground/55 font-medium leading-snug">
          {dictionary.ui.tagline[language]}
        </p>

        <div className="flex shrink-0 items-center gap-1 max-[359px]:gap-0">
          <SuiteSwitcher language={language} />
          <LanguageSelector language={language} setLanguage={setLanguage} />
        </div>
      </div>
    </header>
  );
}
