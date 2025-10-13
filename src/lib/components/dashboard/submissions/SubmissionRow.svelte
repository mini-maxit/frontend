<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import Clock from '@lucide/svelte/icons/clock';
  import Code from '@lucide/svelte/icons/code';
  import Eye from '@lucide/svelte/icons/eye';
  import Cpu from '@lucide/svelte/icons/cpu';
  import HardDrive from '@lucide/svelte/icons/hard-drive';

  interface SubmissionRowProps {
    taskName: string;
    status: 'success' | 'failed' | 'pending';
    score: string;
    language: string;
    submissionDate: string;
    executionTime: string;
    memoryUsed: string;
  }

  let {
    taskName,
    status,
    score,
    language,
    submissionDate,
    executionTime,
    memoryUsed
  }: SubmissionRowProps = $props();

  const statusConfig = {
    success: {
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600',
      label: 'Success'
    },
    failed: {
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600',
      label: 'Failed'
    },
    pending: {
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-600',
      label: 'Pending'
    }
  };

  const config = $derived(statusConfig[status]);
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
            {#if status === 'success'}
              <CheckCircle class="h-5 w-5 {config.textColor}" />
            {:else if status === 'failed'}
              <XCircle class="h-5 w-5 {config.textColor}" />
            {:else}
              <Clock class="h-5 w-5 {config.textColor}" />
            {/if}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-foreground transition-colors group-hover:text-primary">
              {taskName}
            </h3>
            <div class="mt-1 flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center rounded-full {config.bgColor} px-2.5 py-0.5 text-xs font-medium {config.textColor}"
              >
                {config.label}
              </span>
              <span class="text-sm font-medium text-foreground">{score}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Section: Stats Grid -->
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <!-- Language -->
        <div class="rounded-lg border border-border bg-card p-2">
          <div class="flex items-center gap-1.5">
            <Code class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs text-muted-foreground">Language</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-foreground">{language}</p>
        </div>

        <!-- Execution Time -->
        <div class="rounded-lg border border-border bg-card p-2">
          <div class="flex items-center gap-1.5">
            <Cpu class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs text-muted-foreground">Time</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-foreground">{executionTime}</p>
        </div>

        <!-- Memory -->
        <div class="rounded-lg border border-border bg-card p-2">
          <div class="flex items-center gap-1.5">
            <HardDrive class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs text-muted-foreground">Memory</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-foreground">{memoryUsed}</p>
        </div>

        <!-- Date -->
        <div class="rounded-lg border border-border bg-card p-2">
          <div class="flex items-center gap-1.5">
            <Clock class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs text-muted-foreground">Submitted</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-foreground">{submissionDate}</p>
        </div>
      </div>

      <!-- Right Section: Action Button -->
      <div class="flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md lg:w-auto"
        >
          <Eye class="mr-2 h-4 w-4" />
          View Details
        </Button>
      </div>
    </div>
  </Card.Content>
</Card.Root>
