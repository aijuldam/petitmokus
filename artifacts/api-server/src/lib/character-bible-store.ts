import { getSupabase } from "./supabase-client.js";
import {
  CHARACTER_BIBLE,
  type AdditionalCharacter,
  type CharacterBible,
} from "./character-specs.js";
import { logger } from "./logger.js";

const ROW_ID = "global";
const SELECT_COLS =
  "papa, maxime, clothing_before_pajamas, clothing_pajamas, style, additional_characters";

let cache: { value: CharacterBible; loadedAt: number } | null = null;
const CACHE_TTL_MS = 30_000;

function normalizeAdditional(raw: unknown): AdditionalCharacter[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((c): AdditionalCharacter | null => {
      if (!c || typeof c !== "object") return null;
      const obj = c as { name?: unknown; description?: unknown };
      const name = typeof obj.name === "string" ? obj.name : "";
      const description = typeof obj.description === "string" ? obj.description : "";
      return { name, description };
    })
    .filter((c): c is AdditionalCharacter => c !== null);
}

export async function loadActiveCharacterBible(): Promise<CharacterBible> {
  if (cache && Date.now() - cache.loadedAt < CACHE_TTL_MS) {
    return cache.value;
  }
  const supabase = getSupabase();
  if (!supabase) {
    return CHARACTER_BIBLE;
  }
  try {
    const { data, error } = await supabase
      .from("studio_character_bible")
      .select(SELECT_COLS)
      .eq("id", ROW_ID)
      .maybeSingle();
    if (error) {
      logger.warn({ err: error }, "Failed to load character bible — using defaults");
      return CHARACTER_BIBLE;
    }
    const value: CharacterBible = data
      ? {
          papa: data.papa ?? CHARACTER_BIBLE.papa,
          maxime: data.maxime ?? CHARACTER_BIBLE.maxime,
          clothing_before_pajamas:
            data.clothing_before_pajamas ?? CHARACTER_BIBLE.clothing_before_pajamas,
          clothing_pajamas: data.clothing_pajamas ?? CHARACTER_BIBLE.clothing_pajamas,
          style: data.style ?? CHARACTER_BIBLE.style,
          additional_characters: normalizeAdditional(data.additional_characters),
        }
      : CHARACTER_BIBLE;
    cache = { value, loadedAt: Date.now() };
    return value;
  } catch (err) {
    logger.warn({ err }, "Character bible load threw — using defaults");
    return CHARACTER_BIBLE;
  }
}

export async function saveCharacterBible(
  bible: CharacterBible,
): Promise<CharacterBible | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("studio_character_bible")
    .upsert(
      {
        id: ROW_ID,
        ...bible,
        additional_characters: bible.additional_characters ?? [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select(SELECT_COLS)
    .maybeSingle();
  if (error || !data) {
    logger.error({ err: error }, "Failed to save character bible");
    return null;
  }
  cache = null;
  return {
    papa: data.papa,
    maxime: data.maxime,
    clothing_before_pajamas: data.clothing_before_pajamas,
    clothing_pajamas: data.clothing_pajamas,
    style: data.style,
    additional_characters: normalizeAdditional(data.additional_characters),
  };
}

export function invalidateCharacterBibleCache(): void {
  cache = null;
}
