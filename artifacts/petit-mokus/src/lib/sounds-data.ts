import { Language, dictionary } from './i18n';
import { playAnimalSound, playVehicleSound, playNatureSound } from './audio';

import { animalPhotos, animalPhotosSmall } from "./animal-photos";

const {
  dog: dogPhoto,
  cat: catPhoto,
  horse: horsePhoto,
  cow: cowPhoto,
  fox: foxPhoto,
  wolf: wolfPhoto,
  squirrel: squirrelPhoto,
  pig: pigPhoto,
  sheep: sheepPhoto,
  rooster: roosterPhoto,
} = animalPhotos;

export interface SoundItem {
  id: string;
  /** URL/path to the image: a bundled asset for animals, a public path (small card copies) for vehicles and nature. */
  image: string;
  /** A 280 px copy of `image` for small screens, when there is one. */
  imageSmall?: string;
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
  { id: 'dog',      image: dogPhoto, imageSmall: animalPhotosSmall.dog,      objectPosition: 'center 25%', color: 'bg-accent/20',    getName: l => dictionary.animals.dog[l],      playSound: () => playAnimalSound('dog'),      getFunFact: l => dictionary.funFacts.dog[l] },
  { id: 'cat',      image: catPhoto, imageSmall: animalPhotosSmall.cat,      objectPosition: 'center 15%', color: 'bg-primary/10',   getName: l => dictionary.animals.cat[l],      playSound: () => playAnimalSound('cat'),      getFunFact: l => dictionary.funFacts.cat[l] },
  { id: 'horse',    image: horsePhoto, imageSmall: animalPhotosSmall.horse,    objectPosition: 'center 30%', color: 'bg-secondary/20', getName: l => dictionary.animals.horse[l],    playSound: () => playAnimalSound('horse'),    getFunFact: l => dictionary.funFacts.horse[l] },
  { id: 'cow',      image: cowPhoto, imageSmall: animalPhotosSmall.cow,      objectPosition: 'center 65%', color: 'bg-chart-3/50',   getName: l => dictionary.animals.cow[l],      playSound: () => playAnimalSound('cow'),      getFunFact: l => dictionary.funFacts.cow[l] },
  { id: 'fox',      image: foxPhoto, imageSmall: animalPhotosSmall.fox,      objectPosition: 'center 42%', color: 'bg-orange-100',   getName: l => dictionary.animals.fox[l],      playSound: () => playAnimalSound('fox'),      getFunFact: l => dictionary.funFacts.fox[l] },
  { id: 'wolf',     image: wolfPhoto, imageSmall: animalPhotosSmall.wolf,     objectPosition: 'center 25%', color: 'bg-slate-100',    getName: l => dictionary.animals.wolf[l],     playSound: () => playAnimalSound('wolf'),     getFunFact: l => dictionary.funFacts.wolf[l] },
  { id: 'squirrel', image: squirrelPhoto, imageSmall: animalPhotosSmall.squirrel, objectPosition: 'center 30%', color: 'bg-primary/20',   getName: l => dictionary.animals.squirrel[l], playSound: () => playAnimalSound('squirrel'), getFunFact: l => dictionary.funFacts.squirrel[l] },
  { id: 'pig',      image: pigPhoto, imageSmall: animalPhotosSmall.pig,      objectPosition: 'center 40%', color: 'bg-pink-100',     getName: l => dictionary.animals.pig[l],      playSound: () => playAnimalSound('pig'),      getFunFact: l => dictionary.funFacts.pig[l] },
  { id: 'sheep',    image: sheepPhoto, imageSmall: animalPhotosSmall.sheep,    objectPosition: 'center 25%', color: 'bg-blue-50',      getName: l => dictionary.animals.sheep[l],    playSound: () => playAnimalSound('sheep'),    getFunFact: l => dictionary.funFacts.sheep[l] },
  { id: 'rooster',  image: roosterPhoto, imageSmall: animalPhotosSmall.rooster,  objectPosition: 'center 20%', color: 'bg-red-50',       getName: l => dictionary.animals.rooster[l],  playSound: () => playAnimalSound('rooster'),  getFunFact: l => dictionary.funFacts.rooster[l] },
];

// ── Vehicles ─────────────────────────────────────────────────────────────────

const vehicleItems: SoundItem[] = [
  { id: 'fire-truck',   image: '/vehicles/fire-truck-card.jpg', imageSmall: '/vehicles/fire-truck-card-sm.jpg',  objectPosition: 'center 40%', color: 'bg-red-50',    getName: l => dictionary.vehicles['fire-truck'][l],   playSound: () => playVehicleSound('fire-truck'),   getFunFact: l => dictionary.vehicleFacts['fire-truck'][l] },
  { id: 'police',       image: '/vehicles/police-card.jpg', imageSmall: '/vehicles/police-card-sm.jpg',       objectPosition: 'center 50%', color: 'bg-blue-50',   getName: l => dictionary.vehicles['police'][l],       playSound: () => playVehicleSound('police'),       getFunFact: l => dictionary.vehicleFacts['police'][l] },
  { id: 'ambulance',    image: '/vehicles/ambulance-card.jpg', imageSmall: '/vehicles/ambulance-card-sm.jpg',    objectPosition: 'center 40%', color: 'bg-yellow-50', getName: l => dictionary.vehicles['ambulance'][l],    playSound: () => playVehicleSound('ambulance'),    getFunFact: l => dictionary.vehicleFacts['ambulance'][l] },
  { id: 'construction', image: '/vehicles/construction.jpg', objectPosition: 'center 50%', color: 'bg-amber-50',  getName: l => dictionary.vehicles['construction'][l], playSound: () => playVehicleSound('construction'), getFunFact: l => dictionary.vehicleFacts['construction'][l] },
  { id: 'train',        image: '/vehicles/train.jpg',        objectPosition: 'center 50%', color: 'bg-slate-50',  getName: l => dictionary.vehicles['train'][l],        playSound: () => playVehicleSound('train'),        getFunFact: l => dictionary.vehicleFacts['train'][l] },
  { id: 'school-bus',   image: '/vehicles/schoolbus.jpg',    objectPosition: 'center 50%', color: 'bg-amber-50',  getName: l => dictionary.vehicles['school-bus'][l],   playSound: () => playVehicleSound('school-bus'),   getFunFact: l => dictionary.vehicleFacts['school-bus'][l] },
  { id: 'airplane',     image: '/vehicles/airplane-card.jpg', imageSmall: '/vehicles/airplane-card-sm.jpg',     objectPosition: 'center 50%', color: 'bg-sky-50',    getName: l => dictionary.vehicles['airplane'][l],     playSound: () => playVehicleSound('airplane'),     getFunFact: l => dictionary.vehicleFacts['airplane'][l] },
  { id: 'helicopter',   image: '/vehicles/helicopter-card.jpg', imageSmall: '/vehicles/helicopter-card-sm.jpg',   objectPosition: 'center 50%', color: 'bg-sky-50',    getName: l => dictionary.vehicles['helicopter'][l],   playSound: () => playVehicleSound('helicopter'),   getFunFact: l => dictionary.vehicleFacts['helicopter'][l] },
];

// ── Nature ────────────────────────────────────────────────────────────────────

const natureItems: SoundItem[] = [
  { id: 'waves',        image: '/Nature/waves-card.jpg', imageSmall: '/Nature/waves-card-sm.jpg',        objectPosition: 'center 50%', color: 'bg-blue-50',   getName: l => dictionary.nature.waves[l],          playSound: () => playNatureSound('waves'),        getFunFact: l => dictionary.natureFacts.waves[l] },
  { id: 'fire',         image: '/Nature/fire-card.jpg', imageSmall: '/Nature/fire-card-sm.jpg',         objectPosition: 'center 50%', color: 'bg-orange-50', getName: l => dictionary.nature.fire[l],           playSound: () => playNatureSound('fire'),         getFunFact: l => dictionary.natureFacts.fire[l] },
  { id: 'thunder',      image: '/Nature/thunder-card.jpg', imageSmall: '/Nature/thunder-card-sm.jpg',      objectPosition: 'center 40%', color: 'bg-slate-100', getName: l => dictionary.nature.thunder[l],        playSound: () => playNatureSound('thunder'),      getFunFact: l => dictionary.natureFacts.thunder[l] },
  { id: 'tornado',      image: '/Nature/tornado.jpg',      objectPosition: 'center 50%', color: 'bg-gray-100',  getName: l => dictionary.nature.tornado[l],        playSound: () => playNatureSound('tornado'),      getFunFact: l => dictionary.natureFacts.tornado[l] },
  { id: 'waterfall',    image: '/Nature/waterfall-card.jpg', imageSmall: '/Nature/waterfall-card-sm.jpg',    objectPosition: 'center 50%', color: 'bg-cyan-50',   getName: l => dictionary.nature.waterfall[l],      playSound: () => playNatureSound('waterfall'),    getFunFact: l => dictionary.natureFacts.waterfall[l] },
  { id: 'summer-night', image: '/Nature/Summer night.jpg', objectPosition: 'center 50%', color: 'bg-indigo-50', getName: l => dictionary.nature['summer-night'][l], playSound: () => playNatureSound('summer-night'), getFunFact: l => dictionary.natureFacts['summer-night'][l] },
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
  {
    id: 'nature',
    getLabelKey: l => dictionary.ui.soundsCategoryNature[l],
    emoji: '🌿',
    items: natureItems,
  },
];
