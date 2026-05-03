// Lightweight fetch helpers for the Studio + Bedtime Stories APIs.
// Bedtime Stories API is now served by Cloudflare Worker (multilingual support)
// Studio API still comes from petit-mokus.replit.app

const STORIES_API_BASE = "https://petit-mokus-stories-api.aijuldam.workers.dev";

function resolveStudioApiBase(): string {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host === "petitmokus.com" || host.endsWith(".petitmokus.com")) {
    return "https://petit-mokus.replit.app";
  }
  return "";
}

const STUDIO_API_BASE = resolveStudioApiBase();
const ADMIN_PW_STORAGE_KEY = "petitmokus.studio.adminPassword";

export function getStoredAdminPassword(): string | null {
  try {
    return localStorage.getItem(ADMIN_PW_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeAdminPassword(pw: string): void {
  try {
    localStorage.setItem(ADMIN_PW_STORAGE_KEY, pw);
  } catch {
    // ignore
  }
}

export function clearAdminPassword(): void {
  try {
    localStorage.removeItem(ADMIN_PW_STORAGE_KEY);
  } catch {
    // ignore
  }
}

async function request<T>(
  path: string,
  opts: { method?: string; body?: unknown; admin?: boolean; baseUrl?: string } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.admin) {
    const pw = getStoredAdminPassword();
    if (pw) headers["X-Admin-Password"] = pw;
  }
  const baseUrl = opts.baseUrl || STUDIO_API_BASE;
  const res = await fetch(`${baseUrl}/api${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const err = (await res.json()) as { error?: string };
      if (err?.error) msg = err.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

// ---- Studio types (kept loose; backend is authoritative) ----
export interface StudioProjectSummary {
  id: string;
  title: string;
  seed: string;
  status: "brief" | "manuscript" | "illustrations" | "published";
  published_book_id: string | null;
  updated_at: string;
  created_at: string;
}

export interface ManuscriptPage {
  page: number;
  text: string;
  scene: string;
  isPajamaScene: boolean;
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

export interface AdditionalCharacter {
  name: string;
  description: string;
}

export interface CharacterBible {
  papa: string;
  maxime: string;
  clothing_before_pajamas: string;
  clothing_pajamas: string;
  style: string;
  additional_characters: AdditionalCharacter[];
}

export interface StudioProject extends StudioProjectSummary {
  brief_data: Record<string, unknown> | null;
  brief_approved_at: string | null;
  manuscript_data: { pages: ManuscriptPage[]; recurringPhrase: string } | null;
  manuscript_approved_at: string | null;
  illustrations_data: { items: IllustrationItem[] } | null;
  illustrations_approved_at: string | null;
}

export const studioApi = {
  status: () =>
    request<{ adminConfigured: boolean; imageProvider: string }>("/studio/status"),
  login: (password: string) =>
    request<{ ok: true }>("/studio/auth", { method: "POST", body: { password } }),
  listProjects: () =>
    request<{ projects: StudioProjectSummary[] }>("/studio/projects", { admin: true }),
  getProject: (id: string) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}`, { admin: true }),
  createProject: (seed: string) =>
    request<{ project: StudioProject }>("/studio/projects", {
      method: "POST",
      body: { seed },
      admin: true,
    }),
  generateBrief: (
    id: string,
    customPrompt?: string,
    autoApprove?: boolean,
  ) => {
    const body: Record<string, unknown> = {};
    if (customPrompt) body.customPrompt = customPrompt;
    if (autoApprove) body.autoApprove = true;
    return request<{ project: StudioProject }>(`/studio/projects/${id}/brief`, {
      method: "POST",
      body: Object.keys(body).length > 0 ? body : undefined,
      admin: true,
    });
  },
  deleteProject: (id: string) =>
    request<{ ok: true; deletedId: string }>(`/studio/projects/${id}`, {
      method: "DELETE",
      admin: true,
    }),
  getCharacterBible: () =>
    request<{ bible: CharacterBible; defaults: CharacterBible }>(
      "/studio/character-bible",
      { admin: true },
    ),
  saveCharacterBible: (bible: CharacterBible) =>
    request<{ bible: CharacterBible; defaults: CharacterBible }>(
      "/studio/character-bible",
      { method: "PUT", body: bible, admin: true },
    ),
  approveBrief: (id: string) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}/brief/approve`, {
      method: "POST",
      admin: true,
    }),
  generateManuscript: (id: string) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}/manuscript`, {
      method: "POST",
      admin: true,
    }),
  saveManuscript: (id: string, manuscript: StudioProject["manuscript_data"]) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}/manuscript`, {
      method: "PUT",
      body: { manuscript },
      admin: true,
    }),
  approveManuscript: (id: string) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}/manuscript/approve`, {
      method: "POST",
      admin: true,
    }),
  prepareIllustrations: (id: string) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}/illustrations/prepare`, {
      method: "POST",
      admin: true,
    }),
  generateIllustrations: (id: string, pages?: number[]) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}/illustrations/generate`, {
      method: "POST",
      body: pages ? { pages } : {},
      admin: true,
    }),
  approveIllustrations: (id: string) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}/illustrations/approve`, {
      method: "POST",
      admin: true,
    }),
  resetIllustrations: (id: string) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}/illustrations/reset`, {
      method: "POST",
      admin: true,
    }),
  skipBrief: (id: string) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}/skip-brief`, {
      method: "POST",
      admin: true,
    }),
  publish: (id: string) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}/publish`, {
      method: "POST",
      admin: true,
    }),
  productionSpec: (id: string) =>
    request<{ checklist: { item: string; done: boolean }[]; pdfSpec: unknown }>(
      `/studio/projects/${id}/production-spec`,
      { admin: true },
    ),
};

// ---- Public Bedtime Stories API ----
export type BookLanguage = "EN" | "FR" | "HU" | "DE";
export type Translatable = Partial<Record<BookLanguage, string>>;

export interface BedtimeStorySummary {
  id: string;
  slug: string;
  title: string;
  language: string;
  cover_image_url: string | null;
  published_at: string;
  // pages JSONB may carry title_i18n for the localized list view.
  pages?:
    | unknown[]
    | { pages?: unknown; title_i18n?: Partial<Record<"EN" | "FR" | "HU" | "DE", string>> };
}

export function pickSummaryTitle(
  summary: BedtimeStorySummary,
  lang: BookLanguage,
): string {
  const p = summary.pages;
  if (p && !Array.isArray(p) && typeof p === "object" && "title_i18n" in p && p.title_i18n) {
    const t = p.title_i18n as Partial<Record<BookLanguage, string>>;
    return t[lang] ?? t.EN ?? summary.title;
  }
  return summary.title;
}

export interface BedtimeStoryPage {
  page: number;
  text: string; // legacy English fallback
  texts?: Translatable; // multilingual (newer books)
  imageUrl: string | null;
}

// `pages` field can be either:
//  - legacy: BedtimeStoryPage[]
//  - new:    { pages: BedtimeStoryPage[], title_i18n?: Translatable, recurring_phrase_i18n?: Translatable }
export type BedtimeStoryPagesField =
  | BedtimeStoryPage[]
  | {
      pages: BedtimeStoryPage[];
      title_i18n?: Translatable;
      recurring_phrase_i18n?: Translatable;
    };

export interface BedtimeStory extends BedtimeStorySummary {
  recurring_phrase: string | null;
  pages: BedtimeStoryPagesField;
}

// Helper to safely pick localized text with EN/source fallback.
export function pickText(
  value: string | Translatable | null | undefined,
  lang: BookLanguage,
  fallback = "",
): string {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  return value[lang] ?? value.EN ?? Object.values(value)[0] ?? fallback;
}

// Normalize either pages shape into { pages, title_i18n?, recurring_phrase_i18n? }
export function unwrapBookPages(book: BedtimeStory): {
  pages: BedtimeStoryPage[];
  title_i18n?: Translatable;
  recurring_phrase_i18n?: Translatable;
} {
  const f = book.pages;
  if (Array.isArray(f)) return { pages: f };
  return {
    pages: f.pages,
    title_i18n: f.title_i18n,
    recurring_phrase_i18n: f.recurring_phrase_i18n,
  };
}

// ---- Cloudflare Worker Bedtime Stories API ----
// Transforms Worker response format to expected component format

interface CloudflareStory {
  id: string;
  slug: string;
  title: string;
  language: string;
  cover: string;
  pages: Array<{
    number: number;
    text: string;
    image: string;
  }>;
}

interface CloudflareStoriesResponse {
  stories: CloudflareStory[];
}

function transformCloudflareStory(story: CloudflareStory): BedtimeStory {
  return {
    id: story.id,
    slug: story.slug,
    title: story.title,
    language: story.language,
    cover_image_url: story.cover,
    published_at: new Date().toISOString(),
    pages: {
      pages: story.pages.map((p) => ({
        page: p.number,
        text: p.text,
        imageUrl: p.image,
      })),
    },
    recurring_phrase: null,
  };
}

async function fetchStoriesFromWorker(path: string): Promise<CloudflareStoriesResponse> {
  const res = await fetch(`${STORIES_API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch stories: ${res.status}`);
  }
  return res.json() as Promise<CloudflareStoriesResponse>;
}

export const bedtimeStoriesApi = {
  list: async () => {
    const data = await fetchStoriesFromWorker("/api/stories");
    const books: BedtimeStorySummary[] = data.stories.map((story) => ({
      id: story.id,
      slug: story.slug,
      title: story.title,
      language: story.language,
      cover_image_url: story.cover,
      published_at: new Date().toISOString(),
    }));
    return { books };
  },
  get: async (slug: string) => {
    const data = await fetchStoriesFromWorker("/api/stories");
    const story = data.stories.find((s) => s.slug === slug);
    if (!story) {
      throw new Error(`Story ${slug} not found`);
    }
    const book = transformCloudflareStory(story);
    return { book };
  },
};
