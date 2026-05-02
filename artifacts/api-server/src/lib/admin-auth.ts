import type { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.STUDIO_ADMIN_PASSWORD;
  if (!expected) {
    res.status(503).json({
      error: "Studio admin password not configured",
      hint: "Set STUDIO_ADMIN_PASSWORD as a Replit secret to enable the Studio.",
    });
    return;
  }

  const provided =
    (req.headers["x-admin-password"] as string | undefined) ??
    (typeof req.body === "object" && req.body !== null
      ? (req.body as { adminPassword?: string }).adminPassword
      : undefined);

  if (!provided || provided !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}

export function adminPasswordIsConfigured(): boolean {
  return !!process.env.STUDIO_ADMIN_PASSWORD;
}
