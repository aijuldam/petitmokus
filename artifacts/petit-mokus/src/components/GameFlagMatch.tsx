import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Volume2 } from "lucide-react";
import { Language, dictionary } from "../lib/i18n";
import { FLAGS, FlagItem } from "../lib/flagsData";

const ROUNDS = 5;
const ui = dictionary.ui;

const LANG_CODE: Record<Language, string> = {
  EN: "en-US",
  FR: "fr-FR",
  HU: "hu-HU",
  DE: "de-DE",
};

function speak(text: string, lang: Language) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = LANG_CODE[lang];
  utter.rate = 0.82;
  window.speechSynthesis.speak(utter);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function flagUrl(code: string) {
  return `https://flagcdn.com/w320/${code}.png`;
}

interface Round {
  target: FlagItem;
  options: FlagItem[];
}

function buildRounds(): Round[] {
  const pool = FLAGS.filter((f) => f.difficulty <= 2);
  const targets = shuffle(pool).slice(0, ROUNDS);
  return targets.map((target) => {
    const distractor = shuffle(pool.filter((f) => f.code !== target.code))[0];
    return { target, options: shuffle([target, distractor]) };
  });
}

interface GameFlagMatchProps {
  language: Language;
}

export function GameFlagMatch({ language }: GameFlagMatchProps) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [round, setRound] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [correct, setCorrect] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const initGame = useCallback(() => {
    setRounds(buildRounds());
    setRound(0);
    setWrong(null);
    setCorrect(null);
    setDone(false);
  }, []);

  useEffect(() => {
    initGame();
    return () => { window.speechSynthesis?.cancel(); };
  }, [initGame]);

  useEffect(() => {
    if (!rounds[round]) return;
    const name = rounds[round].target.countryName[language];
    const t = setTimeout(() => speak(name, language), 420);
    return () => clearTimeout(t);
  }, [round, rounds, language]);

  const current = rounds[round];
  if (!current) return null;

  const countryName = current.target.countryName[language];

  function handleTap(flag: FlagItem) {
    if (correct) return;
    if (flag.code === current.target.code) {
      setCorrect(flag.code);
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          setDone(true);
        } else {
          setRound((r) => r + 1);
          setWrong(null);
          setCorrect(null);
        }
      }, 620);
    } else {
      setWrong(flag.code);
      setTimeout(() => setWrong(null), 650);
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Instruction */}
      <p className="text-[10px] font-bold tracking-widest uppercase text-foreground/40 text-center">
        {ui.gameFlagMatchInstruction[language]}
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

      {/* Country name card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`name-${round}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.22 }}
          className="w-full"
        >
          <div className="w-full px-6 py-5 rounded-2xl bg-primary/10 border-2 border-primary/20 flex flex-col items-center gap-3">
            <span className="text-3xl font-bold text-primary tracking-wide text-center leading-tight">
              {countryName}
            </span>
            <button
              onClick={() => speak(countryName, language)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 hover:bg-primary/25 active:scale-95 transition-all"
            >
              <Volume2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">
                {ui.gameFlagMatchHear[language]}
              </span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Two flag choices */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`opts-${round}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.24 }}
          className="grid grid-cols-2 gap-4 w-full"
        >
          {current.options.map((flag) => {
            const isWrong   = wrong   === flag.code;
            const isCorrect = correct === flag.code;
            return (
              <motion.button
                key={flag.code}
                onClick={() => handleTap(flag)}
                animate={
                  isWrong   ? { x: [-6, 6, -6, 6, 0] } :
                  isCorrect ? { scale: [1, 1.06, 1] }   : {}
                }
                transition={{ duration: 0.32 }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-colors shadow-sm ${
                  isCorrect
                    ? "border-green-400 bg-green-50/80"
                    : isWrong
                    ? "border-rose-300 bg-rose-50/70"
                    : "border-transparent bg-card hover:border-primary/25 active:scale-95"
                }`}
              >
                <div
                  className="w-full rounded-xl overflow-hidden shadow-sm"
                  style={{ aspectRatio: "3/2" }}
                >
                  <img
                    src={flagUrl(flag.code)}
                    alt={flag.countryName[language]}
                    draggable={false}
                    className="w-full h-full object-cover select-none"
                  />
                </div>
                {isCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-500 text-xl leading-none"
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
              onClick={initGame}
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
