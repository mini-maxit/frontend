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
 * @returns RFC3339 formatted string with timezone offset (e.g., "2025-10-18T16:30:00+01:00")
 */
export function toRFC3339(datetimeLocal: string): string {
  const date = new Date(datetimeLocal);

  // Get timezone offset in minutes (positive for west of UTC, negative for east)
  // We need to negate it to get the standard offset format
  const tzOffsetMinutes = -date.getTimezoneOffset();

  // Calculate timezone offset sign, hours, and minutes
  const sign = tzOffsetMinutes >= 0 ? '+' : '-';
  const absOffset = Math.abs(tzOffsetMinutes);
  const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const minutes = String(absOffset % 60).padStart(2, '0');

  // Format the date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  // Return RFC3339 formatted string with timezone offset
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${hours}:${minutes}`;
}

/**
 * Calculates the current page number based on offset and limit
 */
export function getCurrentPage(offset: number, limit: number): number {
  return Math.floor(offset / limit) + 1;
}

/**
 * Calculates the total number of pages based on total items and limit
 */
export function getTotalPages(total: number, limit: number): number {
  return Math.max(1, Math.ceil(total / limit));
}

/**
 * Generates pagination pages array with ellipsis
 */
export function getPaginationPages(
  currentPage: number,
  totalPages: number
): Array<number | 'ellipsis'> {
  const pages: Array<number | 'ellipsis'> = [];
  const maxVisible = 7;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  const leftSiblingIndex = Math.max(currentPage - 1, 2);
  const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    for (let i = 2; i < Math.min(6, totalPages); i++) {
      pages.push(i);
    }
    pages.push('ellipsis');
  } else if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    pages.push('ellipsis');
    for (let i = Math.max(totalPages - 4, 2); i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push('ellipsis');
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }
    pages.push('ellipsis');
  }

  pages.push(totalPages);
  return pages;
}

/**
 * Calculates the offset based on page number and limit
 */
export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
