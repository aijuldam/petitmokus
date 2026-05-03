import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Language, dictionary } from "../lib/i18n";
import { SuccessOverlay } from "./shared/SuccessOverlay";

interface GameShapeParkingProps {
  language: Language;
}

type ParkShape = 'circle' | 'square' | 'triangle';

interface Car {
  id: string;
  shape: ParkShape;
  color: string;
}

interface Space {
  shape: ParkShape;
  parkedCarId: string | null;
}

interface RoundState {
  cars: Car[];
  spaces: Space[];
}

const TOTAL_ROUNDS = 4;

const CAR_COLORS: Record<ParkShape, string> = {
  circle:   '#E8675A',
  square:   '#5B9BD5',
  triangle: '#F0B93A',
};

const SHAPE_BG: Record<ParkShape, string> = {
  circle:   '#FDECEA',
  square:   '#E8F4FD',
  triangle: '#FEF9E7',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound(): RoundState {
  const shapes: ParkShape[] = ['circle', 'square', 'triangle'];
  const cars: Car[] = shuffle(shapes).map(shape => ({
    id: shape + '-' + Math.random().toString(36).slice(2, 7),
    shape,
    color: CAR_COLORS[shape],
  }));
  const spaces: Space[] = shapes.map(shape => ({ shape, parkedCarId: null }));
  return { cars, spaces };
}

function CarSvg({ shape, color, size = 90 }: { shape: ParkShape; color: string; size?: number }) {
  const h = size * 0.6;
  const dark = (c: string) => c; // already dark enough
  return (
    <svg width={size} height={h} viewBox="0 0 100 60">
      {/* shadow */}
      <ellipse cx="50" cy="58" rx="40" ry="4" fill="rgba(0,0,0,0.10)" />
      {/* body */}
      <rect x="2" y="18" width="96" height="24" rx="7" fill={color} />
      {/* cabin */}
      <path d="M20,18 L28,5 L72,5 L80,18 Z" fill={color} strokeLinejoin="round" />
      {/* body outline */}
      <rect x="2" y="18" width="96" height="24" rx="7" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
      <path d="M20,18 L28,5 L72,5 L80,18 Z" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* windshield front */}
      <rect x="29" y="6" width="21" height="11" rx="2.5" fill="rgba(180,225,255,0.75)" />
      {/* rear window */}
      <rect x="52" y="6" width="19" height="11" rx="2.5" fill="rgba(180,225,255,0.75)" />
      {/* headlight */}
      <ellipse cx="91" cy="29" rx="5" ry="4" fill="#FDE88A" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      {/* taillight */}
      <rect x="3" y="24" width="4" height="7" rx="1.5" fill="#E8675A" opacity="0.85" />
      {/* door badge */}
      <rect x="35" y="20" width="30" height="18" rx="4" fill="rgba(255,255,255,0.22)" />
      {shape === 'circle'   && <circle cx="50" cy="29" r="7" fill="white" opacity="0.88" />}
      {shape === 'square'   && <rect x="43" y="22" width="14" height="14" rx="2.5" fill="white" opacity="0.88" />}
      {shape === 'triangle' && <polygon points="50,22 59,36 41,36" fill="white" opacity="0.88" />}
      {/* roof shine */}
      <ellipse cx="40" cy="9" rx="9" ry="2.5" fill="white" opacity="0.18" transform="rotate(-6 40 9)" />
      {/* wheels */}
      <circle cx="23" cy="48" r="10" fill="#3D2E20" />
      <circle cx="77" cy="48" r="10" fill="#3D2E20" />
      <circle cx="23" cy="48" r="4" fill="#888" />
      <circle cx="77" cy="48" r="4" fill="#888" />
      <circle cx="23" cy="48" r="1.5" fill="#bbb" />
      <circle cx="77" cy="48" r="1.5" fill="#bbb" />
    </svg>
  );
}

function SpaceShapeSvg({ shape, filled, color }: { shape: ParkShape; filled: boolean; color: string }) {
  const stroke      = filled ? color  : '#C4B9AF';
  const fill        = filled ? color  : 'none';
  const dashArray   = filled ? '0'    : '9 5';
  const sw          = 4;

  return (
    <svg viewBox="0 0 80 80" width={72} height={72}>
      {/* parking lane marks */}
      <line x1="6"  y1="4" x2="6"  y2="76" stroke="#DDD6CE" strokeWidth="2.5" />
      <line x1="74" y1="4" x2="74" y2="76" stroke="#DDD6CE" strokeWidth="2.5" />

      {shape === 'circle' && (
        <circle cx="40" cy="40" r="28" fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} opacity={filled ? 0.75 : 1} />
      )}
      {shape === 'square' && (
        <rect x="12" y="12" width="56" height="56" rx="6" fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} opacity={filled ? 0.75 : 1} />
      )}
      {shape === 'triangle' && (
        <polygon points="40,9 72,70 8,70" fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} opacity={filled ? 0.75 : 1} />
      )}

      {/* checkmark when filled */}
      {filled && (
        <motion.path
          d="M28,40 L37,50 L54,30"
          fill="none" stroke="white" strokeWidth="5"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      )}
    </svg>
  );
}

export function GameShapeParking({ language }: GameShapeParkingProps) {
  const ui = dictionary.ui;

  const [round, setRound]               = useState<RoundState>(() => generateRound());
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [wrongShape, setWrongShape]       = useState<ParkShape | null>(null);
  const [advancing, setAdvancing]         = useState(false);
  const [roundsDone, setRoundsDone]       = useState(0);
  const [isComplete, setIsComplete]       = useState(false);

  const selectedCar = round.cars.find(c => c.id === selectedCarId) ?? null;

  const handleCarTap = useCallback((car: Car) => {
    if (advancing) return;
    const isParked = round.spaces.some(s => s.parkedCarId === car.id);
    if (isParked) return;
    setSelectedCarId(prev => prev === car.id ? null : car.id);
  }, [advancing, round.spaces]);

  const handleSpaceTap = useCallback((space: Space) => {
    if (advancing || !selectedCarId) return;
    if (space.parkedCarId) return;

    const car = round.cars.find(c => c.id === selectedCarId);
    if (!car) return;

    if (car.shape === space.shape) {
      const newSpaces = round.spaces.map(s =>
        s.shape === space.shape ? { ...s, parkedCarId: selectedCarId } : s
      );
      setRound(r => ({ ...r, spaces: newSpaces }));
      setSelectedCarId(null);

      if (newSpaces.every(s => s.parkedCarId !== null)) {
        setAdvancing(true);
        setTimeout(() => {
          const next = roundsDone + 1;
          if (next >= TOTAL_ROUNDS) {
            setIsComplete(true);
          } else {
            setRoundsDone(next);
            setRound(generateRound());
          }
          setAdvancing(false);
        }, 950);
      }
    } else {
      setWrongShape(space.shape);
      setTimeout(() => setWrongShape(null), 500);
    }
  }, [advancing, selectedCarId, round, roundsDone]);

  const restart = () => {
    setRoundsDone(0);
    setIsComplete(false);
    setSelectedCarId(null);
    setWrongShape(null);
    setAdvancing(false);
    setRound(generateRound());
  };

  return (
    <div className="flex flex-col items-center gap-5 pt-1 pb-4 w-full">

      {/* Instruction */}
      <p className="text-[11px] text-foreground/38 font-medium uppercase tracking-widest select-none text-center">
        {ui.gameShapeParkingInstruction[language]}
      </p>

      {/* Parking spaces */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {round.spaces.map(space => {
          const filled    = space.parkedCarId !== null;
          const isWrong   = wrongShape === space.shape;
          const isTarget  = !filled && selectedCar?.shape === space.shape;
          return (
            <motion.button
              key={space.shape}
              onClick={() => handleSpaceTap(space)}
              animate={isWrong ? { x: [-7, 7, -6, 6, 0] } : isTarget ? { scale: [1, 1.04, 1] } : {}}
              transition={isTarget ? { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } : { duration: 0.35 }}
              className="h-[8rem] rounded-[1.5rem] flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: filled ? SHAPE_BG[space.shape] : '#F0EBE4',
                border: filled
                  ? `3px solid ${CAR_COLORS[space.shape]}55`
                  : isTarget
                  ? `3px dashed ${CAR_COLORS[selectedCar!.shape]}90`
                  : '2px dashed #D4CCC4',
                boxShadow: filled
                  ? `0 0 0 5px ${CAR_COLORS[space.shape]}20, 0 4px 16px rgba(0,0,0,0.08)`
                  : isTarget
                  ? `0 0 0 4px ${CAR_COLORS[selectedCar!.shape]}18`
                  : '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <SpaceShapeSvg
                shape={space.shape}
                filled={filled}
                color={CAR_COLORS[space.shape]}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Road separator */}
      <div className="w-full flex items-center gap-2 px-1">
        <div className="flex-1 border-t-2 border-dashed border-foreground/10" />
        <span className="text-xs text-foreground/20 font-medium select-none">🛣</span>
        <div className="flex-1 border-t-2 border-dashed border-foreground/10" />
      </div>

      {/* Cars row */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {round.cars.map(car => {
          const isParked   = round.spaces.some(s => s.parkedCarId === car.id);
          const isSelected = selectedCarId === car.id;
          return (
            <motion.button
              key={car.id}
              onClick={() => handleCarTap(car)}
              animate={{
                opacity: isParked ? 0 : 1,
                scale:   isParked ? 0.75 : isSelected ? 1.06 : 1,
                y:       isParked ? 10   : isSelected ? -8   : 0,
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              whileTap={!isParked && !advancing ? { scale: 0.92 } : {}}
              className="h-[5.5rem] rounded-[1.25rem] flex items-center justify-center p-1 transition-colors duration-200"
              style={{
                backgroundColor: isSelected ? SHAPE_BG[car.shape] : '#FDFDFC',
                border: isSelected
                  ? `3px solid ${CAR_COLORS[car.shape]}`
                  : '2px solid rgba(92,74,61,0.09)',
                boxShadow: isSelected
                  ? `0 0 0 5px ${CAR_COLORS[car.shape]}28, 0 6px 20px rgba(0,0,0,0.12)`
                  : '0 2px 10px rgba(0,0,0,0.06)',
                pointerEvents: isParked ? 'none' : 'auto',
              }}
              aria-label={car.shape}
            >
              <CarSvg shape={car.shape} color={car.color} size={88} />
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
