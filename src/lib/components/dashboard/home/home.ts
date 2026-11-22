import { SubmissionResultCode, SubmissionStatus, type Submission } from '#lib/dto/submission.js';
import * as m from '#lib/paraglide/messages.js';

export type Outcome = 'passed' | 'failed' | 'compile' | 'pending';

export function submissionOutcome(s: Submission): Outcome {
  if (s.status !== SubmissionStatus.Evaluated || !s.result) return 'pending';
  if (s.result.code === SubmissionResultCode.Success) return 'passed';
  if (s.result.code === SubmissionResultCode.CompilationError) return 'compile';
  return 'failed';
}

export const outcomeLabel: Record<Outcome, () => string> = {
  passed: m.home_outcome_passed,
  failed: m.home_outcome_failed,
  compile: m.home_outcome_compile,
  pending: m.home_outcome_pending
};

/** Tailwind classes for the outcome marker; one place so every list reads the same. */
export const outcomeTone: Record<Outcome, string> = {
  passed: 'bg-chart-2',
  failed: 'bg-destructive',
  compile: 'bg-chart-4',
  pending: 'bg-muted'
};

/** "3d 4h", "5h 12m", "8m" — compact countdown for contest windows. */
export function formatSpan(ms: number): string {
  const mins = Math.max(0, Math.floor(ms / 60000));
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${mins % 60}m`;
  return `${mins}m`;
}

export function until(date: string | null, now: number): string | null {
  return date ? formatSpan(new Date(date).getTime() - now) : null;
}
