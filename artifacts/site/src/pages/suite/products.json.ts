import type { APIRoute } from "astro";
import { REGISTRY } from "../../lib/products";

/** The product registry, published for the apps to copy at build time (NAV-0). */
export const GET: APIRoute = () =>
  new Response(`${JSON.stringify(REGISTRY, null, 2)}\n`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
