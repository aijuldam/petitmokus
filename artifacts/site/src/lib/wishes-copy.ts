import type { Locale } from "./i18n";

/**
 * The Wishes public page and its place on the homepage, in every language
 * with a homepage. Each language speaks in the voice of the Wishes app: "vous"
 * in French, "te" in Hungarian, "du" in German, "tu" in Italian, Spanish and
 * European Portuguese.
 */
export interface WishesCopy {
  worldsLabel: string;
  worldsTitle: string;
  label: string;
  cta: string;
  text: string;
  title: string;
  description: string;
  lead: string;
  start: string;
  signIn: string;
  free: string;
  stepsTitle: string;
  steps: [Step, Step, Step];
  closeTitle: string;
  closeText: string;
}

interface Step {
  title: string;
  text: string;
}

export const WISHES: Record<Locale, WishesCopy> = {
  en: {
    worldsLabel: "The four Petit Mokus worlds",
    worldsTitle: "One family, four little worlds",
    label: "For your celebrations",
    cta: "Open Wishes",
    text: "Make a wish list and share it with your loved ones.",
    title: "A wish list for every celebration",
    description:
      "Create a free wish list for a birth, a birthday, a baptism or any other celebration, and share it with your loved ones.",
    lead: "For a birth, a birthday, a baptism or any other celebration. Gather your wishes in one place, share one link, and your loved ones see what is still available.",
    start: "Create my wish list",
    signIn: "I already have an account",
    free: "Free to use",
    stepsTitle: "How it works",
    steps: [
      { title: "Make your list", text: "Add gifts by hand or from a shop link, with a price and a photo." },
      { title: "Share it", text: "Send one link, or invite only the people you choose." },
      { title: "No double gifts", text: "Loved ones reserve a gift with just their name, so nobody buys the same thing twice." },
    ],
    closeTitle: "Start your first list",
    closeText: "It only takes a moment.",
  },
  fr: {
    worldsLabel: "Les quatre univers Petit Mokus",
    worldsTitle: "Une famille, quatre petits univers",
    label: "Pour vos célébrations",
    cta: "Ouvrir Wishes",
    text: "Créez une liste d’envies et partagez-la avec vos proches.",
    title: "Une liste d’envies pour chaque célébration",
    description:
      "Créez gratuitement une liste d’envies pour une naissance, un anniversaire, un baptême ou toute autre célébration, et partagez-la avec vos proches.",
    lead: "Pour une naissance, un anniversaire, un baptême ou toute autre célébration. Réunissez vos envies au même endroit, partagez un seul lien, et vos proches voient ce qui reste disponible.",
    start: "Créer ma liste d’envies",
    signIn: "J’ai déjà un compte",
    free: "Gratuit",
    stepsTitle: "Comment ça marche",
    steps: [
      { title: "Créez votre liste", text: "Ajoutez vos cadeaux à la main ou depuis le lien d’une boutique, avec un prix et une photo." },
      { title: "Partagez-la", text: "Envoyez un seul lien, ou invitez uniquement les personnes de votre choix." },
      { title: "Pas de cadeau en double", text: "Vos proches réservent un cadeau avec leur seul prénom, et personne n’achète deux fois la même chose." },
    ],
    closeTitle: "Commencez votre première liste",
    closeText: "Cela ne prend qu’un instant.",
  },
  hu: {
    worldsLabel: "A Petit Mokus négy világa",
    worldsTitle: "Egy család, négy kis világ",
    label: "Az ünnepeidhez",
    cta: "Wishes megnyitása",
    text: "Készíts kívánságlistát, és oszd meg a szeretteiddel.",
    title: "Kívánságlista minden ünnepre",
    description:
      "Készíts ingyen kívánságlistát születésre, születésnapra, keresztelőre vagy bármilyen más ünnepre, és oszd meg a szeretteiddel.",
    lead: "Születésre, születésnapra, keresztelőre vagy bármilyen más ünnepre. Gyűjtsd egy helyre a kívánságaidat, oszd meg egyetlen linkkel, és a szeretteid látják, mi szabad még.",
    start: "Elkészítem a kívánságlistámat",
    signIn: "Már van fiókom",
    free: "Ingyenes",
    stepsTitle: "Így működik",
    steps: [
      { title: "Készítsd el a listádat", text: "Add hozzá az ajándékokat kézzel vagy egy bolti linkkel, árral és fotóval." },
      { title: "Oszd meg", text: "Küldj egyetlen linket, vagy csak azokat hívd meg, akiket szeretnél." },
      { title: "Nincs dupla ajándék", text: "A szeretteid egy névvel lefoglalhatnak egy ajándékot, így senki sem veszi meg kétszer ugyanazt." },
    ],
    closeTitle: "Kezdd el az első listádat",
    closeText: "Csak egy pillanat az egész.",
  },
  de: {
    worldsLabel: "Die vier Welten von Petit Mokus",
    worldsTitle: "Eine Familie, vier kleine Welten",
    label: "Für deine Feste",
    cta: "Wishes öffnen",
    text: "Erstelle eine Wunschliste und teile sie mit deinen Liebsten.",
    title: "Eine Wunschliste für jedes Fest",
    description:
      "Erstelle kostenlos eine Wunschliste für eine Geburt, einen Geburtstag, eine Taufe oder ein anderes Fest und teile sie mit deinen Liebsten.",
    lead: "Für eine Geburt, einen Geburtstag, eine Taufe oder ein anderes Fest. Sammle deine Wünsche an einem Ort, teile einen einzigen Link, und deine Liebsten sehen, was noch frei ist.",
    start: "Meine Wunschliste erstellen",
    signIn: "Ich habe schon ein Konto",
    free: "Kostenlos",
    stepsTitle: "So funktioniert es",
    steps: [
      { title: "Erstelle deine Liste", text: "Füge Geschenke von Hand oder über einen Shop-Link hinzu, mit Preis und Foto." },
      { title: "Teile sie", text: "Schicke einen einzigen Link oder lade nur die Menschen ein, die du möchtest." },
      { title: "Keine doppelten Geschenke", text: "Deine Liebsten reservieren ein Geschenk nur mit ihrem Namen, damit niemand dasselbe zweimal kauft." },
    ],
    closeTitle: "Starte deine erste Liste",
    closeText: "Es dauert nur einen Moment.",
  },
  it: {
    worldsLabel: "I quattro mondi di Petit Mokus",
    worldsTitle: "Una famiglia, quattro piccoli mondi",
    label: "Per le tue feste",
    cta: "Apri Wishes",
    text: "Crea una lista dei desideri e condividila con le persone care.",
    title: "Una lista dei desideri per ogni festa",
    description:
      "Crea gratis una lista dei desideri per una nascita, un compleanno, un battesimo o un’altra festa, e condividila con le persone care.",
    lead: "Per una nascita, un compleanno, un battesimo o un’altra festa. Raccogli i tuoi desideri in un unico posto, condividi un solo link, e le persone care vedono cosa è ancora disponibile.",
    start: "Crea la mia lista dei desideri",
    signIn: "Ho già un account",
    free: "Gratis",
    stepsTitle: "Come funziona",
    steps: [
      { title: "Crea la tua lista", text: "Aggiungi i regali a mano o dal link di un negozio, con prezzo e foto." },
      { title: "Condividila", text: "Invia un solo link, oppure invita solo le persone che scegli." },
      { title: "Niente regali doppi", text: "Le persone care prenotano un regalo con il solo nome, così nessuno compra due volte la stessa cosa." },
    ],
    closeTitle: "Inizia la tua prima lista",
    closeText: "Basta un momento.",
  },
  es: {
    worldsLabel: "Los cuatro mundos de Petit Mokus",
    worldsTitle: "Una familia, cuatro pequeños mundos",
    label: "Para tus celebraciones",
    cta: "Abrir Wishes",
    text: "Crea una lista de deseos y compártela con tus seres queridos.",
    title: "Una lista de deseos para cada celebración",
    description:
      "Crea gratis una lista de deseos para un nacimiento, un cumpleaños, un bautizo u otra celebración, y compártela con tus seres queridos.",
    lead: "Para un nacimiento, un cumpleaños, un bautizo u otra celebración. Reúne tus deseos en un solo lugar, comparte un único enlace, y tus seres queridos ven lo que sigue disponible.",
    start: "Crear mi lista de deseos",
    signIn: "Ya tengo una cuenta",
    free: "Gratis",
    stepsTitle: "Cómo funciona",
    steps: [
      { title: "Crea tu lista", text: "Añade regalos a mano o desde el enlace de una tienda, con precio y foto." },
      { title: "Compártela", text: "Envía un único enlace, o invita solo a las personas que elijas." },
      { title: "Sin regalos repetidos", text: "Tus seres queridos reservan un regalo solo con su nombre, y nadie compra dos veces lo mismo." },
    ],
    closeTitle: "Empieza tu primera lista",
    closeText: "Solo lleva un momento.",
  },
  pt: {
    worldsLabel: "Os quatro mundos Petit Mokus",
    worldsTitle: "Uma família, quatro pequenos mundos",
    label: "Para as tuas celebrações",
    cta: "Abrir Wishes",
    text: "Cria uma lista de desejos e partilha-a com quem mais gostas.",
    title: "Uma lista de desejos para cada celebração",
    description:
      "Cria gratuitamente uma lista de desejos para um nascimento, um aniversário, um batizado ou outra celebração, e partilha-a com quem mais gostas.",
    lead: "Para um nascimento, um aniversário, um batizado ou outra celebração. Reúne os teus desejos num só lugar, partilha uma única ligação, e quem mais gostas vê o que ainda está disponível.",
    start: "Criar a minha lista de desejos",
    signIn: "Já tenho conta",
    free: "Gratuito",
    stepsTitle: "Como funciona",
    steps: [
      { title: "Cria a tua lista", text: "Adiciona presentes à mão ou a partir da ligação de uma loja, com preço e fotografia." },
      { title: "Partilha-a", text: "Envia uma única ligação, ou convida apenas as pessoas que escolheres." },
      { title: "Sem presentes repetidos", text: "Quem mais gostas reserva um presente só com o nome, e ninguém compra duas vezes a mesma coisa." },
    ],
    closeTitle: "Começa a tua primeira lista",
    closeText: "Demora apenas um momento.",
  },
};
