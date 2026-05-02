import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Squirrel } from "lucide-react";
import { Language, dictionary } from "../lib/i18n";

interface NewsletterBarProps {
  language: Language;
}

type State = "idle" | "loading" | "success" | "already" | "error";

export function NewsletterBar({ language }: NewsletterBarProps) {
  const ui = dictionary.ui;
  const [email, setEmail]         = useState("");
  const [consent, setConsent]     = useState(false);
  const [state, setState]         = useState<State>("idle");
  const [dismissed, setDismissed] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit  = emailValid && consent && state === "idle";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setState("loading");

    try {
      const res = await fetch("/api/newsletter/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          consent_given: true as const,
          language,
          signup_page: window.location.pathname,
        }),
      });

      if (!res.ok) {
        setState("error");
        return;
      }

      const json = await res.json() as { status: string };
      setState(json.status === "already_subscribed" ? "already" : "success");
    } catch {
      setState("error");
    }
  }

  if (dismissed) return null;

  const isDone = state === "success" || state === "already";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed bottom-[72px] left-0 right-0 z-40 px-3 pb-2"
      >
        <div className="max-w-md mx-auto bg-[#FDFDFC] border border-[#D897A8]/30 rounded-2xl shadow-xl overflow-hidden">
          <div className="h-0.5 w-full bg-gradient-to-r from-[#D897A8]/40 via-[#D897A8] to-[#D897A8]/40" />

          <div className="relative px-4 pt-3 pb-4">
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="absolute top-3 right-3 text-[#5C4A3D]/30 hover:text-[#5C4A3D]/60 transition-colors"
            >
              <X size={15} />
            </button>

            {isDone ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-1.5 py-1 text-center"
              >
                <Squirrel size={28} className="text-[#D897A8]" />
                <p className="text-sm font-bold text-[#5C4A3D]">
                  {state === "already"
                    ? ui.newsletterAlready[language]
                    : ui.newsletterSuccess[language]}
                </p>
                <p className="text-[11px] text-[#5C4A3D]/55">
                  {ui.newsletterSuccessSub[language]}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="flex items-start gap-2.5 mb-2.5">
                  <div className="mt-0.5 w-7 h-7 rounded-full bg-[#D897A8]/15 flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-[#D897A8]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#5C4A3D] leading-tight">
                      {ui.newsletterTitle[language]}
                    </p>
                    <p className="text-[11px] text-[#5C4A3D]/55 leading-snug mt-0.5">
                      {ui.newsletterSubtitle[language]}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mb-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={ui.newsletterEmailPlaceholder[language]}
                    required
                    className="flex-1 min-w-0 text-[13px] px-3 py-2 rounded-xl border border-[#D897A8]/30 bg-[#F9F6F1] text-[#5C4A3D] placeholder:text-[#5C4A3D]/30 focus:outline-none focus:border-[#D897A8]/60 focus:ring-1 focus:ring-[#D897A8]/30 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="shrink-0 px-4 py-2 rounded-xl bg-[#D897A8] text-white text-[12px] font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {state === "loading" ? "…" : ui.newsletterSubmit[language]}
                  </button>
                </div>

                <label className="flex items-start gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 shrink-0 accent-[#D897A8] w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-[10px] text-[#5C4A3D]/50 leading-snug group-hover:text-[#5C4A3D]/70 transition-colors">
                    {ui.newsletterConsent[language]}
                  </span>
                </label>

                {state === "error" && (
                  <p className="mt-1.5 text-[10px] text-rose-400 text-center">
                    {ui.newsletterError[language]}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
