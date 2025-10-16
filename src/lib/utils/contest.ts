import { ContestStatus, type Contest } from '$lib/dto/contest';

/**
 * Determines the status of a contest based on current time and contest dates
 */
export function getContestStatus(contest: Contest): ContestStatus {
  const now = new Date();

  // If startAt is null, contest is already ongoing
  if (contest.startAt === null) {
    // If endAt is also null, it's live indefinitely
    if (contest.endAt === null) {
      return ContestStatus.Ongoing;
    }
    // If endAt exists, check if it's still within the end time
    const endDate = new Date(contest.endAt);
    return now <= endDate ? ContestStatus.Ongoing : ContestStatus.Past;
  }

  const startDate = new Date(contest.startAt);

  // If endAt is null, contest is ongoing after start time
  if (contest.endAt === null) {
    return now >= startDate ? ContestStatus.Ongoing : ContestStatus.Upcoming;
  }

  const endDate = new Date(contest.endAt);

  if (now < startDate) {
    return ContestStatus.Upcoming;
  } else if (now >= startDate && now <= endDate) {
    return ContestStatus.Ongoing;
  } else {
    return ContestStatus.Past;
  }
}

/**
 * Calculates minutes remaining until contest ends (for live contests)
 */
export function getMinutesUntilEnd(contest: Contest): number | undefined {
  const status = getContestStatus(contest);
  if (status !== ContestStatus.Ongoing || contest.endAt === null) return undefined;

  const now = new Date();
  const endDate = new Date(contest.endAt);
  const diffMs = endDate.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60)));
}

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
