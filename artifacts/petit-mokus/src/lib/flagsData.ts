export type FlagDifficulty = 1 | 2 | 3;

export interface FlagItem {
  code: string;
  countryName: { EN: string; FR: string; HU: string; DE: string };
  difficulty: FlagDifficulty;
}

export const FLAGS: FlagItem[] = [
  // Difficulty 1 — very visually distinct (2+ pool)
  { code: 'jp', countryName: { EN: 'Japan',           FR: 'Japon',          HU: 'Japán',               DE: 'Japan'                  }, difficulty: 1 },
  { code: 'ch', countryName: { EN: 'Switzerland',     FR: 'Suisse',         HU: 'Svájc',               DE: 'Schweiz'                }, difficulty: 1 },
  { code: 'ca', countryName: { EN: 'Canada',          FR: 'Canada',         HU: 'Kanada',              DE: 'Kanada'                 }, difficulty: 1 },
  { code: 'no', countryName: { EN: 'Norway',          FR: 'Norvège',        HU: 'Norvégia',            DE: 'Norwegen'               }, difficulty: 1 },
  { code: 'br', countryName: { EN: 'Brazil',          FR: 'Brésil',         HU: 'Brazília',            DE: 'Brasilien'              }, difficulty: 1 },
  { code: 'gb', countryName: { EN: 'United Kingdom',  FR: 'Royaume-Uni',    HU: 'Egyesült Királyság',  DE: 'Vereinigtes Königreich' }, difficulty: 1 },
  // Difficulty 2 — moderately distinct (3+ adds these)
  { code: 'hu', countryName: { EN: 'Hungary',         FR: 'Hongrie',        HU: 'Magyarország',        DE: 'Ungarn'                 }, difficulty: 2 },
  { code: 'fr', countryName: { EN: 'France',          FR: 'France',         HU: 'Franciaország',       DE: 'Frankreich'             }, difficulty: 2 },
  { code: 'de', countryName: { EN: 'Germany',         FR: 'Allemagne',      HU: 'Németország',         DE: 'Deutschland'            }, difficulty: 2 },
  { code: 'it', countryName: { EN: 'Italy',           FR: 'Italie',         HU: 'Olaszország',         DE: 'Italien'                }, difficulty: 2 },
  { code: 'us', countryName: { EN: 'United States',   FR: 'États-Unis',     HU: 'Egyesült Államok',    DE: 'Vereinigte Staaten'     }, difficulty: 2 },
  { code: 'se', countryName: { EN: 'Sweden',          FR: 'Suède',          HU: 'Svédország',          DE: 'Schweden'               }, difficulty: 2 },
  { code: 'au', countryName: { EN: 'Australia',       FR: 'Australie',      HU: 'Ausztrália',          DE: 'Australien'             }, difficulty: 2 },
  // Difficulty 3 — more complex (5+ adds these)
  { code: 'es', countryName: { EN: 'Spain',           FR: 'Espagne',        HU: 'Spanyolország',       DE: 'Spanien'                }, difficulty: 3 },
  { code: 'nl', countryName: { EN: 'Netherlands',     FR: 'Pays-Bas',       HU: 'Hollandia',           DE: 'Niederlande'            }, difficulty: 3 },
  { code: 'mx', countryName: { EN: 'Mexico',          FR: 'Mexique',        HU: 'Mexikó',              DE: 'Mexiko'                 }, difficulty: 3 },
  { code: 'tr', countryName: { EN: 'Turkey',          FR: 'Türkiye',        HU: 'Törökország',         DE: 'Türkei'                 }, difficulty: 3 },
  { code: 'za', countryName: { EN: 'South Africa',    FR: 'Afrique du Sud', HU: 'Dél-Afrika',          DE: 'Südafrika'              }, difficulty: 3 },
  { code: 'ke', countryName: { EN: 'Kenya',           FR: 'Kenya',          HU: 'Kenya',               DE: 'Kenia'                  }, difficulty: 3 },
];
