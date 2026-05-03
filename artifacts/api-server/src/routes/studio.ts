import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { getSupabase } from "../lib/supabase-client.js";
import { adminPasswordIsConfigured, requireAdmin } from "../lib/admin-auth.js";
import { getImageProvider } from "../lib/image-providers.js";
import {
  buildIllustrationItems,
  generateBrief,
  generateManuscript,
  getSeedBrief,
  getSeedManuscript,
  translateBook,
  type BriefData,
  type IllustrationItem,
  type IllustrationsData,
  type ManuscriptData,
  type Translatable,
} from "../lib/studio-llm.js";
import { CHARACTER_BIBLE, type CharacterBible } from "../lib/character-specs.js";
import {
  loadActiveCharacterBible,
  saveCharacterBible,
} from "../lib/character-bible-store.js";

const router: IRouter = Router();

type ProjectStatus = "brief" | "manuscript" | "illustrations" | "published";

interface StudioProjectRow {
  id: string;
  title: string;
  seed: string;
  status: ProjectStatus;
  brief_data: BriefData | null;
  brief_approved_at: string | null;
  manuscript_data: ManuscriptData | null;
  manuscript_approved_at: string | null;
  illustrations_data: IllustrationsData | null;
  illustrations_approved_at: string | null;
  published_book_id: string | null;
  created_at: string;
  updated_at: string;
}

async function loadProject(id: string): Promise<StudioProjectRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("studio_projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as StudioProjectRow;
}

async function saveVersion(
  projectId: string,
  stage: "brief" | "manuscript" | "illustrations",
  data: unknown,
) {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase
    .from("studio_versions")
    .insert({ project_id: projectId, stage, data });
}

async function updateProject(
  id: string,
  patch: Partial<StudioProjectRow>,
): Promise<StudioProjectRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("studio_projects")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error || !data) return null;
  return data as StudioProjectRow;
}

// ---- Status / config ----
router.get("/studio/status", (_req, res) => {
  res.json({
    adminConfigured: adminPasswordIsConfigured(),
    imageProvider: getImageProvider().name,
  });
});

// Lightweight password check for the Studio login screen — accepts password,
// returns 200 if it matches the secret. The frontend stores it in
// localStorage and forwards it on every Studio mutation.
router.post("/studio/auth", (req: Request, res: Response) => {
  const expected = process.env.STUDIO_ADMIN_PASSWORD;
  if (!expected) {
    res
      .status(503)
      .json({ error: "Studio admin password not configured on server." });
    return;
  }
  const provided = (req.body as { password?: string })?.password;
  if (!provided || provided !== expected) {
    res.status(401).json({ error: "Wrong password" });
    return;
  }
  res.json({ ok: true });
});

// All routes below require admin
router.use("/studio/projects", requireAdmin);
router.use("/studio/projects/:id", requireAdmin);
router.use("/studio/character-bible", requireAdmin);

// ---- Character bible (shared cast across all stories) ----
router.get("/studio/character-bible", async (_req, res) => {
  const bible = await loadActiveCharacterBible();
  res.json({ bible, defaults: CHARACTER_BIBLE });
});

const CharacterBibleSchema = z.object({
  papa: z.string().min(10).max(2000),
  maxime: z.string().min(10).max(2000),
  clothing_before_pajamas: z.string().min(10).max(2000),
  clothing_pajamas: z.string().min(10).max(2000),
  style: z.string().min(10).max(2000),
});
router.put("/studio/character-bible", async (req, res) => {
  const parsed = CharacterBibleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid character bible", details: parsed.error.flatten() });
    return;
  }
  const saved = await saveCharacterBible(parsed.data as CharacterBible);
  if (!saved) {
    res.status(500).json({ error: "Failed to save character bible" });
    return;
  }
  res.json({ bible: saved, defaults: CHARACTER_BIBLE });
});

// ---- Project CRUD ----
router.get("/studio/projects", async (_req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }
  const { data, error } = await supabase
    .from("studio_projects")
    .select("id, title, seed, status, published_book_id, updated_at, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ projects: data ?? [] });
});

const CreateProjectSchema = z.object({
  seed: z.string().min(1).max(200),
});
router.post("/studio/projects", async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }
  const parsed = CreateProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const { data, error } = await supabase
    .from("studio_projects")
    .insert({ title: parsed.data.seed, seed: parsed.data.seed, status: "brief" })
    .select("*")
    .maybeSingle();
  if (error || !data) {
    res.status(500).json({ error: error?.message ?? "Insert failed" });
    return;
  }
  res.status(201).json({ project: data });
});

router.delete("/studio/projects/:id", async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  // studio_versions has ON DELETE CASCADE; published_books has ON DELETE SET NULL
  // — published books survive the deletion of the source project.
  const { error } = await supabase
    .from("studio_projects")
    .delete()
    .eq("id", project.id);
  if (error) {
    req.log.error({ err: error }, "Project delete failed");
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ ok: true, deletedId: project.id });
});

router.get("/studio/projects/:id", async (req, res) => {
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ project });
});

// ---- Brief stage ----
router.post("/studio/projects/:id/brief", async (req, res) => {
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  try {
    const body = (req.body ?? {}) as {
      customPrompt?: unknown;
      autoApprove?: unknown;
    };
    const rawPrompt = body.customPrompt;
    const customPrompt =
      typeof rawPrompt === "string" && rawPrompt.trim().length > 0
        ? rawPrompt.slice(0, 4000)
        : undefined;
    const autoApprove = body.autoApprove === true;
    const bible = await loadActiveCharacterBible();

    const brief = await generateBrief(project.seed, customPrompt, bible);
    await saveVersion(project.id, "brief", brief);

    if (!autoApprove) {
      const updated = await updateProject(project.id, {
        brief_data: brief,
        status: "brief",
      });
      res.json({ project: updated });
      return;
    }

    // Auto-approve mode: only commit the brief approval AFTER the manuscript
    // generates successfully, so a manuscript failure leaves the project in a
    // clean "brief generated, awaiting approval" state instead of a half-
    // approved limbo.
    let manuscript: ManuscriptData;
    try {
      manuscript = await generateManuscript(brief);
    } catch (err) {
      req.log.error({ err }, "Auto-approve: manuscript generation failed");
      const partial = await updateProject(project.id, {
        brief_data: brief,
        status: "brief",
      });
      res.status(500).json({
        error:
          "Brief generated, but manuscript generation failed. The brief is saved — review it, then approve manually or retry auto-approve.",
        project: partial,
      });
      return;
    }
    await saveVersion(project.id, "manuscript", manuscript);
    const now = new Date().toISOString();
    const finalUpdate = await updateProject(project.id, {
      brief_data: brief,
      brief_approved_at: now,
      title: brief.title,
      manuscript_data: manuscript,
      manuscript_approved_at: now,
      status: "illustrations",
    });
    res.json({ project: finalUpdate });
  } catch (err) {
    req.log.error({ err }, "Brief generation failed");
    res.status(500).json({ error: "Brief generation failed" });
  }
});

router.post("/studio/projects/:id/brief/approve", async (req, res) => {
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (!project.brief_data) {
    res.status(400).json({ error: "Generate the brief first" });
    return;
  }
  const updated = await updateProject(project.id, {
    brief_approved_at: new Date().toISOString(),
    status: "manuscript",
    title: project.brief_data.title,
  });
  res.json({ project: updated });
});

// ---- Manuscript stage ----
router.post("/studio/projects/:id/manuscript", async (req, res) => {
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (!project.brief_data) {
    res.status(400).json({ error: "Approve the brief first" });
    return;
  }
  try {
    const manuscript = await generateManuscript(project.brief_data);
    await saveVersion(project.id, "manuscript", manuscript);
    const updated = await updateProject(project.id, {
      manuscript_data: manuscript,
    });
    res.json({ project: updated });
  } catch (err) {
    req.log.error({ err }, "Manuscript generation failed");
    res.status(500).json({ error: "Manuscript generation failed" });
  }
});

const EditManuscriptSchema = z.object({
  manuscript: z.object({
    pages: z
      .array(
        z.object({
          page: z.number().int().min(1).max(12),
          text: z.string().min(1).max(120),
          scene: z.string().min(1).max(400),
          isPajamaScene: z.boolean(),
        }),
      )
      .length(12),
    recurringPhrase: z.string().min(1),
    wordsPerPageRange: z.tuple([z.number(), z.number()]).optional(),
  }),
});
router.put("/studio/projects/:id/manuscript", async (req, res) => {
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const parsed = EditManuscriptSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid manuscript", details: parsed.error.flatten() });
    return;
  }
  const manuscript: ManuscriptData = {
    pages: parsed.data.manuscript.pages,
    recurringPhrase: parsed.data.manuscript.recurringPhrase,
    wordsPerPageRange: parsed.data.manuscript.wordsPerPageRange ?? [3, 8],
  };
  await saveVersion(project.id, "manuscript", manuscript);
  const updated = await updateProject(project.id, { manuscript_data: manuscript });
  res.json({ project: updated });
});

router.post("/studio/projects/:id/manuscript/approve", async (req, res) => {
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (!project.manuscript_data) {
    res.status(400).json({ error: "Generate the manuscript first" });
    return;
  }
  const updated = await updateProject(project.id, {
    manuscript_approved_at: new Date().toISOString(),
    status: "illustrations",
  });
  res.json({ project: updated });
});

// ---- Illustrations stage ----
// Builds the 12 illustration prompts from the manuscript without calling
// images yet — fast preview so the user can review prompts first.
router.post("/studio/projects/:id/illustrations/prepare", async (req, res) => {
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (!project.manuscript_data) {
    res.status(400).json({ error: "Approve the manuscript first" });
    return;
  }
  const bible = await loadActiveCharacterBible();
  const items = buildIllustrationItems(project.manuscript_data, bible);
  const data: IllustrationsData = {
    items,
    generationStartedAt: undefined,
    generationCompletedAt: undefined,
  };
  await saveVersion(project.id, "illustrations", data);
  const updated = await updateProject(project.id, { illustrations_data: data });
  res.json({ project: updated });
});

const GenerateImagesSchema = z.object({
  pages: z.array(z.number().int().min(1).max(12)).optional(),
});

// Generates images for the given pages (or all 12 if omitted). Runs with
// concurrency 2 to balance speed vs rate limits / cost. Per-page errors are
// captured and returned without aborting the batch.
router.post("/studio/projects/:id/illustrations/generate", async (req, res) => {
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (!project.illustrations_data) {
    res.status(400).json({ error: "Prepare illustrations first" });
    return;
  }
  const parsed = GenerateImagesSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const projectId = project.id;
  const targetPages = new Set(
    parsed.data.pages ?? project.illustrations_data.items.map((i) => i.page),
  );
  const provider = getImageProvider();
  const items: IllustrationItem[] = [...project.illustrations_data.items];
  const startedAt = new Date().toISOString();

  // Simple sequential-with-concurrency pool
  const queue = items.filter((i) => targetPages.has(i.page));
  const concurrency = 2;
  let cursor = 0;
  async function worker() {
    while (cursor < queue.length) {
      const item = queue[cursor++];
      if (!item) continue;
      try {
        const generated = await provider.generate(item.prompt, {
          projectId,
          page: item.page,
        });
        const idx = items.findIndex((i) => i.page === item.page);
        if (idx >= 0) {
          items[idx] = {
            ...items[idx]!,
            imageUrl: generated.url,
            imageStoragePath: generated.storagePath,
            generatedAt: new Date().toISOString(),
            provider: generated.provider,
            error: undefined,
          };
        }
      } catch (err) {
        const idx = items.findIndex((i) => i.page === item.page);
        if (idx >= 0) {
          items[idx] = {
            ...items[idx]!,
            error: err instanceof Error ? err.message : String(err),
          };
        }
        req.log.error({ err, page: item.page }, "Image generation failed");
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const data: IllustrationsData = {
    items,
    generationStartedAt: project.illustrations_data.generationStartedAt ?? startedAt,
    generationCompletedAt: new Date().toISOString(),
  };
  await saveVersion(project.id, "illustrations", data);
  const updated = await updateProject(project.id, { illustrations_data: data });
  res.json({ project: updated });
});

router.post("/studio/projects/:id/illustrations/approve", async (req, res) => {
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (!project.illustrations_data || project.illustrations_data.items.length !== 12) {
    res.status(400).json({ error: "Need 12 illustration items" });
    return;
  }
  const missing = project.illustrations_data.items.filter((i) => !i.imageUrl);
  if (missing.length > 0) {
    res.status(400).json({
      error: `Generate images for all 12 pages first (missing pages: ${missing.map((m) => m.page).join(", ")})`,
    });
    return;
  }
  const updated = await updateProject(project.id, {
    illustrations_approved_at: new Date().toISOString(),
  });
  res.json({ project: updated });
});

// ---- Publish ----
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

router.post("/studio/projects/:id/publish", async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (
    !project.brief_approved_at ||
    !project.manuscript_approved_at ||
    !project.illustrations_approved_at ||
    !project.illustrations_data ||
    !project.manuscript_data
  ) {
    res.status(400).json({ error: "All three checkpoints must be approved before publishing" });
    return;
  }

  // Translate title + recurring phrase + every page text into FR/HU/DE.
  const englishPageTexts = project.manuscript_data.pages.map((p) => p.text);
  let translated;
  try {
    translated = await translateBook(
      project.title,
      project.manuscript_data.recurringPhrase,
      englishPageTexts,
    );
  } catch (e) {
    req.log.error({ err: e }, "Translation failed; publishing English-only");
    const idTrans = (s: string): Translatable => ({ EN: s, FR: s, HU: s, DE: s });
    translated = {
      title: idTrans(project.title),
      recurringPhrase: idTrans(project.manuscript_data.recurringPhrase),
      pageTexts: englishPageTexts.map(idTrans),
    };
  }

  const pages = project.manuscript_data.pages.map((p, idx) => {
    const ill = project.illustrations_data!.items.find((i) => i.page === p.page);
    return {
      page: p.page,
      text: p.text, // legacy field — English text, kept for backwards compat
      texts: translated.pageTexts[idx], // new multilingual field
      imageUrl: ill?.imageUrl ?? null,
    };
  });
  const coverImageUrl = pages[0]?.imageUrl ?? null;
  const baseSlug = slugify(project.title || "bedtime-story");
  const slug = `${baseSlug}-${project.id.slice(0, 6)}`;

  const pagesPayload = {
    pages,
    title_i18n: translated.title,
    recurring_phrase_i18n: translated.recurringPhrase,
  };

  const { data: published, error: pubErr } = await supabase
    .from("published_books")
    .upsert(
      {
        slug,
        title: project.title,
        language: "EN",
        recurring_phrase: project.manuscript_data.recurringPhrase,
        pages: pagesPayload,
        cover_image_url: coverImageUrl,
        source_project_id: project.id,
        published_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    )
    .select("*")
    .maybeSingle();

  if (pubErr || !published) {
    req.log.error({ err: pubErr }, "Publish failed");
    res.status(500).json({ error: pubErr?.message ?? "Publish failed" });
    return;
  }

  const updated = await updateProject(project.id, {
    status: "published",
    published_book_id: (published as { id: string }).id,
  });
  res.json({ project: updated, published });
});

// ---- Production checklist + PDF spec export ----
router.get("/studio/projects/:id/production-spec", async (req, res) => {
  const project = await loadProject(req.params.id!);
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const checklist = [
    { item: "Brief approved", done: !!project.brief_approved_at },
    { item: "Manuscript approved", done: !!project.manuscript_approved_at },
    { item: "Illustrations approved", done: !!project.illustrations_approved_at },
    {
      item: "All 12 illustrations generated",
      done:
        !!project.illustrations_data &&
        project.illustrations_data.items.length === 12 &&
        project.illustrations_data.items.every((i) => !!i.imageUrl),
    },
    { item: "Published to Bedtime Stories", done: !!project.published_book_id },
  ];

  const pdfSpec = {
    format: "Board book",
    trimSize: { width_mm: 178, height_mm: 178, units: "mm" },
    bleed_mm: 3,
    safeArea_mm: 6,
    pageCount: 12,
    coverStock: "350gsm matte laminated",
    interiorStock: "Greyboard 1.4mm core, 157gsm matte coated paper laminated each side",
    bindingStyle: "Glued board book, rounded corners 8mm radius",
    colorSpace: "CMYK with embedded ICC profile (FOGRA39)",
    typography: { font: "Georgia", sizeRange_pt: [22, 32] },
    illustrationDpi: 300,
    fileFormat: "PDF/X-1a:2001",
    pages: project.manuscript_data?.pages.map((p) => {
      const ill = project.illustrations_data?.items.find((i) => i.page === p.page);
      return {
        page: p.page,
        copy: p.text,
        imageUrl: ill?.imageUrl ?? null,
        imageStoragePath: ill?.imageStoragePath ?? null,
      };
    }),
  };

  res.json({ checklist, pdfSpec, characterBible: project.brief_data?.characterBible });
});

// Seed the canonical "Maxime Goes to Sleep" project on first run.
export async function seedStudioIfEmpty(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const { count, error: countErr } = await supabase
    .from("studio_projects")
    .select("*", { count: "exact", head: true });
  if (countErr) return; // Table missing — user hasn't run the migration yet.
  if ((count ?? 0) > 0) return;

  const brief = getSeedBrief();
  const manuscript = getSeedManuscript();
  const items = buildIllustrationItems(manuscript);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("studio_projects")
    .insert({
      title: brief.title,
      seed: "Maxime Goes to Sleep",
      status: "illustrations", // brief and manuscript are pre-approved
      brief_data: brief,
      brief_approved_at: now,
      manuscript_data: manuscript,
      manuscript_approved_at: now,
      illustrations_data: { items },
    })
    .select("id")
    .maybeSingle();

  if (error) {
    // Don't crash the server if the seed insert fails — just log.
    // eslint-disable-next-line no-console
    console.warn("[studio] seed insert failed:", error.message);
    return;
  }
  if (data) {
    await supabase.from("studio_versions").insert([
      { project_id: (data as { id: string }).id, stage: "brief", data: brief },
      { project_id: (data as { id: string }).id, stage: "manuscript", data: manuscript },
      { project_id: (data as { id: string }).id, stage: "illustrations", data: { items } },
    ]);
  }
}

export default router;
