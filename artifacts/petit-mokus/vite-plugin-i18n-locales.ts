// Splits the Kids dictionary (src/lib/i18n-dictionary.ts) into one chunk per
// language, so a visitor downloads their own language instead of all 30.
//
// The dictionary stays one file for editing. Its translated strings are
// objects keyed by language code ({ EN: 'Dog', FR: 'Chien', ... }); anything
// else (for example song titles) is shared by every language.
//
//   virtual:i18n-base     the whole dictionary with English only, plus shared values
//   virtual:i18n/<CODE>   that language's translations, same shape, strings at the leaves
//   virtual:i18n-loaders  { FR: () => import("virtual:i18n/FR"), ... } for every other language
//
// src/lib/i18n.ts builds the runtime dictionary from these.
import { readFileSync } from "node:fs";
import { transformWithEsbuild, type Plugin } from "vite";

const BASE = "virtual:i18n-base";
const LOADERS = "virtual:i18n-loaders";
const LOCALE = "virtual:i18n/";

type Tree = { [key: string]: unknown };

export function i18nLocales(dictionaryFile: string): Plugin {
  let cache: { source: string; dictionary: Tree; languages: string[] } | undefined;

  async function load() {
    const source = readFileSync(dictionaryFile, "utf8");
    if (cache?.source === source) return cache;
    const { code } = await transformWithEsbuild(source, dictionaryFile, { loader: "ts", format: "esm" });
    const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
    const dictionary = mod.dictionary as Tree;
    // The language codes come from the Language type, so a new language is picked up on its own.
    const typeBlock = source.match(/export type Language =([\s\S]*?);/);
    if (!typeBlock) throw new Error("i18n: could not read the Language type");
    const languages = [...new Set([...typeBlock[1].matchAll(/'([A-Z]{2})'/g)].map((m) => m[1]))];
    cache = { source, dictionary, languages };
    return cache;
  }

  /** A translated string: an object whose keys are all language codes. */
  const isLeaf = (value: unknown, languages: string[]): value is Record<string, string> =>
    typeof value === "object" && value !== null && Object.keys(value).length > 0 &&
    Object.keys(value).every((k) => languages.includes(k));

  /** English plus shared values, keeping the dictionary's shape. */
  function base(tree: Tree, languages: string[]): Tree {
    const out: Tree = {};
    for (const [key, value] of Object.entries(tree)) {
      if (isLeaf(value, languages)) out[key] = { EN: value.EN };
      else if (typeof value === "object" && value !== null) out[key] = base(value as Tree, languages);
      else out[key] = value;
    }
    return out;
  }

  /** One language's strings, at the leaf positions only. */
  function locale(tree: Tree, languages: string[], lang: string): Tree {
    const out: Tree = {};
    for (const [key, value] of Object.entries(tree)) {
      if (isLeaf(value, languages)) {
        if (typeof value[lang] === "string") out[key] = value[lang];
      } else if (typeof value === "object" && value !== null) {
        const sub = locale(value as Tree, languages, lang);
        if (Object.keys(sub).length) out[key] = sub;
      }
    }
    return out;
  }

  return {
    name: "petit-mokus-i18n-locales",
    resolveId(id) {
      if (id === BASE || id === LOADERS || id.startsWith(LOCALE)) return "\0" + id;
    },
    async load(id) {
      if (!id.startsWith("\0virtual:i18n")) return;
      this.addWatchFile(dictionaryFile);
      const { dictionary, languages } = await load();
      const name = id.slice(1);
      if (name === BASE) return `export default ${JSON.stringify(base(dictionary, languages))};`;
      if (name === LOADERS) {
        const entries = languages.filter((l) => l !== "EN").map((l) => `  ${l}: () => import(${JSON.stringify(LOCALE + l)}),`);
        return `export default {\n${entries.join("\n")}\n};`;
      }
      const lang = name.slice(LOCALE.length);
      if (!languages.includes(lang)) throw new Error(`i18n: unknown language ${lang}`);
      return `export default ${JSON.stringify(locale(dictionary, languages, lang))};`;
    },
  };
}
