import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import roosterPhoto from "@assets/alberto-rodriguez-santana-2coVy1szQK4-unsplash_1777227006297.jpg";

interface TabSoundsProps {
  language: Language;
}

type AnimalEntry = {
  id: string;
  color: string;
  objectPosition?: string;
} & ({ emoji: string; photo?: never } | { photo: string; emoji?: never });

const animals: AnimalEntry[] = [
  { id: 'dog',      photo: dogPhoto,      color: 'bg-accent/20 text-accent-foreground',       objectPosition: 'center 25%' },
  { id: 'cat',      photo: catPhoto,      color: 'bg-primary/10 text-primary-foreground',      objectPosition: 'center 15%' },
  { id: 'horse',    photo: horsePhoto,    color: 'bg-secondary/20 text-secondary-foreground',  objectPosition: 'center 30%' },
  { id: 'cow',      photo: cowPhoto,      color: 'bg-chart-3/50 text-foreground',              objectPosition: 'center 65%' },
  { id: 'fox',      photo: foxPhoto,      color: 'bg-orange-100 text-orange-900',              objectPosition: 'center 42%' },
  { id: 'wolf',     photo: wolfPhoto,     color: 'bg-slate-100 text-slate-800',                objectPosition: 'center 25%' },
  { id: 'squirrel', photo: squirrelPhoto, color: 'bg-primary/20 text-primary-foreground',      objectPosition: 'center 30%' },
  { id: 'pig',      photo: pigPhoto,      color: 'bg-pink-100 text-pink-900',                  objectPosition: 'center 40%' },
  { id: 'sheep',    photo: sheepPhoto,    color: 'bg-blue-50 text-blue-900',                   objectPosition: 'center 25%' },
  { id: 'rooster',  photo: roosterPhoto,  color: 'bg-red-50 text-red-900',                     objectPosition: 'center 20%' },
];

export function TabSounds({ language }: TabSoundsProps) {
  const [openFact, setOpenFact] = useState<string | null>(null);

  return (
    <>
    <div className="grid grid-cols-2 gap-4 p-6 pb-4 max-w-md mx-auto">
      {animals.map((animal) => {
        const isOpen = openFact === animal.id;
        return (
          <motion.button
            key={animal.id}
            data-testid={`animal-card-${animal.id}`}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              if (isOpen) {
                setOpenFact(null);
              } else {
                playAnimalSound(animal.id);
              }
            }}
            className="relative flex flex-col items-center p-4 bg-card rounded-[1.5rem] shadow-sm border border-card-border overflow-hidden hover:shadow-md transition-shadow"
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

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-foreground tracking-wide capitalize">
                {dictionary.animals[animal.id as keyof typeof dictionary.animals][language]}
              </span>
              <span
                role="button"
                aria-label="Fun fact"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenFact(isOpen ? null : animal.id);
                }}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors flex-shrink-0 cursor-pointer select-none",
                  isOpen
                    ? "bg-primary text-white"
                    : "bg-foreground/10 text-foreground/50 hover:bg-primary/20 hover:text-primary"
                )}
              >
                i
              </span>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFact(null);
                  }}
                  className="absolute inset-0 rounded-[1.5rem] flex items-center justify-center p-4"
                  style={{ background: 'rgba(92, 74, 61, 0.82)' }}
                >
                  <p className="text-white text-xs text-center leading-relaxed font-medium">
                    {dictionary.funFacts[animal.id as keyof typeof dictionary.funFacts][language]}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>

    <div className="px-6 pb-36 max-w-md mx-auto">
      <div className="bg-card border border-card-border rounded-[1.25rem] p-5 shadow-sm">
        <h2 className="font-bold text-foreground text-base mb-3">About Petit Mokus</h2>
        <p className="text-sm text-foreground/65 leading-relaxed">
          Petit Mokus is a gentle digital companion for families, supporting children's growth through calming routines, soothing sounds, and simple learning — wherever life takes you. Petit Mokus is multicultural at its core, crafted by a French &amp; Hungarian family in Amsterdam. <em>Mokus</em> means squirrel in Hungarian, a small, curious animal that thrives through play, exploration, and a love of small, meaningful moments — which mirrors the way Petit Mokus turns bedtime songs, quiet sounds, and simple games into building blocks for children's emotional and cognitive development. Like a little squirrel gathering nuts, Petit Mokus gathers gentle interactions that help families feel more connected and secure, one small moment at a time.
        </p>
      </div>
    </div>
    </>
  );
}
