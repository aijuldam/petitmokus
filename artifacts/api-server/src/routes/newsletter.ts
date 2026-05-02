import { Router, type IRouter, type Request, type Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { z } from "zod";
import {
  renderTemplateWithUnsubscribe,
  renderUnsubscribeErrorPage,
  renderUnsubscribeSuccessPage,
  resolveLanguage,
} from "../lib/email.js";
import {
  buildUnsubscribeUrl,
  getPublicApiBaseUrl,
  verifyEmailToken,
} from "../lib/unsubscribe.js";

const router: IRouter = Router();

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const CONSENT_TEXT =
  "I agree to receive the Petit Mokus newsletter with updates about new features and special offers. I understand I can unsubscribe at any time.";

// Override via RESEND_FROM_EMAIL once your domain is verified in Resend.
// Until then, Resend's onboarding sender works without DNS setup.
const FROM_ADDRESS =
  process.env.RESEND_FROM_EMAIL ?? "Petit Mokus <onboarding@resend.dev>";

const SignupSchema = z.object({
  email: z.string().email(),
  consent_given: z.literal(true),
  language: z.string().optional(),
  signup_page: z.string().optional(),
});

router.post("/newsletter/signup", async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    req.log.error("Supabase env vars not configured");
    res.status(503).json({ error: "Service not configured" });
    return;
  }

  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    return;
  }

  const { language, signup_page } = parsed.data;
  // Normalize email server-side so direct API callers can't bypass duplicate
  // detection with mixed-case input (e.g. "User@x.com" vs "user@x.com").
  const email = parsed.data.email.trim().toLowerCase();
  const emailLang = resolveLanguage(language);

  const { data, error: upsertError } = await supabase
    .from("newsletter_signups")
    .upsert(
      {
        email,
        consent_given: true,
        consent_text: CONSENT_TEXT,
        source: "floating_newsletter_bar",
        signup_page: signup_page ?? "/",
        language: emailLang,
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

  const isNewSignup = data && data.length > 0;

  if (!isNewSignup) {
    res.status(200).json({ status: "already_subscribed" });
    return;
  }

  // Send welcome email only for new signups with consent
  const resend = getResend();
  if (resend) {
    const unsubscribeUrl = buildUnsubscribeUrl(
      getPublicApiBaseUrl(),
      email,
      emailLang,
    );
    const template = renderTemplateWithUnsubscribe(emailLang, unsubscribeUrl);
    try {
      const { error: emailError } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject: template.subject,
        text: template.text,
        html: template.html,
        // RFC 8058 one-click unsubscribe — required by Gmail's bulk sender
        // requirements and surfaces a native "Unsubscribe" button in Gmail
        // and Apple Mail.
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:hello@petitmokus.com?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });

      if (emailError) {
        req.log.error({ err: emailError }, "Resend email error");
      } else {
        req.log.info({ email, lang: emailLang }, "Welcome email sent");
      }
    } catch (err) {
      req.log.error({ err }, "Resend unexpected error");
    }
  } else {
    req.log.warn("RESEND_API_KEY not configured — welcome email skipped");
  }

  res.status(201).json({ status: "subscribed" });
});

const UnsubscribeSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  lang: z.string().optional(),
});

async function handleUnsubscribe(req: Request, res: Response) {
  // Accept params from query string (GET link click) or form body (POST
  // one-click from mailbox providers per RFC 8058).
  const source =
    req.method === "POST" && req.body && Object.keys(req.body).length > 0
      ? req.body
      : req.query;
  const parsed = UnsubscribeSchema.safeParse(source);

  const lang = resolveLanguage(
    typeof source?.lang === "string" ? source.lang : undefined,
  );

  if (!parsed.success) {
    res.status(400).type("html").send(renderUnsubscribeErrorPage(lang));
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();
  if (!verifyEmailToken(email, parsed.data.token)) {
    req.log.warn({ email }, "Invalid unsubscribe token");
    res.status(400).type("html").send(renderUnsubscribeErrorPage(lang));
    return;
  }

  const supabase = getSupabase();
  if (!supabase) {
    req.log.error("Supabase env vars not configured");
    res.status(503).type("html").send(renderUnsubscribeErrorPage(lang));
    return;
  }

  const { error: deleteError } = await supabase
    .from("newsletter_signups")
    .delete()
    .eq("email", email);

  if (deleteError) {
    req.log.error({ err: deleteError, email }, "Supabase delete error");
    res.status(500).type("html").send(renderUnsubscribeErrorPage(lang));
    return;
  }

  req.log.info({ email, lang }, "Newsletter unsubscribe");
  res.status(200).type("html").send(renderUnsubscribeSuccessPage(lang));
}

router.get("/newsletter/unsubscribe", handleUnsubscribe);
router.post("/newsletter/unsubscribe", handleUnsubscribe);

export default router;
