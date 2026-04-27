export type Language = 'EN' | 'FR' | 'HU';

export const dictionary = {
  animals: {
    dog:      { EN: 'Dog',      FR: 'Chien',    HU: 'Kutya'  },
    cat:      { EN: 'Cat',      FR: 'Chat',     HU: 'Macska' },
    horse:    { EN: 'Horse',    FR: 'Cheval',   HU: 'Ló'     },
    cow:      { EN: 'Cow',      FR: 'Vache',    HU: 'Tehén'  },
    fox:      { EN: 'Fox',      FR: 'Renard',   HU: 'Róka'   },
    wolf:     { EN: 'Wolf',     FR: 'Loup',     HU: 'Farkas' },
    squirrel: { EN: 'Squirrel', FR: 'Écureuil', HU: 'Mókus'  },
    pig:      { EN: 'Pig',      FR: 'Cochon',   HU: 'Malac'  },
    sheep:    { EN: 'Sheep',    FR: 'Mouton',   HU: 'Juh'    },
    rooster:  { EN: 'Rooster',  FR: 'Coq',      HU: 'Kakas'  },
  },
  funFacts: {
    dog: {
      EN: "Their nose is 100,000× better than ours! They can sniff out hidden treats — or even detect diseases.",
      FR: "Leur nez est 100 000× plus fort que le nôtre ! Ils détectent les friandises cachées — et même les maladies.",
      HU: "Az orruk 100 000-szer jobb mint a miénk! Megérzik a rejtett finomságokat — sőt betegségeket is.",
    },
    cat: {
      EN: "Cats jump 6× their own height — true ninja acrobats! They always land on their feet.",
      FR: "Les chats sautent 6× leur taille — de vrais ninjas ! Et ils retombent toujours sur leurs pattes.",
      HU: "A macskák saját magasságuk 6-szorosát ugorják — igazi nindzsák! És mindig a talpukra esnek.",
    },
    horse: {
      EN: "Horses sleep standing up, always ready to gallop! Baby horses can walk just minutes after birth.",
      FR: "Les chevaux dorment debout, prêts à galoper ! Les poulains marchent quelques minutes après leur naissance.",
      HU: "A lovak állva alszanak, készen a vágtára! A csikók már születés után percekkel járkálnak.",
    },
    cow: {
      EN: "Cows have best friends and feel sad when apart. They can recognise up to 100 other cow faces!",
      FR: "Les vaches ont de vraies meilleures amies et s'ennuient sans elles. Elles reconnaissent jusqu'à 100 visages !",
      HU: "A teheneknek legjobb barátaik vannak, és szomorkodnak nélkülük. Akár 100 tehénarcot is felismernek!",
    },
    fox: {
      EN: "Foxes climb trees better than cats! They make over 40 different sounds to chat with their friends.",
      FR: "Les renards grimpent aux arbres mieux que les chats ! Ils font plus de 40 sons pour se parler.",
      HU: "A rókák jobban másznak fára, mint a macskák! Több mint 40 hangot adnak ki, hogy csevegjenek.",
    },
    wolf: {
      EN: "Wolves live and hunt in close family packs. Wolf dads help raise up to 10 fluffy pups!",
      FR: "Les loups vivent en famille et chassent ensemble. Les papas aident à élever jusqu'à 10 louveteaux !",
      HU: "A farkasok szoros csapatban élnek és vadásznak. A farkasapák akár 10 bolyhos kölyköt nevelnek!",
    },
    squirrel: {
      EN: "Squirrels plant thousands of trees by accident — they bury nuts for later snacks, then forget where!",
      FR: "Les écureuils plantent des milliers d'arbres par accident — ils enterrent des noix... et les oublient !",
      HU: "A mókusok véletlenül ezernyi fát ültetnek — elásnak diókat uzsonnára, aztán elfelejtik, hol!",
    },
    pig: {
      EN: "Pigs use their super-sensitive snout to find food buried underground — little treasure hunters!",
      FR: "Les cochons utilisent leur groin ultra-sensible pour trouver de la nourriture cachée sous terre !",
      HU: "A malacok szuperérzékeny orrukkal a föld alá rejtett ételt is megtalálják — kis kincsvadászok!",
    },
    sheep: {
      EN: "Sheep remember 50 faces — sheep or human — for over 2 years. Friends are never forgotten!",
      FR: "Les moutons retiennent 50 visages pendant plus de 2 ans — ils n'oublient jamais leurs amis !",
      HU: "A juhok 50 arcot emlékeznek 2 évig — juhtársét vagy emberét. A barátokat sosem felejtik el!",
    },
    rooster: {
      EN: "Roosters crow every single morning to wake their chicken friends — nature's noisiest alarm clock!",
      FR: "Le coq chante 'cocorico !' chaque matin pour réveiller ses amis — le réveil le plus bruyant !",
      HU: "A kakas minden reggel kukorékol, hogy felélessze barátikat — a természet leghangosabb ébresztőórája!",
    },
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
    sounds:      { EN: 'Sounds',   FR: 'Sons',      HU: 'Hangok'     },
    music:       { EN: 'Music',    FR: 'Musique',   HU: 'Zene'       },
    stories:     { EN: 'Stories',  FR: 'Histoires', HU: 'Mesék'      },
    soon:        { EN: 'Soon',     FR: 'Bientôt',   HU: 'Hamarosan'  },
    storiesTitle: { EN: 'Bedtime Stories', FR: 'Histoires du Soir', HU: 'Esti Mesék' },
    storiesSub: {
      EN: 'Soft little tales are on their way.',
      FR: 'De douces petites histoires sont en route.',
      HU: 'Lágy kis mesék már úton vannak.'
    }
  }
};
