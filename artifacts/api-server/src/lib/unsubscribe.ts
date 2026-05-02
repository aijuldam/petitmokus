import crypto from "node:crypto";
import type { EmailLanguage } from "./email.js";

const SECRET =
  process.env.SESSION_SECRET ??
  "petit-mokus-dev-only-fallback-do-not-use-in-production";

function b64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function signEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  return b64url(
    crypto.createHmac("sha256", SECRET).update(normalized).digest(),
  );
}

export function verifyEmailToken(email: string, token: string): boolean {
  const expected = signEmail(email);
  if (expected.length !== token.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(token),
    );
  } catch {
    return false;
  }
}

export function buildUnsubscribeUrl(
  baseUrl: string,
  email: string,
  lang: EmailLanguage,
): string {
  const token = signEmail(email);
  const params = new URLSearchParams({ email, token, lang });
  return `${baseUrl.replace(/\/$/, "")}/api/newsletter/unsubscribe?${params.toString()}`;
}

export function getPublicApiBaseUrl(): string {
  return (
    process.env.PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    "https://petit-mokus.replit.app"
  );
}
