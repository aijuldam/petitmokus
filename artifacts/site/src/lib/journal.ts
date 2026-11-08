import { type CollectionEntry, getCollection } from "astro:content";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./i18n";
import { productLang, productUrl, REGISTRY, isLive, visibleProducts } from "./products";
import { absolute, BRAND, SITE } from "./site";

/**
 * How the language versions of one Journal article fit together. Versions
 * share a `translationKey` (see content.config.ts); each keeps its own,
 * localised file name as its slug. docs/journal-localization.md has the rules.
 */
export type Post = CollectionEntry<"journal">;
export type Versions = Partial<Record<Locale, Post>>;

export const articlePath = (post: Post) => `/${post.data.locale}/journal/${post.id}/`;

/** Where an English article is shown in a language that has no version yet. */
export const fallbackPath = (english: Post, locale: Locale) => `/${locale}/journal/${english.id}/`;

/** Every published version of an article, by language. */
export async function versionsOf(key: string): Promise<Versions> {
  const posts = await getCollection("journal", ({ data }) => !data.draft && data.translationKey === key);
  return Object.fromEntries(posts.map((p) => [p.data.locale, p])) as Versions;
}

/** hreflang links: each published version, plus English as x-default. */
export function alternatesFor(versions: Versions): { hreflang: string; href: string }[] {
  const list: { hreflang: string; href: string }[] = LOCALES.filter((l) => versions[l]).map((l) => ({
    hreflang: l,
    href: absolute(articlePath(versions[l]!)),
  }));
  const english = versions[DEFAULT_LOCALE];
  if (english) list.push({ hreflang: "x-default", href: absolute(articlePath(english)) });
  return list.length > 1 ? list : [];
}

/**
 * Where the language switcher goes from this article: its version in each
 * language, or the English text with a notice where a version is missing.
 */
export function languageHrefsFor(versions: Versions): Record<string, string> {
  const english = versions[DEFAULT_LOCALE];
  const hrefs: Record<string, string> = {};
  for (const l of LOCALES) {
    const version = versions[l];
    if (version) hrefs[l] = articlePath(version);
    else if (english) hrefs[l] = fallbackPath(english, l);
  }
  return hrefs;
}

/** Turns the [text](url) links an FAQ answer may hold into HTML (the rest is escaped). */
export function answerHtml(answer: string): string {
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return escape(answer).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text: string, href: string) => `<a href="${href}">${text}</a>`);
}

/** The same answer as plain text, for structured data. */
export const answerText = (answer: string) => answer.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, "$1");

/** Link into a product app from an article button, in the reader's language when the app speaks it. */
export function appHref(productId: string, locale: Locale): string | null {
  const p = REGISTRY.products.find((x) => x.id === productId);
  if (!p?.url || !isLive(p)) return null;
  const url = new URL(p.url.replace("{locale}", locale));
  if (url.origin === SITE) return url.pathname;
  url.searchParams.set("lang", productLang(p, locale));
  url.searchParams.set("utm_source", "petitmokus");
  url.searchParams.set("utm_medium", "site");
  return url.toString();
}

const ORGANIZATION_ID = `${SITE}/#organization`;

/** The organisation, as the PlanIt launch article describes it. */
const ORGANIZATION_DESCRIPTION: Record<Locale, string> = {
  en: "Petit Mokus makes calm, thoughtful digital experiences for families, created by a French and Hungarian family in Amsterdam. All Petit Mokus products are free to use.",
  fr: "Petit Mokus crée des expériences numériques douces et attentives pour les familles, imaginées par une famille franco-hongroise à Amsterdam. Tous les produits Petit Mokus sont gratuits.",
  hu: "A Petit Mokus nyugodt, átgondolt digitális élményeket készít családoknak; egy francia–magyar család hozta létre Amszterdamban. Minden Petit Mokus termék ingyenes.",
  de: "Petit Mokus gestaltet ruhige, durchdachte digitale Erlebnisse für Familien, entstanden in einer französisch-ungarischen Familie in Amsterdam. Alle Produkte von Petit Mokus sind kostenlos.",
  it: "Petit Mokus crea esperienze digitali calme e curate per le famiglie, ideate da una famiglia franco-ungherese ad Amsterdam. Tutti i prodotti Petit Mokus sono gratuiti.",
  es: "Petit Mokus crea experiencias digitales tranquilas y cuidadas para familias, creadas por una familia franco-húngara en Ámsterdam. Todos los productos de Petit Mokus son gratuitos.",
  pt: "A Petit Mokus cria experiências digitais calmas e cuidadas para famílias, criadas por uma família franco-húngara em Amesterdão. Todos os produtos Petit Mokus são gratuitos.",
};

/**
 * PlanIt in its own words: the app's meta description where PlanIt speaks
 * the language (en, fr, hu), otherwise the homepage one-liner.
 */
const PLANIT_DESCRIPTION: Record<Locale, string> = {
  en: "Petit Mokus PlanIt makes getting together easier for families and friends. Get everyone on the same page, without endless messages or chasing replies.",
  fr: "Petit Mokus PlanIt facilite les retrouvailles en famille et entre amis. Tout le monde a les mêmes informations, sans messages à n’en plus finir ni relances.",
  hu: "A Petit Mokus PlanIt megkönnyíti a családi és baráti együttléteket. Mindenki ugyanazt tudja, végtelen üzenetváltás és utánajárás nélkül.",
  de: "Mehr gemeinsame Momente, zusammen. Plant ein Treffen ohne endlose Nachrichten und ohne allen hinterherzulaufen.",
  it: "Più momenti condivisi, insieme. Organizzate un ritrovo senza messaggi infiniti né risposte da rincorrere.",
  es: "Más momentos compartidos, juntos. Organizad un encuentro sin mensajes interminables ni respuestas que perseguir.",
  pt: "Mais momentos partilhados, juntos. Organizem um encontro sem mensagens intermináveis nem andar atrás de respostas.",
};

/**
 * Structured data for an article page. Articles about PlanIt, or with an
 * FAQ, get a graph (organisation, app, article, FAQ); every other article
 * keeps its plain BlogPosting unchanged.
 */
export function structuredData(post: Post, blogPosting: Record<string, unknown>): Record<string, unknown> {
  const locale = post.data.locale;
  const isPlanit = post.data.relatedProduct === "planit";
  if (!isPlanit && post.data.faq.length === 0) return blogPosting;
  const { "@context": _context, ...article } = blogPosting;
  const graph: Record<string, unknown>[] = [];
  if (isPlanit) {
    const appId = "https://planit.petitmokus.com/#app";
    graph.push(
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: BRAND,
        url: `${SITE}/`,
        slogan: "Little Moments Matter",
        description: ORGANIZATION_DESCRIPTION[locale],
      },
      {
        "@type": "WebApplication",
        "@id": appId,
        name: "Petit Mokus PlanIt",
        url: "https://planit.petitmokus.com/",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web browser",
        description: PLANIT_DESCRIPTION[locale],
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        isAccessibleForFree: true,
        publisher: { "@id": ORGANIZATION_ID },
        isPartOf: { "@id": ORGANIZATION_ID },
      },
    );
    Object.assign(article, {
      url: article.mainEntityOfPage,
      author: { "@id": ORGANIZATION_ID },
      publisher: { "@id": ORGANIZATION_ID },
      about: { "@id": appId },
      mentions: visibleProducts()
        .filter((p) => p.id !== "planit" && isLive(p))
        .map((p) => ({ "@type": "WebApplication", name: p.fullName, url: productUrl(p, locale) })),
    });
  }
  graph.push(article);
  if (post.data.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: post.data.faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: answerText(a) },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
