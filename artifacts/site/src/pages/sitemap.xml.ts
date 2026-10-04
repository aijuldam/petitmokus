import type { APIRoute } from "astro";
import { publishedJournal, publishedUpdates } from "../lib/content";
import { absolute, HOME_URL, isoDate, KIDS_LOCALES, KIDS_URL } from "../lib/site";

// Published English pages plus the locale roots that serve Kids. Drafts,
// preview hosts and the BabyNaming app are never listed here.
export const GET: APIRoute = async () => {
  const [posts, updates] = await Promise.all([publishedJournal(), publishedUpdates()]);
  const urls: { path: string; lastmod?: string }[] = [
    { path: HOME_URL },
    { path: KIDS_URL },
    { path: "/en/journal/" },
    ...posts.map((p) => ({ path: `/en/journal/${p.id}/`, lastmod: isoDate(p.data.updatedAt ?? p.data.publishedAt) })),
    { path: "/en/updates/" },
    ...updates.map((u) => ({ path: `/en/updates/${u.id}/`, lastmod: isoDate(u.data.publishedAt) })),
    ...KIDS_LOCALES.map((code) => ({ path: `/${code}/` })),
  ];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url><loc>${absolute(u.path)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`),
    "</urlset>",
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
