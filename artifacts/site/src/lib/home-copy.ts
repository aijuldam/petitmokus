import type { Locale } from "./i18n";

/**
 * The parent homepage, in every language that has one (/<locale>/). English
 * is the original; the others say the same thing in the voice of each
 * product ("vous" in French, "te/ti" in Hungarian, "ihr" in German,
 * "voi" in Italian, "vosotros" in Spanish, "vocês" in European Portuguese).
 * The brand tagline stays English everywhere, like the header.
 */
export interface HomeCopy {
  description: string;
  heroTitle: string;
  lead: string;
  worldsLabel: string;
  live: string;
  soon: string;
  explore: string;
  worldsTitle: string;
  babynaming: { label: string; cta: string; text: string };
  kids: { label: string; cta: string; text: string };
  cotton: { label: string; text: string };
  storyTitle: string;
  storyLead: string;
  story: [string, string, string];
  journalTitle: string;
  articleKind: string;
  updateKind: string;
  readJournal: string;
}

const NBSP = " ";

export const HOME: Record<Locale, HomeCopy> = {
  en: {
    description:
      "A digital companion for families, from preparing for your baby’s arrival to discovering the world together as your child grows.",
    heroTitle:
      "Petit Mokus is a digital companion for families, from preparing for your baby’s arrival to discovering the world together as your child grows.",
    lead: "For the moments before they arrive, and all the little discoveries that follow.",
    worldsLabel: "The three Petit Mokus worlds",
    live: "Live",
    soon: "Coming soon",
    explore: "Explore our little worlds",
    worldsTitle: "One family, three little worlds",
    babynaming: {
      label: "Before they arrive",
      cta: "Open BabyNaming",
      text: "Choose your baby’s name together, as two parents.",
    },
    kids: {
      label: "As they grow",
      cta: "Open Kids",
      text: "Sounds, lullabies and simple games to enjoy together.",
    },
    cotton: {
      label: "For everyday adventures",
      text: "Natural materials for little everyday adventures. A small collection is taking shape.",
    },
    storyTitle: "Our story",
    storyLead: "It began at home.",
    story: [
      "Petit Mokus is multicultural at its core, crafted by a French-Hungarian family in Amsterdam.",
      "Mokus means squirrel in Hungarian: a small, curious animal that thrives through play, exploration, and a love of small, meaningful moments.",
      "Like a little squirrel gathering nuts, Petit Mokus brings together gentle interactions for family life, one small moment at a time.",
    ],
    journalTitle: "From the Journal",
    articleKind: "Article",
    updateKind: "Update",
    readJournal: "Read the Journal",
  },
  fr: {
    description:
      "Un compagnon numérique pour les familles, de la préparation à l’arrivée de bébé jusqu’à la découverte du monde ensemble, à mesure que votre enfant grandit.",
    heroTitle:
      "Petit Mokus est un compagnon numérique pour les familles, de la préparation à l’arrivée de bébé jusqu’à la découverte du monde ensemble, à mesure que votre enfant grandit.",
    lead: "Pour les moments qui précèdent son arrivée, et toutes les petites découvertes qui suivent.",
    worldsLabel: "Les trois univers Petit Mokus",
    live: "Disponible",
    soon: "Bientôt",
    explore: "Découvrir nos petits univers",
    worldsTitle: "Une famille, trois petits univers",
    babynaming: {
      label: "Avant son arrivée",
      cta: "Ouvrir BabyNaming",
      text: "Choisissez à deux le prénom de votre bébé.",
    },
    kids: {
      label: "Pendant qu’il grandit",
      cta: "Ouvrir Kids",
      text: "Des sons, des berceuses et des jeux simples à partager.",
    },
    cotton: {
      label: "Pour les aventures du quotidien",
      text: "Des matières naturelles pour les petites aventures du quotidien. Une petite collection prend forme.",
    },
    storyTitle: "Notre histoire",
    storyLead: "Tout a commencé à la maison.",
    story: [
      "Petit Mokus est multiculturel par essence, imaginé par une famille franco-hongroise à Amsterdam.",
      `Mokus signifie écureuil en hongrois${NBSP}: un petit animal curieux qui s’épanouit par le jeu, l’exploration et le goût des petits moments qui comptent.`,
      "Comme un petit écureuil qui rassemble ses noisettes, Petit Mokus réunit de douces interactions pour la vie de famille, un petit moment à la fois.",
    ],
    journalTitle: "Dans le Journal",
    articleKind: "Article",
    updateKind: "Nouveauté",
    readJournal: "Lire le Journal",
  },
  hu: {
    description:
      "Digitális társ családoknak, a baba érkezésére való készülődéstől a világ közös felfedezéséig, ahogy a gyermeked nő.",
    heroTitle:
      "A Petit Mokus digitális társ családoknak, a baba érkezésére való készülődéstől a világ közös felfedezéséig, ahogy a gyermeked nő.",
    lead: "Az érkezése előtti pillanatokra, és minden apró felfedezésre, ami utána jön.",
    worldsLabel: "A Petit Mokus három világa",
    live: "Elérhető",
    soon: "Hamarosan",
    explore: "Fedezd fel kis világainkat",
    worldsTitle: "Egy család, három kis világ",
    babynaming: {
      label: "Mielőtt megérkezik",
      cta: "BabyNaming megnyitása",
      text: "Válasszatok együtt, kettesben nevet a babátoknak.",
    },
    kids: {
      label: "Ahogy nő",
      cta: "Kids megnyitása",
      text: "Hangok, altatódalok és egyszerű játékok a közös örömhöz.",
    },
    cotton: {
      label: "A mindennapi kalandokhoz",
      text: "Természetes anyagok a mindennapok apró kalandjaihoz. Egy kis kollekció van készülőben.",
    },
    storyTitle: "Történetünk",
    storyLead: "Otthon kezdődött.",
    story: [
      "A Petit Mokus a lényegét tekintve multikulturális: egy francia–magyar család álmodta meg Amszterdamban.",
      "A név a magyar mókus szóból ered: egy kis, kíváncsi állatéból, amely a játékban, a felfedezésben és az apró, értékes pillanatok szeretetében teljesedik ki.",
      "Ahogy a kis mókus gyűjtögeti a diót, úgy gyűjti össze a Petit Mokus a családi élet gyengéd pillanatait, egyszerre egy apró pillanatot.",
    ],
    journalTitle: "A Naplóból",
    articleKind: "Cikk",
    updateKind: "Újdonság",
    readJournal: "Tovább a Naplóhoz",
  },
  de: {
    description:
      "Ein digitaler Begleiter für Familien, von der Vorbereitung auf die Ankunft eures Babys bis zum gemeinsamen Entdecken der Welt, während euer Kind wächst.",
    heroTitle:
      "Petit Mokus ist ein digitaler Begleiter für Familien, von der Vorbereitung auf die Ankunft eures Babys bis zum gemeinsamen Entdecken der Welt, während euer Kind wächst.",
    lead: "Für die Momente vor seiner Ankunft und all die kleinen Entdeckungen danach.",
    worldsLabel: "Die drei Welten von Petit Mokus",
    live: "Verfügbar",
    soon: "Demnächst",
    explore: "Unsere kleinen Welten entdecken",
    worldsTitle: "Eine Familie, drei kleine Welten",
    babynaming: {
      label: "Bevor es da ist",
      cta: "BabyNaming öffnen",
      text: "Wählt als Eltern gemeinsam den Namen für euer Baby.",
    },
    kids: {
      label: "Während es wächst",
      cta: "Kids öffnen",
      text: "Klänge, Schlaflieder und einfache Spiele für gemeinsame Momente.",
    },
    cotton: {
      label: "Für die kleinen Abenteuer im Alltag",
      text: "Natürliche Materialien für kleine Alltagsabenteuer. Eine kleine Kollektion entsteht.",
    },
    storyTitle: "Unsere Geschichte",
    storyLead: "Alles begann zu Hause.",
    story: [
      "Petit Mokus ist von Grund auf multikulturell, gestaltet von einer französisch-ungarischen Familie in Amsterdam.",
      "Mokus bedeutet auf Ungarisch Eichhörnchen: ein kleines, neugieriges Tier, das beim Spielen, Entdecken und in kleinen, bedeutsamen Momenten aufblüht.",
      "Wie ein kleines Eichhörnchen, das Nüsse sammelt, bringt Petit Mokus sanfte Begegnungen ins Familienleben, einen kleinen Moment nach dem anderen.",
    ],
    journalTitle: "Aus dem Journal",
    articleKind: "Artikel",
    updateKind: "Neuigkeit",
    readJournal: "Zum Journal",
  },
  it: {
    description:
      "Un compagno digitale per le famiglie, dalla preparazione all’arrivo del bebè alla scoperta del mondo insieme, mentre il vostro bambino cresce.",
    heroTitle:
      "Petit Mokus è un compagno digitale per le famiglie, dalla preparazione all’arrivo del bebè alla scoperta del mondo insieme, mentre il vostro bambino cresce.",
    lead: "Per i momenti prima del suo arrivo, e per tutte le piccole scoperte che seguono.",
    worldsLabel: "I tre mondi di Petit Mokus",
    live: "Disponibile",
    soon: "Presto in arrivo",
    explore: "Scoprite i nostri piccoli mondi",
    worldsTitle: "Una famiglia, tre piccoli mondi",
    babynaming: {
      label: "Prima del suo arrivo",
      cta: "Apri BabyNaming",
      text: "Scegliete insieme, in due, il nome del vostro bebè.",
    },
    kids: {
      label: "Mentre cresce",
      cta: "Apri Kids",
      text: "Suoni, ninne nanne e giochi semplici da condividere.",
    },
    cotton: {
      label: "Per le avventure di ogni giorno",
      text: "Materiali naturali per le piccole avventure di ogni giorno. Una piccola collezione sta prendendo forma.",
    },
    storyTitle: "La nostra storia",
    storyLead: "Tutto è iniziato a casa.",
    story: [
      "Petit Mokus è multiculturale nel profondo, creato da una famiglia franco-ungherese ad Amsterdam.",
      "Mokus in ungherese significa scoiattolo: un piccolo animale curioso che cresce giocando, esplorando e amando i piccoli momenti che contano.",
      "Come un piccolo scoiattolo che raccoglie le noci, Petit Mokus riunisce dolci momenti per la vita in famiglia, un piccolo momento alla volta.",
    ],
    journalTitle: "Dal Diario",
    articleKind: "Articolo",
    updateKind: "Novità",
    readJournal: "Leggi il Diario",
  },
  es: {
    description:
      "Un compañero digital para las familias, desde la preparación para la llegada de vuestro bebé hasta descubrir el mundo juntos mientras vuestro hijo crece.",
    heroTitle:
      "Petit Mokus es un compañero digital para las familias, desde la preparación para la llegada de vuestro bebé hasta descubrir el mundo juntos mientras vuestro hijo crece.",
    lead: "Para los momentos antes de su llegada y todos los pequeños descubrimientos que vienen después.",
    worldsLabel: "Los tres mundos de Petit Mokus",
    live: "Disponible",
    soon: "Próximamente",
    explore: "Descubrid nuestros pequeños mundos",
    worldsTitle: "Una familia, tres pequeños mundos",
    babynaming: {
      label: "Antes de su llegada",
      cta: "Abrir BabyNaming",
      text: "Elegid juntos, en pareja, el nombre de vuestro bebé.",
    },
    kids: {
      label: "Mientras crece",
      cta: "Abrir Kids",
      text: "Sonidos, nanas y juegos sencillos para disfrutar juntos.",
    },
    cotton: {
      label: "Para las aventuras de cada día",
      text: "Materiales naturales para las pequeñas aventuras de cada día. Una pequeña colección está tomando forma.",
    },
    storyTitle: "Nuestra historia",
    storyLead: "Todo empezó en casa.",
    story: [
      "Petit Mokus es multicultural en su esencia, creado por una familia franco-húngara en Ámsterdam.",
      "Mokus significa ardilla en húngaro: un animal pequeño y curioso que crece jugando, explorando y disfrutando de los pequeños momentos que importan.",
      "Como una pequeña ardilla que recoge frutos secos, Petit Mokus reúne momentos tiernos para la vida en familia, un pequeño momento cada vez.",
    ],
    journalTitle: "Del Diario",
    articleKind: "Artículo",
    updateKind: "Novedad",
    readJournal: "Leer el Diario",
  },
  pt: {
    description:
      "Um companheiro digital para as famílias, desde a preparação para a chegada do vosso bebé até à descoberta do mundo em conjunto, à medida que o vosso filho cresce.",
    heroTitle:
      "A Petit Mokus é um companheiro digital para as famílias, desde a preparação para a chegada do vosso bebé até à descoberta do mundo em conjunto, à medida que o vosso filho cresce.",
    lead: "Para os momentos antes da sua chegada e todas as pequenas descobertas que se seguem.",
    worldsLabel: "Os três mundos Petit Mokus",
    live: "Disponível",
    soon: "Em breve",
    explore: "Descubram os nossos pequenos mundos",
    worldsTitle: "Uma família, três pequenos mundos",
    babynaming: {
      label: "Antes de chegar",
      cta: "Abrir o BabyNaming",
      text: "Escolham juntos, a dois, o nome do vosso bebé.",
    },
    kids: {
      label: "À medida que cresce",
      cta: "Abrir o Kids",
      text: "Sons, canções de embalar e jogos simples para partilhar.",
    },
    cotton: {
      label: "Para as aventuras do dia a dia",
      text: "Materiais naturais para as pequenas aventuras do dia a dia. Uma pequena coleção está a ganhar forma.",
    },
    storyTitle: "A nossa história",
    storyLead: "Tudo começou em casa.",
    story: [
      "A Petit Mokus é multicultural na sua essência, criada por uma família franco-húngara em Amesterdão.",
      "Mokus significa esquilo em húngaro: um animal pequeno e curioso que cresce a brincar, a explorar e a gostar dos pequenos momentos que importam.",
      "Como um pequeno esquilo que junta frutos secos, a Petit Mokus reúne momentos ternos para a vida em família, um pequeno momento de cada vez.",
    ],
    journalTitle: "Do Diário",
    articleKind: "Artigo",
    updateKind: "Novidade",
    readJournal: "Ler o Diário",
  },
};
