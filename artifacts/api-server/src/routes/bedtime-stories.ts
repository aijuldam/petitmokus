import { Router, type IRouter } from "express";
import { getSupabase } from "../lib/supabase-client.js";

const router: IRouter = Router();

// Public list of published bedtime story books — read by the petit-mokus
// frontend's TabStories.
router.get("/bedtime-stories", async (_req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }
  const { data, error } = await supabase
    .from("published_books")
    .select("id, slug, title, language, cover_image_url, published_at, pages")
    .order("published_at", { ascending: false });
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ books: data ?? [] });
});

router.get("/bedtime-stories/:slug", async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }
  const { data, error } = await supabase
    .from("published_books")
    .select("id, slug, title, language, recurring_phrase, pages, cover_image_url, published_at")
    .eq("slug", req.params.slug)
    .maybeSingle();
  if (error || !data) {
    res.status(404).json({ error: "Story not found" });
    return;
  }
  res.json({ book: data });
});

export default router;
