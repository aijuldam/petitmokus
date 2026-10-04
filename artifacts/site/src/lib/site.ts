import { ALL_LANGUAGES } from "../../../petit-mokus/src/lib/languages";

export const SITE = "https://petitmokus.com";
export const BRAND = "Petit Mokus";
export const TAGLINE = "Little Moments Matter";
export const HOME_URL = "/en/";
export const KIDS_URL = "/en/kids/";
export const BABYNAMING_URL = "https://babynaming.petitmokus.com";
export const AUTHOR_URL = "/en/#our-story";
/** Square brand image already shipped at the site root by the Kids build. */
export const SOCIAL_IMAGE = `${SITE}/favicon-512x512.png`;

/**
 * Every language Kids is available in, from the Kids app's own list.
 * English leads to the parent homepage; each other language still opens
 * Kids at its locale root, because only English has a parent homepage.
 */
export const LANGUAGES = ALL_LANGUAGES.filter((l) => l.available).map((l) => {
  const code = l.code.toLowerCase();
  return { code, native: l.native, english: l.english, href: code === "en" ? HOME_URL : `/${code}/` };
});

/** The non-English locale roots, which keep serving the Kids app. */
export const KIDS_LOCALES = LANGUAGES.filter((l) => l.code !== "en").map((l) => l.code);

export function absolute(path: string): string {
  return new URL(path, SITE).toString();
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
