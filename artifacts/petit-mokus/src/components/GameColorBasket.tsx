import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Language, dictionary } from "../lib/i18n";
import { SuccessOverlay } from "./shared/SuccessOverlay";

interface GameColorBasketProps {
  language: Language;
}

type SortColor  = 'red' | 'blue' | 'yellow';
type SortShape  = 'circle' | 'square' | 'star';

interface SortObject {
  id: string;
  color: SortColor;
  shape: SortShape;
}

interface RoundConfig {
  colors: SortColor[];
  objectsPerColor: number;
}

const ROUND_CONFIGS: RoundConfig[] = [
  { colors: ['red', 'blue'],           objectsPerColor: 3 },
  { colors: ['red', 'blue', 'yellow'], objectsPerColor: 3 },
  { colors: ['red', 'blue', 'yellow'], objectsPerColor: 3 },
];

const TOTAL_ROUNDS = ROUND_CONFIGS.length;

const COLOR_HEX: Record<SortColor, string> = {
  red:    '#E85858',
  blue:   '#4A90D9',
  yellow: '#F0B82A',
};

const COLOR_STROKE: Record<SortColor, string> = {
  red:    '#C84040',
  blue:   '#3070B5',
  yellow: '#C8920A',
};

const LIGHT_BG: Record<SortColor, string> = {
  red:    '#FDECEA',
  blue:   '#E8F4FD',
  yellow: '#FEF9E7',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateObjects(config: RoundConfig): SortObject[] {
  const shapes: SortShape[] = ['circle', 'square', 'star'];
  const items: SortObject[] = [];
  config.colors.forEach(color => {
    shuffle([...shapes]).slice(0, config.objectsPerColor).forEach(shape => {
      items.push({
        id: `${color}-${shape}-${Math.random().toString(36).slice(2, 6)}`,
        color,
        shape,
      });
    });
  });
  return shuffle(items);
}

function ObjectSvg({ color, shape, size = 40 }: { color: SortColor; shape: SortShape; size?: number }) {
  const fill   = COLOR_HEX[color];
  const stroke = COLOR_STROKE[color];
  switch (shape) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill={fill} stroke={stroke} strokeWidth="2" />
          <ellipse cx="13" cy="13" rx="4.5" ry="3" fill="white" opacity="0.25" transform="rotate(-25 13 13)" />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <rect x="5" y="5" width="30" height="30" rx="7" fill={fill} stroke={stroke} strokeWidth="2" />
          <ellipse cx="12" cy="11" rx="4.5" ry="2.5" fill="white" opacity="0.22" transform="rotate(-15 12 11)" />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon
            points="20,3 24,14 37,14 27,22 31,34 20,27 9,34 13,22 3,14 16,14"
            fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round"
          />
          <ellipse cx="15" cy="12" rx="3.5" ry="2" fill="white" opacity="0.22" transform="rotate(-20 15 12)" />
        </svg>
      );
  }
}

function BasketSvg({ color, size = 56 }: { color: SortColor; size?: number }) {
  const fill   = COLOR_HEX[color];
  const light  = LIGHT_BG[color];
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 60 51">
      {/* handle */}
      <path d="M15,14 Q30,-4 45,14" fill="none" stroke={fill} strokeWidth="4" strokeLinecap="round" />
      {/* body */}
      <path d="M6,16 L4,50 L56,50 L54,16 Z" fill={light} stroke={fill} strokeWidth="3" strokeLinejoin="round" />
      {/* rim */}
      <rect x="4" y="14" width="52" height="8" rx="4" fill={fill} />
    </svg>
  );
}

export function GameColorBasket({ language }: GameColorBasketProps) {
  const ui = dictionary.ui;

  const [roundIdx, setRoundIdx]     = useState(0);
  const [objects, setObjects]       = useState<SortObject[]>(() => generateObjects(ROUND_CONFIGS[0]));
  const [sorted, setSorted]         = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wrongColor, setWrongColor] = useState<SortColor | null>(null);
  const [advancing, setAdvancing]   = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const config    = ROUND_CONFIGS[roundIdx];
  const selectedObj = objects.find(o => o.id === selectedId) ?? null;

  const handleObjectTap = useCallback((obj: SortObject) => {
    if (advancing || sorted.has(obj.id)) return;
    setSelectedId(prev => prev === obj.id ? null : obj.id);
  }, [advancing, sorted]);

  const handleBasketTap = useCallback((color: SortColor) => {
    if (advancing) return;
    if (!selectedId) {
      // No object selected — briefly pulse the basket as a hint
      setWrongColor(color);
      setTimeout(() => setWrongColor(null), 350);
      return;
    }
    const obj = objects.find(o => o.id === selectedId);
    if (!obj) return;

    if (obj.color === color) {
      const newSorted = new Set([...sorted, selectedId]);
      setSorted(newSorted);
      setSelectedId(null);

      if (newSorted.size === objects.length) {
        setAdvancing(true);
        setTimeout(() => {
          const nextIdx = roundIdx + 1;
          if (nextIdx >= TOTAL_ROUNDS) {
            setIsComplete(true);
          } else {
            setRoundIdx(nextIdx);
            setObjects(generateObjects(ROUND_CONFIGS[nextIdx]));
            setSorted(new Set());
            setSelectedId(null);
          }
          setAdvancing(false);
        }, 1000);
      }
    } else {
      setWrongColor(color);
      setTimeout(() => setWrongColor(null), 500);
    }
  }, [advancing, selectedId, objects, sorted, roundIdx]);

  const restart = () => {
    setRoundIdx(0);
    setIsComplete(false);
    setObjects(generateObjects(ROUND_CONFIGS[0]));
    setSorted(new Set());
    setSelectedId(null);
    setWrongColor(null);
    setAdvancing(false);
  };

  const sortedCount = sorted.size;
  const totalCount  = objects.length;

  return (
    <div className="flex flex-col items-center gap-4 pt-1 pb-4 w-full">

      {/* Instruction */}
      <p className="text-[11px] text-foreground/38 font-medium uppercase tracking-widest select-none text-center">
        {ui.gameColorBasketInstruction[language]}
      </p>

      {/* Baskets row */}
      <motion.div
        key={`baskets-${roundIdx}`}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`grid gap-2 w-full ${config.colors.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
      >
        {config.colors.map(color => {
          const sortedItems  = objects.filter(o => o.color === color && sorted.has(o.id));
          const totalForColor = objects.filter(o => o.color === color).length;
          const isWrong      = wrongColor === color;
          const isTarget     = selectedObj?.color === color;
          const isFull       = sortedItems.length === totalForColor;

          return (
            <motion.button
              key={color}
              onClick={() => handleBasketTap(color)}
              animate={
                isWrong  ? { x: [-7, 7, -5, 5, 0] } :
                isTarget ? { scale: [1, 1.04, 1]    } :
                isFull   ? { scale: [1, 1.06, 1]    } :
                {}
              }
              transition={
                isTarget ? { repeat: Infinity, duration: 1.3, ease: 'easeInOut' } :
                { duration: 0.35 }
              }
              className="rounded-[1.5rem] flex flex-col overflow-hidden min-h-[8.5rem] transition-shadow duration-200"
              style={{
                backgroundColor: LIGHT_BG[color],
                border: isTarget
                  ? `3px solid ${COLOR_HEX[color]}`
                  : isFull
                  ? `3px solid ${COLOR_HEX[color]}90`
                  : `2px solid ${COLOR_HEX[color]}50`,
                boxShadow: isTarget
                  ? `0 0 0 4px ${COLOR_HEX[color]}25, 0 4px 16px rgba(0,0,0,0.09)`
                  : '0 2px 10px rgba(0,0,0,0.06)',
              }}
            >
              {/* Basket icon + rim */}
              <div className="flex justify-center pt-2 pb-0">
                <BasketSvg color={color} size={48} />
              </div>

              {/* Sorted items inside */}
              <div className="flex flex-wrap gap-1 px-2 pb-1 pt-0.5 flex-1 items-start content-start min-h-[2.5rem]">
                {sortedItems.map(obj => (
                  <motion.div
                    key={obj.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    <ObjectSvg color={obj.color} shape={obj.shape} size={22} />
                  </motion.div>
                ))}
              </div>

              {/* Fill progress bar */}
              <div className="h-1.5 bg-white/40 mx-2 mb-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLOR_HEX[color] }}
                  animate={{ width: `${(sortedItems.length / totalForColor) * 100}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Tray divider */}
      <div className="w-full flex items-center gap-2 px-1">
        <div className="flex-1 border-t-2 border-dashed border-foreground/10" />
        <span className="text-xs text-foreground/22 font-medium select-none tabular-nums">
          {sortedCount}/{totalCount}
        </span>
        <div className="flex-1 border-t-2 border-dashed border-foreground/10" />
      </div>

      {/* Objects tray */}
      <motion.div
        key={`tray-${roundIdx}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-3 gap-2 w-full"
      >
        {objects.map(obj => {
          const isSorted   = sorted.has(obj.id);
          const isSelected = selectedId === obj.id;
          return (
            <motion.button
              key={obj.id}
              onClick={() => handleObjectTap(obj)}
              animate={{
                y:       isSorted ? 0      : isSelected ? -10  : 0,
                scale:   isSorted ? 0.6    : isSelected ? 1.08 : 1,
                opacity: isSorted ? 0      : 1,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              whileTap={!isSorted && !advancing ? { scale: 0.9 } : {}}
              className="h-[4.5rem] rounded-[1.25rem] flex items-center justify-center transition-colors duration-200"
              style={{
                backgroundColor: isSorted ? 'transparent'
                  : isSelected ? LIGHT_BG[obj.color] : '#FDFDFC',
                border: isSorted ? 'none'
                  : isSelected ? `3px solid ${COLOR_HEX[obj.color]}`
                  : '2px solid rgba(92,74,61,0.09)',
                boxShadow: isSorted ? 'none'
                  : isSelected
                  ? `0 0 0 5px ${COLOR_HEX[obj.color]}28, 0 6px 20px rgba(0,0,0,0.12)`
                  : '0 2px 10px rgba(0,0,0,0.06)',
                pointerEvents: isSorted ? 'none' : 'auto',
              }}
            >
              {!isSorted && <ObjectSvg color={obj.color} shape={obj.shape} size={42} />}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-1">
        {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i === roundIdx && !isComplete ? 1.3 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: i < roundIdx || isComplete
                ? '#D897A8'
                : 'rgba(92,74,61,0.12)',
            }}
          />
        ))}
      </div>

      {/* Completion overlay */}
      <SuccessOverlay
        show={isComplete}
        language={language}
        subtitle={`${TOTAL_ROUNDS} ${ui.gameOf[language]} ${TOTAL_ROUNDS} ${ui.gameMatched[language]}`}
        onPlayAgain={restart}
      />
    </div>
  );
}
