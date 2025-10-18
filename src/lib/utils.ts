import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
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

export function formatDate(dateString: string | null): string {
  if (!dateString) return m.common_not_available();

  const date = new Date(dateString);

  return Intl.DateTimeFormat(getLocale(), {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}

/**
 * Converts a datetime-local input value to RFC3339 format for API requests
 * @param datetimeLocal - String in format "YYYY-MM-DDTHH:mm" from datetime-local input
 * @returns RFC3339 formatted string (e.g., "2025-10-18T16:30:00Z")
 */
export function toRFC3339(datetimeLocal: string): string {
  const date = new Date(datetimeLocal);
  return date.toISOString();
}
