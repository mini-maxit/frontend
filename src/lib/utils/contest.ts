import { ContestStatus, type Contest } from '$lib/dto/contest';
import { differenceInMinutes, formatDistanceToNow, parseISO } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';
import { getLocale } from '$lib/paraglide/runtime';
import * as m from '$lib/paraglide/messages';
import { formatDate } from '$lib/utils';

/**
 * Get date-fns locale based on current app locale
 */
function getDateFnsLocale() {
  const locale = getLocale();
  return locale === 'pl' ? pl : enUS;
}

/**
 * Formats a contest's start date for display
 */
export function getFormattedStartDate(contest: Contest): string {
  if (contest.startAt === null) {
    return contest.status === ContestStatus.Ongoing ? m.contest_already_started() : m.contest_tbd();
  }
  return formatDate(contest.startAt);
}

/**
 * Formats a contest's end date for display
 */
export function getFormattedEndDate(contest: Contest): string {
  if (contest.endAt === null) {
    return contest.status === ContestStatus.Ongoing
      ? m.contest_ongoing()
      : contest.status === ContestStatus.Upcoming
        ? m.contest_tbd()
        : m.contest_not_specified();
  }
  return formatDate(contest.endAt);
}

/**
 * Groups contests by their status
 */
export function groupContestsByStatus(contests: Contest[]) {
  return {
    live: contests.filter((c) => c.status === ContestStatus.Ongoing),
    upcoming: contests.filter((c) => c.status === ContestStatus.Upcoming),
    past: contests.filter((c) => c.status === ContestStatus.Past)
  };
}

/**
 * Calculates contest statistics from contest data
 */
export function calculateContestStats(contests: Contest[]) {
  const groups = groupContestsByStatus(contests);

  return {
    total: contests.length,
    live: groups.live.length,
    upcoming: groups.upcoming.length,
    past: groups.past.length
  };
}

/**
 * Calculate minutes until a date (for upcoming contests) or minutes since start (for ongoing contests)
 */
export function calculateTimeInMinutes(
  startAt: string | null,
  endAt: string | null,
  status: ContestStatus
): number {
  const now = new Date();

  if (status === ContestStatus.Upcoming) {
    // For upcoming contests, calculate minutes until start
    if (!startAt) return -1; // Special value for null start time
    const startTime = parseISO(startAt);
    return Math.max(0, differenceInMinutes(startTime, now));
  } else if (status === ContestStatus.Ongoing) {
    // For ongoing contests, calculate minutes until end
    if (!endAt) return -1; // Special value for null end time (indefinite contest)
    const endTime = parseISO(endAt);
    return Math.max(0, differenceInMinutes(endTime, now));
  }

  return 0;
}

/**
 * Format a date to relative time string (e.g., "2 weeks ago", "1 month ago")
 */
export function formatRelativeDate(dateString: string): string {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: getDateFnsLocale() });
}
