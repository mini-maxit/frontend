<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Calendar from '@lucide/svelte/icons/calendar';
  import User from '@lucide/svelte/icons/user';
  import Clock from '@lucide/svelte/icons/clock';
  import Users from '@lucide/svelte/icons/users';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import UserCheck from '@lucide/svelte/icons/user-check';
  import type { Contest } from '$lib/dto/contest';
  import * as m from '$lib/paraglide/messages';
  import { localizeHref } from '$lib/paraglide/runtime';
  import { formatDate } from '$lib/utils';
  import { AppRoutes } from '$lib/routes';

  interface AdminContestCardProps {
    contest: Contest;
  }

  let { contest }: AdminContestCardProps = $props();

  const statusColors = {
    ongoing: 'bg-primary/10 text-primary',
    upcoming: 'bg-secondary/10 text-secondary-foreground',
    past: 'bg-muted text-muted-foreground'
  };

  const statusColor = $derived(statusColors[contest.status] || statusColors.past);
  const contestDetailsUrl = $derived(localizeHref(`${AppRoutes.AdminContests}/${contest.id}`));
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
      <span
        class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary"
      >
        #{contest.id}
      </span>
      <span
        class="inline-flex items-center rounded-full {statusColor} px-2.5 py-0.5 text-xs font-bold"
      >
        {contest.status}
      </span>
    </div>
    <Card.Title
      class="mt-3 flex items-start gap-2 text-lg transition-colors group-hover:text-primary"
    >
      <Trophy class="mt-0.5 h-5 w-5 flex-shrink-0" />
      <a href={contestDetailsUrl} class="break-words hover:underline">{contest.name}</a>
    </Card.Title>
    <p class="mt-2 line-clamp-2 text-sm text-muted-foreground">{contest.description}</p>
  </Card.Header>

  <Card.Content class="relative mt-auto space-y-4">
    <!-- Contest Dates -->
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-sm">
        <Calendar class="h-4 w-4 text-muted-foreground" />
        <span class="text-muted-foreground">{m.admin_contests_card_start()}</span>
        <span class="font-medium text-foreground">{formatDate(contest.startAt)}</span>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <Calendar class="h-4 w-4 text-muted-foreground" />
        <span class="text-muted-foreground">{m.admin_contests_card_end()}</span>
        <span class="font-medium text-foreground">{formatDate(contest.endAt)}</span>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <Clock class="h-4 w-4 text-muted-foreground" />
        <span class="text-muted-foreground">{m.admin_contests_card_created()}</span>
        <span class="font-medium text-foreground">{formatDate(contest.createdAt)}</span>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <User class="h-4 w-4 text-muted-foreground" />
        <span class="text-muted-foreground">{m.admin_contests_card_created_by()}</span>
        <span class="font-medium text-foreground"
          >{m.admin_contests_card_user_prefix()}{contest.createdBy}</span
        >
      </div>
    </div>

    <!-- Contest Stats -->
    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground"
            >{m.admin_contests_card_participants()}</span
          >
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">{contest.participantCount}</p>
      </div>

      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <ListTodo class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground"
            >{m.admin_contests_card_tasks()}</span
          >
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">{contest.taskCount}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-2">
      <Button
        variant="outline"
        class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        href={contestDetailsUrl}
      >
        {m.admin_contests_card_view_details()}
      </Button>
      <Button
        variant="default"
        class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        href={localizeHref(`${AppRoutes.AdminContests}/${contest.id}/tasks`)}
      >
        <ListTodo class="mr-2 h-4 w-4" />
        {m.admin_contests_card_manage_tasks()}
      </Button>
      <Button
        variant="default"
        class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        href={localizeHref(`${AppRoutes.AdminContests}/${contest.id}/registration-requests`)}
      >
        <UserCheck class="mr-2 h-4 w-4" />
        {m.admin_contests_card_view_requests()}
      </Button>
    </div>
  </Card.Content>
</Card.Root>
