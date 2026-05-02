import { useState, useCallback, useEffect } from "react";
import { Language, dictionary } from "../lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { ShapeSvg, ShapeId } from "../lib/ShapeSvg";
import { GameFind } from "./GameFind";
import { GameColorHunt } from "./GameColorHunt";
import { GameShapeParking } from "./GameShapeParking";
import { GameColorBasket } from "./GameColorBasket";

interface TabGamesProps {
  language: Language;
}

type GameMode = 'colors' | 'find' | 'shapes' | 'colorhunt' | 'shapeparking' | 'colorbasket';
type AgeFilter = null | 1 | 2 | 3 | 5;

const GAME_MODES: { id: GameMode; minAge: number }[] = [
  { id: 'colors',    minAge: 1 },
  { id: 'find',      minAge: 1 },
  { id: 'shapes',    minAge: 1 },
  { id: 'colorhunt',    minAge: 2 },
  { id: 'shapeparking', minAge: 2 },
  { id: 'colorbasket',  minAge: 2 },
];

const AGE_OPTIONS: AgeFilter[] = [null, 1, 2, 3, 5];

const COLORS = [
  { id: 'pink',   hex: '#D897A8', EN: 'Pink',   FR: 'Rose',   HU: 'Rózsaszín' },
  { id: 'blue',   hex: '#B8CCE0', EN: 'Blue',   FR: 'Bleu',   HU: 'Kék'       },
  { id: 'green',  hex: '#A6C9B5', EN: 'Green',  FR: 'Vert',   HU: 'Zöld'      },
  { id: 'yellow', hex: '#E8C77A', EN: 'Yellow', FR: 'Jaune',  HU: 'Sárga'     },
];

const SHAPES: { id: ShapeId; hex: string }[] = [
  { id: 'circle',   hex: '#D897A8' },
  { id: 'square',   hex: '#B8CCE0' },
  { id: 'triangle', hex: '#A6C9B5' },
  { id: 'star',     hex: '#E8C77A' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getIds(m: GameMode) {
  return m === 'colors' ? COLORS.map(c => c.id) : SHAPES.map(s => s.id);
}

export function TabGames({ language }: TabGamesProps) {
  const ui = dictionary.ui;

  const [ageFilter, setAgeFilter] = useState<AgeFilter>(null);
  const [mode, setMode] = useState<GameMode>('colors');
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [targetOrder, setTargetOrder] = useState(() => shuffle(getIds('colors')));
  const [itemOrder, setItemOrder] = useState(() => shuffle(getIds('colors')));

  const visibleModes = ageFilter === null
    ? GAME_MODES
    : GAME_MODES.filter(m => m.minAge >= ageFilter);

  useEffect(() => {
    if (visibleModes.length > 0 && !visibleModes.find(m => m.id === mode)) {
      switchMode(visibleModes[0].id);
    }
  }, [ageFilter]);

  const reset = useCallback(() => {
    setSelected(null);
    setMatched(new Set());
    setWrong(null);
    setTargetOrder(shuffle(getIds(mode)));
    setItemOrder(shuffle(getIds(mode)));
  }, [mode]);

  const switchMode = (m: GameMode) => {
    setMode(m);
    setSelected(null);
    setMatched(new Set());
    setWrong(null);
    if (m !== 'find' && m !== 'colorhunt' && m !== 'shapeparking' && m !== 'colorbasket') {
      setTargetOrder(shuffle(getIds(m)));
      setItemOrder(shuffle(getIds(m)));
    }
  };

  const handleItemTap = (id: string) => {
    if (matched.has(id)) return;
    setSelected(prev => (prev === id ? null : id));
  };

  const handleTargetTap = (id: string) => {
    if (!selected) return;
    if (selected === id) {
      setMatched(prev => new Set(prev).add(id));
      setSelected(null);
    } else {
      setWrong(id);
      setTimeout(() => setWrong(null), 500);
      setSelected(null);
    }
  };

  const total = mode === 'colors' ? COLORS.length : SHAPES.length;
  const isComplete = mode !== 'find' && matched.size === total;

  const tip = mode === 'colors' ? ui.gameTipColor[language] : ui.gameTipShape[language];
  const instruction = mode === 'colors' ? ui.gameMatchColor[language] : ui.gameMatchShape[language];

  const modeLabel = (id: GameMode) => {
    if (id === 'colors')    return ui.gameColors[language];
    if (id === 'find')      return ui.gameFindLabel[language];
    if (id === 'colorhunt')    return ui.gameColorHuntLabel[language];
    if (id === 'shapeparking') return ui.gameShapeParkingLabel[language];
    if (id === 'colorbasket')  return ui.gameColorBasketLabel[language];
    return ui.gameShapes[language];
  };
  const modeMinAge = (id: GameMode) => GAME_MODES.find(m => m.id === id)!.minAge;

  return (
    <div className="px-4 pt-4 pb-36 max-w-md mx-auto">

      {/* Intro card */}
      <div className="mb-5 bg-accent/10 border border-accent/20 rounded-[1.25rem] p-4 flex gap-3 items-start">
        <span className="text-2xl shrink-0 mt-0.5">🧩</span>
        <div>
          <p className="font-bold text-foreground text-sm mb-1">{ui.gameHeaderTitle[language]}</p>
          <p className="text-xs text-foreground/60 leading-relaxed">{ui.gameHeaderBody[language]}</p>
        </div>
      </div>

      {/* Age filter */}
      <div className="mb-4">
        <p className="text-xs text-foreground/40 mb-2 font-medium tracking-wide uppercase">
          {language === 'FR' ? 'Filtrer par âge' : language === 'HU' ? 'Szűrés kor szerint' : 'Filter by age'}
        </p>
        <div className="flex gap-2 flex-wrap">
          {AGE_OPTIONS.map(age => {
            const isActive = ageFilter === age;
            const label = age === null ? ui.gameFilterAll[language] : `${age}+`;
            return (
              <button
                key={age ?? 'all'}
                onClick={() => setAgeFilter(age)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-muted text-muted-foreground border-transparent hover:border-primary/30 hover:text-foreground'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {ageFilter !== null && (
          <p className="text-[11px] text-foreground/38 mt-1.5 pl-0.5">
            {ui.gameFilterHelp[language].replace('age', `age ${ageFilter}`)}
          </p>
        )}
      </div>

      {/* Empty state */}
      {visibleModes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <span className="text-5xl mb-4">🌱</span>
          <p className="text-sm font-medium text-foreground/50">{ui.gameNoGames[language]}</p>
        </motion.div>
      ) : (
        <>
          {/* Mode switch — horizontally scrollable for many games */}
          <div className="flex gap-1 mb-5 bg-muted rounded-2xl p-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {visibleModes.map(({ id }) => (
              <button
                key={id}
                onClick={() => switchMode(id)}
                className={`flex-shrink-0 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                  mode === id
                    ? 'bg-card shadow text-primary'
                    : 'text-muted-foreground hover:text-foreground/70'
                }`}
              >
                {modeLabel(id)}
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  mode === id ? 'bg-primary/15 text-primary' : 'bg-foreground/8 text-foreground/40'
                }`}>
                  {modeMinAge(id)}+
                </span>
              </button>
            ))}
          </div>

          {/* Find Match game */}
          {mode === 'find' && <GameFind key="find" language={language} />}

          {/* Color Hunt game */}
          {mode === 'colorhunt' && <GameColorHunt key="colorhunt" language={language} />}

          {/* Shape Parking game */}
          {mode === 'shapeparking' && <GameShapeParking key="shapeparking" language={language} />}

          {/* Color Basket Sort game */}
          {mode === 'colorbasket' && <GameColorBasket key="colorbasket" language={language} />}

          {/* Color / Shape match games */}
          {mode !== 'find' && mode !== 'colorhunt' && mode !== 'shapeparking' && mode !== 'colorbasket' && (
            <>
              <p className="text-sm text-foreground/55 text-center mb-5">{instruction}</p>

              {/* Item pieces (top) */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {itemOrder.map(id => {
                  const isMatched = matched.has(id);
                  const isSelected = selected === id;

                  if (isMatched) return <div key={id} className="h-[4.5rem] rounded-[1.25rem] bg-muted/20" />;

                  if (mode === 'colors') {
                    const color = COLORS.find(c => c.id === id)!;
                    return (
                      <motion.button
                        key={id}
                        onClick={() => handleItemTap(id)}
                        whileTap={{ scale: 0.92 }}
                        animate={{ scale: isSelected ? 1.05 : 1 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                        className="h-[4.5rem] rounded-[1.25rem] flex items-center justify-center font-bold text-white text-sm drop-shadow transition-shadow duration-200"
                        style={{
                          backgroundColor: color.hex,
                          boxShadow: isSelected
                            ? '0 0 0 4px rgba(92,74,61,0.4), 0 4px 16px rgba(0,0,0,0.15)'
                            : '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                        aria-label={color[language]}
                        aria-pressed={isSelected}
                      >
                        {color[language]}
                      </motion.button>
                    );
                  } else {
                    const shape = SHAPES.find(s => s.id === id)!;
                    return (
                      <motion.button
                        key={id}
                        onClick={() => handleItemTap(id)}
                        whileTap={{ scale: 0.92 }}
                        animate={{ scale: isSelected ? 1.05 : 1 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                        className="h-[4.5rem] rounded-[1.25rem] bg-muted flex items-center justify-center transition-shadow duration-200"
                        style={{
                          boxShadow: isSelected
                            ? '0 0 0 4px rgba(92,74,61,0.4), 0 4px 16px rgba(0,0,0,0.15)'
                            : '0 2px 8px rgba(0,0,0,0.05)',
                        }}
                        aria-label={shape.id}
                        aria-pressed={isSelected}
                      >
                        <ShapeSvg id={shape.id} hex={shape.hex} size={44} />
                      </motion.button>
                    );
                  }
                })}
              </div>

              <p className="text-center text-foreground/25 text-xs mb-3 tracking-wide uppercase select-none">↓ match ↓</p>

              {/* Target slots (bottom) */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {targetOrder.map(id => {
                  const isMatched = matched.has(id);
                  const isWrong = wrong === id;

                  if (mode === 'colors') {
                    const color = COLORS.find(c => c.id === id)!;
                    return (
                      <motion.button
                        key={id}
                        onClick={() => handleTargetTap(id)}
                        animate={isWrong ? { x: [-7, 7, -5, 5, 0] } : { x: 0 }}
                        transition={{ duration: 0.35 }}
                        className="h-[4.5rem] rounded-[1.25rem] border-[3px] flex flex-col items-center justify-center gap-1 transition-all duration-300"
                        style={{
                          backgroundColor: isMatched ? color.hex : color.hex + '22',
                          borderStyle: 'solid',
                          borderColor: isWrong ? '#F87171' : color.hex,
                        }}
                        aria-label={color[language]}
                      >
                        {isMatched ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                            className="text-white text-xl font-bold drop-shadow"
                          >
                            ✓
                          </motion.span>
                        ) : (
                          <>
                            <div className="w-7 h-7 rounded-full shadow-sm" style={{ backgroundColor: color.hex }} />
                            <span className="text-[11px] font-bold leading-none" style={{ color: color.hex }}>
                              {color[language]}
                            </span>
                          </>
                        )}
                      </motion.button>
                    );
                  } else {
                    const shape = SHAPES.find(s => s.id === id)!;
                    return (
                      <motion.button
                        key={id}
                        onClick={() => handleTargetTap(id)}
                        animate={isWrong ? { x: [-7, 7, -5, 5, 0] } : { x: 0 }}
                        transition={{ duration: 0.35 }}
                        className="h-[4.5rem] rounded-[1.25rem] border-[3px] flex items-center justify-center bg-muted/30 transition-colors duration-200"
                        style={{
                          borderStyle: isMatched ? 'solid' : 'dashed',
                          borderColor: isWrong ? '#F87171' : isMatched ? shape.hex : 'rgba(92,74,61,0.18)',
                        }}
                        aria-label={shape.id}
                      >
                        {isMatched ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                          >
                            <ShapeSvg id={shape.id} hex={shape.hex} size={40} />
                          </motion.div>
                        ) : (
                          <ShapeSvg id={shape.id} hex={shape.hex} size={40} outline />
                        )}
                      </motion.button>
                    );
                  }
                })}
              </div>

              <div className="text-center mb-1">
                <span className="text-sm text-foreground/45">
                  {matched.size} {ui.gameOf[language]} {total} {ui.gameMatched[language]}
                </span>
              </div>
              <p className="text-xs text-foreground/38 italic text-center">{tip}</p>
            </>
          )}
        </>
      )}

      {/* Success overlay (color/shape match) */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm px-8"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 24 }}
              className="bg-card border border-card-border rounded-[2rem] p-8 text-center shadow-xl w-full max-w-sm"
            >
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{ui.gameBravo[language]}</h2>
              <p className="text-sm text-foreground/45 mb-7">
                {total} {ui.gameOf[language]} {total} {ui.gameMatched[language]}
              </p>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-7 rounded-full text-sm hover:bg-primary/90 active:scale-95 transition-all"
              >
                <RefreshCw size={15} />
                {ui.gamePlayAgain[language]}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
