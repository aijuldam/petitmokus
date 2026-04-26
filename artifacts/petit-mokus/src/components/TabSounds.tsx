import { motion } from "framer-motion";
import { Language, dictionary } from "../lib/i18n";
import { playAnimalSound } from "../lib/audio";
import { cn } from "../lib/utils";
import dogPhoto from "@assets/fran-taylor-3VhTw1T0WwI-unsplash_1777220813646.jpg";
import catPhoto from "@assets/animal-face_W8CE6CC9MP_1777221156438.jpg";
import horsePhoto from "@assets/luisa-peter-Olt577JtPM0-unsplash_(1)_1777223739525.jpg";
import cowPhoto from "@assets/thomas-oldenburger-1SQFd9_zNW4-unsplash_(1)_1777221618899.jpg";
import foxPhoto from "@assets/alex-glebov-Y9mp8VnyreQ-unsplash_1777225879484.jpg";
import wolfPhoto from "@assets/reyk-odinson-mk2chAKaZR4-unsplash_1777225751422.jpg";
import squirrelPhoto from "@assets/richard-sagredo-VKe5EyWv8PA-unsplash_1777226655987.jpg";
import pigPhoto from "@assets/pascal-debrunner-b-zyMn_e_R4-unsplash_1777226794867.jpg";
import sheepPhoto from "@assets/benjamin-sander-bergum-Bpkdz8nkufU-unsplash_1777226933706.jpg";

interface TabSoundsProps {
  language: Language;
}

type AnimalEntry = {
  id: string;
  color: string;
  objectPosition?: string;
} & ({ emoji: string; photo?: never } | { photo: string; emoji?: never });

const animals: AnimalEntry[] = [
  { id: 'dog',      photo: dogPhoto,   color: 'bg-accent/20 text-accent-foreground',       objectPosition: 'center 25%' },
  { id: 'cat',      photo: catPhoto,   color: 'bg-primary/10 text-primary-foreground',      objectPosition: 'center 15%' },
  { id: 'horse',    photo: horsePhoto, color: 'bg-secondary/20 text-secondary-foreground',  objectPosition: 'center 30%' },
  { id: 'cow',      photo: cowPhoto,   color: 'bg-chart-3/50 text-foreground',              objectPosition: 'center 33%' },
  { id: 'fox',      photo: foxPhoto,   color: 'bg-orange-100 text-orange-900',  objectPosition: 'center 20%' },
  { id: 'wolf',     photo: wolfPhoto,  color: 'bg-slate-100 text-slate-800',    objectPosition: 'center 25%' },
  { id: 'squirrel', photo: squirrelPhoto, color: 'bg-primary/20 text-primary-foreground', objectPosition: 'center 30%' },
  { id: 'pig',      photo: pigPhoto,   color: 'bg-pink-100 text-pink-900',  objectPosition: 'center 40%' },
  { id: 'sheep',    photo: sheepPhoto, color: 'bg-blue-50 text-blue-900',  objectPosition: 'center 25%' },
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
              ? <img
                  src={animal.photo}
                  alt={animal.id}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: animal.objectPosition ?? 'center' }}
                />
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
