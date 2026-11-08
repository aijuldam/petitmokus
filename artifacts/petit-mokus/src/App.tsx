import { lazy, Suspense, useEffect, useState } from "react";
import { Header } from "./components/Header";
import { BottomNav, TabType } from "./components/BottomNav";
import { TabSounds } from "./components/TabSounds";
import { NewsletterBar } from "./components/NewsletterBar";
import { Language, loadLanguage } from "./lib/i18n";
import { TooltipProvider } from "@/components/ui/tooltip";
import { trackTabView } from "./lib/analytics";
import { stopAllAudio } from "./lib/audio";

// ── Code splitting ────────────────────────────────────────────────────────
// Sounds is the first tab and ships in the main bundle. The other tabs and the
// Studio load as separate chunks, fetched once the page is idle so that a tab
// switch is still instant.
const loadMusic = () => import("./components/TabMusic");
const loadStories = () => import("./components/TabStories");
const loadGames = () => import("./components/TabGames");
const loadAbout = () => import("./components/TabAbout");
const TabMusic = lazy(() => loadMusic().then((m) => ({ default: m.TabMusic })));
const TabStories = lazy(() => loadStories().then((m) => ({ default: m.TabStories })));
const TabGames = lazy(() => loadGames().then((m) => ({ default: m.TabGames })));
const TabAbout = lazy(() => loadAbout().then((m) => ({ default: m.TabAbout })));
const StudioApp = lazy(() => import("./components/Studio/StudioApp").then((m) => ({ default: m.StudioApp })));

function prefetchTabs() {
  const run = () => { loadMusic(); loadStories(); loadGames(); loadAbout(); };
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 2000);
}

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

/** Read the language from the URL path, e.g. /fr/kids/ → 'FR'. Falls back to 'EN'. */
export function getLanguageFromPath(): Language {
  const match = window.location.pathname.match(/^\/([a-z]{2,3})\/?/);
  if (match) return PATH_TO_LANGUAGE[match[1]] ?? 'EN';
  return 'EN';
}

/**
 * The home of Kids for a language: /<locale>/kids/ in every language, since
 * /<locale>/ is the Petit Mokus parent homepage (or leads to Kids where there
 * is none).
 */
function kidsPathForLanguage(lang: Language): string {
  return `/${LANGUAGE_TO_PATH[lang]}/kids/`;
}

/** Update the browser URL to reflect the active language without a page reload. */
function syncUrlToLanguage(lang: Language) {
  const target = kidsPathForLanguage(lang);
  if (!window.location.pathname.startsWith(target)) {
    window.history.pushState(null, '', target + window.location.hash);
  }
  // Keep the canonical link in step with the language actually shown.
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://petitmokus.com${target}`;
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

  // Sync URL on mount (covers direct navigation to /fr/kids/ etc.)
  useEffect(() => { syncUrlToLanguage(language); }, []);

  // Fetch the other tabs' code after the first paint, once the load event has passed.
  useEffect(() => {
    if (document.readyState === "complete") prefetchTabs();
    else window.addEventListener("load", prefetchTabs, { once: true });
  }, []);

  // No sound carries on after leaving Kids (NAV-6). pagehide, not unload, so
  // the back/forward cache keeps working.
  useEffect(() => {
    window.addEventListener("pagehide", stopAllAudio);
    return () => window.removeEventListener("pagehide", stopAllAudio);
  }, []);

  // The new language's strings are fetched before it is shown.
  const handleLanguageChange = (lang: Language) => {
    loadLanguage(lang).then(() => {
      setLanguage(lang);
      syncUrlToLanguage(lang);
    });
  };

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    trackTabView(tab);
  };
  const isStudio = useStudioMode();

  if (isStudio) {
    return (
      <TooltipProvider>
        <Suspense fallback={null}>
          <StudioApp />
        </Suspense>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-[100dvh] w-full bg-background font-sans flex flex-col relative overflow-hidden">
        <Header language={language} setLanguage={handleLanguageChange} />
        
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'sounds' && <TabSounds language={language} />}
          <Suspense fallback={null}>
            {currentTab === 'music' && <TabMusic language={language} />}
            {currentTab === 'stories' && <TabStories language={language} />}
            {currentTab === 'games' && <TabGames language={language} />}
            {currentTab === 'about' && <TabAbout language={language} />}
          </Suspense>
        </main>

        <BottomNav currentTab={currentTab} setTab={handleTabChange} language={language} />
        <NewsletterBar language={language} />
      </div>
    </TooltipProvider>
  );
}

export default App;
