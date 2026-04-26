import { motion } from "framer-motion";
import { Language, dictionary } from "../lib/i18n";
import { playAnimalSound } from "../lib/audio";
import { cn } from "../lib/utils";
import dogPhoto from "@assets/fran-taylor-3VhTw1T0WwI-unsplash_1777220813646.jpg";
import catPhoto from "@assets/animal-face_W8CE6CC9MP_1777221156438.jpg";

interface TabSoundsProps {
  language: Language;
}

type AnimalEntry = { id: string; color: string } & ({ emoji: string; photo?: never } | { photo: string; emoji?: never });

const animals: AnimalEntry[] = [
  { id: 'dog', photo: dogPhoto, color: 'bg-accent/20 text-accent-foreground' },
  { id: 'cat', photo: catPhoto, color: 'bg-primary/10 text-primary-foreground' },
  { id: 'horse', emoji: '🐴', color: 'bg-secondary/20 text-secondary-foreground' },
  { id: 'cow', emoji: '🐄', color: 'bg-chart-3/50 text-foreground' },
  { id: 'fox', emoji: '🦊', color: 'bg-orange-100 text-orange-900' },
  { id: 'wolf', emoji: '🐺', color: 'bg-slate-100 text-slate-800' },
  { id: 'squirrel', emoji: '🐿️', color: 'bg-primary/20 text-primary-foreground' }, // special rose tint
  { id: 'mouse', emoji: '🐭', color: 'bg-gray-100 text-gray-800' },
  { id: 'sheep', emoji: '🐑', color: 'bg-blue-50 text-blue-900' },
];

export function TabSounds({ language }: TabSoundsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-6 pb-32 max-w-md mx-auto">
      {animals.map((animal) => (
        <motion.button
          key={animal.id}
          data-testid={`animal-card-${animal.id}`}
          whileTap={{ scale: 0.92 }}
          onClick={() => playAnimalSound(animal.id)}
          className="flex flex-col items-center p-4 bg-card rounded-[1.5rem] shadow-sm border border-card-border overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className={cn("w-full aspect-square flex items-center justify-center text-6xl rounded-[1rem] mb-3 overflow-hidden", animal.color)}>
            {animal.photo
              ? <img src={animal.photo} alt={animal.id} className="w-full h-full object-cover" />
              : animal.emoji}
          </div>
          <span className="font-bold text-lg text-foreground tracking-wide capitalize">
            {dictionary.animals[animal.id as keyof typeof dictionary.animals][language]}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
