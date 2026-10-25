/**
 * Wishes recommendations for Journal articles, read once per build from the
 * shared Petit Mokus database (published recommendations only, through the
 * public `wish_published_recommendations` function). Without
 * PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY, or if the read
 * fails, articles simply show no recommendations: the build never fails.
 */
export type Recommendation = {
  slug: string;
  affiliate: boolean;
  priceMinor: number | null;
  currency: string | null;
  translations: Record<string, { name: string; description: string | null } | undefined>;
};

let cache: Promise<Map<string, Recommendation>> | undefined;

async function load(): Promise<Map<string, Recommendation>> {
  const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
  const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  if (!url || !key) {
    console.warn("[recommendations] PUBLIC_SUPABASE_URL or key not set: no recommendations in this build.");
    return new Map();
  }
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/wish_published_recommendations`, {
      method: "POST",
      headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: "{}",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const list = (await response.json()) as Recommendation[];
    return new Map(list.map((r) => [r.slug, r]));
  } catch (error) {
    console.warn(`[recommendations] could not read recommendations: ${String(error)}`);
    return new Map();
  }
}

/** The published recommendations among these slugs, in the article's order. */
export async function recommendationsFor(slugs: string[]): Promise<Recommendation[]> {
  if (slugs.length === 0) return [];
  cache ??= load();
  const all = await cache;
  return slugs.flatMap((slug) => (all.has(slug) ? [all.get(slug)!] : []));
}

/** The reader's language, else English, else any language written. */
export function textFor(rec: Recommendation, locale: string) {
  return rec.translations[locale] ?? rec.translations.en ?? Object.values(rec.translations).find(Boolean)!;
}
