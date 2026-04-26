export type Language = 'EN' | 'FR' | 'HU';

export const dictionary = {
  animals: {
    dog: { EN: 'Dog', FR: 'Chien', HU: 'Kutya' },
    cat: { EN: 'Cat', FR: 'Chat', HU: 'Macska' },
    horse: { EN: 'Horse', FR: 'Cheval', HU: 'Ló' },
    cow: { EN: 'Cow', FR: 'Vache', HU: 'Tehén' },
    fox: { EN: 'Fox', FR: 'Renard', HU: 'Róka' },
    wolf: { EN: 'Wolf', FR: 'Loup', HU: 'Farkas' },
    squirrel: { EN: 'Squirrel', FR: 'Écureuil', HU: 'Mókus' },
    pig: { EN: 'Pig', FR: 'Cochon', HU: 'Malac' },
    sheep: { EN: 'Sheep', FR: 'Mouton', HU: 'Juh' },
  },
  songs: {
    fr1: 'Pirouette, cacahuète',
    fr2: 'Pomme de reinette et pomme d\'api',
    fr3: 'Promenons-nous dans les bois',
    hu1: 'Tente, baba, tente',
    hu2: 'Bóbita',
    en1: 'Twinkle, Twinkle, Little Star',
    en2: 'Hush Little Baby'
  },
  ui: {
    sounds: { EN: 'Sounds', FR: 'Sons', HU: 'Hangok' },
    music: { EN: 'Music', FR: 'Musique', HU: 'Zene' },
    stories: { EN: 'Stories', FR: 'Histoires', HU: 'Mesék' },
    soon: { EN: 'Soon', FR: 'Bientôt', HU: 'Hamarosan' },
    storiesTitle: { EN: 'Bedtime Stories', FR: 'Histoires du Soir', HU: 'Esti Mesék' },
    storiesSub: { 
      EN: 'Soft little tales are on their way.', 
      FR: 'De douces petites histoires sont en route.', 
      HU: 'Lágy kis mesék már úton vannak.' 
    }
  }
};
