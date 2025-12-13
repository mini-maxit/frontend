<script lang="ts">
  import { getSubmissionDetails, type SubmissionWithFileContent } from './submission.remote';
  import { LoadingSpinner, ErrorCard } from '$lib/components/common';
  import * as Card from '$lib/components/ui/card';
  import * as m from '$lib/paraglide/messages';
  import { formatDate } from '$lib/utils';
  import TestCaseResult from '$lib/components/dashboard/submissions/TestCaseResult.svelte';
  import { SubmissionStatus, SubmissionResultCode } from '$lib/dto/submission';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import Clock from '@lucide/svelte/icons/clock';
  import Code from '@lucide/svelte/icons/code';
  import Calendar from '@lucide/svelte/icons/calendar';
  import UserIcon from '@lucide/svelte/icons/user';
  import FileText from '@lucide/svelte/icons/file-text';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Hash from '@lucide/svelte/icons/hash';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/mono-blue.css';

  interface Props {
    data: {
      submissionId: number;
    };
  }

  let { data }: Props = $props();

  const submissionQuery = getSubmissionDetails(data.submissionId);

  // Reactive variable with proper typing
  const submission = $derived(submissionQuery.current as SubmissionWithFileContent | undefined);

  const statusConfig = {
    success: {
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
      label: m.submissions_status_success(),
      icon: CheckCircle
    },
    failed: {
      bgColor: 'bg-muted',
      textColor: 'text-muted-foreground',
      label: m.submissions_status_failed(),
      icon: XCircle
    },
    pending: {
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
      label: m.submissions_status_pending(),
      icon: Clock
    }
  };

  const getStatusKey = (
    status: SubmissionStatus,
    testResults?: { passed: boolean }[]
  ): keyof typeof statusConfig => {
    switch (status) {
      case SubmissionStatus.Evaluated: {
        if (testResults) {
          const passed = testResults.filter((t) => t.passed).length;
          const total = testResults.length;
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

  const getResultCodeLabel = (code: SubmissionResultCode | string) => {
    switch (code) {
      case SubmissionResultCode.Success:
        return m.submissions_result_status_success();
      case SubmissionResultCode.TestFailed:
        return m.submissions_result_status_test_failed();
      case SubmissionResultCode.CompilationError:
        return m.submissions_result_status_compilation_error();
      case SubmissionResultCode.InitializationError:
        return m.submissions_result_status_initialization_error();
      case SubmissionResultCode.InternalError:
        return m.submissions_result_status_internal_error();
      default:
        return String(code);
    }
  };

  const highlighted = $derived(() => {
    if (!submission?.fileContent) return '';
    const result = hljs.highlightAuto(submission.fileContent);
    return result.value;
  });

  const config = $derived(
    submission
      ? statusConfig[getStatusKey(submission.status, submission.result?.testResults)]
      : statusConfig.pending
  );

  const getScore = () => {
    if (!submission?.result?.testResults) return '-/-';
    const passed = submission.result.testResults.filter((t) => t.passed).length;
    const total = submission.result.testResults.length;
    return `${passed}/${total}`;
  };
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">
      {m.submission_details_page_title()}
    </h1>
    <p class="text-lg text-muted-foreground">
      {m.submission_details_page_description()}
    </p>
  </div>

  {#if submissionQuery.error}
    <ErrorCard
      title={m.submission_details_load_error()}
      error={submissionQuery.error}
      onRetry={() => submissionQuery.refresh()}
      inCard
      iconBackground
    />
  {:else if submissionQuery.loading}
    <LoadingSpinner message={m.submission_details_loading()} inCard size="h-12 w-12" />
  {:else if submission}
    <!-- Status Overview Card -->
    <Card.Root class="overflow-hidden shadow-md">
      <Card.Content class="p-6">
        <div class="flex items-center gap-4">
          <div
            class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg {config.bgColor}"
          >
            <config.icon class="h-8 w-8 {config.textColor}" />
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-foreground">{submission.task.title}</h2>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              {#if submission.status === SubmissionStatus.Evaluated && submission.result?.code}
                <span
                  class="inline-flex items-center rounded-full {config.bgColor} px-3 py-1 text-sm font-medium {config.textColor}"
                >
                  {getResultCodeLabel(submission.result.code as SubmissionResultCode)}
                </span>
              {:else}
                <span
                  class="inline-flex items-center rounded-full {config.bgColor} px-3 py-1 text-sm font-medium {config.textColor}"
                >
                  {config.label}
                </span>
              {/if}
              <span class="text-lg font-semibold text-foreground">{getScore()}</span>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Basic Information -->
    <Card.Root class="shadow-md">
      <Card.Header>
        <Card.Title>{m.submission_details_basic_info()}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <!-- Submission ID -->
          <div class="rounded-lg border border-border bg-card p-3">
            <div class="flex items-center gap-2">
              <Hash class="h-4 w-4 text-primary" />
              <span class="text-sm text-muted-foreground"
                >{m.submission_details_submission_id()}</span
              >
            </div>
            <p class="mt-2 text-lg font-semibold text-foreground">#{submission.id}</p>
          </div>

          <!-- Task -->
          <div class="rounded-lg border border-border bg-card p-3">
            <div class="flex items-center gap-2">
              <FileText class="h-4 w-4 text-primary" />
              <span class="text-sm text-muted-foreground">{m.submission_details_task()}</span>
            </div>
            <p class="mt-2 text-lg font-semibold text-foreground">{submission.task.title}</p>
          </div>

          <!-- Contest -->
          <div class="rounded-lg border border-border bg-card p-3">
            <div class="flex items-center gap-2">
              <Trophy class="h-4 w-4 text-primary" />
              <span class="text-sm text-muted-foreground">{m.submission_details_contest()}</span>
            </div>
            <p class="mt-2 text-lg font-semibold text-foreground">
              {submission.contestId
                ? `#${submission.contestId}`
                : m.submission_details_no_contest()}
            </p>
          </div>

          <!-- Submitter -->
          <div class="rounded-lg border border-border bg-card p-3">
            <div class="flex items-center gap-2">
              <UserIcon class="h-4 w-4 text-primary" />
              <span class="text-sm text-muted-foreground">{m.submission_details_submitter()}</span>
            </div>
            <p class="mt-2 text-lg font-semibold text-foreground">
              {submission.user.name}
              {submission.user.surname}
            </p>
          </div>

          <!-- Language -->
          <div class="rounded-lg border border-border bg-card p-3">
            <div class="flex items-center gap-2">
              <Code class="h-4 w-4 text-primary" />
              <span class="text-sm text-muted-foreground">{m.submission_details_language()}</span>
            </div>
            <p class="mt-2 text-lg font-semibold text-foreground">
              {submission.language.language}
              {submission.language.version}
            </p>
          </div>

          <!-- Attempt Number -->
          <div class="rounded-lg border border-border bg-card p-3">
            <div class="flex items-center gap-2">
              <Clock class="h-4 w-4 text-primary" />
              <span class="text-sm text-muted-foreground"
                >{m.submission_details_attempt_number()}</span
              >
            </div>
            <p class="mt-2 text-lg font-semibold text-foreground">#{submission.order}</p>
          </div>

          <!-- Submitted At -->
          <div class="rounded-lg border border-border bg-card p-3">
            <div class="flex items-center gap-2">
              <Calendar class="h-4 w-4 text-primary" />
              <span class="text-sm text-muted-foreground"
                >{m.submission_details_submitted_at()}</span
              >
            </div>
            <p class="mt-2 text-lg font-semibold text-foreground">
              {formatDate(submission.submittedAt)}
            </p>
          </div>

          <!-- Checked At -->
          {#if submission.checkedAt}
            <div class="rounded-lg border border-border bg-card p-3">
              <div class="flex items-center gap-2">
                <Calendar class="h-4 w-4 text-primary" />
                <span class="text-sm text-muted-foreground"
                  >{m.submission_details_checked_at()}</span
                >
              </div>
              <p class="mt-2 text-lg font-semibold text-foreground">
                {formatDate(submission.checkedAt)}
              </p>
            </div>
          {/if}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Test Results -->
    {#if submission.result?.testResults && submission.result.testResults.length > 0}
      <Card.Root class="shadow-md">
        <Card.Header>
          <Card.Title>{m.submission_details_test_results()}</Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="space-y-3">
            {#each submission.result.testResults as testResult, index (testResult.id)}
              <TestCaseResult {testResult} testNumber={index + 1} />
            {/each}
          </div>
        </Card.Content>
      </Card.Root>
    {/if}

    <!-- Submitted Code -->
    <Card.Root class="shadow-md">
      <Card.Header>
        <Card.Title>{m.submission_details_code_title()}</Card.Title>
      </Card.Header>
      <Card.Content class="mx-6 overflow-auto px-0">
        <pre class="rounded-lg text-xs"><code>{@html highlighted()}</code></pre>
      </Card.Content>
    </Card.Root>
  {/if}
</div>
