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
  const [language, setLanguage] = useState<Language>('EN');
  const [currentTab, setCurrentTab] = useState<TabType>('sounds');
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
        <Header language={language} setLanguage={setLanguage} />
        
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'sounds' && <TabSounds language={language} />}
          {currentTab === 'music' && <TabMusic language={language} />}
          {currentTab === 'stories' && <TabStories language={language} setLanguage={setLanguage} />}
          {currentTab === 'games' && <TabGames language={language} />}
          {currentTab === 'about' && <TabAbout language={language} />}
        </main>

        <BottomNav currentTab={currentTab} setTab={setCurrentTab} language={language} />
        <NewsletterBar language={language} />
      </div>
    </TooltipProvider>
  );
}

export default App;
