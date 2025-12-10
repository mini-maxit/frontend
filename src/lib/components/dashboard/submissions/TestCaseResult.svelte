<script lang="ts">
  import type { TestResult } from '$lib/dto/submission';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import Clock from '@lucide/svelte/icons/clock';

  interface TestCaseResultProps {
    testResult: TestResult;
    testNumber: number;
  }

  let { testResult, testNumber }: TestCaseResultProps = $props();

  const formatExecutionTime = (timeMs: number): string => {
    if (!isFinite(timeMs) || timeMs < 0) return 'N/A';
    if (timeMs < 1) {
      return `${timeMs.toFixed(3)}ms`;
    } else if (timeMs < 1000) {
      return `${timeMs.toFixed(2)}ms`;
    } else {
      return `${(timeMs / 1000).toFixed(2)}s`;
    }
  };
</script>

<div class="rounded-lg border border-border bg-card p-3">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      {#if testResult.passed}
        <CheckCircle class="h-4 w-4 text-primary" />
      {:else}
        <XCircle class="h-4 w-4 text-destructive" />
      {/if}
      <span class="text-sm font-medium text-foreground">
        Test Case #{testNumber}
      </span>
      <span
        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {testResult.passed
          ? 'bg-primary/10 text-primary'
          : 'bg-destructive/10 text-destructive'}"
      >
        {testResult.passed ? 'Passed' : 'Failed'}
      </span>
    </div>
    <div class="flex items-center gap-2">
      {#if testResult.executionTimeMs !== undefined && testResult.executionTimeMs !== null}
        <div class="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock class="h-3 w-3" />
          <span>{formatExecutionTime(testResult.executionTimeMs)}</span>
        </div>
      {/if}
    </div>
  </div>

  <div class="mt-3 space-y-2 border-t border-border pt-3">
    {#if testResult.code}
      <div>
        <span class="text-xs font-medium text-muted-foreground">Status Code:</span>
        <span
          class="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {testResult.passed
            ? 'bg-primary/10 text-primary'
            : 'bg-destructive/10 text-destructive'}"
        >
          {testResult.code}
        </span>
      </div>
    {/if}

    {#if testResult.errorMessage}
      <div>
        <span class="text-xs font-medium text-muted-foreground">Message:</span>
        <p class="mt-1 text-sm text-foreground">{testResult.errorMessage}</p>
      </div>
    {/if}
  </div>
</div>
