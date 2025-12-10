<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import Clock from '@lucide/svelte/icons/clock';
  import Code from '@lucide/svelte/icons/code';
  import Calendar from '@lucide/svelte/icons/calendar';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import ChevronUp from '@lucide/svelte/icons/chevron-up';
  import UserIcon from '@lucide/svelte/icons/user';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import { SubmissionStatus, type Submission } from '$lib/dto/submission';
  import * as m from '$lib/paraglide/messages';
  import { formatDate } from '$lib/utils';
  import TestCaseResult from './TestCaseResult.svelte';

  interface SubmissionListRowProps {
    submission: Submission;
  }

  let { submission }: SubmissionListRowProps = $props();
  let testCasesExpanded = $state(false);

  const statusConfig = {
    success: {
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
      cardBgClass: '',
      label: m.submissions_status_success(),
      icon: CheckCircle
    },
    failed: {
      bgColor: 'bg-muted',
      textColor: 'text-muted-foreground',
      cardBgClass: 'bg-muted/30',
      label: m.submissions_status_failed(),
      icon: XCircle
    },
    pending: {
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
      cardBgClass: 'bg-muted/15',
      label: m.submissions_status_pending(),
      icon: Clock
    }
  };

  const getStatusKey = (status: SubmissionStatus): keyof typeof statusConfig => {
    switch (status) {
      case SubmissionStatus.Evaluated: {
        if (submission.result?.testResults) {
          const passed = submission.result.testResults.filter((t) => t.passed).length;
          const total = submission.result.testResults.length;
          return passed === total && total > 0 ? 'success' : 'failed';
        }
        return 'failed';
      }
      case SubmissionStatus.Lost:
        return 'failed';
      case SubmissionStatus.Received:
      case SubmissionStatus.SentForEvaluation:
        return 'pending';
      default:
        return 'pending';
    }
  };

  const config = $derived(statusConfig[getStatusKey(submission.status)]);

  const getScore = () => {
    if (!submission.result?.testResults) return '-/-';
    const passed = submission.result.testResults.filter((t) => t.passed).length;
    const total = submission.result.testResults.length;
    return `${passed}/${total}`;
  };

  const toggleTestCases = () => {
    testCasesExpanded = !testCasesExpanded;
  };
</script>

<Card.Root
  class="group relative overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg {config.cardBgClass}"
>
  <Card.Content class="relative p-4">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <!-- Left Section: Task Name & Status -->
      <div class="flex-1 space-y-2">
        <div class="flex items-start gap-3">
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg {config.bgColor} transition-transform duration-300 group-hover:scale-110"
          >
            <config.icon class="h-5 w-5 {config.textColor}" />
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-foreground transition-colors group-hover:text-primary">
              {submission.task.title}
            </h3>
            <div class="mt-1 flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center rounded-full {config.bgColor} px-2.5 py-0.5 text-xs font-medium {config.textColor}"
              >
                {config.label}
              </span>
              <span class="text-sm font-medium text-foreground">{getScore()}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Section: Stats Grid -->
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <!-- Submitter -->
        <div class="rounded-lg border border-border bg-card p-2">
          <div class="flex items-center gap-1.5">
            <UserIcon class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs text-muted-foreground">{m.submissions_submitter_label()}</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-foreground">
            {submission.user.name}
            {submission.user.surname}
          </p>
        </div>

        <!-- Language -->
        <div class="rounded-lg border border-border bg-card p-2">
          <div class="flex items-center gap-1.5">
            <Code class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs text-muted-foreground">{m.submissions_language_label()}</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-foreground">
            {submission.language.language}
          </p>
        </div>

        <!-- Submitted Date -->
        <div class="rounded-lg border border-border bg-card p-2">
          <div class="flex items-center gap-1.5">
            <Calendar class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs text-muted-foreground">{m.submissions_submitted_label()}</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-foreground">
            {formatDate(submission.submittedAt)}
          </p>
        </div>

        <!-- Order -->
        <div class="rounded-lg border border-border bg-card p-2">
          <div class="flex items-center gap-1.5">
            <Clock class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs text-muted-foreground">{m.submissions_attempt_label()}</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-foreground">#{submission.order}</p>
        </div>
      </div>
    </div>

    <!-- Result Status Section -->
    {#if submission.result?.code}
      <div class="mt-4 border-t border-border pt-4">
        <div class="rounded-lg border border-border bg-card p-3">
          <div class="flex items-center gap-2">
            <AlertCircle class="h-4 w-4 text-primary" />
            <span class="text-xs font-medium text-muted-foreground">
              {m.submissions_result_status_label()}
            </span>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {config.bgColor} {config.textColor}"
            >
              {submission.result.code}
            </span>
            {#if submission.result.message}
              <span class="text-sm text-muted-foreground">{submission.result.message}</span>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Test Cases Section -->
    {#if submission.result?.testResults && submission.result.testResults.length > 0}
      <div class="mt-4 border-t border-border pt-4">
        <button
          onclick={toggleTestCases}
          class="flex w-full items-center justify-between text-left transition-colors hover:text-primary"
        >
          <h4 class="text-sm font-semibold text-foreground">
            {m.admin_contest_submissions_test_cases()}
          </h4>
          {#if testCasesExpanded}
            <ChevronUp class="h-4 w-4 text-muted-foreground" />
          {:else}
            <ChevronDown class="h-4 w-4 text-muted-foreground" />
          {/if}
        </button>

        {#if testCasesExpanded}
          <div class="mt-3 space-y-2">
            {#each submission.result.testResults as testResult, index (testResult.id)}
              <TestCaseResult {testResult} testNumber={index + 1} />
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </Card.Content>
</Card.Root>
