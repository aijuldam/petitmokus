// The runtime dictionary. It has the same shape and type as the one in
// ./i18n-dictionary.ts, but starts with English only; loadLanguage() adds a
// language's strings in place before it is shown. Code that holds on to a part
// of it (const ui = dictionary.ui) sees the added strings too.
import type { Language, dictionary as fullDictionary } from "./i18n-dictionary";
import base from "virtual:i18n-base";
import loaders from "virtual:i18n-loaders";

export type { Language };

export const dictionary = base as typeof fullDictionary;

type Tree = { [key: string]: unknown };

/** Copies a language's strings (a tree with strings at the leaves) into the dictionary. */
function merge(target: Tree, strings: Tree, lang: Language) {
  for (const [key, value] of Object.entries(strings)) {
    if (typeof value === "string") (target[key] as Record<string, string>)[lang] = value;
    else merge(target[key] as Tree, value as Tree, lang);
  }
}

/** English, in the same leaves-only shape, used if a language cannot be fetched. */
function english(tree: Tree): Tree {
  const out: Tree = {};
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value !== "object" || value === null) continue;
    const en = (value as Record<string, unknown>).EN;
    if (typeof en === "string") out[key] = en;
    else out[key] = english(value as Tree);
  }
  return out;
}

const loading = new Map<Language, Promise<void>>([["EN", Promise.resolve()]]);

/** Makes a language's strings available. Falls back to English if it cannot load. */
export function loadLanguage(lang: Language): Promise<void> {
  let pending = loading.get(lang);
  if (!pending) {
    pending = loaders[lang]()
      .then((m) => merge(dictionary as unknown as Tree, m.default, lang))
      .catch(() => {
        loading.delete(lang); // try again next time
        merge(dictionary as unknown as Tree, english(dictionary as unknown as Tree), lang);
      });
    loading.set(lang, pending);
  }
  return pending;
}
