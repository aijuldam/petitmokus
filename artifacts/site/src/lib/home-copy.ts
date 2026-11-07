import type { Locale } from "./i18n";

/**
 * The parent homepage, in every language that has one (/<locale>/). Product
 * names, moment labels and one-liners live in the registry (data/products.json).
 * English is the original; the others say the same thing in the voice of each
 * product ("vous" in French, "te/ti" in Hungarian, "ihr" in German,
 * "voi" in Italian, "vosotros" in Spanish, "vocês" in European Portuguese).
 * The brand tagline stays English everywhere, like the header.
 */
export interface HomeCopy {
  description: string;
  heroTitle: string;
  /** The browser tab and search title, after "Petit Mokus | ". */
  pageTitle: string;
  lead: string;
  /** The line under the tiles. */
  oneAccount: string;
  worldsLabel: string;
  live: string;
  soon: string;
  explore: string;
  worldsTitle: string;
  /** "How it fits together": three short points. */
  fitsTitle: string;
  fits: [Point, Point, Point];
  storyTitle: string;
  storyLead: string;
  story: [string, string, string];
  journalTitle: string;
  articleKind: string;
  updateKind: string;
  readJournal: string;
}

interface Point {
  title: string;
  text: string;
}

const NBSP = " ";

export const HOME: Record<Locale, HomeCopy> = {
  en: {
    description:
      "Simple, gentle tools for families and the people they love: choosing a name, sharing wishes, planning time together and playing with your little ones.",
    heroTitle: "More moments, shared as a family",
    pageTitle: "Happily shared moments",
    lead: "Petit Mokus brings together simple tools for families and the people they love: choosing a name, sharing wishes, planning time together and playing with your little ones.",
    oneAccount: "One family of products. One Petit Mokus account where you need one.",
    worldsLabel: "The five Petit Mokus worlds",
    worldsTitle: "One family, five little worlds",
    fitsTitle: "How it fits together",
    fits: [
      { title: "Made for real family life", text: "From the first name to the big family get-together." },
      { title: "One account", text: "Sign in once with your Petit Mokus account for BabyNaming, Wishes and PlanIt." },
      { title: "In your language", text: "Petit Mokus speaks English, French, Hungarian, German, Italian, Spanish and Portuguese." },
    ],
    live: "Live",
    soon: "Coming soon",
    explore: "Explore our little worlds",
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
      `Des outils simples et doux pour les familles et ceux qu’elles aiment${NBSP}: choisir un prénom, partager ses envies, organiser des moments ensemble et jouer avec vos tout-petits.`,
    heroTitle: "Plus de moments, partagés en famille",
    pageTitle: "Des moments partagés avec bonheur",
    lead: `Petit Mokus réunit des outils simples pour les familles et ceux qu’elles aiment${NBSP}: choisir un prénom, partager ses envies, organiser des moments ensemble et jouer avec vos tout-petits.`,
    oneAccount: "Une famille de produits. Un seul compte Petit Mokus, là où il en faut un.",
    worldsLabel: "Les cinq univers Petit Mokus",
    worldsTitle: "Une famille, cinq petits univers",
    fitsTitle: "Comment tout s’articule",
    fits: [
      { title: "Pensé pour la vraie vie de famille", text: "Du choix du prénom aux grandes retrouvailles en famille." },
      { title: "Un seul compte", text: "Connectez-vous une fois avec votre compte Petit Mokus pour BabyNaming, Wishes et PlanIt." },
      { title: "Dans votre langue", text: "Petit Mokus parle anglais, français, hongrois, allemand, italien, espagnol et portugais." },
    ],
    live: "Disponible",
    soon: "Bientôt",
    explore: "Découvrir nos petits univers",
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
      "Egyszerű, gyengéd eszközök családoknak és szeretteiknek: névválasztás, kívánságok megosztása, közös idő tervezése és játék a kicsikkel.",
    heroTitle: "Több pillanat, családként megélve",
    pageTitle: "Boldogan megosztott pillanatok",
    lead: "A Petit Mokus egyszerű eszközöket gyűjt össze a családoknak és szeretteiknek: névválasztás, kívánságok megosztása, közös idő tervezése és játék a kicsikkel.",
    oneAccount: "Egy termékcsalád. Egyetlen Petit Mokus fiók, ahol szükség van rá.",
    worldsLabel: "A Petit Mokus öt világa",
    worldsTitle: "Egy család, öt kis világ",
    fitsTitle: "Hogyan áll össze",
    fits: [
      { title: "A valódi családi élethez", text: "Az első névtől a nagy családi összejövetelig." },
      { title: "Egy fiók", text: "Jelentkezz be egyszer a Petit Mokus fiókoddal a BabyNaminghez, a Wisheshez és a PlanIthez." },
      { title: "A te nyelveden", text: "A Petit Mokus beszél angolul, franciául, magyarul, németül, olaszul, spanyolul és portugálul." },
    ],
    live: "Elérhető",
    soon: "Hamarosan",
    explore: "Fedezd fel kis világainkat",
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
      "Einfache, sanfte Werkzeuge für Familien und die Menschen, die sie lieben: einen Namen wählen, Wünsche teilen, gemeinsame Zeit planen und mit euren Kleinen spielen.",
    heroTitle: "Mehr Momente, als Familie geteilt",
    pageTitle: "Glücklich geteilte Momente",
    lead: "Petit Mokus vereint einfache Werkzeuge für Familien und die Menschen, die sie lieben: einen Namen wählen, Wünsche teilen, gemeinsame Zeit planen und mit euren Kleinen spielen.",
    oneAccount: "Eine Produktfamilie. Ein Petit-Mokus-Konto, wo ihr eins braucht.",
    worldsLabel: "Die fünf Welten von Petit Mokus",
    worldsTitle: "Eine Familie, fünf kleine Welten",
    fitsTitle: "Wie alles zusammenpasst",
    fits: [
      { title: "Gemacht für echtes Familienleben", text: "Vom ersten Namen bis zum großen Familientreffen." },
      { title: "Ein Konto", text: "Meldet euch einmal mit eurem Petit-Mokus-Konto an, für BabyNaming, Wishes und PlanIt." },
      { title: "In eurer Sprache", text: "Petit Mokus spricht Englisch, Französisch, Ungarisch, Deutsch, Italienisch, Spanisch und Portugiesisch." },
    ],
    live: "Verfügbar",
    soon: "Demnächst",
    explore: "Unsere kleinen Welten entdecken",
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
      "Strumenti semplici e delicati per le famiglie e le persone che amano: scegliere un nome, condividere desideri, organizzare il tempo insieme e giocare con i vostri piccoli.",
    heroTitle: "Più momenti, condivisi in famiglia",
    pageTitle: "Momenti condivisi con gioia",
    lead: "Petit Mokus riunisce strumenti semplici per le famiglie e le persone che amano: scegliere un nome, condividere desideri, organizzare il tempo insieme e giocare con i vostri piccoli.",
    oneAccount: "Una famiglia di prodotti. Un solo account Petit Mokus, dove serve.",
    worldsLabel: "I cinque mondi di Petit Mokus",
    worldsTitle: "Una famiglia, cinque piccoli mondi",
    fitsTitle: "Come si incastra tutto",
    fits: [
      { title: "Pensato per la vera vita di famiglia", text: "Dal primo nome alla grande riunione di famiglia." },
      { title: "Un solo account", text: "Accedete una volta con il vostro account Petit Mokus per BabyNaming, Wishes e PlanIt." },
      { title: "Nella vostra lingua", text: "Petit Mokus parla inglese, francese, ungherese, tedesco, italiano, spagnolo e portoghese." },
    ],
    live: "Disponibile",
    soon: "Presto in arrivo",
    explore: "Scoprite i nostri piccoli mondi",
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
      "Herramientas sencillas y tiernas para las familias y las personas que quieren: elegir un nombre, compartir deseos, planear tiempo juntos y jugar con vuestros pequeños.",
    heroTitle: "Más momentos, compartidos en familia",
    pageTitle: "Momentos compartidos con alegría",
    lead: "Petit Mokus reúne herramientas sencillas para las familias y las personas que quieren: elegir un nombre, compartir deseos, planear tiempo juntos y jugar con vuestros pequeños.",
    oneAccount: "Una familia de productos. Una sola cuenta Petit Mokus, donde haga falta.",
    worldsLabel: "Los cinco mundos de Petit Mokus",
    worldsTitle: "Una familia, cinco pequeños mundos",
    fitsTitle: "Cómo encaja todo",
    fits: [
      { title: "Pensado para la vida familiar real", text: "Desde el primer nombre hasta la gran reunión familiar." },
      { title: "Una sola cuenta", text: "Iniciad sesión una vez con vuestra cuenta Petit Mokus para BabyNaming, Wishes y PlanIt." },
      { title: "En vuestro idioma", text: "Petit Mokus habla inglés, francés, húngaro, alemán, italiano, español y portugués." },
    ],
    live: "Disponible",
    soon: "Próximamente",
    explore: "Descubrid nuestros pequeños mundos",
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
      "Ferramentas simples e ternas para as famílias e as pessoas de quem gostam: escolher um nome, partilhar desejos, planear tempo juntos e brincar com os vossos pequenos.",
    heroTitle: "Mais momentos, partilhados em família",
    pageTitle: "Momentos partilhados com alegria",
    lead: "A Petit Mokus reúne ferramentas simples para as famílias e as pessoas de quem gostam: escolher um nome, partilhar desejos, planear tempo juntos e brincar com os vossos pequenos.",
    oneAccount: "Uma família de produtos. Uma só conta Petit Mokus, onde for precisa.",
    worldsLabel: "Os cinco mundos Petit Mokus",
    worldsTitle: "Uma família, cinco pequenos mundos",
    fitsTitle: "Como tudo se encaixa",
    fits: [
      { title: "Feito para a vida familiar real", text: "Do primeiro nome ao grande encontro de família." },
      { title: "Uma só conta", text: "Entrem uma vez com a vossa conta Petit Mokus para BabyNaming, Wishes e PlanIt." },
      { title: "Na vossa língua", text: "A Petit Mokus fala inglês, francês, húngaro, alemão, italiano, espanhol e português." },
    ],
    live: "Disponível",
    soon: "Em breve",
    explore: "Descubram os nossos pequenos mundos",
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
