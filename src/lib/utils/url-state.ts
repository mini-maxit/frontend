import { browser } from '$app/env';
import { goto } from '$app/navigation';

/**
 * Read an integer query parameter with a default fallback.
 */
export function readIntParam(
  url: { searchParams: { get(name: string): string | null } },
  key: string,
  fallback: number
): number {
  const raw = url.searchParams.get(key);
  if (raw === null || raw === '') return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Read a string query parameter with a default fallback.
 */
export function readParam(
  url: { searchParams: { get(name: string): string | null } },
  key: string,
  fallback = ''
): string {
  return url.searchParams.get(key) ?? fallback;
}

/**
 * Write query parameters into the current URL without adding a history entry.
 * Empty/undefined/null values remove the parameter.
 *
 * Uses `goto` with `replaceState` (instead of a raw `history.replaceState` call)
 * so SvelteKit's navigation state stored in `history.state` is preserved. A raw
 * `replaceState(null, ...)` clobbers that state and breaks SvelteKit's popstate
 * handling, so browser back no longer re-renders the previous page.
 */
export function writeSearchParams(
  updates: Record<string, string | number | null | undefined>
): void {
  if (!browser) return;

  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
  }

  // kit 3: shallow updates the URL without navigating (no scroll, no focus change,
  // no load re-run) — replaces the old replaceState+keepFocus+noScroll combo.
  goto(url.pathname + url.search, { replace: true, shallow: true });
}
