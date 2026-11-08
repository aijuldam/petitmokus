import registry from "../data/products.json";
import type { Locale } from "./i18n";
import { SITE, WISHES_LIVE } from "./site";
import type { SymbolId } from "./symbols";

/**
 * The Petit Mokus product registry (NAV-0): the one list every surface reads.
 * Adding or hiding a product is a change to src/data/products.json only. The
 * build also publishes the file at /suite/products.json for the apps.
 */
export type ProductStatus = "live" | "soon" | "hidden";
export type Translated = Partial<Record<Locale, string>> & { en: string };

export interface Product {
  id: string;
  name: string;
  fullName: string;
  status: ProductStatus;
  /** Absolute address; `{locale}` is replaced. Null while not live. */
  url: string | null;
  /** Languages the product itself speaks. Others open it in English. */
  locales: string[];
  symbol: SymbolId;
  momentLabel: Translated;
  /** Short line under the name on the homepage tiles. */
  tileSubtitle: Translated;
  oneLiner: Translated;
  cta?: Translated;
  /** Shown where the visitor's language is not one of `locales`. */
  languageNote?: Partial<Record<Locale, string>>;
}

export const REGISTRY = registry as { version: number; products: Product[] };

/**
 * Wishes stays behind its launch switch: a build without PUBLIC_WISHES_LIVE
 * treats it as hidden, like every other place that switch governs.
 */
function effectiveStatus(p: Product): ProductStatus {
  if (p.id === "wishes" && !WISHES_LIVE) return "hidden";
  return p.status;
}

/** Products to show, in registry order (the family life story). */
export function visibleProducts(): Product[] {
  return REGISTRY.products.filter((p) => effectiveStatus(p) !== "hidden");
}

export function isLive(p: Product): boolean {
  return effectiveStatus(p) === "live" && p.url !== null;
}

export function text(t: Translated, locale: Locale): string {
  return t[locale] ?? t.en;
}

/** The language a product opens in: the visitor's own, or English. */
export function productLang(p: Product, locale: Locale): string {
  return p.locales.includes(locale) ? locale : "en";
}

export function speaksLocale(p: Product, locale: Locale): boolean {
  return p.locales.includes(locale);
}

/** The product's clean public address in a language, for structured data. */
export function productUrl(p: Product, locale: Locale): string | null {
  return p.url ? p.url.replace("{locale}", locale) : null;
}

/** Live products, in registry order: the site header and footer links. */
export function navProducts(): Product[] {
  return visibleProducts().filter(isLive);
}

/**
 * Where a link to a product goes. Pages on petitmokus.com itself get a plain
 * relative path (no UTM, so Cloudflare page grouping stays clean). Other
 * hosts get `lang`, and homepage tiles and stops also get the site's UTM
 * pattern; header and footer links carry no UTM.
 */
export function productHref(p: Product, locale: Locale, placement: "tile" | "world" | "nav"): string | null {
  if (!p.url) return null;
  const url = new URL(p.url.replace("{locale}", locale));
  if (url.origin === SITE) return url.pathname;
  url.searchParams.set("lang", productLang(p, locale));
  if (placement === "nav") return url.toString();
  url.searchParams.set("utm_source", "petitmokus");
  url.searchParams.set("utm_medium", "site");
  url.searchParams.set("utm_campaign", "homepage");
  url.searchParams.set("utm_content", `${p.id}_${placement}`);
  return url.toString();
}
