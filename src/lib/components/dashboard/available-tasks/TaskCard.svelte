<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import Calendar from '@lucide/svelte/icons/calendar';
  import Code from '@lucide/svelte/icons/code';
  import type { Task } from '$lib/dto/task';
  import * as m from '$lib/paraglide/messages';
  import { formatDate } from '$lib/utils';

  interface Props {
    task: Task;
  }

  let { task }: Props = $props();
</script>

<Card.Root
  class="group relative flex h-full flex-col overflow-hidden border-border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
  <div
    class="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-[var(--secondary)]/5 to-[var(--primary)]/10 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
  ></div>

  <Card.Header class="relative">
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2">
        <Code class="h-5 w-5 text-primary" />
        <span class="text-xs font-medium text-muted-foreground">
          {m.task_badge_prefix()}{task.id}
        </span>
      </div>
    </div>

    <Card.Title class="mt-2 line-clamp-2 text-xl font-bold">
      {task.title}
    </Card.Title>
  </Card.Header>

  <Card.Content class="relative flex-1 space-y-4">
    <div class="flex items-center gap-2 text-sm text-muted-foreground">
      <Calendar class="h-4 w-4" />
      <span>{m.tasks_card_created()}</span>
      <span class="font-medium text-foreground">{formatDate(task.createdAt)}</span>
    </div>
  </Card.Content>

  <Card.Footer class="relative">
    <Button href="/dashboard/tasks/{task.id}" class="w-full" variant="default">
      {m.tasks_card_view()}
    </Button>
  </Card.Footer>
</Card.Root>
