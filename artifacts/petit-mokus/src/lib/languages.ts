export interface LangOption {
  code: string;
  native: string;   // shown first, large
  english: string;  // shown second, muted — for cross-language recognition
  available: boolean;
}

export const SUGGESTED_CODES = ['EN', 'FR', 'HU', 'DE', 'ES', 'PT', 'IT', 'NL', 'DA', 'SV', 'NB', 'IS', 'GA'];

export const ALL_LANGUAGES: LangOption[] = [
  { code: 'EN', native: 'English',        english: 'English',    available: true  },
  { code: 'FR', native: 'Français',       english: 'French',     available: true  },
  { code: 'HU', native: 'Magyar',         english: 'Hungarian',  available: true  },
  { code: 'DE', native: 'Deutsch',        english: 'German',     available: true  },
  { code: 'BG', native: 'Български',      english: 'Bulgarian',  available: false },
  { code: 'BS', native: 'Bosanski',       english: 'Bosnian',    available: false },
  { code: 'CS', native: 'Čeština',        english: 'Czech',      available: false },
  { code: 'DA', native: 'Dansk',          english: 'Danish',     available: true  },
  { code: 'EL', native: 'Ελληνικά',       english: 'Greek',      available: false },
  { code: 'ES', native: 'Español',        english: 'Spanish',    available: true  },
  { code: 'ET', native: 'Eesti',          english: 'Estonian',   available: false },
  { code: 'FI', native: 'Suomi',          english: 'Finnish',    available: false },
  { code: 'GA', native: 'Gaeilge',        english: 'Irish',      available: true  },
  { code: 'HR', native: 'Hrvatski',       english: 'Croatian',   available: false },
  { code: 'IS', native: 'Íslenska',       english: 'Icelandic',  available: true  },
  { code: 'IT', native: 'Italiano',       english: 'Italian',    available: true  },
  { code: 'LT', native: 'Lietuvių',       english: 'Lithuanian', available: false },
  { code: 'LV', native: 'Latviešu',       english: 'Latvian',    available: false },
  { code: 'MK', native: 'Македонски',     english: 'Macedonian', available: false },
  { code: 'MT', native: 'Malti',          english: 'Maltese',    available: false },
  { code: 'NB', native: 'Norsk',          english: 'Norwegian',  available: true  },
  { code: 'NL', native: 'Nederlands',     english: 'Dutch',      available: true  },
  { code: 'PL', native: 'Polski',         english: 'Polish',     available: false },
  { code: 'PT', native: 'Português',      english: 'Portuguese', available: true  },
  { code: 'RO', native: 'Română',         english: 'Romanian',   available: false },
  { code: 'SK', native: 'Slovenčina',     english: 'Slovak',     available: false },
  { code: 'SL', native: 'Slovenščina',    english: 'Slovenian',  available: false },
  { code: 'SQ', native: 'Shqip',          english: 'Albanian',   available: false },
  { code: 'SR', native: 'Srpski',         english: 'Serbian',    available: false },
  { code: 'SV', native: 'Svenska',        english: 'Swedish',    available: true  },
  { code: 'TR', native: 'Türkçe',         english: 'Turkish',    available: false },
  { code: 'UK', native: 'Українська',     english: 'Ukrainian',  available: false },
];

export const SUGGESTED = ALL_LANGUAGES.filter(l => SUGGESTED_CODES.includes(l.code));
export const REST      = ALL_LANGUAGES.filter(l => !SUGGESTED_CODES.includes(l.code));
