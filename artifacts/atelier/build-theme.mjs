#!/usr/bin/env node
/**
 * Petit Mokus Atelier theme and menu (PRD 4.2, 4.5). The Fourthwall shop at
 * atelier.petitmokus.com takes its brand from the site's design tokens
 * (artifacts/site/src/styles/tokens.css); no value is typed here.
 *
 *   node artifacts/atelier/build-theme.mjs           write generated/ from the tokens
 *   node artifacts/atelier/build-theme.mjs --check   fail if generated/ is out of date
 *   node artifacts/atelier/build-theme.mjs --live    compare the live shop with the tokens
 *
 * Fourthwall has no API for its theme, so generated/theme.md lists the values
 * to set in Site design, and generated/header-code.html is pasted into
 * Site design > Style > Edit HTML code > Header code. --live catches drift
 * between what is set in Fourthwall and the tokens.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const TOKENS = join(here, "../site/src/styles/tokens.css");
const OUT = join(here, "generated");
const REGISTRY = join(here, "../site/src/data/products.json");
const SHOP = "https://atelier.petitmokus.com";
const MAIN_SITE = "https://petitmokus.com";
/** Fourthwall's own font library has Nunito, so the shop loads no third-party font. */
const FOURTHWALL_FONT = "Nunito";

function readTokens() {
  const css = readFileSync(TOKENS, "utf8");
  const root = css.match(/:root\s*\{([\s\S]*?)\n\}/);
  if (!root) throw new Error(`No :root block in ${TOKENS}`);
  const tokens = {};
  for (const m of root[1].replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/(--pm-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    tokens[m[1]] = m[2].trim();
  }
  return tokens;
}

function need(tokens, name) {
  const v = tokens[name];
  if (!v) throw new Error(`Token ${name} is missing from tokens.css`);
  return v;
}

/** Fourthwall settings take pixels; the tokens use rem (16px). */
function px(value) {
  const m = value.match(/^([\d.]+)rem$/);
  if (!m) throw new Error(`Expected a rem value, got ${value}`);
  return `${Math.round(Number(m[1]) * 16)}px`;
}

function hex(value) {
  if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`Expected a #rrggbb colour, got ${value}`);
  return value.toLowerCase();
}

function luminance(h) {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const l = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
}

function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

function rgb(h) {
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ");
}

function build() {
  const t = readTokens();
  const c = {
    primary: hex(need(t, "--pm-action")),
    onPrimary: hex(need(t, "--pm-action-text")),
    background: hex(need(t, "--pm-background")),
    text: hex(need(t, "--pm-text")),
    card: hex(need(t, "--pm-card")),
    muted: hex(need(t, "--pm-muted-text")),
  };
  const radius = { button: px(need(t, "--pm-radius")), card: px(need(t, "--pm-radius-card")) };

  // Every text pair the shop shows, at WCAG AA for normal text.
  const pairs = [
    ["Text on background", c.text, c.background],
    ["Text on cards and photo backgrounds", c.text, c.card],
    ["Links and buttons on background", c.primary, c.background],
    ["Button text on buttons", c.onPrimary, c.primary],
    ["Muted text on background", c.muted, c.background],
  ].map(([label, fg, bg]) => ({ label, fg, bg, ratio: contrast(fg, bg) }));
  const failing = pairs.filter((p) => p.ratio < 4.5);
  if (failing.length) {
    throw new Error(`Contrast below 4.5:1: ${failing.map((p) => `${p.label} ${p.ratio.toFixed(2)}`).join(", ")}`);
  }

  // What Fourthwall's own settings produce, for the live check.
  const expectedLive = {
    "--color-primary": c.primary,
    "--color-on-primary": c.onPrimary,
    "--color-background": c.background,
    "--color-on-background": c.text,
    "--font-family-base-name": FOURTHWALL_FONT,
  };

  const theme = `# Atelier theme values

Generated from \`artifacts/site/src/styles/tokens.css\` by \`artifacts/atelier/build-theme.mjs\`. Do not edit by hand.

Set these in the Fourthwall dashboard, **Site design > Style**:

| Setting | Value | Token |
|---|---|---|
| Colors > Primary | \`${c.primary}\` | \`--pm-action\` |
| Colors > Background | \`${c.background}\` | \`--pm-background\` |
| Colors > Text | \`${c.text}\` | \`--pm-text\` |
| Colors > Text over primary | \`${c.onPrimary}\` | \`--pm-action-text\` |
| Fonts > Headings and body | ${FOURTHWALL_FONT} | \`--pm-font\` |
| Buttons > Border radius | ${radius.button} | \`--pm-radius\` |
| Forms > Input rounded corners | ${radius.button} | \`--pm-radius\` |
| Photography > Rounded corners | ${radius.card} | \`--pm-radius-card\` |
| Photography > Background | \`${c.card}\` | \`--pm-card\` |
| Logo | \`artifacts/site/public/brand/petitmokus-logo-color.svg\` (PNG if SVG is refused: \`attached_assets/petitmokus-logo-512_1777320029919.png\`) | brand kit |
| Favicon | \`artifacts/petit-mokus/public/favicon.svg\` | brand kit |

Then paste \`header-code.html\` into **Edit HTML code > Header code**.

## Contrast (WCAG AA needs 4.5:1)

| Pair | Colours | Ratio |
|---|---|---|
${pairs.map((p) => `| ${p.label} | \`${p.fg}\` on \`${p.bg}\` | ${p.ratio.toFixed(2)} |`).join("\n")}
`;

  const header = `<!-- Petit Mokus Atelier brand. Generated from tokens.css by artifacts/atelier/build-theme.mjs; do not edit here. -->
<style>
  :root:root {
    --color-product-image-background: ${c.card};
    --color-product-image-background-rgb: ${rgb(c.card)};
    --primary-button-border-radius: ${radius.button};
    --secondary-button-border-radius: ${radius.button};
    --input-corner-radius: ${radius.button};
    --image-corner-radius: ${radius.card};
    --font-weight-base-bold: 700;
    --font-weight-heading: 700;
  }
</style>
`;

  return { files: { "theme.md": theme, "header-code.html": header, "menu.md": menu() }, expectedLive };
}

/**
 * The shop's header and footer links back to every live product (PRD 4.5),
 * from the same registry as every other Petit Mokus surface. The shop speaks
 * English, so pages that need a language get /en/; the apps pick the
 * visitor's language themselves, so they get no `lang`.
 */
function menu() {
  const registry = JSON.parse(readFileSync(REGISTRY, "utf8"));
  const tag = (href, content) => {
    const url = new URL(href);
    url.searchParams.set("utm_source", "atelier");
    url.searchParams.set("utm_medium", "shop_nav");
    url.searchParams.set("utm_content", content);
    return url.toString();
  };
  const rows = registry.products
    .filter((p) => p.status === "live" && p.url && p.id !== "atelier")
    .map((p) => [p.name, tag(p.url.replace("{locale}", "en"), p.id)]);
  rows.push(["Journal", tag(`${MAIN_SITE}/en/journal/`, "journal")]);
  rows.push(["Petit Mokus home", tag(`${MAIN_SITE}/en/`, "home")]);
  return `# Atelier menu links

Generated from \`artifacts/site/src/data/products.json\` by \`artifacts/atelier/build-theme.mjs\`. Do not edit by hand.

In Fourthwall, **Site design > Layout > Header > Edit menu**: add a parent item **Petit Mokus** and, under it, one **Link** per row (Open in new tab: off). Add the same links to the footer menu.

| Label | Link |
|---|---|
${rows.map(([label, href]) => `| ${label} | ${href} |`).join("\n")}
`;
}

async function live(expected) {
  const html = await fetch(`${SHOP}/password`).then((r) => r.text());
  const href = html.match(/href="([^"]+css-variables[^"]+)"/)?.[1];
  if (!href) throw new Error("No css-variables stylesheet found on the shop page");
  const css = await fetch(href.replace(/&amp;/g, "&")).then((r) => r.text());
  let drift = 0;
  for (const [name, want] of Object.entries(expected)) {
    const got = css.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1]?.trim();
    const ok = got?.toLowerCase() === want.toLowerCase();
    if (!ok) drift++;
    console.log(`${ok ? "ok   " : "DRIFT"} ${name}: shop ${got ?? "(missing)"}, tokens ${want}`);
  }
  if (drift) process.exitCode = 1;
}

const { files, expectedLive } = build();
const mode = process.argv[2];
if (mode === "--live") {
  await live(expectedLive);
} else if (mode === "--check") {
  const stale = Object.entries(files).filter(([name, body]) => {
    try {
      return readFileSync(join(OUT, name), "utf8") !== body;
    } catch {
      return true;
    }
  });
  if (stale.length) {
    console.error(
      `Atelier theme is out of date with tokens.css: ${stale.map(([n]) => n).join(", ")}. Run node artifacts/atelier/build-theme.mjs`,
    );
    process.exit(1);
  }
  console.log("Atelier theme matches tokens.css.");
} else {
  mkdirSync(OUT, { recursive: true });
  for (const [name, body] of Object.entries(files)) writeFileSync(join(OUT, name), body);
  console.log(`Wrote ${Object.keys(files).join(", ")} to ${OUT}`);
}
