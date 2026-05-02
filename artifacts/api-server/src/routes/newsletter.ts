import { Router, type IRouter } from "express";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const router: IRouter = Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CONSENT_TEXT =
  "I agree to receive the Petit Mokus newsletter with updates about new features and special offers. I understand I can unsubscribe at any time.";

const SignupSchema = z.object({
  email: z.string().email(),
  consent_given: z.literal(true),
  language: z.string().optional(),
  signup_page: z.string().optional(),
});

router.post("/newsletter/signup", async (req, res) => {
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    return;
  }

  const { email, language, signup_page } = parsed.data;

  // Atomic upsert: insert if not exists, silently ignore duplicates.
  // ignoreDuplicates: true maps to ON CONFLICT DO NOTHING so no row is
  // overwritten; an empty result means the email was already present.
  const { data, error: upsertError } = await supabase
    .from("newsletter_signups")
    .upsert(
      {
        email,
        consent_given: true,
        consent_text: CONSENT_TEXT,
        source: "floating_newsletter_bar",
        signup_page: signup_page ?? "/",
        language: language ?? "EN",
        user_agent: req.headers["user-agent"] ?? null,
      },
      { onConflict: "email", ignoreDuplicates: true },
    )
    .select("id");

  if (upsertError) {
    req.log.error({ err: upsertError }, "Supabase upsert error");
    res.status(500).json({ error: "Server error" });
    return;
  }

  if (!data || data.length === 0) {
    res.status(200).json({ status: "already_subscribed" });
    return;
  }

  res.status(201).json({ status: "subscribed" });
});

export default router;
