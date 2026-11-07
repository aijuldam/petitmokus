import type { APIRoute } from "astro";
import { spriteSvg } from "../../lib/symbols";

/** One SVG sprite with every product symbol, `#pm-<symbol>` (NAV-0). */
export const GET: APIRoute = () =>
  new Response(spriteSvg(), { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } });
