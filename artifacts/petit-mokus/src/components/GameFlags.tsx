import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { Language, dictionary } from "../lib/i18n";
import { FLAGS, FlagItem } from "../lib/flagsData";

type AgeMode = 2 | 3 | 5;

interface GameFlagsProps {
  language: Language;
}

const ui = dictionary.ui;
const ROUNDS = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function flagUrl(code: string): string {
  return `https://flagcdn.com/w320/${code}.png`;
}

function getPool(age: AgeMode): FlagItem[] {
  if (age === 2) return FLAGS.filter((f) => f.difficulty === 1);
  if (age === 3) return FLAGS.filter((f) => f.difficulty <= 2);
  return FLAGS;
}

function getOptCount(age: AgeMode): number {
  return age === 2 ? 2 : age === 3 ? 3 : 4;
}

interface Round {
  target: FlagItem;
  options: FlagItem[];
}

function buildRounds(age: AgeMode): Round[] {
  const pool = getPool(age);
  const optCount = getOptCount(age);
  const targets = shuffle(pool).slice(0, ROUNDS);
  return targets.map((target) => {
    const distractors = shuffle(pool.filter((f) => f.code !== target.code)).slice(0, optCount - 1);
    return { target, options: shuffle([target, ...distractors]) };
  });
}

function FlagImage({ code, alt, className = "" }: { code: string; alt: string; className?: string }) {
  return (
    <img
      src={flagUrl(code)}
      alt={alt}
      draggable={false}
      className={`w-full h-full object-contain select-none ${className}`}
    />
  );
}

export function GameFlags({ language }: GameFlagsProps) {
  const [ageMode, setAgeMode] = useState<AgeMode>(2);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [round, setRound] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [correct, setCorrect] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const initGame = useCallback((age: AgeMode) => {
    setRounds(buildRounds(age));
    setRound(0);
    setWrong(null);
    setCorrect(null);
    setDone(false);
  }, []);

  useEffect(() => {
    initGame(ageMode);
  }, [ageMode, initGame]);

  const current = rounds[round];

  function handleTap(flag: FlagItem) {
    if (correct) return;
    const isCorrect = flag.code === current.target.code;
    if (isCorrect) {
      setCorrect(flag.code);
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          setDone(true);
        } else {
          setRound((r) => r + 1);
          setWrong(null);
          setCorrect(null);
        }
      }, 520);
    } else {
      setWrong(flag.code);
      setTimeout(() => setWrong(null), 620);
    }
  }

  if (!current) return null;

  const optCount = getOptCount(ageMode);
  const gridCols = optCount === 3 ? "grid-cols-3" : "grid-cols-2";

  const nameCls =
    ageMode === 2
      ? "text-[9px] text-foreground/35 mt-1 leading-tight"
      : ageMode === 3
      ? "text-[11px] text-foreground/58 font-medium mt-1 leading-tight"
      : "text-xs text-foreground/82 font-semibold mt-1 leading-tight";

  const instruction =
    ageMode === 5 ? ui.gameFlagsMatch[language] : ui.gameFlagsFind[language];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Age sub-mode selector */}
      <div className="flex gap-1 w-full bg-muted rounded-2xl p-1">
        {([2, 3, 5] as AgeMode[]).map((age) => (
          <button
            key={age}
            onClick={() => setAgeMode(age)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              ageMode === age
                ? "bg-card shadow text-primary"
                : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            {age}+
          </button>
        ))}
      </div>

      {/* Instruction */}
      <p className="text-[10px] font-bold tracking-widest uppercase text-foreground/40 text-center">
        {instruction}
      </p>

      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center">
        {Array.from({ length: ROUNDS }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < round
                ? "bg-primary scale-110"
                : i === round
                ? "bg-primary/40"
                : "bg-muted-foreground/20"
            }`}
          />
        ))}
      </div>

      {/* Target card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`target-${round}-${ageMode}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.22 }}
          className="flex justify-center w-full"
        >
          {ageMode === 5 ? (
            <div className="px-8 py-5 rounded-2xl bg-primary/10 border-2 border-primary/20 text-primary text-2xl font-bold text-center tracking-wide">
              {current.target.countryName[language]}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`rounded-2xl bg-card border-2 border-primary/25 shadow-md overflow-hidden flex items-center justify-center p-2 ${
                  ageMode === 2 ? "w-48 h-32" : "w-40 h-[106px]"
                }`}
              >
                <FlagImage
                  code={current.target.code}
                  alt={current.target.countryName[language]}
                />
              </div>
              <span className="text-[9px] text-foreground/28">
                {current.target.countryName[language]}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Options grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`opts-${round}-${ageMode}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24 }}
          className={`grid ${gridCols} gap-3 w-full`}
        >
          {current.options.map((flag) => {
            const isWrong = wrong === flag.code;
            const isCorrect = correct === flag.code;
            return (
              <motion.button
                key={flag.code}
                onClick={() => handleTap(flag)}
                animate={
                  isWrong
                    ? { x: [-5, 5, -5, 5, 0] }
                    : isCorrect
                    ? { scale: [1, 1.07, 1] }
                    : {}
                }
                transition={{ duration: 0.3 }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-2xl border-2 transition-colors shadow-sm ${
                  isCorrect
                    ? "border-green-400 bg-green-50/80"
                    : isWrong
                    ? "border-rose-300 bg-rose-50/70"
                    : "border-transparent bg-card hover:border-primary/25 active:scale-95"
                }`}
              >
                {/* Flag image — 3:2 aspect ratio container */}
                <div className="w-full rounded-lg overflow-hidden bg-muted/20" style={{ aspectRatio: "3/2" }}>
                  <FlagImage
                    code={flag.code}
                    alt={flag.countryName[language]}
                  />
                </div>
                <span className={`text-center w-full ${nameCls}`}>
                  {flag.countryName[language]}
                </span>
                {isCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-500 text-base leading-none"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Bravo overlay */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Star className="w-20 h-20 text-yellow-400 fill-yellow-300" />
            </motion.div>
            <p className="text-4xl font-bold text-primary mt-4">
              {ui.gameBravo[language]}
            </p>
            <button
              onClick={() => initGame(ageMode)}
              className="mt-6 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
            >
              {ui.gamePlayAgain[language]}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
