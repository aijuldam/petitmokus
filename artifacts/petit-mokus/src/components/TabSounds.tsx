import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, dictionary } from "../lib/i18n";
import { cn } from "../lib/utils";
import { TabIntro } from "./TabIntro";
import { soundCategories, SoundItem } from "../lib/sounds-data";

interface TabSoundsProps {
  language: Language;
}

// ── Single sound card ─────────────────────────────────────────────────────────

function SoundCard({ item, language, isOpen, onTap, onInfo }: {
  item: SoundItem;
  language: Language;
  isOpen: boolean;
  onTap: () => void;
  onInfo: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.button
      data-testid={`sound-card-${item.id}`}
      whileTap={{ scale: 0.92 }}
      onClick={onTap}
      className="relative flex flex-col items-center p-4 bg-card rounded-[1.5rem] shadow-sm border border-card-border overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className={cn(
        "w-full aspect-square flex items-center justify-center rounded-[1rem] mb-3 overflow-hidden",
        item.color,
      )}>
        <img
          src={item.image}
          alt={item.getName(language)}
          className="w-full h-full object-cover"
          style={{ objectPosition: item.objectPosition ?? 'center' }}
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="font-bold text-lg text-foreground tracking-wide capitalize">
          {item.getName(language)}
        </span>
        {item.getFunFact && (
          <span
            role="button"
            aria-label="Fun fact"
            onClick={onInfo}
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors flex-shrink-0 cursor-pointer select-none",
              isOpen
                ? "bg-primary text-white"
                : "bg-foreground/10 text-foreground/50 hover:bg-primary/20 hover:text-primary",
            )}
          >
            i
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && item.getFunFact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => { e.stopPropagation(); onTap(); }}
            className="absolute inset-0 rounded-[1.5rem] flex items-center justify-center p-4"
            style={{ background: 'rgba(92, 74, 61, 0.82)' }}
          >
            <p className="text-white text-xs text-center leading-relaxed font-medium">
              {item.getFunFact(language)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Tab component ─────────────────────────────────────────────────────────────

export function TabSounds({ language }: TabSoundsProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(soundCategories[0].id);
  const [openFact, setOpenFact] = useState<string | null>(null);

  const activeCategory = soundCategories.find(c => c.id === activeCategoryId) ?? soundCategories[0];

  const handleCategoryChange = (id: string) => {
    setActiveCategoryId(id);
    setOpenFact(null);
  };

  return (
    <>
      <div className="px-6 pt-6 max-w-md mx-auto">
        <TabIntro
          emoji={activeCategory.emoji}
          title={dictionary.ui.soundsIntroTitle[language]}
          body={dictionary.ui.soundsIntroBody[language]}
        />

        {/* Category pill selector */}
        <div className="flex gap-2 mt-4 mb-1">
          {soundCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200",
                cat.id === activeCategoryId
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted/60 text-foreground/60 hover:bg-muted hover:text-foreground",
              )}
            >
              <span>{cat.emoji}</span>
              <span>{cat.getLabelKey(language)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-6 pb-36 pt-4 max-w-md mx-auto">
        {activeCategory.items.map((item) => {
          const isOpen = openFact === item.id;
          return (
            <SoundCard
              key={item.id}
              item={item}
              language={language}
              isOpen={isOpen}
              onTap={() => {
                if (isOpen) {
                  setOpenFact(null);
                } else {
                  item.playSound();
                }
              }}
              onInfo={(e) => {
                e.stopPropagation();
                setOpenFact(isOpen ? null : item.id);
              }}
            />
          );
        })}
      </div>
    </>
  );
}
