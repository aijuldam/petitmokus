import registry from "../../../site/src/data/products.json";
import type { Language } from "./i18n";

/**
 * The Petit Mokus product registry (suite NAV-0), read at build time from the
 * main site's own copy in this repo, so the switcher never waits on a network
 * call. Kids speaks ~30 languages; the main site speaks seven. Elsewhere, the
 * home link goes to English and the switcher shows English copy (NAV-6).
 */
const SITE = "https://petitmokus.com";
const MAIN_LOCALES = ["en", "fr", "hu", "de", "it", "es", "pt"] as const;
type MainLocale = (typeof MAIN_LOCALES)[number];
type Translated = Partial<Record<MainLocale, string>> & { en: string };

interface Product {
  id: string;
  name: string;
  fullName: string;
  status: "live" | "soon" | "hidden";
  url: string | null;
  locales: string[];
  symbol: string;
  oneLiner: Translated;
}

const PRODUCTS = (registry as { products: Product[] }).products;

export const BRAND = "Petit Mokus";

/** The main site language for a Kids language: itself, or English. */
export function mainLocale(language: Language): MainLocale {
  const code = language.toLowerCase();
  return (MAIN_LOCALES as readonly string[]).includes(code) ? (code as MainLocale) : "en";
}

/** The Petit Mokus homepage, same site, no UTM (Cloudflare page grouping). */
export function suiteHomeHref(language: Language): string {
  return `/${mainLocale(language)}/`;
}

/**
 * Where a product opens from Kids. Pages on petitmokus.com get a plain path
 * (no UTM); other hosts get `lang` and the switcher UTM.
 */
function productHref(p: Product, language: Language): string | null {
  if (p.status !== "live" || !p.url) return null;
  const locale = mainLocale(language);
  const url = new URL(p.url.replace("{locale}", locale));
  if (url.origin === SITE) return url.pathname;
  const code = language.toLowerCase();
  url.searchParams.set("lang", p.locales.includes(code) ? code : p.locales.includes(locale) ? locale : "en");
  url.searchParams.set("utm_source", "kids");
  url.searchParams.set("utm_medium", "suite_switcher");
  url.searchParams.set("utm_content", p.id);
  return url.toString();
}

export interface SuiteItem {
  id: string;
  name: string;
  symbol: string;
  text: string;
  href: string | null;
}

/** Every visible product, in registry order (the family life story). */
export function suiteItems(language: Language): SuiteItem[] {
  const locale = mainLocale(language);
  return PRODUCTS.filter((p) => p.status !== "hidden").map((p) => ({
    id: p.id,
    name: p.name,
    symbol: p.symbol,
    text: p.oneLiner[locale] ?? p.oneLiner.en,
    href: productHref(p, language),
  }));
}

const COPY: Record<MainLocale, { products: string; label: string; youAreHere: string; soon: string; home: string; close: string }> = {
  en: { products: "Products", label: "{brand} products", youAreHere: "You are here", soon: "Coming soon", home: "{brand} home", close: "Close" },
  fr: { products: "Produits", label: "Produits {brand}", youAreHere: "Vous êtes ici", soon: "Bientôt disponible", home: "Accueil {brand}", close: "Fermer" },
  hu: { products: "Termékek", label: "{brand} termékek", youAreHere: "Itt vagy", soon: "Hamarosan", home: "{brand} kezdőlap", close: "Bezárás" },
  de: { products: "Produkte", label: "Produkte von {brand}", youAreHere: "Du bist hier", soon: "Demnächst", home: "{brand}-Startseite", close: "Schließen" },
  it: { products: "Prodotti", label: "Prodotti {brand}", youAreHere: "Sei qui", soon: "Prossimamente", home: "Home di {brand}", close: "Chiudi" },
  es: { products: "Productos", label: "Productos de {brand}", youAreHere: "Estás aquí", soon: "Próximamente", home: "Inicio de {brand}", close: "Cerrar" },
  pt: { products: "Produtos", label: "Produtos {brand}", youAreHere: "Estás aqui", soon: "Em breve", home: "Início da {brand}", close: "Fechar" },
};

/** The switcher's own words, in the main site language (English otherwise). */
export function suiteCopy(language: Language) {
  const c = COPY[mainLocale(language)];
  return { ...c, label: c.label.replace("{brand}", BRAND), home: c.home.replace("{brand}", BRAND) };
}
