// Lightweight fetch helpers for the Studio + Bedtime Stories APIs.
// In production the petit-mokus frontend is hosted on petitmokus.com (Cloudflare)
// while the API runs on petit-mokus.replit.app, so we resolve API_BASE accordingly.

function resolveApiBase(): string {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host === "petitmokus.com" || host.endsWith(".petitmokus.com")) {
    return "https://petit-mokus.replit.app";
  }
  return "";
}

const API_BASE = resolveApiBase();
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
  opts: { method?: string; body?: unknown; admin?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.admin) {
    const pw = getStoredAdminPassword();
    if (pw) headers["X-Admin-Password"] = pw;
  }
  const res = await fetch(`${API_BASE}/api${path}`, {
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
  generateBrief: (id: string) =>
    request<{ project: StudioProject }>(`/studio/projects/${id}/brief`, {
      method: "POST",
      admin: true,
    }),
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
export interface BedtimeStorySummary {
  id: string;
  slug: string;
  title: string;
  language: string;
  cover_image_url: string | null;
  published_at: string;
}

export interface BedtimeStoryPage {
  page: number;
  text: string;
  imageUrl: string | null;
}

export interface BedtimeStory extends BedtimeStorySummary {
  recurring_phrase: string | null;
  pages: BedtimeStoryPage[];
}

export const bedtimeStoriesApi = {
  list: () => request<{ books: BedtimeStorySummary[] }>("/bedtime-stories"),
  get: (slug: string) => request<{ book: BedtimeStory }>(`/bedtime-stories/${slug}`),
};
