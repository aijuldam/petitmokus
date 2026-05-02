import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Volume2 } from "lucide-react";
import { Language, dictionary } from "../lib/i18n";
import { playAnimalSound } from "../lib/audio";

import dogPhoto      from "@assets/fran-taylor-3VhTw1T0WwI-unsplash_1777220813646.jpg";
import catPhoto      from "@assets/animal-face_W8CE6CC9MP_1777221156438.jpg";
import horsePhoto    from "@assets/luisa-peter-Olt577JtPM0-unsplash_(1)_1777223739525.jpg";
import cowPhoto      from "@assets/thomas-oldenburger-1SQFd9_zNW4-unsplash_(1)_1777221618899.jpg";
import foxPhoto      from "@assets/alex-glebov-Y9mp8VnyreQ-unsplash_1777225879484.jpg";
import wolfPhoto     from "@assets/reyk-odinson-mk2chAKaZR4-unsplash_1777225751422.jpg";
import squirrelPhoto from "@assets/richard-sagredo-VKe5EyWv8PA-unsplash_1777226655987.jpg";
import pigPhoto      from "@assets/pascal-debrunner-b-zyMn_e_R4-unsplash_1777226794867.jpg";
import sheepPhoto    from "@assets/benjamin-sander-bergum-Bpkdz8nkufU-unsplash_1777226933706.jpg";
import roosterPhoto  from "@assets/alberto-rodriguez-santana-2coVy1szQK4-unsplash_1777227006297.jpg";

type AgeMode = 1 | 2 | 3 | 5;

interface AnimalItem {
  id: string;
  photo: string;
  objectPosition: string;
  color: string;
}

const ANIMALS: AnimalItem[] = [
  { id: 'dog',      photo: dogPhoto,      objectPosition: 'center 25%', color: 'bg-accent/20'    },
  { id: 'cat',      photo: catPhoto,      objectPosition: 'center 15%', color: 'bg-primary/10'   },
  { id: 'horse',    photo: horsePhoto,    objectPosition: 'center 30%', color: 'bg-secondary/20' },
  { id: 'cow',      photo: cowPhoto,      objectPosition: 'center 65%', color: 'bg-chart-3/50'   },
  { id: 'fox',      photo: foxPhoto,      objectPosition: 'center 42%', color: 'bg-orange-100'   },
  { id: 'wolf',     photo: wolfPhoto,     objectPosition: 'center 25%', color: 'bg-slate-100'    },
  { id: 'squirrel', photo: squirrelPhoto, objectPosition: 'center 30%', color: 'bg-primary/20'   },
  { id: 'pig',      photo: pigPhoto,      objectPosition: 'center 40%', color: 'bg-pink-100'     },
  { id: 'sheep',    photo: sheepPhoto,    objectPosition: 'center 25%', color: 'bg-blue-50'      },
  { id: 'rooster',  photo: roosterPhoto,  objectPosition: 'center 20%', color: 'bg-red-50'       },
];

const ROUNDS = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getOptCount(age: AgeMode): number {
  if (age === 1) return 2;
  if (age === 2) return 3;
  if (age === 3) return 5;
  return 4;
}

interface Round {
  target: AnimalItem;
  options: AnimalItem[];
}

function buildRounds(age: AgeMode): Round[] {
  const optCount = getOptCount(age);
  const targets = shuffle(ANIMALS).slice(0, ROUNDS);
  return targets.map((target) => {
    const distractors = shuffle(ANIMALS.filter((a) => a.id !== target.id)).slice(0, optCount - 1);
    return { target, options: shuffle([target, ...distractors]) };
  });
}

const ui     = dictionary.ui;
const clues  = dictionary.gameAnimalsClues;
const names  = dictionary.animals;

interface GameAnimalsProps {
  language: Language;
  ageMode: AgeMode;
}

export function GameAnimals({ language, ageMode }: GameAnimalsProps) {
  const [rounds,  setRounds]  = useState<Round[]>([]);
  const [round,   setRound]   = useState(0);
  const [wrong,   setWrong]   = useState<string | null>(null);
  const [correct, setCorrect] = useState<string | null>(null);
  const [done,    setDone]    = useState(false);

  const initGame = useCallback((age: AgeMode) => {
    setRounds(buildRounds(age));
    setRound(0);
    setWrong(null);
    setCorrect(null);
    setDone(false);
  }, []);

  useEffect(() => { initGame(ageMode); }, [ageMode, initGame]);

  // Auto-play sound at round start for sound-based modes
  useEffect(() => {
    if ((ageMode === 2 || ageMode === 3) && rounds[round]) {
      const t = setTimeout(() => playAnimalSound(rounds[round].target.id), 450);
      return () => clearTimeout(t);
    }
  }, [round, ageMode, rounds]);

  const current = rounds[round];

  function handleTap(animal: AnimalItem) {
    if (correct) return;
    if (animal.id === current.target.id) {
      setCorrect(animal.id);
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
      setWrong(animal.id);
      setTimeout(() => setWrong(null), 620);
    }
  }

  if (!current) return null;

  const optCount = getOptCount(ageMode);

  const instruction =
    ageMode === 1 ? ui.gameAnimalsInstruction1[language] :
    ageMode === 5 ? ui.gameAnimalsInstruction5[language] :
                   ui.gameAnimalsInstruction2[language];

  return (
    <div className="w-full flex flex-col items-center gap-4">
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
              i < round ? "bg-primary scale-110" : i === round ? "bg-primary/40" : "bg-muted-foreground/20"
            }`}
          />
        ))}
      </div>

      {/* Prompt area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`prompt-${round}-${ageMode}`}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.22 }}
          className="flex justify-center w-full"
        >
          {/* 1+: show target animal photo */}
          {ageMode === 1 && (
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-36 h-36 rounded-2xl overflow-hidden border-2 border-primary/25 shadow-md ${current.target.color}`}
              >
                <img
                  src={current.target.photo}
                  alt={names[current.target.id as keyof typeof names][language]}
                  className="w-full h-full object-cover select-none"
                  style={{ objectPosition: current.target.objectPosition }}
                  draggable={false}
                />
              </div>
              <span className="text-[9px] text-foreground/28">
                {names[current.target.id as keyof typeof names][language]}
              </span>
            </div>
          )}

          {/* 2+ / 3+: sound play button */}
          {(ageMode === 2 || ageMode === 3) && (
            <button
              onClick={() => playAnimalSound(current.target.id)}
              className="flex flex-col items-center gap-2 px-10 py-5 rounded-2xl bg-primary/10 border-2 border-primary/20 active:scale-95 transition-transform"
            >
              <Volume2 className="w-10 h-10 text-primary" />
              <span className="text-xs font-semibold text-primary">
                {ui.gameAnimalsPlaySound[language]}
              </span>
            </button>
          )}

          {/* 5+: Who Am I? clue + optional sound */}
          {ageMode === 5 && (
            <div className="w-full flex flex-col gap-2">
              <div className="px-5 py-4 rounded-2xl bg-primary/10 border-2 border-primary/20">
                <p className="text-center text-base font-bold text-primary leading-snug">
                  {clues[current.target.id as keyof typeof clues][language]}
                </p>
              </div>
              <button
                onClick={() => playAnimalSound(current.target.id)}
                className="flex items-center justify-center gap-2 py-2 rounded-xl bg-muted active:scale-95 transition-transform"
              >
                <Volume2 className="w-4 h-4 text-foreground/45" />
                <span className="text-[11px] text-foreground/45 font-medium">
                  {ui.gameAnimalsPlaySound[language]}
                </span>
              </button>
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
          className="w-full"
        >
          {optCount === 5 ? (
            /* 5 options: 3 top + 2 centred bottom */
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                {current.options.slice(0, 3).map((a) => (
                  <AnimalCard key={a.id} animal={a} language={language} ageMode={ageMode} isWrong={wrong === a.id} isCorrect={correct === a.id} onTap={handleTap} />
                ))}
              </div>
              <div className="flex gap-2 justify-center">
                {current.options.slice(3).map((a) => (
                  <div key={a.id} className="w-[calc(33.33%-4px)]">
                    <AnimalCard animal={a} language={language} ageMode={ageMode} isWrong={wrong === a.id} isCorrect={correct === a.id} onTap={handleTap} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`grid gap-3 ${
                optCount === 2 ? "grid-cols-2" :
                optCount === 3 ? "grid-cols-3" :
                "grid-cols-2"
              }`}
            >
              {current.options.map((a) => (
                <AnimalCard key={a.id} animal={a} language={language} ageMode={ageMode} isWrong={wrong === a.id} isCorrect={correct === a.id} onTap={handleTap} />
              ))}
            </div>
          )}
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

interface AnimalCardProps {
  animal: AnimalItem;
  language: Language;
  ageMode: AgeMode;
  isWrong: boolean;
  isCorrect: boolean;
  onTap: (a: AnimalItem) => void;
}

function AnimalCard({ animal, language, ageMode, isWrong, isCorrect, onTap }: AnimalCardProps) {
  const name = dictionary.animals[animal.id as keyof typeof dictionary.animals][language];

  const nameCls =
    ageMode === 1 ? "text-[9px] text-foreground/35 mt-0.5" :
    ageMode === 2 ? "text-[10px] text-foreground/45 mt-0.5" :
    ageMode === 3 ? "text-[10px] text-foreground/55 mt-0.5" :
                   "text-xs font-semibold text-foreground/80 mt-0.5";

  return (
    <motion.button
      onClick={() => onTap(animal)}
      animate={
        isWrong   ? { x: [-5, 5, -5, 5, 0] } :
        isCorrect ? { scale: [1, 1.07, 1] }   : {}
      }
      transition={{ duration: 0.3 }}
      className={`w-full flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-colors shadow-sm ${
        isCorrect ? "border-green-400 bg-green-50/80" :
        isWrong   ? "border-rose-300 bg-rose-50/70"  :
                    "border-transparent bg-card hover:border-primary/25 active:scale-95"
      }`}
    >
      <div
        className={`w-full rounded-xl overflow-hidden ${animal.color}`}
        style={{ aspectRatio: "1/1" }}
      >
        <img
          src={animal.photo}
          alt={name}
          draggable={false}
          className="w-full h-full object-cover select-none"
          style={{ objectPosition: animal.objectPosition }}
        />
      </div>
      <span className={`text-center leading-tight ${nameCls}`}>{name}</span>
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
}
