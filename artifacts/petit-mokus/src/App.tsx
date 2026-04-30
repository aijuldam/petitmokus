import { useState } from "react";
import { Header } from "./components/Header";
import { BottomNav, TabType } from "./components/BottomNav";
import { TabSounds } from "./components/TabSounds";
import { TabMusic } from "./components/TabMusic";
import { TabStories } from "./components/TabStories";
import { TabGames } from "./components/TabGames";
import { Language } from "./lib/i18n";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const [language, setLanguage] = useState<Language>('EN');
  const [currentTab, setCurrentTab] = useState<TabType>('sounds');

  return (
    <TooltipProvider>
      <div className="min-h-[100dvh] w-full bg-background font-sans flex flex-col relative overflow-hidden">
        <Header language={language} setLanguage={setLanguage} />
        
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'sounds' && <TabSounds language={language} />}
          {currentTab === 'music' && <TabMusic language={language} />}
          {currentTab === 'stories' && <TabStories language={language} />}
          {currentTab === 'games' && <TabGames language={language} />}
        </main>

        <BottomNav currentTab={currentTab} setTab={setCurrentTab} language={language} />
      </div>
    </TooltipProvider>
  );
}

export default App;
