import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Language, dictionary } from "../lib/i18n";
import { SuccessOverlay } from "./shared/SuccessOverlay";

interface GameFindProps {
  language: Language;
}

type ItemId = 'ball' | 'duck' | 'car' | 'banana' | 'cup' | 'apple';

interface GameItem {
  id: ItemId;
  bgColor: string;
}

const ALL_ITEMS: GameItem[] = [
  { id: 'ball',   bgColor: '#FDECEA' },
  { id: 'duck',   bgColor: '#FEF9E7' },
  { id: 'car',    bgColor: '#E8F8F7' },
  { id: 'banana', bgColor: '#FEFAE7' },
  { id: 'cup',    bgColor: '#FCF0F3' },
  { id: 'apple',  bgColor: '#EAF5EF' },
];

const TOTAL_ROUNDS = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound(prevTargetId?: ItemId) {
  const targetPool = prevTargetId
    ? ALL_ITEMS.filter(i => i.id !== prevTargetId)
    : ALL_ITEMS;
  const target = targetPool[Math.floor(Math.random() * targetPool.length)];
  const distractors = shuffle(ALL_ITEMS.filter(i => i.id !== target.id)).slice(0, 2);
  const options = shuffle([target, ...distractors]);
  return { target, options };
}

function ObjectSvg({ id, size = 48 }: { id: ItemId; size?: number }) {
  switch (id) {
    case 'ball':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" aria-label="ball">
          <circle cx="24" cy="24" r="21" fill="#E8675A" stroke="#C05A3A" strokeWidth="2.5" />
          <path d="M 5 16 Q 15 4 24 16 Q 33 28 43 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
          <path d="M 5 32 Q 15 44 24 32 Q 33 20 43 32" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
          <ellipse cx="16" cy="14" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 16 14)" />
        </svg>
      );

    case 'duck':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" aria-label="duck">
          <ellipse cx="20" cy="33" rx="16" ry="11" fill="#F5C842" stroke="#D4A017" strokeWidth="2.5" />
          <circle cx="34" cy="20" r="11" fill="#F5C842" stroke="#D4A017" strokeWidth="2.5" />
          <polygon points="43,19 47,22 43,26" fill="#F39C12" />
          <circle cx="37" cy="16" r="2" fill="#2C3E50" />
          <ellipse cx="37" cy="15.2" rx="0.8" ry="0.6" fill="white" opacity="0.7" />
          <path d="M 8 32 Q 14 26 20 32" fill="none" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'car':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" aria-label="car">
          <rect x="2" y="24" width="44" height="14" rx="4" fill="#4ECDC4" stroke="#2BBBAD" strokeWidth="2.5" />
          <polygon points="10,24 16,12 36,12 42,24" fill="#4ECDC4" stroke="#2BBBAD" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="17" y="13" width="14" height="10" rx="2.5" fill="#B8D8E8" stroke="#2BBBAD" strokeWidth="1.5" />
          <circle cx="12" cy="38" r="6" fill="#5C4A3D" stroke="#3D2E20" strokeWidth="1.5" />
          <circle cx="36" cy="38" r="6" fill="#5C4A3D" stroke="#3D2E20" strokeWidth="1.5" />
          <circle cx="12" cy="38" r="2.2" fill="#999" />
          <circle cx="36" cy="38" r="2.2" fill="#999" />
        </svg>
      );

    case 'banana':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" aria-label="banana">
          {/* Brown stem at the top */}
          <path
            d="M 21 5 L 21 11 L 26 11 L 26 5 Z"
            fill="#6B4A2B"
            stroke="#3F2A18"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          {/* Filled crescent body — fat in the middle, tapered ends */}
          <path
            d="M 21 10
               C 34 9 43 18 41 30
               C 40 38 33 43 26 42
               C 22 41 23 37 26 34
               C 21 30 14 22 13 16
               C 12 12 16 9 21 10 Z"
            fill="#F9C240"
            stroke="#B07F0E"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Darker brown tip at the bottom of the curve */}
          <path
            d="M 25 39 C 25 41.5 28 42.5 30.5 41.5 L 28 38 Z"
            fill="#7A5230"
          />
          {/* Inner highlight stripe to read as a ripe banana */}
          <path
            d="M 24 14 C 32 16 38 24 36 32"
            fill="none"
            stroke="#FFE49A"
            strokeWidth="2.3"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      );

    case 'cup':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" aria-label="cup">
          <rect x="8" y="16" width="28" height="26" rx="5" fill="#D897A8" stroke="#B8728A" strokeWidth="2.5" />
          <rect x="6" y="12" width="32" height="6" rx="3" fill="#C07090" />
          <path d="M 36 22 Q 46 22 46 29 Q 46 36 36 36" fill="none" stroke="#B8728A" strokeWidth="3" strokeLinecap="round" />
          <path d="M 14 24 Q 22 30 30 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </svg>
      );

    case 'apple':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" aria-label="apple">
          <circle cx="24" cy="30" r="17" fill="#A6C9B5" stroke="#7EB09A" strokeWidth="2.5" />
          <path d="M 24 13 L 22 18" stroke="#8B6F47" strokeWidth="3" strokeLinecap="round" />
          <path d="M 22 16 Q 16 10 13 14 Q 18 17 22 16" fill="#A6C9B5" stroke="#7EB09A" strokeWidth="1.5" strokeLinejoin="round" />
          <ellipse cx="18" cy="24" rx="3" ry="5" fill="white" opacity="0.22" transform="rotate(-15 18 24)" />
          <path d="M 24 13 Q 24 11 24 13" fill="none" />
        </svg>
      );

    default:
      return null;
  }
}

export function GameFind({ language }: GameFindProps) {
  const ui = dictionary.ui;

  const [round, setRound]         = useState(() => generateRound());
  const [correctId, setCorrectId] = useState<ItemId | null>(null);
  const [wrongId, setWrongId]     = useState<ItemId | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [roundsDone, setRoundsDone] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleTap = useCallback((id: ItemId) => {
    if (advancing || correctId) return;

    if (id === round.target.id) {
      setCorrectId(id);
      setAdvancing(true);
      setTimeout(() => {
        const next = roundsDone + 1;
        if (next >= TOTAL_ROUNDS) {
          setIsComplete(true);
        } else {
          setRoundsDone(next);
          setRound(generateRound(round.target.id));
        }
        setCorrectId(null);
        setAdvancing(false);
      }, 800);
    } else {
      setWrongId(id);
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

  const { target, options } = round;

  return (
    <div className="flex flex-col items-center gap-6 pt-2 pb-4">

      {/* Instruction */}
      <p className="text-[11px] text-foreground/38 font-medium uppercase tracking-widest select-none">
        {ui.gameFindInstruction[language]}
      </p>

      {/* Target card */}
      <motion.div
        key={target.id + '-target'}
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 340, damping: 22 }}
        className="w-40 h-40 rounded-[2rem] flex items-center justify-center shadow-sm"
        style={{ backgroundColor: target.bgColor, border: `2.5px solid rgba(92,74,61,0.10)` }}
      >
        <ObjectSvg id={target.id} size={100} />
      </motion.div>

      {/* Options row */}
      <div className="flex gap-4 justify-center">
        {options.map(item => {
          const isCorrect = correctId === item.id;
          const isWrong   = wrongId   === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleTap(item.id)}
              animate={
                isWrong   ? { x: [-6, 6, -5, 5, 0] } :
                isCorrect ? { scale: [1, 1.16, 1.04, 1] } :
                { scale: 1, x: 0 }
              }
              whileTap={!advancing ? { scale: 0.88 } : {}}
              transition={{ duration: isWrong ? 0.35 : 0.45 }}
              className="w-[6.5rem] h-[6.5rem] rounded-[1.5rem] flex items-center justify-center transition-colors duration-200"
              style={{
                backgroundColor: isCorrect ? item.bgColor : '#FDFDFC',
                border: isCorrect
                  ? '3px solid rgba(92,74,61,0.25)'
                  : isWrong
                  ? '3px solid #F87171'
                  : '2px solid rgba(92,74,61,0.09)',
                boxShadow: isCorrect
                  ? '0 0 0 5px rgba(168,200,181,0.3), 0 4px 16px rgba(0,0,0,0.09)'
                  : '0 2px 10px rgba(0,0,0,0.07)',
              }}
              aria-label={item.id}
            >
              <ObjectSvg id={item.id} size={64} />
            </motion.button>
          );
        })}
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-1">
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
