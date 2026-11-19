/**
 * Formats a person's name for display as "Surname N." (e.g. "Kowalski J.").
 * Falls back to whichever part is present when the other is missing.
 */
export function formatUserName(
  user?: { name?: string | null; surname?: string | null } | null
): string {
  const first = user?.name?.trim() ?? '';
  const last = user?.surname?.trim() ?? '';
  if (!last) return first;
  if (!first) return last;
  // Spread so an initial outside the BMP is not split in half.
  return `${last} ${[...first][0].toUpperCase()}.`;
}
