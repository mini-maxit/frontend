<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import Clock from '@lucide/svelte/icons/clock';
  import Code from '@lucide/svelte/icons/code';
  import Calendar from '@lucide/svelte/icons/calendar';
  import { SubmissionStatus, type Submission } from '$lib/dto/submission';
  import * as m from '$lib/paraglide/messages';
  import { formatDate } from '$lib/utils';

  interface SubmissionListRowProps {
    submission: Submission;
  }

  let { submission }: SubmissionListRowProps = $props();

  const statusConfig = {
    success: {
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600',
      label: m.submissions_status_success(),
      icon: CheckCircle
    },
    failed: {
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600',
      label: m.submissions_status_failed(),
      icon: XCircle
    },
    pending: {
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-600',
      label: m.submissions_status_pending(),
      icon: Clock
    }
  };

  const getStatusKey = (status: SubmissionStatus): 'success' | 'failed' | 'pending' => {
    switch (status) {
      case SubmissionStatus.Evaluated:
        return 'success';
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
  const Icon = $derived(config.icon);

  const getScore = () => {
    if (!submission.result?.testResults) return '-/-';
    const passed = submission.result.testResults.filter((t) => t.passed).length;
    const total = submission.result.testResults.length;
    return `${passed}/${total}`;
  };
</script>

<Card.Root
  class="group relative overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
  <!-- Status gradient overlay -->
  <div
    class="absolute inset-0 bg-gradient-to-r {config.color} opacity-[0.02] transition-opacity duration-300 group-hover:opacity-[0.05]"
  ></div>

  <Card.Content class="relative p-4">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <!-- Left Section: Task Name & Status -->
      <div class="flex-1 space-y-2">
        <div class="flex items-start gap-3">
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg {config.bgColor} transition-transform duration-300 group-hover:scale-110"
          >
            <Icon class="h-5 w-5 {config.textColor}" />
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
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <!-- Language -->
        <div class="rounded-lg border border-border bg-card p-2">
          <div class="flex items-center gap-1.5">
            <Code class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs text-muted-foreground">Language</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-foreground">
            {submission.language.language}
          </p>
        </div>

        <!-- Submitted Date -->
        <div class="rounded-lg border border-border bg-card p-2">
          <div class="flex items-center gap-1.5">
            <Calendar class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs text-muted-foreground">Submitted</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-foreground">
            {formatDate(submission.submittedAt)}
          </p>
        </div>

        <!-- Order -->
        <div class="rounded-lg border border-border bg-card p-2">
          <div class="flex items-center gap-1.5">
            <Clock class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs text-muted-foreground">Attempt</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-foreground">#{submission.order}</p>
        </div>
      </div>
    </div>
  </Card.Content>
</Card.Root>
