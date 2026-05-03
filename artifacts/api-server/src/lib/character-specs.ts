// Canonical character & style specs used in EVERY illustration prompt to
// ensure visual consistency across all 12 pages of every book.
// These are the source of truth — never duplicate elsewhere.

export const PAPA_DESCRIPTION =
  "Papa (Julien): a man in his 30s, tall with an average to thin build, " +
  "fair skin, short dark brown hair neatly combed to the side, a short " +
  "well-groomed dark brown beard, gentle warm brown eyes, soft expression, " +
  "calm protective posture";

export const MAXIME_DESCRIPTION =
  "Maxime: an 18-month-old toddler boy, small and round-cheeked, " +
  "soft light brown hair (a touch lighter than his Papa's), big curious " +
  "brown eyes, sleepy gentle expression, fair skin, slightly chubby toddler " +
  "proportions";

export const CLOTHING_BEFORE_PAJAMAS =
  "Maxime wears a soft warm brown long-sleeve outfit (top and matching " +
  "trousers). Papa wears a relaxed blue color-blocked sweater (two tones of " +
  "blue, soft cotton look) with comfortable beige trousers";

export const CLOTHING_PAJAMAS_SCENE =
  "Maxime wears soft sky-blue button-up pajamas with a tiny pattern. Papa " +
  "wears casual loungewear: a soft heather-grey long-sleeve t-shirt and " +
  "soft navy joggers";

export const STYLE_GUIDE =
  "Petit Mokus illustration style: soft watercolor with gentle pastel " +
  "palette (warm peach, dusty rose, sage green, cream, soft sky blue), " +
  "rounded organic shapes, no harsh lines, warm and uncluttered cozy " +
  "domestic scene, soft golden lamp light, plenty of negative space, " +
  "high-quality children's board book illustration, NO text, NO letters, " +
  "NO words anywhere in the image, painterly storybook feel";

export const NEGATIVE_GUIDANCE =
  "Avoid: photorealism, harsh lighting, scary elements, cluttered " +
  "background, dark colors, sharp edges, text or lettering, watermarks, " +
  "any inconsistency in character appearance between scenes";

export interface SceneSpec {
  page: number;
  text: string;
  scene: string;
  isPajamaScene: boolean;
}

export interface CharacterBible {
  papa: string;
  maxime: string;
  clothing_before_pajamas: string;
  clothing_pajamas: string;
  style: string;
}

export const CHARACTER_BIBLE: CharacterBible = {
  papa: PAPA_DESCRIPTION,
  maxime: MAXIME_DESCRIPTION,
  clothing_before_pajamas: CLOTHING_BEFORE_PAJAMAS,
  clothing_pajamas: CLOTHING_PAJAMAS_SCENE,
  style: STYLE_GUIDE,
};

export function buildIllustrationPrompt(
  spec: SceneSpec,
  bible: CharacterBible = CHARACTER_BIBLE,
): string {
  const clothing = spec.isPajamaScene
    ? bible.clothing_pajamas
    : bible.clothing_before_pajamas;
  return [
    `Children's board book illustration, page ${spec.page} of "Maxime Goes to Sleep".`,
    `Scene: ${spec.scene}`,
    `Characters present: ${bible.papa}. ${bible.maxime}.`,
    `Clothing for this scene: ${clothing}.`,
    `Style: ${bible.style}.`,
    NEGATIVE_GUIDANCE,
    "Square 1:1 composition, soft warm bedtime atmosphere.",
  ].join(" ");
}
