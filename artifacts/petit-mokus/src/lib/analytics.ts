/**
 * Petit Mokus — GA4 analytics wrapper.
 * Fires window.gtag if available; silently no-ops otherwise.
 */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

function trackEvent(name: string, params?: Record<string, string | number | boolean>): void {
  try {
    window.gtag?.('event', name, params ?? {});
  } catch {
    // Never let analytics errors surface to users
  }
}

// ── Tab navigation ─────────────────────────────────────────────────────────

/** Fired when the user switches to a tab. */
export function trackTabView(tab: string): void {
  trackEvent('tab_view', { tab_name: tab });
}

// ── Sounds ─────────────────────────────────────────────────────────────────

/** Fired when a sound card is tapped and the sound plays. */
export function trackSoundPlay(soundId: string, category: string): void {
  trackEvent('sound_play', { sound_id: soundId, category });
}

// ── Stories ────────────────────────────────────────────────────────────────

/** Fired when a story is opened. */
export function trackStoryOpen(storyId: string, language: string): void {
  trackEvent('story_open', { story_id: storyId, language });
}

/** Fired when the user turns a page inside a story. */
export function trackStoryPage(storyId: string, page: number): void {
  trackEvent('story_page', { story_id: storyId, page });
}

// ── Games ──────────────────────────────────────────────────────────────────

/** Fired when a game session starts. */
export function trackGameStart(gameId: string): void {
  trackEvent('game_start', { game_id: gameId });
}

/** Fired when a game session ends (win or complete). */
export function trackGameComplete(gameId: string): void {
  trackEvent('game_complete', { game_id: gameId });
}

// ── Language ───────────────────────────────────────────────────────────────

/** Fired when the user changes the app language. */
export function trackLanguageChange(fromLanguage: string, toLanguage: string): void {
  trackEvent('language_change', { from_language: fromLanguage, to_language: toLanguage });
}

// ── Newsletter ─────────────────────────────────────────────────────────────

/** Fired when the newsletter form is successfully submitted. */
export function trackNewsletterSignup(language: string): void {
  trackEvent('newsletter_signup', { language });
}

/** Fired when the user dismisses the newsletter bar without submitting. */
export function trackNewsletterDismiss(): void {
  trackEvent('newsletter_dismiss');
}
