import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Language, dictionary } from "../lib/i18n";
import { ShapeSvg, ShapeId } from "../lib/ShapeSvg";

interface GameFindProps {
  language: Language;
}

const FIND_SHAPES: { id: ShapeId; hex: string }[] = [
  { id: 'circle',   hex: '#D897A8' },
  { id: 'square',   hex: '#B8CCE0' },
  { id: 'triangle', hex: '#A6C9B5' },
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

function generateRound(prevTargetId?: ShapeId) {
  const pool = prevTargetId
    ? FIND_SHAPES.filter(s => s.id !== prevTargetId)
    : FIND_SHAPES;
  const target = pool[Math.floor(Math.random() * pool.length)];
  const options = shuffle(FIND_SHAPES);
  return { target, options };
}

export function GameFind({ language }: GameFindProps) {
  const ui = dictionary.ui;

  const [round, setRound] = useState(() => generateRound());
  const [correctId, setCorrectId] = useState<ShapeId | null>(null);
  const [wrongId, setWrongId]     = useState<ShapeId | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [roundsDone, setRoundsDone] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleTap = useCallback((id: ShapeId) => {
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
      }, 750);
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

  return (
    <div className="flex flex-col items-center gap-6 pt-2 pb-4">

      {/* Target */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-[11px] text-foreground/38 font-medium uppercase tracking-widest select-none">
          {ui.gameFindInstruction[language]}
        </p>
        <motion.div
          key={round.target.id}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 340, damping: 22 }}
          className="w-40 h-40 rounded-[2rem] flex items-center justify-center shadow-sm"
          style={{ backgroundColor: round.target.hex + '28', border: `2.5px solid ${round.target.hex}55` }}
        >
          <ShapeSvg id={round.target.id} hex={round.target.hex} size={96} />
        </motion.div>
      </div>

      {/* Options row */}
      <div className="flex gap-4 justify-center">
        {round.options.map(shape => {
          const isCorrect = correctId === shape.id;
          const isWrong   = wrongId   === shape.id;
          return (
            <motion.button
              key={shape.id}
              onClick={() => handleTap(shape.id)}
              animate={
                isWrong   ? { x: [-6, 6, -5, 5, 0] } :
                isCorrect ? { scale: [1, 1.18, 1.05, 1] } :
                { scale: 1, x: 0 }
              }
              whileTap={!advancing ? { scale: 0.9 } : {}}
              transition={{ duration: isWrong ? 0.35 : 0.45 }}
              className="w-[6.5rem] h-[6.5rem] rounded-[1.5rem] flex items-center justify-center shadow-md transition-colors duration-200"
              style={{
                backgroundColor: isCorrect ? shape.hex + '40' : '#FDFDFC',
                border: isCorrect
                  ? `3px solid ${shape.hex}`
                  : isWrong
                  ? '3px solid #F87171'
                  : '2px solid rgba(92,74,61,0.10)',
                boxShadow: isCorrect
                  ? `0 0 0 6px ${shape.hex}30, 0 4px 20px rgba(0,0,0,0.10)`
                  : '0 2px 10px rgba(0,0,0,0.07)',
              }}
              aria-label={shape.id}
            >
              <ShapeSvg id={shape.id} hex={shape.hex} size={68} />
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
            style={{ backgroundColor: i < roundsDone || isComplete ? '#D897A8' : 'rgba(92,74,61,0.12)' }}
          />
        ))}
      </div>

      {/* Completion overlay */}
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
                {TOTAL_ROUNDS} {ui.gameOf[language]} {TOTAL_ROUNDS} {ui.gameMatched[language]}
              </p>
              <button
                onClick={restart}
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
