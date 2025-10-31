import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatISO, parseISO } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';
import { getLocale } from './paraglide/runtime';
import * as m from './paraglide/messages';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * Get date-fns locale based on current app locale
 */
export function getDateFnsLocale() {
  const locale = getLocale();
  return locale === 'pl' ? pl : enUS;
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return m.common_not_available();

  const date = parseISO(dateString);
  return format(date, 'MMM d, HH:mm', { locale: getDateFnsLocale() });
}

/**
 * Converts a datetime-local input value to RFC3339 format for API requests
 * @param datetimeLocal - String in format "YYYY-MM-DDTHH:mm" from datetime-local input
 * @returns RFC3339 formatted string (e.g., "2025-10-18T16:30:00Z")
 */
export function toRFC3339(datetimeLocal: string): string {
  return formatISO(new Date(datetimeLocal));
}
