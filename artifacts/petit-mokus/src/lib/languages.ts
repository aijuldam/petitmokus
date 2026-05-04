// All supported display languages — native names only.
// "available" = full translation exists. Others show in selector but fall back to EN.

export interface LangOption {
  code: string;
  native: string;
  available: boolean;
}

export const SUGGESTED_CODES = ['EN', 'FR', 'HU', 'DE'];

export const ALL_LANGUAGES: LangOption[] = [
  { code: 'EN', native: 'English',          available: true  },
  { code: 'FR', native: 'Français',          available: true  },
  { code: 'HU', native: 'Magyar',            available: true  },
  { code: 'DE', native: 'Deutsch',           available: true  },
  { code: 'BG', native: 'Български',         available: false },
  { code: 'BS', native: 'Bosanski',          available: false },
  { code: 'CS', native: 'Čeština',           available: false },
  { code: 'DA', native: 'Dansk',             available: false },
  { code: 'EL', native: 'Ελληνικά',          available: false },
  { code: 'ES', native: 'Español',           available: false },
  { code: 'ET', native: 'Eesti',             available: false },
  { code: 'FI', native: 'Suomi',             available: false },
  { code: 'GA', native: 'Gaeilge',           available: false },
  { code: 'HR', native: 'Hrvatski',          available: false },
  { code: 'IS', native: 'Íslenska',          available: false },
  { code: 'IT', native: 'Italiano',          available: false },
  { code: 'LT', native: 'Lietuvių',          available: false },
  { code: 'LV', native: 'Latviešu',          available: false },
  { code: 'MK', native: 'Македонски',        available: false },
  { code: 'MT', native: 'Malti',             available: false },
  { code: 'NB', native: 'Norsk',             available: false },
  { code: 'NL', native: 'Nederlands',        available: false },
  { code: 'PL', native: 'Polski',            available: false },
  { code: 'PT', native: 'Português',         available: false },
  { code: 'RO', native: 'Română',            available: false },
  { code: 'SK', native: 'Slovenčina',        available: false },
  { code: 'SL', native: 'Slovenščina',       available: false },
  { code: 'SQ', native: 'Shqip',             available: false },
  { code: 'SR', native: 'Srpski',            available: false },
  { code: 'SV', native: 'Svenska',           available: false },
  { code: 'TR', native: 'Türkçe',            available: false },
  { code: 'UK', native: 'Українська',        available: false },
];

export const SUGGESTED = ALL_LANGUAGES.filter(l => SUGGESTED_CODES.includes(l.code));
export const REST = ALL_LANGUAGES.filter(l => !SUGGESTED_CODES.includes(l.code));
