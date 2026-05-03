import { getSupabase } from "./supabase-client.js";
import { CHARACTER_BIBLE, type CharacterBible } from "./character-specs.js";
import { logger } from "./logger.js";

const ROW_ID = "global";

let cache: { value: CharacterBible; loadedAt: number } | null = null;
const CACHE_TTL_MS = 30_000;

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
      .select("papa, maxime, clothing_before_pajamas, clothing_pajamas, style")
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
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("papa, maxime, clothing_before_pajamas, clothing_pajamas, style")
    .maybeSingle();
  if (error || !data) {
    logger.error({ err: error }, "Failed to save character bible");
    return null;
  }
  cache = null;
  return data as CharacterBible;
}

export function invalidateCharacterBibleCache(): void {
  cache = null;
}
