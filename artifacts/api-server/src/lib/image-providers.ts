import { getOpenAI } from "./openai-client.js";
import { createClient } from "@supabase/supabase-js";

export interface GeneratedImage {
  url: string;
  storagePath: string;
  provider: string;
  promptUsed: string;
}

export interface ImageProvider {
  readonly name: string;
  generate(prompt: string, opts: { projectId: string; page: number }): Promise<GeneratedImage>;
}

const STORAGE_BUCKET = "bedtime-books";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function uploadToStorage(
  buffer: Buffer,
  path: string,
  contentType: string,
): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase not configured for image storage");
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, {
      contentType,
      upsert: true,
      cacheControl: "31536000",
    });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ---- OpenAI gpt-image-1 provider (default when API available) ----
class OpenAIImageProvider implements ImageProvider {
  readonly name = "openai-gpt-image-1";

  async generate(prompt: string, opts: { projectId: string; page: number }) {
    const client = getOpenAI();
    if (!client) throw new Error("OpenAI client not configured");

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      n: 1,
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) throw new Error("OpenAI returned no image data");
    const buffer = Buffer.from(b64, "base64");
    const storagePath = `${opts.projectId}/page-${String(opts.page).padStart(2, "0")}-${Date.now()}.png`;
    const url = await uploadToStorage(buffer, storagePath, "image/png");
    return { url, storagePath, provider: this.name, promptUsed: prompt };
  }
}

// ---- Placeholder provider — soft pastel SVG with the page number ----
// Used as fallback when OpenAI is unavailable; also useful for local dev.
class PlaceholderImageProvider implements ImageProvider {
  readonly name = "placeholder-svg";

  async generate(prompt: string, opts: { projectId: string; page: number }) {
    const palette = [
      ["#F5D8C5", "#E8B89B"], // peach
      ["#E8C5D1", "#D29AB0"], // dusty rose
      ["#D5E0C5", "#A8C2A0"], // sage
      ["#C5D8E8", "#9BB8D2"], // sky blue
    ];
    const [bg, accent] = palette[opts.page % palette.length] ?? palette[0]!;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <defs><radialGradient id="g" cx="50%" cy="40%" r="70%"><stop offset="0%" stop-color="${bg}"/><stop offset="100%" stop-color="${accent}"/></radialGradient></defs>
      <rect width="1024" height="1024" fill="url(#g)"/>
      <circle cx="512" cy="420" r="180" fill="#FFFFFF" opacity="0.4"/>
      <text x="512" y="460" font-family="Georgia, serif" font-size="180" text-anchor="middle" fill="#5C4A3D" opacity="0.75">${opts.page}</text>
      <text x="512" y="780" font-family="Georgia, serif" font-size="36" text-anchor="middle" fill="#5C4A3D" opacity="0.6">Petit Mokus · placeholder</text>
    </svg>`;
    const buffer = Buffer.from(svg, "utf8");
    const storagePath = `${opts.projectId}/page-${String(opts.page).padStart(2, "0")}-placeholder.svg`;
    try {
      const url = await uploadToStorage(buffer, storagePath, "image/svg+xml");
      return { url, storagePath, provider: this.name, promptUsed: prompt };
    } catch {
      // No storage configured — fall back to inline data URL so MVP still works.
      const dataUrl = `data:image/svg+xml;base64,${buffer.toString("base64")}`;
      return {
        url: dataUrl,
        storagePath: "(inline-data-url)",
        provider: this.name,
        promptUsed: prompt,
      };
    }
  }
}

// ---- Stub providers showing the swap-in surface ----
// To enable: set IMAGE_PROVIDER=replicate-flux + REPLICATE_API_TOKEN, then
// implement the generate() body using replicate-js (or fetch).
class FluxStubProvider implements ImageProvider {
  readonly name = "replicate-flux";
  async generate(): Promise<GeneratedImage> {
    throw new Error(
      "FluxStubProvider not implemented. Add replicate-js, set REPLICATE_API_TOKEN, " +
        "and implement generate() using `black-forest-labs/flux-schnell`.",
    );
  }
}

export function getImageProvider(): ImageProvider {
  const choice = (process.env.IMAGE_PROVIDER ?? "openai").toLowerCase();
  if (choice === "placeholder") return new PlaceholderImageProvider();
  if (choice === "replicate-flux") return new FluxStubProvider();
  if (getOpenAI()) return new OpenAIImageProvider();
  return new PlaceholderImageProvider();
}
