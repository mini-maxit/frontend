import type { Contest, ContestStatus, ContestWithStatus } from '$lib/dto/contest';

/**
 * Determines the status of a contest based on current time and contest dates
 */
export function getContestStatus(contest: Contest): ContestStatus {
  const now = new Date();

  // If startAt is null, contest is already ongoing
  if (contest.startAt === null) {
    // If endAt is also null, it's live indefinitely
    if (contest.endAt === null) {
      return 'live';
    }
    // If endAt exists, check if it's still within the end time
    const endDate = new Date(contest.endAt);
    return now <= endDate ? 'live' : 'past';
  }

  const startDate = new Date(contest.startAt);

  // If endAt is null, contest is ongoing after start time
  if (contest.endAt === null) {
    return now >= startDate ? 'live' : 'upcoming';
  }

  const endDate = new Date(contest.endAt);

  if (now < startDate) {
    return 'upcoming';
  } else if (now >= startDate && now <= endDate) {
    return 'live';
  } else {
    return 'past';
  }
}

/**
 * Calculates minutes remaining until contest ends (for live contests)
 */
export function getMinutesUntilEnd(contest: Contest): number | undefined {
  const status = getContestStatus(contest);
  if (status !== 'live' || contest.endAt === null) return undefined;

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
 * Transforms API contest data to the format expected by components
 */
export function transformContestData(contest: Contest): ContestWithStatus {
  const status = getContestStatus(contest);
  const endsInMinutes = getMinutesUntilEnd(contest);

  // Provide status-specific fallbacks for null dates
  let startDate: string;
  let endDate: string;

  if (contest.startAt === null) {
    startDate = status === 'live' ? 'Already started' : 'TBD';
  } else {
    startDate = formatContestDate(contest.startAt);
  }

  if (contest.endAt === null) {
    endDate = status === 'live' ? 'Ongoing' : status === 'upcoming' ? 'TBD' : 'No end time';
  } else {
    endDate = formatContestDate(contest.endAt);
  }

  return {
    ...contest,
    status,
    startDate,
    endDate,
    // These would need to come from additional API calls or be included in the contest response
    participantCount: 0, // Placeholder - would need separate API call
    tasksCount: 0, // Placeholder - would need separate API call
    isRegistered: false, // Placeholder - would need user-specific data
    ...(endsInMinutes !== undefined && { endsInMinutes })
  };
}

/**
 * Groups contests by their status
 */
export function groupContestsByStatus(contests: Contest[]) {
  const transformed = contests.map(transformContestData);

  return {
    live: transformed.filter((c) => c.status === 'live'),
    upcoming: transformed.filter((c) => c.status === 'upcoming'),
    past: transformed.filter((c) => c.status === 'past')
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
