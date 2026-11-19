/**
 * Formats a person's name for display as "Surname N." (e.g. "Kowalski J.").
 * Falls back to whichever part is present when the other is missing.
 */
export function formatUserName(name?: string | null, surname?: string | null): string {
  const first = name?.trim() ?? '';
  const last = surname?.trim() ?? '';
  if (!last) return first;
  if (!first) return last;
  // Spread so an initial outside the BMP is not split in half.
  return `${last} ${[...first][0].toUpperCase()}.`;
}
