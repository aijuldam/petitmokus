// Animal photos, shared by the Sounds tab and the animal games.
//
// These are 480 px (short side) copies of the original Unsplash photos in
// attached_assets/, which run from 0.7 to 8.5 MB each. The photos are shown
// at no more than about 190 CSS px, so 480 px stays sharp on 2.5x screens.
// The 280 px "-sm" copies are for Sounds cards on 1x and 2x screens.
import dog from "../assets/animals/dog.jpg";
import cat from "../assets/animals/cat.jpg";
import horse from "../assets/animals/horse.jpg";
import cow from "../assets/animals/cow.jpg";
import fox from "../assets/animals/fox.jpg";
import wolf from "../assets/animals/wolf.jpg";
import squirrel from "../assets/animals/squirrel.jpg";
import pig from "../assets/animals/pig.jpg";
import sheep from "../assets/animals/sheep.jpg";
import rooster from "../assets/animals/rooster.jpg";
import dogSm from "../assets/animals/dog-sm.jpg";
import catSm from "../assets/animals/cat-sm.jpg";
import horseSm from "../assets/animals/horse-sm.jpg";
import cowSm from "../assets/animals/cow-sm.jpg";
import foxSm from "../assets/animals/fox-sm.jpg";
import wolfSm from "../assets/animals/wolf-sm.jpg";
import squirrelSm from "../assets/animals/squirrel-sm.jpg";
import pigSm from "../assets/animals/pig-sm.jpg";
import sheepSm from "../assets/animals/sheep-sm.jpg";
import roosterSm from "../assets/animals/rooster-sm.jpg";

export const animalPhotos = { dog, cat, horse, cow, fox, wolf, squirrel, pig, sheep, rooster };

export const animalPhotosSmall: Record<keyof typeof animalPhotos, string> = {
  dog: dogSm, cat: catSm, horse: horseSm, cow: cowSm, fox: foxSm, wolf: wolfSm, squirrel: squirrelSm, pig: pigSm, sheep: sheepSm, rooster: roosterSm,
};
