import { useState, useCallback } from "react";
import { Language, dictionary } from "../lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface TabGamesProps {
  language: Language;
}

type GameMode = 'colors' | 'shapes';
type ShapeId = 'circle' | 'square' | 'triangle' | 'star';

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

function ShapeSvg({
  id, hex, size = 44, outline = false,
}: {
  id: ShapeId; hex: string; size?: number; outline?: boolean;
}) {
  const fill = outline ? 'none' : hex;
  const stroke = outline ? hex : 'none';
  const sw = outline ? 3.5 : 0;
  const props = { fill, stroke, strokeWidth: sw };

  switch (id) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" {...props} />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="4" y="4" width="40" height="40" rx="9" {...props} />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <polygon points="24,5 45,43 3,43" strokeLinejoin="round" {...props} />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <polygon
            points="24,4 29,18 44,18 32,28 37,42 24,33 11,42 16,28 4,18 19,18"
            strokeLinejoin="round"
            {...props}
          />
        </svg>
      );
    default:
      return null;
  }
}

export function TabGames({ language }: TabGamesProps) {
  const ui = dictionary.ui;

  const [mode, setMode] = useState<GameMode>('colors');
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [targetOrder, setTargetOrder] = useState(() => shuffle(getIds('colors')));
  const [itemOrder, setItemOrder] = useState(() => shuffle(getIds('colors')));

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
    setTargetOrder(shuffle(getIds(m)));
    setItemOrder(shuffle(getIds(m)));
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
  const isComplete = matched.size === total;

  const tip = mode === 'colors' ? ui.gameTipColor[language] : ui.gameTipShape[language];
  const instruction = mode === 'colors' ? ui.gameMatchColor[language] : ui.gameMatchShape[language];

  return (
    <div className="px-4 pt-4 pb-36 max-w-md mx-auto">

      {/* Info header card */}
      <div className="mb-5 bg-accent/10 border border-accent/20 rounded-[1.25rem] p-4 flex gap-3 items-start">
        <span className="text-2xl shrink-0 mt-0.5">🧩</span>
        <div>
          <p className="font-bold text-foreground text-sm mb-1">
            {ui.gameHeaderTitle[language]}
          </p>
          <p className="text-xs text-foreground/60 leading-relaxed">
            {ui.gameHeaderBody[language]}
          </p>
        </div>
      </div>

      {/* Mode switch */}
      <div className="flex gap-1 mb-5 bg-muted rounded-full p-1">
        {(['colors', 'shapes'] as GameMode[]).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
              mode === m
                ? 'bg-card shadow text-primary'
                : 'text-muted-foreground hover:text-foreground/70'
            }`}
          >
            {m === 'colors' ? ui.gameColors[language] : ui.gameShapes[language]}
          </button>
        ))}
      </div>

      {/* Instruction */}
      <p className="text-sm text-foreground/55 text-center mb-5">{instruction}</p>

      {/* Item pieces (top) */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {itemOrder.map(id => {
          const isMatched = matched.has(id);
          const isSelected = selected === id;

          if (isMatched) {
            return <div key={id} className="h-[4.5rem] rounded-[1.25rem] bg-muted/20" />;
          }

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

      {/* Divider hint */}
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
                    <div
                      className="w-7 h-7 rounded-full shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span
                      className="text-[11px] font-bold leading-none"
                      style={{ color: color.hex }}
                    >
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
                {isMatched
                  ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      <ShapeSvg id={shape.id} hex={shape.hex} size={40} />
                    </motion.div>
                  )
                  : <ShapeSvg id={shape.id} hex={shape.hex} size={40} outline />
                }
              </motion.button>
            );
          }
        })}
      </div>

      {/* Progress */}
      <div className="text-center mb-1">
        <span className="text-sm text-foreground/45">
          {matched.size} {ui.gameOf[language]} {total} {ui.gameMatched[language]}
        </span>
      </div>

      {/* Caregiver tip */}
      <p className="text-xs text-foreground/38 italic text-center">{tip}</p>

      {/* Success overlay */}
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
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {ui.gameBravo[language]}
              </h2>
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
