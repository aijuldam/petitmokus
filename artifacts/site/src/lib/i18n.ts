import { BRAND } from "./site";

/**
 * The parent site is English, with a French and a Hungarian Journal. These
 * are the few interface words those Journal pages need. Kids and BabyNaming
 * keep their own translations.
 */
export type Locale = "en" | "fr" | "hu";
export const JOURNAL_LOCALES = ["fr", "hu"] as const;

export const UI = {
  en: {
    skip: "Skip to content",
    brandHome: `${BRAND} home`,
    main: "Main",
    footer: "Footer",
    menu: "Menu",
    home: "Home",
    journal: "Journal",
    languages: "Languages",
    languageLabel: "Language: English",
    languageNote: "Other languages open Petit Mokus Kids.",
    journalDescription: "Guides and product stories from Petit Mokus for parents and families.",
    journalLead: "Guides and product stories for parents and families.",
    by: "By",
    published: "Published",
    updated: "Updated",
    open: (product: string) => `Open ${product}`,
    dateLocale: "en-GB",
  },
  fr: {
    skip: "Aller au contenu",
    brandHome: `Accueil ${BRAND}`,
    main: "Principal",
    footer: "Pied de page",
    menu: "Menu",
    home: "Accueil",
    journal: "Journal",
    languages: "Langues",
    languageLabel: "Langue : français",
    languageNote: "Les autres langues ouvrent Petit Mokus Kids.",
    journalDescription: "Conseils et histoires de Petit Mokus pour les parents et les familles.",
    journalLead: "Conseils et histoires pour les parents et les familles.",
    by: "Par",
    published: "Publié le",
    updated: "Mis à jour le",
    open: (product: string) => `Ouvrir ${product}`,
    dateLocale: "fr-FR",
  },
  hu: {
    skip: "Ugrás a tartalomhoz",
    brandHome: `${BRAND} kezdőlap`,
    main: "Fő menü",
    footer: "Lábléc",
    menu: "Menü",
    home: "Kezdőlap",
    journal: "Napló",
    languages: "Nyelvek",
    languageLabel: "Nyelv: magyar",
    languageNote: "A többi nyelv a Petit Mokus Kids alkalmazást nyitja meg.",
    journalDescription: "Tanácsok és történetek a Petit Mokustól szülőknek és családoknak.",
    journalLead: "Tanácsok és történetek szülőknek és családoknak.",
    by: "Szerző:",
    published: "Megjelent:",
    updated: "Frissítve:",
    open: (product: string) => `${product} megnyitása`,
    dateLocale: "hu-HU",
  },
} satisfies Record<Locale, unknown>;

export function formatLocalDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(UI[locale].dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
