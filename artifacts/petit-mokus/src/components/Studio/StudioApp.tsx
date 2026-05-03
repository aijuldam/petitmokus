import { useEffect, useState } from "react";
import {
  bedtimeStoriesApi,
  clearAdminPassword,
  getStoredAdminPassword,
  storeAdminPassword,
  studioApi,
  type AdditionalCharacter,
  type CharacterBible,
  type IllustrationItem,
  type ManuscriptPage,
  type StudioProject,
  type StudioProjectSummary,
} from "../../lib/studio-api";

type View =
  | { kind: "login" }
  | { kind: "dashboard" }
  | { kind: "project"; id: string };

export function StudioApp() {
  const [view, setView] = useState<View>(() =>
    getStoredAdminPassword() ? { kind: "dashboard" } : { kind: "login" },
  );
  const [serverStatus, setServerStatus] = useState<{
    adminConfigured: boolean;
    imageProvider: string;
  } | null>(null);

  useEffect(() => {
    studioApi.status().then(setServerStatus).catch(() => setServerStatus(null));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 text-slate-800">
      <header className="border-b border-amber-200/60 bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-amber-900">
              Petit Mokus Studio
            </h1>
            <p className="text-xs text-slate-500">Bedtime book workshop</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {serverStatus && (
              <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                images: {serverStatus.imageProvider}
              </span>
            )}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "";
                window.location.reload();
              }}
              className="text-slate-500 hover:text-slate-800"
            >
              ← Exit Studio
            </a>
            {view.kind !== "login" && (
              <button
                onClick={() => {
                  clearAdminPassword();
                  setView({ kind: "login" });
                }}
                className="text-slate-500 hover:text-slate-800"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {view.kind === "login" && (
          <LoginScreen
            onSuccess={() => setView({ kind: "dashboard" })}
            adminConfigured={serverStatus?.adminConfigured ?? true}
          />
        )}
        {view.kind === "dashboard" && (
          <Dashboard
            onOpen={(id) => setView({ kind: "project", id })}
            onUnauthorized={() => setView({ kind: "login" })}
          />
        )}
        {view.kind === "project" && (
          <ProjectView
            projectId={view.id}
            onBack={() => setView({ kind: "dashboard" })}
            onUnauthorized={() => setView({ kind: "login" })}
          />
        )}
      </main>
    </div>
  );
}

// ============================================================
// Login
// ============================================================
function LoginScreen({
  onSuccess,
  adminConfigured,
}: {
  onSuccess: () => void;
  adminConfigured: boolean;
}) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await studioApi.login(pw);
      storeAdminPassword(pw);
      onSuccess();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <form
        onSubmit={submit}
        className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-amber-100"
      >
        <h2 className="text-xl font-bold mb-2 text-amber-900">Studio sign-in</h2>
        <p className="text-sm text-slate-500 mb-6">
          Enter the admin password to manage bedtime stories.
        </p>
        {!adminConfigured && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            Studio is not configured. Set <code>STUDIO_ADMIN_PASSWORD</code> as a Replit secret.
          </div>
        )}
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Admin password"
          className="w-full border border-amber-200 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        {err && <p className="text-rose-600 text-sm mb-3">{err}</p>}
        <button
          disabled={busy || !pw}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg"
        >
          {busy ? "Signing in…" : "Enter Studio"}
        </button>
      </form>
    </div>
  );
}

// ============================================================
// Dashboard
// ============================================================
function Dashboard({
  onOpen,
  onUnauthorized,
}: {
  onOpen: (id: string) => void;
  onUnauthorized: () => void;
}) {
  const [projects, setProjects] = useState<StudioProjectSummary[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [seed, setSeed] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<StudioProjectSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function reload() {
    setErr(null);
    try {
      const { projects } = await studioApi.listProjects();
      setProjects(projects);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load projects";
      if (msg === "Unauthorized") onUnauthorized();
      else setErr(msg);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const { project } = await studioApi.createProject(seed);
      setSeed("");
      onOpen(project.id);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function confirmDelete() {
    if (!deleteCandidate) return;
    setDeleting(true);
    setErr(null);
    try {
      await studioApi.deleteProject(deleteCandidate.id);
      setProjects((prev) => prev?.filter((p) => p.id !== deleteCandidate.id) ?? null);
      setDeleteCandidate(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      if (msg === "Unauthorized") onUnauthorized();
      else setErr(msg);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="bg-white/80 rounded-2xl shadow p-6 border border-amber-100">
        <h2 className="text-lg font-bold mb-3 text-amber-900">Start a new book</h2>
        <form onSubmit={createProject} className="flex gap-3">
          <input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="e.g. Maxime visits the farm"
            className="flex-1 border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            disabled={creating || !seed}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg"
          >
            {creating ? "Creating…" : "Create"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3 text-amber-900">Projects</h2>
        {err && (
          <div className="mb-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            {err}
          </div>
        )}
        {!projects && <p className="text-slate-500 text-sm">Loading…</p>}
        {projects && projects.length === 0 && (
          <p className="text-slate-500 text-sm">
            No projects yet. The seed "Maxime Goes to Sleep" project should appear here once the
            Supabase migration has been applied.
          </p>
        )}
        <ul className="space-y-3">
          {projects?.map((p) => (
            <li
              key={p.id}
              className="bg-white/80 rounded-xl shadow-sm border border-amber-100 p-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpen(p.id)}
                  className="flex-1 min-w-0 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  <p className="font-bold text-amber-900 truncate">{p.title}</p>
                  <p className="text-xs text-slate-500">
                    Updated {new Date(p.updated_at).toLocaleString()}
                  </p>
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={p.status} />
                  <button
                    type="button"
                    aria-label={`Delete ${p.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteCandidate(p);
                    }}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md px-2 py-1 text-sm font-bold transition"
                    title="Delete project"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <CharacterBibleSection onUnauthorized={onUnauthorized} />

      {deleteCandidate && (
        <DeleteConfirmModal
          project={deleteCandidate}
          busy={deleting}
          onCancel={() => (deleting ? undefined : setDeleteCandidate(null))}
          onConfirm={() => void confirmDelete()}
        />
      )}
    </div>
  );
}

// ============================================================
// Delete confirmation modal
// ============================================================
function DeleteConfirmModal({
  project,
  busy,
  onCancel,
  onConfirm,
}: {
  project: StudioProjectSummary;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isPublished = project.status === "published" || !!project.published_book_id;
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !busy) onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={() => (busy ? undefined : onCancel())}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 max-w-md w-full"
      >
        <h3 id="delete-modal-title" className="text-lg font-extrabold text-rose-700 mb-2">
          Delete this project?
        </h3>
        <p className="text-sm text-slate-700 mb-1">
          You're about to permanently delete{" "}
          <span className="font-bold text-amber-900">"{project.title}"</span>.
        </p>
        <p id="delete-modal-desc" className="text-xs text-slate-500 mb-4">
          The brief, manuscript, illustrations and version history will be removed.
          {isPublished && (
            <>
              {" "}
              The published book itself will stay live but will no longer be linked back to a source project.
            </>
          )}
          {" "}
          This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-50"
          >
            {busy ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Character bible editor (shared cast across all stories)
// ============================================================
type BibleStringKey = Exclude<keyof CharacterBible, "additional_characters">;
const BIBLE_FIELDS: { key: BibleStringKey; label: string; hint: string }[] = [
  { key: "papa", label: "Papa", hint: "Adult appearance: build, hair, beard, eyes, posture." },
  { key: "maxime", label: "Maxime", hint: "Toddler appearance: age, hair, eyes, proportions." },
  {
    key: "clothing_before_pajamas",
    label: "Clothing — daytime / pre-pajamas",
    hint: "What everyone wears in early scenes (pages 1-5).",
  },
  {
    key: "clothing_pajamas",
    label: "Clothing — pajama scenes",
    hint: "Outfits from page 6 onward (post-bath).",
  },
  {
    key: "style",
    label: "Illustration style",
    hint: "Look & feel: medium, palette, lighting, composition.",
  },
];

function CharacterBibleSection({
  onUnauthorized,
}: {
  onUnauthorized: () => void;
}) {
  const [bible, setBible] = useState<CharacterBible | null>(null);
  const [defaults, setDefaults] = useState<CharacterBible | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    studioApi
      .getCharacterBible()
      .then((res) => {
        if (cancelled) return;
        setBible(res.bible);
        setDefaults(res.defaults);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Load failed";
        if (msg === "Unauthorized") onUnauthorized();
        else setErr(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [onUnauthorized]);

  async function save() {
    if (!bible) return;
    setSaving(true);
    setErr(null);
    try {
      const res = await studioApi.saveCharacterBible(bible);
      setBible(res.bible);
      setSavedAt(Date.now());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Save failed";
      if (msg === "Unauthorized") onUnauthorized();
      else setErr(msg);
    } finally {
      setSaving(false);
    }
  }

  function resetToDefaults() {
    if (!defaults) return;
    setBible({ ...defaults });
  }

  return (
    <section className="bg-white/80 rounded-2xl shadow p-6 border border-amber-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h2 className="text-lg font-bold text-amber-900">Characters & style</h2>
          <p className="text-xs text-slate-500">
            Shared across every story so the cast stays consistent in all illustrations.
          </p>
        </div>
        <span className="text-amber-700 text-lg select-none">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="mt-5">
          {loading && <p className="text-sm text-slate-500">Loading…</p>}
          {err && (
            <div className="mb-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              {err}
            </div>
          )}
          {bible && (
            <>
              <div className="space-y-4">
                {BIBLE_FIELDS.map((f) => (
                  <div key={f.key}>
                    <label
                      htmlFor={`bible-${f.key}`}
                      className="block text-xs font-bold uppercase tracking-wide text-amber-900/70 mb-1"
                    >
                      {f.label}
                    </label>
                    <textarea
                      id={`bible-${f.key}`}
                      value={bible[f.key]}
                      onChange={(e) =>
                        setBible((prev) => (prev ? { ...prev, [f.key]: e.target.value } : prev))
                      }
                      disabled={saving}
                      rows={3}
                      maxLength={2000}
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
                    />
                    <p className="text-[11px] text-slate-500 mt-0.5">{f.hint}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-amber-900">
                      Additional characters
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Add Mama, siblings, pets, friends. They'll be referenced in every
                      brief and only appear in illustrations when the scene calls for them.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={saving || (bible.additional_characters ?? []).length >= 20}
                    onClick={() =>
                      setBible((prev) =>
                        prev
                          ? {
                              ...prev,
                              additional_characters: [
                                ...(prev.additional_characters ?? []),
                                { name: "", description: "" },
                              ],
                            }
                          : prev,
                      )
                    }
                    className="text-sm font-bold text-amber-700 hover:text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300 disabled:opacity-50"
                  >
                    + Add character
                  </button>
                </div>
                <div className="space-y-3 mt-3">
                  {(bible.additional_characters ?? []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">
                      No additional characters yet. Click "+ Add character" to start.
                    </p>
                  )}
                  {(bible.additional_characters ?? []).map(
                    (c: AdditionalCharacter, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-amber-200 bg-amber-50/40 p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={c.name}
                            placeholder="Character name (e.g. Mama, Léo, Biscuit the dog)"
                            maxLength={60}
                            onChange={(e) => {
                              const v = e.target.value;
                              setBible((prev) => {
                                if (!prev) return prev;
                                const next = [...(prev.additional_characters ?? [])];
                                next[idx] = { ...next[idx], name: v };
                                return { ...prev, additional_characters: next };
                              });
                            }}
                            disabled={saving}
                            className="flex-1 rounded-md border border-amber-200 bg-white px-2.5 py-1.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
                          />
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              setBible((prev) => {
                                if (!prev) return prev;
                                const next = (prev.additional_characters ?? []).filter(
                                  (_, i) => i !== idx,
                                );
                                return { ...prev, additional_characters: next };
                              })
                            }
                            aria-label={`Remove character ${c.name || idx + 1}`}
                            className="text-rose-600 hover:text-rose-800 text-sm font-bold px-2 py-1 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                        <textarea
                          value={c.description}
                          placeholder="Appearance: age, hair, eyes, clothing, distinctive traits…"
                          rows={3}
                          maxLength={2000}
                          onChange={(e) => {
                            const v = e.target.value;
                            setBible((prev) => {
                              if (!prev) return prev;
                              const next = [...(prev.additional_characters ?? [])];
                              next[idx] = { ...next[idx], description: v };
                              return { ...prev, additional_characters: next };
                            });
                          }}
                          disabled={saving}
                          className="w-full rounded-md border border-amber-200 bg-white/80 px-2.5 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void save()}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save characters"}
                </button>
                <button
                  type="button"
                  disabled={saving || !defaults}
                  onClick={resetToDefaults}
                  className="border border-amber-300 text-amber-800 font-bold px-4 py-2 rounded-lg disabled:opacity-50"
                  title="Restore the original built-in descriptions (does not save)"
                >
                  Reset to defaults
                </button>
                {savedAt && !saving && (
                  <span className="text-xs text-emerald-700">
                    ✓ Saved {new Date(savedAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-3">
                These descriptions are injected into every illustration prompt and into the brief
                generator, so updates take effect on the next "Generate brief" or
                "Prepare illustrations" run.
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: StudioProjectSummary["status"] }) {
  const colors: Record<StudioProjectSummary["status"], string> = {
    brief: "bg-sky-100 text-sky-800",
    manuscript: "bg-violet-100 text-violet-800",
    illustrations: "bg-amber-100 text-amber-800",
    published: "bg-emerald-100 text-emerald-800",
  };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
}

// ============================================================
// Project view (3 checkpoints)
// ============================================================
function ProjectView({
  projectId,
  onBack,
  onUnauthorized,
}: {
  projectId: string;
  onBack: () => void;
  onUnauthorized: () => void;
}) {
  const [project, setProject] = useState<StudioProject | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [briefPrompt, setBriefPrompt] = useState<string>("");
  const [autoApprove, setAutoApprove] = useState<boolean>(false);

  async function reload() {
    try {
      const { project } = await studioApi.getProject(projectId);
      setProject(project);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Load failed";
      if (msg === "Unauthorized") onUnauthorized();
      else setErr(msg);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function action(label: string, fn: () => Promise<{ project: StudioProject }>) {
    setBusy(label);
    setErr(null);
    try {
      const { project } = await fn();
      setProject(project);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : `${label} failed`);
    } finally {
      setBusy(null);
    }
  }

  if (!project) return <p className="text-slate-500">Loading project…</p>;

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-amber-50/90 backdrop-blur border-b border-amber-100 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-800 hover:text-amber-950 bg-white/80 hover:bg-white border border-amber-200 px-3 py-1.5 rounded-lg shadow-sm"
        >
          ← Studio home
        </button>
        <StatusBadge status={project.status} />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-amber-900">{project.title}</h2>
        <p className="text-sm text-slate-500">Seed: {project.seed}</p>
      </div>

      {err && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {err}
        </div>
      )}

      <WorkflowProgress project={project} />

      {/* Checkpoint 1: Brief */}
      <CheckpointCard
        number={1}
        title="Brief"
        approvedAt={project.brief_approved_at}
      >
        {!project.brief_approved_at && (
          <div className="mb-4">
            <label
              htmlFor="brief-prompt"
              className="block text-xs font-bold uppercase tracking-wide text-amber-900/70 mb-1.5"
            >
              Custom prompt <span className="font-normal normal-case text-slate-500">(optional)</span>
            </label>
            <textarea
              id="brief-prompt"
              value={briefPrompt}
              onChange={(e) => setBriefPrompt(e.target.value)}
              disabled={busy !== null}
              rows={4}
              maxLength={4000}
              placeholder={
                'Guide the AI: e.g. "Set the story in a snowy cabin, focus on a grandparent reading by candlelight, gentle wintry tone."'
              }
              className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
            />
            <div className="flex justify-between mt-1 text-[11px] text-slate-500">
              <span>The AI will follow this guidance while keeping the Petit Mokus brand and 12-page format.</span>
              <span>{briefPrompt.length}/4000</span>
            </div>
            <label className="mt-3 flex items-start gap-2 text-sm text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
                disabled={busy !== null}
                className="mt-0.5 h-4 w-4 accent-amber-600"
              />
              <span>
                <span className="font-bold text-amber-900">Skip Brief & Manuscript review</span>
                <span className="block text-[11px] text-slate-500">
                  Auto-approve both steps and jump straight to Illustrations. Slower (one extra AI call) but no manual approvals needed.
                </span>
              </span>
            </label>
          </div>
        )}
        {!project.brief_data && (
          <div className="flex flex-wrap gap-3 items-center">
            <button
              disabled={busy !== null}
              onClick={() =>
                action("brief", () =>
                  studioApi.generateBrief(
                    project.id,
                    briefPrompt.trim() || undefined,
                    autoApprove,
                  ),
                )
              }
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {busy === "brief"
                ? autoApprove
                  ? "Generating brief + manuscript…"
                  : "Generating…"
                : autoApprove
                  ? "Generate & auto-approve"
                  : "Generate brief"}
            </button>
            <button
              disabled={busy !== null}
              onClick={() => action("skip-brief", () => studioApi.skipBrief(project.id))}
              title="Use the title as-is, skip the brief, and jump straight to writing the manuscript."
              className="border border-slate-300 text-slate-700 font-bold px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-slate-50"
            >
              {busy === "skip-brief"
                ? "Skipping brief…"
                : "Skip brief → start manuscript"}
            </button>
          </div>
        )}
        {project.brief_data && (
          <>
            <JsonViewer data={project.brief_data} />
            {!project.brief_approved_at && (
              <div className="flex gap-3 mt-3">
                <button
                  disabled={busy !== null}
                  onClick={() =>
                    action("brief", () =>
                      studioApi.generateBrief(
                        project.id,
                        briefPrompt.trim() || undefined,
                        autoApprove,
                      ),
                    )
                  }
                  className="border border-amber-300 text-amber-800 font-bold px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {busy === "brief" ? "Regenerating…" : autoApprove ? "Regenerate & auto-approve" : "Regenerate"}
                </button>
                <button
                  disabled={busy !== null}
                  onClick={() => action("approve-brief", () => studioApi.approveBrief(project.id))}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  ✓ Approve brief
                </button>
              </div>
            )}
          </>
        )}
      </CheckpointCard>

      {/* Checkpoint 2: Manuscript */}
      {project.brief_approved_at && (
        <CheckpointCard
          number={2}
          title="Manuscript (12 pages)"
          approvedAt={project.manuscript_approved_at}
        >
          {!project.manuscript_data && (
            <button
              disabled={busy !== null}
              onClick={() => action("ms", () => studioApi.generateManuscript(project.id))}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {busy === "ms" ? "Generating…" : "Generate manuscript"}
            </button>
          )}
          {project.manuscript_data && (
            <ManuscriptEditor
              project={project}
              busy={busy}
              onSave={(pages) =>
                action("save-ms", () =>
                  studioApi.saveManuscript(project.id, {
                    pages,
                    recurringPhrase: project.manuscript_data!.recurringPhrase,
                  }),
                )
              }
              onApprove={() =>
                action("approve-ms", () => studioApi.approveManuscript(project.id))
              }
              onRegenerate={() =>
                action("ms", () => studioApi.generateManuscript(project.id))
              }
            />
          )}
        </CheckpointCard>
      )}

      {/* Checkpoint 3: Illustrations */}
      {project.manuscript_approved_at && (
        <CheckpointCard
          number={3}
          title="Illustrations (12 images)"
          approvedAt={project.illustrations_approved_at}
        >
          {!project.illustrations_data && (
            <button
              disabled={busy !== null}
              onClick={() =>
                action("prep-ill", () => studioApi.prepareIllustrations(project.id))
              }
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {busy === "prep-ill" ? "Preparing…" : "Prepare illustration prompts"}
            </button>
          )}
          {project.illustrations_data && (
            <IllustrationsPanel
              project={project}
              busy={busy}
              onGenerateAll={() =>
                action("gen-ill", () => studioApi.generateIllustrations(project.id))
              }
              onRegen={(page) =>
                action(`gen-ill-${page}`, () =>
                  studioApi.generateIllustrations(project.id, [page]),
                )
              }
              onApprove={() =>
                action("approve-ill", () => studioApi.approveIllustrations(project.id))
              }
              onReset={() => {
                if (
                  window.confirm(
                    "Discard the current illustration prompts and images? You'll be able to re-prepare prompts (picking up any character or manuscript edits) and regenerate the images.",
                  )
                ) {
                  void action("reset-ill", () => studioApi.resetIllustrations(project.id));
                }
              }}
            />
          )}
        </CheckpointCard>
      )}

      {/* Publish */}
      {project.illustrations_approved_at && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <h3 className="font-bold text-emerald-900 mb-2">Ready to publish</h3>
          <p className="text-sm text-emerald-800 mb-4">
            Publishing writes the book to the public Bedtime Stories tab.
          </p>
          <button
            disabled={busy !== null || project.status === "published"}
            onClick={() => action("publish", () => studioApi.publish(project.id))}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {project.status === "published"
              ? "✓ Published"
              : busy === "publish"
                ? "Publishing…"
                : "Publish to Bedtime Stories"}
          </button>
        </div>
      )}
    </div>
  );
}

function WorkflowProgress({ project }: { project: StudioProject }) {
  const steps = [
    { label: "Brief", done: !!project.brief_approved_at },
    { label: "Manuscript", done: !!project.manuscript_approved_at },
    { label: "Illustrations", done: !!project.illustrations_approved_at },
    { label: "Published", done: project.status === "published" },
  ];
  return (
    <div className="flex gap-2">
      {steps.map((s, i) => (
        <div
          key={s.label}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold text-center ${
            s.done ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-400"
          }`}
        >
          {i + 1}. {s.label}
        </div>
      ))}
    </div>
  );
}

function CheckpointCard({
  number,
  title,
  approvedAt,
  children,
}: {
  number: number;
  title: string;
  approvedAt: string | null;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white/80 rounded-2xl shadow border border-amber-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-amber-900">
          Checkpoint {number}: {title}
        </h3>
        {approvedAt && (
          <span className="text-xs text-emerald-700 font-bold">
            ✓ Approved {new Date(approvedAt).toLocaleDateString()}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function JsonViewer({ data }: { data: unknown }) {
  return (
    <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs overflow-x-auto max-h-72">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function ManuscriptEditor({
  project,
  busy,
  onSave,
  onApprove,
  onRegenerate,
}: {
  project: StudioProject;
  busy: string | null;
  onSave: (pages: ManuscriptPage[]) => void;
  onApprove: () => void;
  onRegenerate: () => void;
}) {
  const [pages, setPages] = useState<ManuscriptPage[]>(project.manuscript_data!.pages);
  const dirty = JSON.stringify(pages) !== JSON.stringify(project.manuscript_data!.pages);

  return (
    <div>
      <div className="grid gap-3">
        {pages.map((p, i) => (
          <div
            key={p.page}
            className="grid grid-cols-[40px_1fr_1fr_auto] gap-2 items-start text-sm"
          >
            <span className="font-bold text-amber-700 mt-2">{p.page}</span>
            <input
              value={p.text}
              onChange={(e) => {
                const next = [...pages];
                next[i] = { ...p, text: e.target.value };
                setPages(next);
              }}
              className="border border-slate-200 rounded px-2 py-1.5"
            />
            <input
              value={p.scene}
              onChange={(e) => {
                const next = [...pages];
                next[i] = { ...p, scene: e.target.value };
                setPages(next);
              }}
              placeholder="scene description"
              className="border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-600"
            />
            <label className="text-xs flex items-center gap-1 mt-2">
              <input
                type="checkbox"
                checked={p.isPajamaScene}
                onChange={(e) => {
                  const next = [...pages];
                  next[i] = { ...p, isPajamaScene: e.target.checked };
                  setPages(next);
                }}
              />
              pajamas
            </label>
          </div>
        ))}
      </div>
      {dirty && project.illustrations_data && (
        <p className="mt-3 text-xs text-amber-900 bg-amber-100/60 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ Saving these edits will clear the current illustrations (12 generated
          images) and reset the manuscript approval — so the next image batch
          reflects the new text.
        </p>
      )}
      <div className="flex gap-3 mt-4">
        <button
          disabled={busy !== null}
          onClick={onRegenerate}
          className="border border-amber-300 text-amber-800 font-bold px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Regenerate
        </button>
        {dirty && (
          <button
            disabled={busy !== null}
            onClick={() => {
              if (
                project.illustrations_data &&
                !window.confirm(
                  "Saving these manuscript edits will reset the existing illustrations and the manuscript approval. Continue?",
                )
              ) {
                return;
              }
              onSave(pages);
            }}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Save edits
          </button>
        )}
        {!project.manuscript_approved_at && !dirty && (
          <button
            disabled={busy !== null}
            onClick={onApprove}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            ✓ Approve manuscript
          </button>
        )}
      </div>
    </div>
  );
}

function IllustrationsPanel({
  project,
  busy,
  onGenerateAll,
  onRegen,
  onApprove,
  onReset,
}: {
  project: StudioProject;
  busy: string | null;
  onGenerateAll: () => void;
  onRegen: (page: number) => void;
  onApprove: () => void;
  onReset: () => void;
}) {
  const items = project.illustrations_data!.items;
  const allHaveImages = items.every((i) => !!i.imageUrl);
  const someMissing = items.some((i) => !i.imageUrl);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {someMissing && (
          <button
            disabled={busy !== null}
            onClick={onGenerateAll}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {busy === "gen-ill"
              ? "Generating images (this can take 1–3 minutes)…"
              : "Generate all 12 images"}
          </button>
        )}
        {allHaveImages && !project.illustrations_approved_at && (
          <button
            disabled={busy !== null}
            onClick={onApprove}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            ✓ Approve illustrations
          </button>
        )}
        {!project.illustrations_approved_at && (
          <button
            disabled={busy !== null}
            onClick={onReset}
            title="Discard these prompts and images so you can re-prepare them with the latest character bible or manuscript edits."
            className="border border-rose-300 text-rose-700 font-bold px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-rose-50"
          >
            {busy === "reset-ill" ? "Resetting…" : "✗ Reject & rework"}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <IllustrationCell
            key={it.page}
            item={it}
            busy={busy === `gen-ill-${it.page}` || busy === "gen-ill"}
            onRegen={() => onRegen(it.page)}
          />
        ))}
      </div>
    </div>
  );
}

function IllustrationCell({
  item,
  busy,
  onRegen,
}: {
  item: IllustrationItem;
  busy: boolean;
  onRegen: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
      <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={`Page ${item.page}`} className="w-full h-full object-cover" />
        ) : (
          <span className="text-slate-400 text-sm">
            {busy ? "Generating…" : "No image"}
          </span>
        )}
        <span className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold">
          {item.page}
        </span>
      </div>
      <div className="p-3 text-xs">
        <p className="font-bold text-slate-800">{item.text}</p>
        {item.error && <p className="text-rose-600 mt-1">{item.error}</p>}
        <details className="mt-2">
          <summary className="cursor-pointer text-slate-500">prompt</summary>
          <p className="text-slate-600 mt-1">{item.prompt}</p>
        </details>
        <button
          disabled={busy}
          onClick={onRegen}
          className="mt-2 text-xs border border-amber-300 text-amber-800 font-bold px-2 py-1 rounded disabled:opacity-50"
        >
          {item.imageUrl ? "Regenerate" : "Generate"}
        </button>
      </div>
    </div>
  );
}
