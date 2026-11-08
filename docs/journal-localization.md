# Journal localisation

How the petitmokus.com Journal is published in several languages, and how to
add a language. The site is the Astro project in `artifacts/site`.

## Where things live

| What | Where |
| --- | --- |
| Supported languages (the single list) | `LOCALES` in `artifacts/site/src/lib/i18n.ts` |
| Interface words for Journal pages (By, Published, FAQ title, fallback notice, date locale) | `UI` in `artifacts/site/src/lib/i18n.ts` |
| Articles, one Markdown file per language version | `artifacts/site/src/content/journal/<slug>.md` |
| Front matter schema | `artifacts/site/src/content.config.ts` |
| English article pages | `artifacts/site/src/pages/en/journal/[slug].astro` |
| Other languages' article pages (and English fallback pages) | `artifacts/site/src/pages/[locale]/journal/[slug].astro` |
| Journal index per language | `artifacts/site/src/pages/[locale]/journal/index.astro`, `pages/en/journal/index.astro` |
| Versions, hreflang, language switcher, structured data | `artifacts/site/src/lib/journal.ts` |
| Visible FAQ | `artifacts/site/src/components/Faq.astro` |
| Sitemap | `artifacts/site/src/pages/sitemap.xml.ts` |
| Homepage "From the Journal" block | `artifacts/site/src/components/Home.astro` (shows the newest article in that language) |
| Product names, one-liners, CTAs per language (reuse these words) | `artifacts/site/src/data/products.json`, `lib/home-copy.ts`, `lib/wishes-copy.ts`; PlanIt's own landing words are in the PlanIt app, `src/i18n/messages/{en,fr,hu}.json` |
| Approved English sources of articles | `content/source/*.en.md` (repo root) |
| Automated check | `artifacts/site/scripts/check-journal.mjs` |

## The per-language file pattern

Each language version of an article is its own file. The **file name is the
URL slug**, and the slug is localised (written in that language, ASCII,
lowercase, hyphens, no accents). File names must be unique across all
languages because they share one folder.

```
src/content/journal/introducing-petit-mokus-planit.md       -> /en/journal/introducing-petit-mokus-planit/
src/content/journal/decouvrez-petit-mokus-planit.md         -> /fr/journal/decouvrez-petit-mokus-planit/
src/content/journal/bemutatkozik-a-petit-mokus-planit.md    -> /hu/journal/bemutatkozik-a-petit-mokus-planit/
```

Versions are linked by `translationKey`, which is the English file name.

## Front matter

Required:

| Field | Notes |
| --- | --- |
| `title` | The headline (H1). |
| `description` | Meta description and Journal index excerpt. Aim for 155 characters or fewer (schema maximum 170). |
| `publishedAt` | `YYYY-MM-DD`. Shown in each language's date format (`UI[locale].dateLocale`). Use the same date in every version. |
| `category` | `guides`, `product-stories` or `brand`. |
| `locale` | One of `LOCALES`. |
| `translationKey` | The English file name, identical in every version. |

Optional:

| Field | Notes |
| --- | --- |
| `author` | Defaults to `Petit Mokus`. |
| `updatedAt` | Sets `dateModified` and shows "Updated". |
| `tags` | Become `keywords` in structured data on non-English pages. |
| `relatedProduct` | `kids`, `babynaming`, `wishes`, `planit`. Adds the closing product button (in the reader's language when the product speaks it). `planit` also adds the Organization and WebApplication graph (free, price 0) to the structured data. |
| `cta` | Wording of the closing button. Reuse the product's own CTA in that language. |
| `seoTitle` | Shorter `<title>`; the site appends " · Petit Mokus". Used on non-English pages only. |
| `htmlTitle` | The whole `<title>` and `og:title`, used as is, when it already names the brand. Keep it to about 60 characters. Works in every language. |
| `faq` | List of `{ q, a }`. Rendered as a visible "Frequently asked questions" section after the button and published as `FAQPage` structured data. Answers may hold `[text](url)` links. |
| `recommendations` | Wishes gift picks by slug. |
| `heroImage`, `draft` | As before. Drafts never reach a page, index or sitemap. |

## What the site wires up for you

From `translationKey` the build produces, for every version:

- `<link rel="alternate" hreflang>` for every version plus `x-default` (English),
  the same set on every version (reciprocal);
- a self-referencing canonical, Open Graph and Twitter tags (`layouts/Base.astro`);
- a language switcher whose entries for the Journal languages open the same
  article in that language;
- an entry in that language's Journal index and in the sitemap (with
  `lastmod`), and, if it is the newest, the homepage "From the Journal" block.

You do not edit hreflang, the index, the homepage or the sitemap by hand.

**Missing version.** If an English article has no version in a language, that
language gets the English text at `/<locale>/journal/<english-slug>/` with a
notice (`UI[locale].fallbackNotice`), `noindex`, no hreflang and no sitemap
entry, so a switcher link never 404s. The check below still fails the build.

## Writing a version

- Localise, don't translate word for word, in the voice the products use in
  that language (see the comments at the top of `lib/home-copy.ts` and
  `lib/wishes-copy.ts`).
- Never translate product names: Petit Mokus, Petit Mokus Kids,
  Petit Mokus BabyNaming, Petit Mokus Wishes, Petit Mokus PlanIt.
- Reuse existing product wording in that language before writing new words.
- Link products in the reader's language: Kids `/<locale>/kids/`, Wishes
  `/<locale>/wishes/`, BabyNaming `https://babynaming.petitmokus.com/?lang=<locale>`,
  PlanIt `https://planit.petitmokus.com/?lang=<locale>` for en, fr, hu (other
  languages: no `lang`, PlanIt opens in English).
- Keep the "In brief" opening paragraph when the source has one.
- French: non-breaking space before `:` `;` `?` `!`.
- No em dash characters.

## The check

`pnpm --filter @workspace/petit-mokus-site run build` runs `astro build` and
then `scripts/check-journal.mjs`, so the build (and `scripts/assemble-site.mjs`)
fails when:

- a published article has no `translationKey`, or a group lacks a version for
  any language in `LOCALES`;
- a built version's hreflang set is incomplete or not reciprocal, its canonical
  is not itself, its `<html lang>` is wrong, its JSON-LD does not parse, its
  switcher does not lead to the other versions, or it is missing from the sitemap.

`node scripts/check-journal.mjs --source` runs the first part without a build.

## Adding a new language

1. **Config.** Add the code to `LOCALES` in `src/lib/i18n.ts` and add its
   `UI` entry (every key, including `faqTitle`, `fallbackNotice`, `dateLocale`).
   Add it to `HOME_LOCALES` in `src/lib/site.ts` and give it a `HOME` entry in
   `lib/home-copy.ts` and a `WISHES` entry in `lib/wishes-copy.ts` (the
   homepage and Wishes page exist for every Journal language), and add the
   language to each product's `tileSubtitle`, `momentLabel`, `oneLiner` and
   `cta` in `src/data/products.json`. If the language is not one of the Kids
   app's languages, check `scripts/assemble-site.mjs` routing.
2. **Every existing article.** For every `translationKey` in
   `src/content/journal/`, create the new language's version: a new file with
   a localised slug, the same `translationKey`, `publishedAt` and
   `relatedProduct`, localised `title`, `description`, `htmlTitle`/`seoTitle`,
   `cta`, `tags`, `faq` and body. Reuse product strings from that language
   (step 1 files, and the apps' own message files where the product speaks
   the language). List any wording you had to write new.
3. **hreflang on existing versions.** Nothing to edit: the build adds the new
   language to every version's hreflang set and switcher from `translationKey`.
   Confirm it in step 5.
4. **Sitemap and Journal index.** Also automatic: the new
   `/<locale>/journal/` index, its articles and the homepage block appear once
   the files exist. Confirm `dist/sitemap.xml` lists them.
5. **Run the check.** `PUBLIC_WISHES_LIVE=true pnpm --filter @workspace/petit-mokus-site run build`
   must end with "Journal check passed". Then load each new page locally,
   check the switcher, and look for leftover English.
