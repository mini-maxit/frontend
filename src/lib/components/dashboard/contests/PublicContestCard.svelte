<script lang="ts">
  import { formatUserName } from '#lib/utils/user.js';
  import * as Card from '#lib/components/ui/card/index.js';
  import { Button } from '#lib/components/ui/button/index.js';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Users from '@lucide/svelte/icons/users';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import Calendar from '@lucide/svelte/icons/calendar';
  import Loader2 from '@lucide/svelte/icons/loader-2';
  import Eye from '@lucide/svelte/icons/eye';
  import {
    ContestRegistrationStatus,
    ContestStatus,
    type PublicContest
  } from '#lib/dto/contest.js';
  import { getFormattedStartDate, getFormattedEndDate } from '#lib/utils/contest.js';
  import { AppRoutes } from '#lib/routes.js';
  import * as m from '#lib/paraglide/messages.js';

  interface Props {
    contest: PublicContest;
    onRegister: (id: number) => void;
    isRegistering?: boolean;
  }

  let { contest, onRegister, isRegistering = false }: Props = $props();

  const statusConfig = {
    [ContestStatus.Ongoing]: {
      label: m.available_contest_live(),
      classes: 'bg-primary/10 text-primary'
    },
    [ContestStatus.Upcoming]: {
      label: m.available_contest_upcoming(),
      classes: 'bg-secondary/10 text-secondary-foreground'
    },
    [ContestStatus.Past]: {
      label: m.available_contest_past(),
      classes: 'bg-muted text-muted-foreground'
    }
  };
  const status = $derived(statusConfig[contest.status]);
</script>

{#snippet notice(text: string, tone: 'info' | 'warning')}
  <div
    class="rounded-lg border border-border p-3 text-center text-xs {tone === 'warning'
      ? 'bg-destructive/10 text-destructive'
      : 'bg-secondary/10 text-secondary-foreground'}"
  >
    {text}
  </div>
{/snippet}

<Card.Root
  class="group relative flex h-full flex-col overflow-hidden border-border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
  <Card.Header>
    <div class="flex items-start justify-between gap-2">
      <div
        class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-md"
      >
        <Trophy class="h-5 w-5 text-primary-foreground" />
      </div>
      <span class="rounded-full px-3 py-1 text-xs font-bold {status.classes}">{status.label}</span>
    </div>
    <Card.Title class="mt-3 text-xl break-words">{contest.name}</Card.Title>
    {#if contest.description}
      <Card.Description class="line-clamp-3">{contest.description}</Card.Description>
    {/if}
    {#if contest.creator}
      <p class="text-xs text-muted-foreground">
        {m.public_contest_created_by({
          name: formatUserName(contest.creator)
        })}
      </p>
    {/if}
  </Card.Header>

  <Card.Content class="mt-auto space-y-4">
    <div class="space-y-2 rounded-lg border border-border bg-card p-3">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar class="h-4 w-4 text-primary" />
        <span>{m.available_contest_duration()}</span>
      </div>
      <p class="text-sm font-semibold text-foreground">
        {getFormattedStartDate(contest)} - {getFormattedEndDate(contest)}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-lg border border-border bg-card p-3">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground"
            >{m.available_contest_participants()}</span
          >
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">{contest.participantCount}</p>
      </div>
      <div class="rounded-lg border border-border bg-card p-3">
        <div class="flex items-center gap-2">
          <ListTodo class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground"
            >{m.available_contest_tasks()}</span
          >
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">{contest.taskCount}</p>
      </div>
    </div>

    {#if contest.registrationStatus === ContestRegistrationStatus.CanRegister}
      <Button class="w-full" onclick={() => onRegister(contest.id)} disabled={isRegistering}>
        {#if isRegistering}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          {m.public_contest_requesting()}
        {:else}
          {m.public_contest_request_to_join()}
        {/if}
      </Button>
    {:else if contest.registrationStatus === ContestRegistrationStatus.AwaitingApproval}
      {@render notice(m.available_contest_pending_review(), 'info')}
    {:else if contest.registrationStatus === ContestRegistrationStatus.Rejected}
      {@render notice(m.public_contest_request_rejected(), 'warning')}
    {:else if contest.registrationStatus === ContestRegistrationStatus.RegistrationClosed}
      {@render notice(m.available_contest_registration_closed_msg(), 'warning')}
    {:else if contest.status === ContestStatus.Upcoming}
      {@render notice(m.available_contest_wait_until_start(), 'info')}
    {:else if contest.status === ContestStatus.Ongoing}
      <Button class="w-full" href={`${AppRoutes.UserContests}/${contest.id}`}>
        {m.available_contest_go_to_contest()}
      </Button>
    {:else}
      <Button
        variant="outline"
        class="w-full"
        href={`${AppRoutes.UserContests}/${contest.id}/results`}
      >
        <Eye class="mr-2 h-4 w-4" />
        {m.available_contest_view_results()}
      </Button>
    {/if}
  </Card.Content>
</Card.Root>
