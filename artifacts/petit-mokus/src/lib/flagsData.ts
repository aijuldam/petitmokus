export type FlagDifficulty = 1 | 2 | 3;

export interface FlagItem {
  code: string;
  countryName: { EN: string; FR: string; HU: string };
  difficulty: FlagDifficulty;
}

export const FLAGS: FlagItem[] = [
  // Difficulty 1 — very visually distinct (2+ pool)
  { code: 'jp', countryName: { EN: 'Japan',           FR: 'Japon',          HU: 'Japán'              }, difficulty: 1 },
  { code: 'ch', countryName: { EN: 'Switzerland',     FR: 'Suisse',         HU: 'Svájc'              }, difficulty: 1 },
  { code: 'ca', countryName: { EN: 'Canada',          FR: 'Canada',         HU: 'Kanada'             }, difficulty: 1 },
  { code: 'no', countryName: { EN: 'Norway',          FR: 'Norvège',        HU: 'Norvégia'           }, difficulty: 1 },
  { code: 'br', countryName: { EN: 'Brazil',          FR: 'Brésil',         HU: 'Brazília'           }, difficulty: 1 },
  { code: 'gb', countryName: { EN: 'United Kingdom',  FR: 'Royaume-Uni',    HU: 'Egyesült Királyság' }, difficulty: 1 },
  // Difficulty 2 — moderately distinct (3+ adds these)
  { code: 'fr', countryName: { EN: 'France',          FR: 'France',         HU: 'Franciaország'      }, difficulty: 2 },
  { code: 'de', countryName: { EN: 'Germany',         FR: 'Allemagne',      HU: 'Németország'        }, difficulty: 2 },
  { code: 'it', countryName: { EN: 'Italy',           FR: 'Italie',         HU: 'Olaszország'        }, difficulty: 2 },
  { code: 'us', countryName: { EN: 'United States',   FR: 'États-Unis',     HU: 'Egyesült Államok'   }, difficulty: 2 },
  { code: 'se', countryName: { EN: 'Sweden',          FR: 'Suède',          HU: 'Svédország'         }, difficulty: 2 },
  { code: 'au', countryName: { EN: 'Australia',       FR: 'Australie',      HU: 'Ausztrália'         }, difficulty: 2 },
  // Difficulty 3 — more complex (5+ adds these)
  { code: 'es', countryName: { EN: 'Spain',           FR: 'Espagne',        HU: 'Spanyolország'      }, difficulty: 3 },
  { code: 'nl', countryName: { EN: 'Netherlands',     FR: 'Pays-Bas',       HU: 'Hollandia'          }, difficulty: 3 },
  { code: 'mx', countryName: { EN: 'Mexico',          FR: 'Mexique',        HU: 'Mexikó'             }, difficulty: 3 },
  { code: 'tr', countryName: { EN: 'Turkey',          FR: 'Türkiye',        HU: 'Törökország'        }, difficulty: 3 },
  { code: 'za', countryName: { EN: 'South Africa',    FR: 'Afrique du Sud', HU: 'Dél-Afrika'         }, difficulty: 3 },
  { code: 'ke', countryName: { EN: 'Kenya',           FR: 'Kenya',          HU: 'Kenya'              }, difficulty: 3 },
];
