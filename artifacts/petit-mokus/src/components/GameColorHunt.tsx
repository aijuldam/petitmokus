import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Language, dictionary } from "../lib/i18n";
import { SuccessOverlay } from "./shared/SuccessOverlay";

interface GameColorHuntProps {
  language: Language;
}

type HuntColor  = 'red' | 'yellow' | 'blue' | 'green';
type HuntItemId = 'heart' | 'apple' | 'strawberry' | 'sun' | 'star' | 'banana' | 'raindrop' | 'fish' | 'whale' | 'frog' | 'tree' | 'leaf';

interface HuntItem { id: HuntItemId; color: HuntColor }

const HUNT_COLORS: HuntColor[] = ['red', 'yellow', 'blue', 'green'];

const COLOR_HEX: Record<HuntColor, string> = {
  red:    '#E05050',
  yellow: '#D4A017',
  blue:   '#4A90D9',
  green:  '#5BAB85',
};

const COLOR_BG: Record<HuntColor, string> = {
  red:    '#FDECEA',
  yellow: '#FEFAE7',
  blue:   '#E8F4FD',
  green:  '#EAF5EF',
};

const PROMPTS_PREFIX: Record<Language, string> = {
  EN: 'Find something',
  FR: 'Trouve quelque chose de',
  HU: 'Keress valami',
  DE: 'Finde etwas',
};

const COLOR_WORD: Record<HuntColor, Record<Language, string>> = {
  red:    { EN: 'red',    FR: 'rouge', HU: 'pirosat', DE: 'Rotes'   },
  yellow: { EN: 'yellow', FR: 'jaune', HU: 'sárgát',  DE: 'Gelbes'  },
  blue:   { EN: 'blue',   FR: 'bleu',  HU: 'kéket',   DE: 'Blaues'  },
  green:  { EN: 'green',  FR: 'vert',  HU: 'zöldet',  DE: 'Grünes'  },
};

const HUNT_ITEMS: Record<HuntColor, HuntItem[]> = {
  red:    [{ id: 'heart', color: 'red' },      { id: 'apple', color: 'red' },       { id: 'strawberry', color: 'red'    }],
  yellow: [{ id: 'sun',   color: 'yellow' },   { id: 'star',  color: 'yellow' },    { id: 'banana',     color: 'yellow' }],
  blue:   [{ id: 'raindrop', color: 'blue' },  { id: 'fish',  color: 'blue' },      { id: 'whale',      color: 'blue'   }],
  green:  [{ id: 'frog',  color: 'green' },    { id: 'tree',  color: 'green' },     { id: 'leaf',       color: 'green'  }],
};

const TOTAL_ROUNDS = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound(prevColor?: HuntColor) {
  const pool = prevColor ? HUNT_COLORS.filter(c => c !== prevColor) : HUNT_COLORS;
  const targetColor = pool[Math.floor(Math.random() * pool.length)];
  const target = shuffle(HUNT_ITEMS[targetColor])[0];
  const distractors = HUNT_COLORS.filter(c => c !== targetColor).map(c => shuffle(HUNT_ITEMS[c])[0]);
  return { targetColor, target, options: shuffle([target, ...distractors]) };
}

function HuntItemSvg({ id, size = 72 }: { id: HuntItemId; size?: number }) {
  switch (id) {

    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M24,38 C24,38 5,26 5,15 C5,9 10,5 17,5 C20.5,5 23,7 24,9 C25,7 27.5,5 31,5 C38,5 43,9 43,15 C43,26 24,38 24,38 Z" fill="#E8675A" stroke="#C05A3A" strokeWidth="2.5" strokeLinejoin="round"/>
          <ellipse cx="18" cy="15" rx="4" ry="6" fill="white" opacity="0.2" transform="rotate(-25 18 15)"/>
        </svg>
      );

    case 'apple':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <circle cx="24" cy="30" r="17" fill="#E8675A" stroke="#C05A3A" strokeWidth="2.5"/>
          <path d="M24 13 L22 18" stroke="#8B6F47" strokeWidth="3" strokeLinecap="round"/>
          <path d="M22 16 Q16 10 13 14 Q18 17 22 16" fill="#A6C9B5" stroke="#7EB09A" strokeWidth="1.5" strokeLinejoin="round"/>
          <ellipse cx="18" cy="24" rx="3" ry="5" fill="white" opacity="0.18" transform="rotate(-15 18 24)"/>
        </svg>
      );

    case 'strawberry':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M24,42 C14,36 7,26 9,16 C11,8 18,7 24,9 C30,7 37,8 39,16 C41,26 34,36 24,42 Z" fill="#E8675A" stroke="#C05A3A" strokeWidth="2.5"/>
          <circle cx="18" cy="22" r="1.8" fill="white" opacity="0.75"/>
          <circle cx="25" cy="27" r="1.8" fill="white" opacity="0.75"/>
          <circle cx="30" cy="21" r="1.8" fill="white" opacity="0.75"/>
          <circle cx="21" cy="33" r="1.8" fill="white" opacity="0.75"/>
          <path d="M24,9 C20,4 13,5 13,10" fill="none" stroke="#A6C9B5" strokeWidth="3" strokeLinecap="round"/>
          <path d="M24,9 Q24,3 24,3" fill="none" stroke="#A6C9B5" strokeWidth="3" strokeLinecap="round"/>
          <path d="M24,9 C28,4 35,5 35,10" fill="none" stroke="#A6C9B5" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      );

    case 'sun':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="13" fill="#F9C240" stroke="#D4A017" strokeWidth="2.5"/>
          {[0,45,90,135,180,225,270,315].map(deg => {
            const r1 = 15, r2 = 20;
            const rad = (deg * Math.PI) / 180;
            return (
              <line key={deg}
                x1={24 + r1 * Math.cos(rad)} y1={24 + r1 * Math.sin(rad)}
                x2={24 + r2 * Math.cos(rad)} y2={24 + r2 * Math.sin(rad)}
                stroke="#D4A017" strokeWidth="3" strokeLinecap="round"
              />
            );
          })}
          <ellipse cx="19" cy="19" rx="3.5" ry="2.5" fill="white" opacity="0.3" transform="rotate(-30 19 19)"/>
        </svg>
      );

    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <polygon points="24,5 29,18 44,18 32,28 37,42 24,33 11,42 16,28 4,18 19,18" fill="#F9C240" stroke="#D4A017" strokeWidth="2.5" strokeLinejoin="round"/>
          <ellipse cx="19" cy="17" rx="3" ry="2" fill="white" opacity="0.3" transform="rotate(-20 19 17)"/>
        </svg>
      );

    case 'banana':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M 9 41 C 5 24 16 7 30 6 C 42 5 47 17 41 27" fill="none" stroke="#C8900A" strokeWidth="11" strokeLinecap="round"/>
          <path d="M 9 41 C 5 24 16 7 30 6 C 42 5 47 17 41 27" fill="none" stroke="#F9C240" strokeWidth="8"  strokeLinecap="round"/>
          <path d="M 9 41 C 5 24 16 7 30 6 C 42 5 47 17 41 27" fill="none" stroke="#FDE88A" strokeWidth="3"  strokeLinecap="round" opacity="0.6"/>
        </svg>
      );

    case 'raindrop':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M24,4 C24,4 7,24 7,33 C7,41 15,46 24,46 C33,46 41,41 41,33 C41,24 24,4 24,4 Z" fill="#5B9BD5" stroke="#3D7FC5" strokeWidth="2.5"/>
          <ellipse cx="18" cy="30" rx="3" ry="6" fill="white" opacity="0.25" transform="rotate(-15 18 30)"/>
        </svg>
      );

    case 'fish':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M36,24 L44,16 L44,32 Z" fill="#5B9BD5" stroke="#3D7FC5" strokeWidth="2"/>
          <ellipse cx="21" cy="24" rx="18" ry="12" fill="#5B9BD5" stroke="#3D7FC5" strokeWidth="2.5"/>
          <circle cx="11" cy="19" r="3" fill="white"/>
          <circle cx="11" cy="19" r="1.5" fill="#1A1A2E"/>
          <circle cx="10" cy="18" r="0.8" fill="white" opacity="0.8"/>
          <path d="M22,12 Q28,7 32,15" fill="none" stroke="#3D7FC5" strokeWidth="2" strokeLinecap="round"/>
          <ellipse cx="28" cy="28" rx="6" ry="3" fill="white" opacity="0.15"/>
        </svg>
      );

    case 'whale':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <ellipse cx="21" cy="28" rx="18" ry="12" fill="#5B9BD5" stroke="#3D7FC5" strokeWidth="2.5"/>
          <path d="M37,24 L45,16 L45,34 L37,30 Z" fill="#5B9BD5" stroke="#3D7FC5" strokeWidth="2.5" strokeLinejoin="round"/>
          <circle cx="12" cy="24" r="2.5" fill="white" stroke="#3D7FC5" strokeWidth="1"/>
          <circle cx="12" cy="24" r="1.2" fill="#1A1A2E"/>
          <circle cx="11" cy="23" r="0.6" fill="white" opacity="0.8"/>
          <ellipse cx="26" cy="32" rx="8" ry="4" fill="white" opacity="0.15"/>
          <path d="M20,16 Q22,10 24,8 Q26,10 22,16" fill="none" stroke="#7FC0E8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
        </svg>
      );

    case 'frog':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <ellipse cx="24" cy="33" rx="18" ry="12" fill="#7BBF90" stroke="#5A9B70" strokeWidth="2.5"/>
          <circle cx="14" cy="19" r="9" fill="#7BBF90" stroke="#5A9B70" strokeWidth="2.5"/>
          <circle cx="34" cy="19" r="9" fill="#7BBF90" stroke="#5A9B70" strokeWidth="2.5"/>
          <circle cx="14" cy="19" r="4" fill="#1A2E1A"/>
          <circle cx="34" cy="19" r="4" fill="#1A2E1A"/>
          <circle cx="15.5" cy="17.5" r="1.5" fill="white" opacity="0.85"/>
          <circle cx="35.5" cy="17.5" r="1.5" fill="white" opacity="0.85"/>
          <path d="M17,38 Q24,44 31,38" fill="none" stroke="#5A9B70" strokeWidth="2.5" strokeLinecap="round"/>
          <ellipse cx="24" cy="33" rx="10" ry="5" fill="white" opacity="0.15"/>
        </svg>
      );

    case 'tree':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="19" y="38" width="10" height="8" rx="2" fill="#8B6F47" stroke="#6B4F27" strokeWidth="1.5"/>
          <polygon points="24,20 40,38 8,38" fill="#7BBF90" stroke="#5A9B70" strokeWidth="2.5" strokeLinejoin="round"/>
          <polygon points="24,6 38,24 10,24" fill="#5A9B70" stroke="#3D7D55" strokeWidth="2.5" strokeLinejoin="round"/>
          <ellipse cx="19" cy="16" rx="3" ry="2" fill="white" opacity="0.2" transform="rotate(-20 19 16)"/>
        </svg>
      );

    case 'leaf':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M24,44 C14,38 8,28 10,18 C12,8 18,4 24,4 C30,4 36,8 38,18 C40,28 34,38 24,44 Z" fill="#7BBF90" stroke="#5A9B70" strokeWidth="2.5"/>
          <line x1="24" y1="44" x2="24" y2="8"  stroke="#5A9B70" strokeWidth="2"   opacity="0.5"/>
          <line x1="24" y1="20" x2="15" y2="28" stroke="#5A9B70" strokeWidth="1.5" opacity="0.45"/>
          <line x1="24" y1="28" x2="33" y2="36" stroke="#5A9B70" strokeWidth="1.5" opacity="0.45"/>
          <line x1="24" y1="14" x2="33" y2="22" stroke="#5A9B70" strokeWidth="1.5" opacity="0.45"/>
          <line x1="24" y1="14" x2="15" y2="22" stroke="#5A9B70" strokeWidth="1.5" opacity="0.45"/>
        </svg>
      );

    default:
      return null;
  }
}

export function GameColorHunt({ language }: GameColorHuntProps) {
  const ui = dictionary.ui;

  const [round, setRound]           = useState(() => generateRound());
  const [correctId, setCorrectId]   = useState<HuntItemId | null>(null);
  const [wrongId, setWrongId]       = useState<HuntItemId | null>(null);
  const [advancing, setAdvancing]   = useState(false);
  const [roundsDone, setRoundsDone] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleTap = useCallback((item: HuntItem) => {
    if (advancing || correctId) return;

    if (item.color === round.targetColor) {
      setCorrectId(item.id);
      setAdvancing(true);
      setTimeout(() => {
        const next = roundsDone + 1;
        if (next >= TOTAL_ROUNDS) {
          setIsComplete(true);
        } else {
          setRoundsDone(next);
          setRound(generateRound(round.targetColor));
        }
        setCorrectId(null);
        setAdvancing(false);
      }, 850);
    } else {
      setWrongId(item.id);
      setTimeout(() => setWrongId(null), 500);
    }
  }, [advancing, correctId, round, roundsDone]);

  const restart = () => {
    setRoundsDone(0);
    setIsComplete(false);
    setCorrectId(null);
    setWrongId(null);
    setAdvancing(false);
    setRound(generateRound());
  };

  const { targetColor, options } = round;
  const accentHex = COLOR_HEX[targetColor];

  return (
    <div className="flex flex-col items-center gap-5 pt-2 pb-4 w-full">

      {/* Color prompt */}
      <motion.div
        key={targetColor}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full rounded-[1.5rem] border p-5 text-center shadow-sm"
        style={{ backgroundColor: COLOR_BG[targetColor], borderColor: accentHex + '40' }}
      >
        <p className="text-xs text-foreground/45 font-medium uppercase tracking-widest mb-2">
          {PROMPTS_PREFIX[language]}
        </p>
        <div className="flex items-center justify-center gap-3">
          <div className="w-9 h-9 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: accentHex }} />
          <p className="text-3xl font-extrabold tracking-tight" style={{ color: accentHex }}>
            {COLOR_WORD[targetColor][language]}
          </p>
        </div>
      </motion.div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {options.map(item => {
          const isCorrect = correctId === item.id;
          const isWrong   = wrongId   === item.id;
          return (
            <motion.button
              key={item.id + '-' + targetColor}
              onClick={() => handleTap(item)}
              animate={
                isWrong   ? { x: [-7, 7, -5, 5, 0] } :
                isCorrect ? { scale: [1, 1.12, 1.04, 1] } :
                { x: 0, scale: 1 }
              }
              whileTap={!advancing ? { scale: 0.91 } : {}}
              transition={{ duration: isWrong ? 0.35 : 0.5 }}
              className="h-[7.5rem] rounded-[1.5rem] flex items-center justify-center transition-all duration-200"
              style={{
                backgroundColor: isCorrect
                  ? COLOR_BG[item.color]
                  : '#FDFDFC',
                border: isCorrect
                  ? `3px solid ${COLOR_HEX[item.color]}`
                  : isWrong
                  ? '3px solid #F87171'
                  : '2px solid rgba(92,74,61,0.09)',
                boxShadow: isCorrect
                  ? `0 0 0 6px ${COLOR_HEX[item.color]}28, 0 4px 20px rgba(0,0,0,0.10)`
                  : '0 2px 12px rgba(0,0,0,0.06)',
              }}
              aria-label={item.id}
            >
              <HuntItemSvg id={item.id} size={76} />
            </motion.button>
          );
        })}
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i === roundsDone && !isComplete ? 1.3 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: i < roundsDone || isComplete
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
