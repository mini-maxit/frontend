<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Users from '@lucide/svelte/icons/users';
  import ListTodo from '@lucide/svelte/icons/list-todo';

  import Calendar from '@lucide/svelte/icons/calendar';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import Loader2 from '@lucide/svelte/icons/loader-2';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import Eye from '@lucide/svelte/icons/eye';

  import { ContestRegistrationStatus, ContestStatus, type Contest } from '$lib/dto/contest';
  import { getFormattedStartDate, getFormattedEndDate } from '$lib/utils/contest';
  import * as m from '$lib/paraglide/messages';

  interface AvailableContestCardProps {
    contest: Contest;
    onRegister?: (id: number) => void;
    onViewContest?: (id: number) => void;
    isRegistering?: boolean;
  }

  let {
    contest,
    onRegister,
    onViewContest,
    isRegistering = false
  }: AvailableContestCardProps = $props();

  const startDate = $derived(getFormattedStartDate(contest));
  const endDate = $derived(getFormattedEndDate(contest));

  const statusConfig = {
    ongoing: {
      label: m.available_contest_live(),
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    upcoming: {
      label: m.available_contest_upcoming(),
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary-foreground'
    },
    past: {
      label: m.available_contest_past(),
      bgColor: 'bg-muted',
      textColor: 'text-muted-foreground'
    }
  } as const;

  const config = $derived(statusConfig[contest.status as keyof typeof statusConfig]);

  // Registration status configuration
  const registrationConfig = $derived.by(() => {
    switch (contest.registrationStatus) {
      case ContestRegistrationStatus.Registered:
        return {
          icon: CheckCircle,
          text: m.available_contest_registered(),
          bgColor: 'bg-primary/10',
          textColor: 'text-primary',
          canRegister: false,
          showButton: true,
          buttonText:
            contest.status === ContestStatus.Past
              ? m.available_contest_view_results()
              : contest.status === ContestStatus.Ongoing
                ? m.available_contest_go_to_contest()
                : m.available_contest_view_contest(),
          buttonVariant:
            contest.status === ContestStatus.Past ? ('outline' as const) : ('default' as const)
        };
      case ContestRegistrationStatus.AwaitingApproval:
        return {
          icon: AlertCircle,
          text: m.available_contest_awaiting_approval(),
          bgColor: 'bg-secondary/10',
          textColor: 'text-secondary-foreground',
          canRegister: false,
          showButton: false,
          buttonText: '',
          buttonVariant: 'default' as const
        };
      case ContestRegistrationStatus.RegistrationClosed:
        return {
          icon: XCircle,
          text: m.available_contest_registration_closed(),
          bgColor: 'bg-destructive/10',
          textColor: 'text-destructive',
          canRegister: false,
          showButton: contest.status === 'past',
          buttonText: m.available_contest_view_results(),
          buttonVariant: 'outline' as const
        };
      case ContestRegistrationStatus.CanRegister:
        return {
          icon: null,
          text: '',
          bgColor: '',
          textColor: '',
          canRegister: true,
          showButton: true,
          buttonText: m.available_contest_register(),
          buttonVariant: 'default' as const
        };
      default:
        return {
          icon: null,
          text: '',
          bgColor: '',
          textColor: '',
          canRegister: false,
          showButton: false,
          buttonText: '',
          buttonVariant: 'default' as const
        };
    }
  });
</script>

<Card.Root
  class="group relative flex h-full flex-col overflow-hidden border-border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
  <!-- Gradient Background Overlay -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-[var(--secondary)]/5 to-[var(--primary)]/10 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
  ></div>

  <Card.Header class="relative">
    <div class="flex items-start justify-between gap-2">
      <div
        class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-md transition-transform duration-300 group-hover:scale-110"
      >
        <Trophy class="h-5 w-5 text-primary-foreground" />
      </div>
      <div
        class="flex items-center gap-1.5 rounded-full {config.bgColor} px-3 py-1 {config.textColor}"
      >
        {#if contest.status === ContestStatus.Ongoing}
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"
            ></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
        {/if}
        <span class="text-xs font-bold">{config.label}</span>
      </div>
    </div>
    <Card.Title class="mt-3 text-xl transition-colors group-hover:text-primary">
      {contest.name}
    </Card.Title>
  </Card.Header>

  <Card.Content class="relative mt-auto space-y-4">
    <!-- Duration Display -->
    <div class="space-y-2 rounded-lg border border-border bg-card p-3">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar class="h-4 w-4 text-primary" />
        <span>{m.available_contest_duration()}</span>
      </div>
      <p class="text-sm font-semibold text-foreground">
        {startDate} - {endDate}
      </p>
    </div>

    <!-- Contest Info Grid -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Participants -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground"
            >{m.available_contest_participants()}</span
          >
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">{contest.participantCount}</p>
      </div>

      <!-- Tasks -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <ListTodo class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground"
            >{m.available_contest_tasks()}</span
          >
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">{contest.taskCount}</p>
      </div>
    </div>

    <!-- Registration Status & Action Buttons -->
    <!-- Action Button -->
    {#if registrationConfig.showButton}
      {#if registrationConfig.canRegister}
        <Button
          class="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          onclick={() => onRegister?.(contest.id)}
          disabled={isRegistering}
        >
          {#if isRegistering}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
            {m.available_contest_registering()}
          {:else}
            {registrationConfig.buttonText}
          {/if}
        </Button>
      {:else}
        <Button
          variant={registrationConfig.buttonVariant}
          class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          onclick={() => onViewContest?.(contest.id)}
        >
          {#if registrationConfig.buttonText === m.available_contest_view_results()}
            <Eye class="mr-2 h-4 w-4" />
          {/if}
          {registrationConfig.buttonText}
        </Button>
      {/if}
    {:else if contest.registrationStatus === ContestRegistrationStatus.AwaitingApproval}
      <!-- Information text for awaiting approval -->
      <div class="rounded-lg border border-border bg-secondary/10 p-3 text-center">
        <p class="text-xs text-secondary-foreground">
          {m.available_contest_pending_review()}
        </p>
      </div>
    {:else if contest.registrationStatus === ContestRegistrationStatus.RegistrationClosed && contest.status !== 'past'}
      <!-- Information text for closed registration -->
      <div class="rounded-lg border border-border bg-destructive/10 p-3 text-center">
        <p class="text-xs text-destructive">{m.available_contest_registration_closed_msg()}</p>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
