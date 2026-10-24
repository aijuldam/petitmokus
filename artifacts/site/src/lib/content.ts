import { getCollection } from "astro:content";

// Drafts never reach a page, a listing or the sitemap: every reader of the
// collections goes through these two functions.

export async function publishedJournal(locale: "en" | "fr" | "hu" = "en") {
  const entries = await getCollection("journal", ({ data }) => !data.draft && data.locale === locale);
  return entries.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export async function publishedUpdates() {
  const entries = await getCollection("updates", ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}
