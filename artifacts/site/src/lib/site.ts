import { ALL_LANGUAGES } from "../../../petit-mokus/src/lib/languages";

export const SITE = "https://petitmokus.com";
export const BRAND = "Petit Mokus";
export const TAGLINE = "Little Moments Matter";
export const HOME_URL = "/en/";
export const KIDS_URL = "/en/kids/";
export const BABYNAMING_URL = "https://babynaming.petitmokus.com";
/** The Wishes app. */
export const WISHES_APP_URL = (import.meta.env.PUBLIC_WISHES_APP_URL as string | undefined) ?? "https://wishes.petitmokus.com";
/** Off until launch: without it the site has no Wishes page, tile, link or sitemap entry. */
export const WISHES_LIVE = import.meta.env.PUBLIC_WISHES_LIVE === "true";
export const AUTHOR_URL = "/en/#our-story";
export const authorUrl = (locale: string) => `/${locale}/#our-story`;
/** Square brand image already shipped at the site root by the Kids build. */
export const SOCIAL_IMAGE = `${SITE}/favicon-512x512.png`;

/** Languages with a parent homepage at /<locale>/ (and a Journal). */
export const HOME_LOCALES = ["en", "fr", "hu", "de", "it", "es", "pt"] as const;

export const homeUrl = (locale: string) => `/${locale}/`;
/** Kids, in every language it speaks, at /<locale>/kids/. */
export const kidsUrl = (locale: string) => `/${locale}/kids/`;
/** Wishes, at /<locale>/wishes/. */
export const wishesUrl = (locale: string) => `/${locale}/wishes/`;
/** A sign-up or sign-in link into the Wishes app, in the visitor's language. */
export const wishesAppHref = (path: "/signup" | "/login", locale: string) =>
  `${WISHES_APP_URL}${path}?next=%2Fwishes&lang=${locale}&utm_source=petitmokus&utm_medium=site`;

/**
 * Every language Kids is available in, from the Kids app's own list. A
 * language with a parent homepage leads there; any other opens Kids.
 */
export const LANGUAGES = ALL_LANGUAGES.filter((l) => l.available).map((l) => {
  const code = l.code.toLowerCase();
  const hasHome = (HOME_LOCALES as readonly string[]).includes(code);
  return { code, native: l.native, english: l.english, href: hasHome ? homeUrl(code) : kidsUrl(code) };
});

/** Every language Kids speaks: each has Kids at /<locale>/kids/. */
export const KIDS_LOCALES = LANGUAGES.map((l) => l.code);

export function absolute(path: string): string {
  return new URL(path, SITE).toString();
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
