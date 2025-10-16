import { ContestStatus, type Contest } from '$lib/dto/contest';

/**
 * Formats a date string for display
 */
export function formatContestDate(dateString: string | null): string {
  if (dateString === null) return 'Not specified';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Formats a contest's start date for display
 */
export function getFormattedStartDate(contest: Contest): string {
  if (contest.startAt === null) {
    return contest.status === ContestStatus.Ongoing ? 'Already started' : 'TBD';
  }
  return formatContestDate(contest.startAt);
}

/**
 * Formats a contest's end date for display
 */
export function getFormattedEndDate(contest: Contest): string {
  if (contest.endAt === null) {
    return contest.status === ContestStatus.Ongoing
      ? 'Ongoing'
      : contest.status === ContestStatus.Upcoming
        ? 'TBD'
        : 'No end time';
  }
  return formatContestDate(contest.endAt);
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
  status: string
): number {
  const now = new Date();

  if (status === 'upcoming') {
    // For upcoming contests, calculate minutes until start
    if (!startAt) return -1; // Special value for null start time
    const startTime = new Date(startAt);
    return Math.max(0, Math.floor((startTime.getTime() - now.getTime()) / (1000 * 60)));
  } else if (status === 'ongoing') {
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

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}
