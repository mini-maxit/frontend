import * as m from '$lib/paraglide/messages';

export const APP_NAME = 'Mini-Maxit';

/**
 * Builds a browser tab title with a consistent identification pattern.
 * e.g. `Test Contest - Contest · Mini-Maxit`
 *
 * @param name  - the resource name (task title, contest name, user name...)
 * @param type  - the resource type label (translated, e.g. "Contest")
 */
export function buildDocumentTitle(name?: string, type?: string): string {
  const parts: string[] = [];
  if (name) parts.push(name);
  if (type) parts.push(type);
  if (parts.length === 0) return m.app_name();
  return `${parts.join(' - ')} · ${APP_NAME}`;
}
