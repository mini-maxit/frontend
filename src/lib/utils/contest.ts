import { ContestStatus, type Contest } from '$lib/dto/contest';
import * as m from '$lib/paraglide/messages';
import { formatDate } from '$lib/utils';

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
    const startTime = new Date(startAt);
    return Math.max(0, Math.floor((startTime.getTime() - now.getTime()) / (1000 * 60)));
  } else if (status === ContestStatus.Ongoing) {
    // For ongoing contests, calculate minutes until end
    if (!endAt) return -1; // Special value for null end time (indefinite contest)
    const endTime = new Date(endAt);
    return Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / (1000 * 60)));
  }

  return 0;
}

/**
 * Format a date to relative time string (e.g., "2 weeks ago", "1 month ago")
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Configuration array for time units (ordered from largest to smallest)
  const timeUnits = [
    {
      value: years,
      singular: m.relative_time_years_ago,
      plural: m.relative_time_years_ago_plural
    },
    {
      value: months,
      singular: m.relative_time_months_ago,
      plural: m.relative_time_months_ago_plural
    },
    {
      value: weeks,
      singular: m.relative_time_weeks_ago,
      plural: m.relative_time_weeks_ago_plural
    },
    {
      value: days,
      singular: m.relative_time_days_ago,
      plural: m.relative_time_days_ago_plural
    },
    {
      value: hours,
      singular: m.relative_time_hours_ago,
      plural: m.relative_time_hours_ago_plural
    },
    {
      value: minutes,
      singular: m.relative_time_minutes_ago,
      plural: m.relative_time_minutes_ago_plural
    }
  ];

  // Find the first unit with a value > 0 and return its formatted message
  for (const unit of timeUnits) {
    if (unit.value > 0) {
      return unit.value === 1
        ? unit.singular({ count: unit.value })
        : unit.plural({ count: unit.value });
    }
  }

  // If no time has passed, return "just now"
  return m.relative_time_just_now();
}
