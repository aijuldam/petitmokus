import { Language, dictionary } from './i18n';
import { playAnimalSound, playVehicleSound } from './audio';

import dogPhoto from '@assets/fran-taylor-3VhTw1T0WwI-unsplash_1777220813646.jpg';
import catPhoto from '@assets/animal-face_W8CE6CC9MP_1777221156438.jpg';
import horsePhoto from '@assets/luisa-peter-Olt577JtPM0-unsplash_(1)_1777223739525.jpg';
import cowPhoto from '@assets/thomas-oldenburger-1SQFd9_zNW4-unsplash_(1)_1777221618899.jpg';
import foxPhoto from '@assets/alex-glebov-Y9mp8VnyreQ-unsplash_1777225879484.jpg';
import wolfPhoto from '@assets/reyk-odinson-mk2chAKaZR4-unsplash_1777225751422.jpg';
import squirrelPhoto from '@assets/richard-sagredo-VKe5EyWv8PA-unsplash_1777226655987.jpg';
import pigPhoto from '@assets/pascal-debrunner-b-zyMn_e_R4-unsplash_1777226794867.jpg';
import sheepPhoto from '@assets/benjamin-sander-bergum-Bpkdz8nkufU-unsplash_1777226933706.jpg';
import roosterPhoto from '@assets/alberto-rodriguez-santana-2coVy1szQK4-unsplash_1777227006297.jpg';

export interface SoundItem {
  id: string;
  /** URL/path to the image. Imported static asset for animals; public path for vehicles. */
  image: string;
  /** Object-position hint for photo crops */
  objectPosition?: string;
  /** Card background colour class */
  color: string;
  getName: (lang: Language) => string;
  playSound: () => void;
  getFunFact?: (lang: Language) => string;
}

export interface SoundCategory {
  id: string;
  getLabelKey: (lang: Language) => string;
  emoji: string;
  items: SoundItem[];
}

// ── Animals ──────────────────────────────────────────────────────────────────

const animalItems: SoundItem[] = [
  { id: 'dog',      image: dogPhoto,      objectPosition: 'center 25%', color: 'bg-accent/20',    getName: l => dictionary.animals.dog[l],      playSound: () => playAnimalSound('dog'),      getFunFact: l => dictionary.funFacts.dog[l] },
  { id: 'cat',      image: catPhoto,      objectPosition: 'center 15%', color: 'bg-primary/10',   getName: l => dictionary.animals.cat[l],      playSound: () => playAnimalSound('cat'),      getFunFact: l => dictionary.funFacts.cat[l] },
  { id: 'horse',    image: horsePhoto,    objectPosition: 'center 30%', color: 'bg-secondary/20', getName: l => dictionary.animals.horse[l],    playSound: () => playAnimalSound('horse'),    getFunFact: l => dictionary.funFacts.horse[l] },
  { id: 'cow',      image: cowPhoto,      objectPosition: 'center 65%', color: 'bg-chart-3/50',   getName: l => dictionary.animals.cow[l],      playSound: () => playAnimalSound('cow'),      getFunFact: l => dictionary.funFacts.cow[l] },
  { id: 'fox',      image: foxPhoto,      objectPosition: 'center 42%', color: 'bg-orange-100',   getName: l => dictionary.animals.fox[l],      playSound: () => playAnimalSound('fox'),      getFunFact: l => dictionary.funFacts.fox[l] },
  { id: 'wolf',     image: wolfPhoto,     objectPosition: 'center 25%', color: 'bg-slate-100',    getName: l => dictionary.animals.wolf[l],     playSound: () => playAnimalSound('wolf'),     getFunFact: l => dictionary.funFacts.wolf[l] },
  { id: 'squirrel', image: squirrelPhoto, objectPosition: 'center 30%', color: 'bg-primary/20',   getName: l => dictionary.animals.squirrel[l], playSound: () => playAnimalSound('squirrel'), getFunFact: l => dictionary.funFacts.squirrel[l] },
  { id: 'pig',      image: pigPhoto,      objectPosition: 'center 40%', color: 'bg-pink-100',     getName: l => dictionary.animals.pig[l],      playSound: () => playAnimalSound('pig'),      getFunFact: l => dictionary.funFacts.pig[l] },
  { id: 'sheep',    image: sheepPhoto,    objectPosition: 'center 25%', color: 'bg-blue-50',      getName: l => dictionary.animals.sheep[l],    playSound: () => playAnimalSound('sheep'),    getFunFact: l => dictionary.funFacts.sheep[l] },
  { id: 'rooster',  image: roosterPhoto,  objectPosition: 'center 20%', color: 'bg-red-50',       getName: l => dictionary.animals.rooster[l],  playSound: () => playAnimalSound('rooster'),  getFunFact: l => dictionary.funFacts.rooster[l] },
];

// ── Vehicles ─────────────────────────────────────────────────────────────────

const vehicleItems: SoundItem[] = [
  { id: 'fire-truck',   image: '/vehicles/fire-truck.png',  objectPosition: 'center 40%', color: 'bg-red-50',    getName: l => dictionary.vehicles['fire-truck'][l],   playSound: () => playVehicleSound('fire-truck'),   getFunFact: l => dictionary.vehicleFacts['fire-truck'][l] },
  { id: 'police',       image: '/vehicles/police.jpg',       objectPosition: 'center 50%', color: 'bg-blue-50',   getName: l => dictionary.vehicles['police'][l],       playSound: () => playVehicleSound('police'),       getFunFact: l => dictionary.vehicleFacts['police'][l] },
  { id: 'ambulance',    image: '/vehicles/ambulance.jpg',    objectPosition: 'center 40%', color: 'bg-yellow-50', getName: l => dictionary.vehicles['ambulance'][l],    playSound: () => playVehicleSound('ambulance'),    getFunFact: l => dictionary.vehicleFacts['ambulance'][l] },
  { id: 'construction', image: '/vehicles/construction.jpg', objectPosition: 'center 50%', color: 'bg-amber-50',  getName: l => dictionary.vehicles['construction'][l], playSound: () => playVehicleSound('construction'), getFunFact: l => dictionary.vehicleFacts['construction'][l] },
  { id: 'train',        image: '/vehicles/train.jpg',        objectPosition: 'center 50%', color: 'bg-slate-50',  getName: l => dictionary.vehicles['train'][l],        playSound: () => playVehicleSound('train'),        getFunFact: l => dictionary.vehicleFacts['train'][l] },
  { id: 'school-bus',   image: '/vehicles/schoolbus.jpg',    objectPosition: 'center 50%', color: 'bg-amber-50',  getName: l => dictionary.vehicles['school-bus'][l],   playSound: () => playVehicleSound('school-bus'),   getFunFact: l => dictionary.vehicleFacts['school-bus'][l] },
  { id: 'airplane',     image: '/vehicles/airplane.jpg',     objectPosition: 'center 50%', color: 'bg-sky-50',    getName: l => dictionary.vehicles['airplane'][l],     playSound: () => playVehicleSound('airplane'),     getFunFact: l => dictionary.vehicleFacts['airplane'][l] },
  { id: 'helicopter',   image: '/vehicles/helicopter.png',   objectPosition: 'center 50%', color: 'bg-sky-50',    getName: l => dictionary.vehicles['helicopter'][l],   playSound: () => playVehicleSound('helicopter'),   getFunFact: l => dictionary.vehicleFacts['helicopter'][l] },
];

// ── Categories ────────────────────────────────────────────────────────────────

export const soundCategories: SoundCategory[] = [
  {
    id: 'animals',
    getLabelKey: l => dictionary.ui.soundsCategoryAnimals[l],
    emoji: '🐾',
    items: animalItems,
  },
  {
    id: 'vehicles',
    getLabelKey: l => dictionary.ui.soundsCategoryVehicles[l],
    emoji: '🚗',
    items: vehicleItems,
  },
];
