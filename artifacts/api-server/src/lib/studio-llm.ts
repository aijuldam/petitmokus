import { getOpenAI } from "./openai-client.js";
import {
  CHARACTER_BIBLE,
  buildIllustrationPrompt,
  type SceneSpec,
} from "./character-specs.js";

export interface BriefData {
  title: string;
  audience: string;
  tone: string;
  themes: string[];
  pageCount: number;
  recurringPhrase: string;
  styleSummary: string;
  characterBible: typeof CHARACTER_BIBLE;
}

export interface ManuscriptPage {
  page: number;
  text: string;
  scene: string;
  isPajamaScene: boolean;
}

export interface ManuscriptData {
  pages: ManuscriptPage[];
  recurringPhrase: string;
  wordsPerPageRange: [number, number];
}

export interface IllustrationItem {
  page: number;
  text: string;
  prompt: string;
  imageUrl?: string;
  imageStoragePath?: string;
  generatedAt?: string;
  provider?: string;
  error?: string;
}

export interface IllustrationsData {
  items: IllustrationItem[];
  generationStartedAt?: string;
  generationCompletedAt?: string;
}

const SEED_RECURRING_PHRASE = "Soft and slow, here we go.";

const SEED_PAGES: ManuscriptPage[] = [
  { page: 1, text: "Maxime plays with blocks.", scene: "Maxime sits on a soft rug stacking colorful wooden blocks in a cozy living room before bedtime", isPajamaScene: false },
  { page: 2, text: "Warm milk in bottle.", scene: "Papa hands a small warm milk bottle to Maxime in a softly lit kitchen", isPajamaScene: false },
  { page: 3, text: "Soft and slow, here we go.", scene: "Papa gently leads Maxime by the hand toward the bathroom hallway, soft glowing nightlight", isPajamaScene: false },
  { page: 4, text: "Brush teeth up and down.", scene: "Maxime brushes his tiny teeth at the sink with Papa kneeling beside him helping", isPajamaScene: false },
  { page: 5, text: "Smile shines bright!", scene: "Maxime grins widely showing his clean teeth, mirror reflection, Papa smiling warmly behind", isPajamaScene: false },
  { page: 6, text: "Soft pajamas now.", scene: "Papa helping Maxime into soft sky-blue pajamas in his pastel-themed bedroom", isPajamaScene: true },
  { page: 7, text: "Soft and slow, here we go.", scene: "Papa carrying Maxime in pajamas down a softly lit hallway toward the bedroom", isPajamaScene: true },
  { page: 8, text: "Find fluffy teddy bear.", scene: "Maxime reaches for his beloved fluffy teddy bear sitting on the corner of his bed", isPajamaScene: true },
  { page: 9, text: "Bear says shhh so soft.", scene: "Close-up of Maxime hugging the teddy bear close to his cheek, finger over his lips", isPajamaScene: true },
  { page: 10, text: "Papa's big warm hug.", scene: "Papa wrapping Maxime in a big tender hug while sitting on the edge of the toddler bed", isPajamaScene: true },
  { page: 11, text: "Rock and hum lullaby.", scene: "Papa gently rocking Maxime in a wooden rocking chair, Papa humming, eyes closed peacefully", isPajamaScene: true },
  { page: 12, text: "Soft and slow, asleep.", scene: "Maxime fully asleep in his bed cuddling teddy, Papa tucking the soft blanket up to his chin, dim warm bedroom light", isPajamaScene: true },
];

export function getSeedManuscript(): ManuscriptData {
  return {
    pages: SEED_PAGES.map((p) => ({ ...p })),
    recurringPhrase: SEED_RECURRING_PHRASE,
    wordsPerPageRange: [3, 8],
  };
}

export function getSeedBrief(): BriefData {
  return {
    title: "Maxime Goes to Sleep",
    audience: "Toddlers 12-24 months",
    tone: "Calming, warm, intimate, reassuring bedtime ritual",
    themes: ["bedtime routine", "father-son bond", "gentle sleep cues", "comfort objects"],
    pageCount: 12,
    recurringPhrase: SEED_RECURRING_PHRASE,
    styleSummary: "Petit Mokus soft watercolor, pastel palette, rounded shapes, warm lamp-lit cozy domestic scenes, no text in illustrations",
    characterBible: CHARACTER_BIBLE,
  };
}

// ---- LLM-driven generation (used when user requests revisions) ----

export async function generateBrief(seed: string): Promise<BriefData> {
  const client = getOpenAI();
  if (!client) {
    // Fallback when LLM unavailable — return canonical seed brief.
    return { ...getSeedBrief(), title: seed.length > 0 ? seed : "Untitled Bedtime Book" };
  }

  const sys = `You are an expert children's board book editor for the Petit Mokus brand (calm bedtime stories for toddlers 12-24 months). Always reply with strict valid JSON matching the schema. No prose outside JSON.`;
  const user = `Create a story brief for a 12-page board book seeded by: "${seed}".
Schema: { "title": string, "audience": string, "tone": string, "themes": string[], "pageCount": 12, "recurringPhrase": string, "styleSummary": string }
Constraints: 3-8 words per page, recurring phrase repeats on pages 3, 7, and a closing variant on 12. Style is soft watercolor pastel.`;

  const resp = await client.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 1024,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
  });

  const raw = resp.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as Partial<BriefData>;
  return {
    title: parsed.title ?? seed,
    audience: parsed.audience ?? "Toddlers 12-24 months",
    tone: parsed.tone ?? "Calm and warm",
    themes: parsed.themes ?? ["bedtime"],
    pageCount: 12,
    recurringPhrase: parsed.recurringPhrase ?? SEED_RECURRING_PHRASE,
    styleSummary: parsed.styleSummary ?? "Petit Mokus soft watercolor",
    characterBible: CHARACTER_BIBLE,
  };
}

export async function generateManuscript(brief: BriefData): Promise<ManuscriptData> {
  const client = getOpenAI();
  if (!client) {
    return getSeedManuscript();
  }

  const sys = `You are writing a 12-page board book manuscript for toddlers 12-24 months. Strict valid JSON only. Each page text must be 3-8 words. Pages 3 and 7 use the exact recurring phrase. The final page (12) uses a soft variation of the recurring phrase.`;
  const user = `Brief: ${JSON.stringify(brief)}
Generate the manuscript with this schema:
{ "pages": [ { "page": number, "text": string, "scene": string, "isPajamaScene": boolean } ] }
- "scene" is a 1-sentence visual description used by the illustrator (no character appearance details — those are constant).
- "isPajamaScene" is true once the toddler has changed into pajamas (typically page 6 onward).
- Maintain a cozy bedtime ritual arc: play -> wind-down -> bath/teeth -> pajamas -> bedroom -> teddy -> hug -> lullaby -> asleep.`;

  const resp = await client.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 4096,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
  });

  const raw = resp.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { pages?: ManuscriptPage[] };
  const pages = (parsed.pages ?? []).slice(0, 12);
  if (pages.length !== 12) {
    return getSeedManuscript();
  }
  return {
    pages,
    recurringPhrase: brief.recurringPhrase,
    wordsPerPageRange: [3, 8],
  };
}

// Builds the 12 illustration prompts deterministically from the manuscript +
// character bible — does NOT call the LLM, ensuring consistency.
export function buildIllustrationItems(manuscript: ManuscriptData): IllustrationItem[] {
  return manuscript.pages.map((page) => {
    const spec: SceneSpec = {
      page: page.page,
      text: page.text,
      scene: page.scene,
      isPajamaScene: page.isPajamaScene,
    };
    return {
      page: page.page,
      text: page.text,
      prompt: buildIllustrationPrompt(spec),
    };
  });
}
