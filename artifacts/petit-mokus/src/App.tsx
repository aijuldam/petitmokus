import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { BottomNav, TabType } from "./components/BottomNav";
import { TabSounds } from "./components/TabSounds";
import { TabMusic } from "./components/TabMusic";
import { TabStories } from "./components/TabStories";
import { TabGames } from "./components/TabGames";
import { TabAbout } from "./components/TabAbout";
import { NewsletterBar } from "./components/NewsletterBar";
import { StudioApp } from "./components/Studio/StudioApp";
import { Language } from "./lib/i18n";
import { TooltipProvider } from "@/components/ui/tooltip";
import { trackTabView } from "./lib/analytics";

// ── Language ↔ URL path mapping ───────────────────────────────────────────
const PATH_TO_LANGUAGE: Record<string, Language> = {
  en: 'EN', fr: 'FR', hu: 'HU', de: 'DE', es: 'ES', pt: 'PT',
  it: 'IT', nl: 'NL', da: 'DA', sv: 'SV', nb: 'NB', is: 'IS',
  ga: 'GA', pl: 'PL', cs: 'CS', sk: 'SK', ro: 'RO', hr: 'HR',
  sr: 'SR', sl: 'SL', bs: 'BS', mk: 'MK', sq: 'SQ', bg: 'BG',
  et: 'ET', lv: 'LV', lt: 'LT', el: 'EL', mt: 'MT', me: 'ME',
};
const LANGUAGE_TO_PATH: Record<Language, string> = Object.fromEntries(
  Object.entries(PATH_TO_LANGUAGE).map(([path, lang]) => [lang, path])
) as Record<Language, string>;

/** Read the language from the URL path, e.g. /fr/ → 'FR'. Falls back to 'EN'. */
function getLanguageFromPath(): Language {
  const match = window.location.pathname.match(/^\/([a-z]{2,3})\/?/);
  if (match) return PATH_TO_LANGUAGE[match[1]] ?? 'EN';
  return 'EN';
}

/** Update the browser URL to reflect the active language without a page reload. */
function syncUrlToLanguage(lang: Language) {
  const code = LANGUAGE_TO_PATH[lang];
  const target = `/${code}/`;
  if (!window.location.pathname.startsWith(target)) {
    window.history.pushState(null, '', target);
    // Update canonical link tag
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `https://petitmokus.com${target}`;
  }
}

function useStudioMode(): boolean {
  const [isStudio, setIsStudio] = useState(
    () => typeof window !== "undefined" && window.location.hash === "#studio",
  );
  useEffect(() => {
    function check() {
      setIsStudio(window.location.hash === "#studio");
    }
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);
  return isStudio;
}

function App() {
  const [language, setLanguage] = useState<Language>(getLanguageFromPath);
  const [currentTab, setCurrentTab] = useState<TabType>('sounds');

  // Sync URL on mount (covers direct navigation to /fr/ etc.)
  useEffect(() => { syncUrlToLanguage(language); }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    syncUrlToLanguage(lang);
  };

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    trackTabView(tab);
  };
  const isStudio = useStudioMode();

  if (isStudio) {
    return (
      <TooltipProvider>
        <StudioApp />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-[100dvh] w-full bg-background font-sans flex flex-col relative overflow-hidden">
        <Header language={language} setLanguage={handleLanguageChange} />
        
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'sounds' && <TabSounds language={language} />}
          {currentTab === 'music' && <TabMusic language={language} />}
          {currentTab === 'stories' && <TabStories language={language} />}
          {currentTab === 'games' && <TabGames language={language} />}
          {currentTab === 'about' && <TabAbout language={language} />}
        </main>

        <BottomNav currentTab={currentTab} setTab={handleTabChange} language={language} />
        <NewsletterBar language={language} />
      </div>
    </TooltipProvider>
  );
}

export default App;
