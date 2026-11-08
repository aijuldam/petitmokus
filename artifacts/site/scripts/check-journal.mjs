// Journal localisation check. Runs after `astro build` (see package.json) and
// fails the build when:
//
//   1. a published article has no `translationKey`, or a translation group is
//      missing a version for one of the site's languages (src/lib/i18n.ts);
//   2. in the built site, an article's hreflang set is not complete and
//      reciprocal (every version lists every version plus x-default = English),
//      its canonical is not itself, its JSON-LD does not parse, or the sitemap
//      lacks it.
//
//   node scripts/check-journal.mjs           source and built pages
//   node scripts/check-journal.mjs --source  source only (no build needed)
//
// docs/journal-localization.md explains the rules this enforces.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");
const journalDir = join(site, "src", "content", "journal");
const dist = join(site, "dist");
const SITE = "https://petitmokus.com";

const errors = [];
const fail = (message) => errors.push(message);

// The supported languages, read from the one list the site itself uses.
const i18n = readFileSync(join(site, "src", "lib", "i18n.ts"), "utf8");
const listMatch = i18n.match(/export const LOCALES = \[([^\]]*)\]/);
if (!listMatch) throw new Error("Could not read LOCALES from src/lib/i18n.ts");
const LOCALES = [...listMatch[1].matchAll(/"([a-z-]+)"/g)].map((m) => m[1]);
const DEFAULT = "en";

/** Top-level scalar front matter fields (enough for the keys checked here). */
function frontMatter(file) {
  const text = readFileSync(join(journalDir, file), "utf8");
  const block = text.match(/^---\n([\s\S]*?)\n---/);
  if (!block) return {};
  const data = {};
  for (const line of block[1].split("\n")) {
    const m = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (m) data[m[1]] = m[2].replace(/^"(.*)"$/, "$1").trim();
  }
  return data;
}

// 1. Every article exists in every language.
const articles = readdirSync(journalDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({ slug: f.replace(/\.md$/, ""), ...frontMatter(f) }))
  .filter((a) => a.draft !== "true");
const groups = new Map();
for (const a of articles) {
  if (!LOCALES.includes(a.locale)) fail(`${a.slug}: locale "${a.locale}" is not one of ${LOCALES.join(", ")}`);
  if (!a.translationKey) {
    fail(`${a.slug}: no translationKey`);
    continue;
  }
  const group = groups.get(a.translationKey) ?? {};
  if (group[a.locale]) fail(`${a.translationKey}: two ${a.locale} versions (${group[a.locale].slug}, ${a.slug})`);
  group[a.locale] = a;
  groups.set(a.translationKey, group);
}
for (const [key, group] of groups) {
  const missing = LOCALES.filter((l) => !group[l]);
  if (missing.length) fail(`${key}: missing ${missing.join(", ")} (has ${Object.keys(group).join(", ")})`);
}

const path = (a) => `/${a.locale}/journal/${a.slug}/`;

// 2. The built pages agree with each other.
if (!process.argv.includes("--source")) {
  if (!existsSync(dist)) throw new Error(`No build at ${dist}: run astro build first, or pass --source`);
  const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
  const pageCache = new Map();
  const page = (p) => {
    if (!pageCache.has(p)) {
      const file = join(dist, p, "index.html");
      pageCache.set(p, existsSync(file) ? readFileSync(file, "utf8") : null);
    }
    return pageCache.get(p);
  };
  const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
  const alternatesOf = (html) =>
    Object.fromEntries(
      [...html.matchAll(/<link rel="alternate"[^>]*>/g)].map((m) => [attr(m[0], "hreflang"), attr(m[0], "href")]),
    );

  for (const [key, group] of groups) {
    const versions = Object.values(group);
    // The expected set: every version that exists, plus x-default.
    const expected = Object.fromEntries(versions.map((a) => [a.locale, SITE + path(a)]));
    if (group[DEFAULT]) expected["x-default"] = SITE + path(group[DEFAULT]);
    for (const a of versions) {
      const p = path(a);
      const html = page(p);
      if (!html) {
        fail(`${p}: not built`);
        continue;
      }
      const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
      if (canonical !== SITE + p) fail(`${p}: canonical is ${canonical ?? "missing"}`);
      if (!html.includes(`<html lang="${a.locale}"`)) fail(`${p}: <html lang> is not ${a.locale}`);
      if (versions.length > 1) {
        const actual = alternatesOf(html);
        for (const [lang, href] of Object.entries(expected)) {
          if (actual[lang] !== href) fail(`${p}: hreflang ${lang} is ${actual[lang] ?? "missing"}, expected ${href}`);
        }
        for (const lang of Object.keys(actual)) if (!(lang in expected)) fail(`${p}: unexpected hreflang ${lang}`);
      }
      for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try {
          JSON.parse(m[1]);
        } catch (e) {
          fail(`${p}: JSON-LD does not parse (${e.message})`);
        }
      }
      if (!sitemap.includes(`<loc>${SITE + p}</loc>`)) fail(`${p}: not in sitemap.xml`);
      // Every Journal language's switcher entry leads to this article.
      for (const l of LOCALES) {
        const target = group[l] ? path(group[l]) : group[DEFAULT] ? `/${l}/journal/${group[DEFAULT].slug}/` : null;
        if (target && !html.includes(`href="${target}" lang="${l}"`)) fail(`${p}: language switcher for ${l} does not lead to ${target}`);
      }
    }
  }
}

if (errors.length) {
  console.error(`Journal check failed (${errors.length}):\n  - ${errors.join("\n  - ")}`);
  console.error("See docs/journal-localization.md.");
  process.exit(1);
}
console.log(`Journal check passed: ${groups.size} articles × ${LOCALES.length} languages (${LOCALES.join(", ")}).`);
