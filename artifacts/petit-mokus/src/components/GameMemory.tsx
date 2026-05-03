import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
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

interface AnimalItem {
  id: string;
  photo: string;
  objectPosition: string;
}

// Same library used in GameAnimals/TabSounds — pick the first N for the round.
// Increase pairCount to scale the difficulty (up to 10 pairs / 20 cards).
const ANIMALS: AnimalItem[] = [
  { id: 'dog',      photo: dogPhoto,      objectPosition: 'center 25%' },
  { id: 'cat',      photo: catPhoto,      objectPosition: 'center 15%' },
  { id: 'horse',    photo: horsePhoto,    objectPosition: 'center 30%' },
  { id: 'cow',      photo: cowPhoto,      objectPosition: 'center 65%' },
  { id: 'fox',      photo: foxPhoto,      objectPosition: 'center 42%' },
  { id: 'wolf',     photo: wolfPhoto,     objectPosition: 'center 25%' },
  { id: 'squirrel', photo: squirrelPhoto, objectPosition: 'center 30%' },
  { id: 'pig',      photo: pigPhoto,      objectPosition: 'center 40%' },
  { id: 'sheep',    photo: sheepPhoto,    objectPosition: 'center 25%' },
  { id: 'rooster',  photo: roosterPhoto,  objectPosition: 'center 20%' },
];

interface Card {
  index: number;     // stable position in the dealt deck
  animalId: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairCount: number): Card[] {
  const animals = shuffle(ANIMALS).slice(0, pairCount);
  const doubled = animals.flatMap((a) => [a.id, a.id]);
  return shuffle(doubled).map((animalId, index) => ({ index, animalId }));
}

interface GameMemoryProps {
  language: Language;
  pairCount?: number; // default 6 (4×3 grid). Up to 10 supported.
}

export function GameMemory({ language, pairCount = 6 }: GameMemoryProps) {
  const ui = dictionary.ui;
  const names = dictionary.animals;
  const safePairs = Math.min(Math.max(2, pairCount), ANIMALS.length);

  const [deck, setDeck] = useState<Card[]>(() => buildDeck(safePairs));
  const [flipped, setFlipped] = useState<number[]>([]);   // currently revealed indices (0-2)
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);            // lock input while a non-match reveals

  // Re-deal when pairCount changes.
  useEffect(() => {
    setDeck(buildDeck(safePairs));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
  }, [safePairs]);

  // After 2 cards are flipped, evaluate the pair.
  useEffect(() => {
    if (flipped.length !== 2) return undefined;
    const [aIdx, bIdx] = flipped;
    const a = deck[aIdx]!;
    const b = deck[bIdx]!;
    if (a.animalId === b.animalId) {
      // Match — keep them visible, mark as matched, free the board.
      setMatched((prev) => new Set(prev).add(a.animalId));
      setFlipped([]);
      // Soft sound feedback (best-effort; ignore browsers that block autoplay).
      try { playAnimalSound(a.animalId); } catch { /* ignore */ }
      return undefined;
    }
    // No match — keep them visible briefly, then flip back.
    setLocked(true);
    const t = setTimeout(() => {
      setFlipped([]);
      setLocked(false);
    }, 1100);
    return () => clearTimeout(t);
  }, [flipped, deck]);

  const handleCardTap = useCallback(
    (idx: number) => {
      if (locked) return;
      const card = deck[idx];
      if (!card) return;
      if (matched.has(card.animalId)) return;
      if (flipped.includes(idx)) return;
      if (flipped.length >= 2) return;
      setFlipped((prev) => {
        const next = [...prev, idx];
        if (next.length === 2) setMoves((m) => m + 1);
        return next;
      });
    },
    [deck, flipped, matched, locked],
  );

  const reset = useCallback(() => {
    setDeck(buildDeck(safePairs));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
  }, [safePairs]);

  const isComplete = matched.size === safePairs;

  // Choose grid columns adaptively: keep cards comfortably tappable on phones.
  // 3 pairs (6 cards) → 3 cols × 2 rows. 6 pairs (12) → 3 × 4. 8+ → 4-wide.
  const totalCards = safePairs * 2;
  const cols = useMemo(() => {
    if (totalCards <= 6) return 3;
    if (totalCards <= 12) return 3;
    return 4;
  }, [totalCards]);

  return (
    <div className="px-1">
      <p className="text-sm text-foreground/55 text-center mb-4">
        {ui.gameMemoryInstruction[language]}
      </p>

      <div
        className="grid gap-2.5 mb-5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {deck.map((card) => {
          const animal = ANIMALS.find((a) => a.id === card.animalId)!;
          const isMatched = matched.has(card.animalId);
          const isFlipped = flipped.includes(card.index) || isMatched;
          const animalLabel = names[card.animalId as keyof typeof names]?.[language] ?? card.animalId;

          return (
            <motion.button
              key={card.index}
              onClick={() => handleCardTap(card.index)}
              disabled={isMatched || locked}
              whileTap={!isFlipped && !locked ? { scale: 0.94 } : undefined}
              animate={{
                scale: isMatched ? 0.97 : 1,
                opacity: isMatched ? 0.85 : 1,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              aria-label={isFlipped ? animalLabel : "Hidden card"}
              aria-pressed={isFlipped}
              className="relative aspect-square rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              style={{
                boxShadow: isMatched
                  ? "0 0 0 3px rgba(166,201,181,0.55), 0 4px 14px rgba(0,0,0,0.10)"
                  : "0 2px 8px rgba(0,0,0,0.10)",
              }}
            >
              {/* Card back (face-down) */}
              <AnimatePresence initial={false} mode="wait">
                {!isFlipped ? (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 border border-primary/15"
                  >
                    <span className="text-3xl drop-shadow-sm select-none" aria-hidden="true">
                      🐾
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    transition={{ duration: 0.22 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={animal.photo}
                      alt={animalLabel}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: animal.objectPosition }}
                    />
                    {isMatched && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 18 }}
                        className="absolute top-1 right-1 bg-white/85 rounded-full p-0.5 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs font-medium text-foreground/55 px-1 mb-2">
        <span>
          {matched.size} {ui.gameOf[language]} {safePairs} {ui.gameMatched[language]}
        </span>
        <span>
          {moves} {ui.gameMoves[language]}
        </span>
      </div>
      <p className="text-[11px] text-foreground/38 italic text-center mb-4">
        {ui.gameMemoryTip[language]}
      </p>

      <div className="flex justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground/55 hover:text-foreground bg-muted/60 hover:bg-muted px-3 py-1.5 rounded-full active:scale-95 transition"
        >
          <RefreshCw size={12} />
          {ui.gamePlayAgain[language]}
        </button>
      </div>

      {/* Completion overlay — same pattern as TabGames success card */}
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
              transition={{ type: "spring", stiffness: 340, damping: 24 }}
              className="bg-card border border-card-border rounded-[2rem] p-8 text-center shadow-xl w-full max-w-sm"
            >
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {ui.gameBravo[language]}
              </h2>
              <p className="text-sm text-foreground/45 mb-7">
                {moves} {ui.gameMoves[language]}
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
