<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import FileText from '@lucide/svelte/icons/file-text';
  import Calendar from '@lucide/svelte/icons/calendar';
  import type { Task } from '$lib/dto/task';
  import { formatDate } from '$lib/utils';
  import { localizeHref } from '$lib/paraglide/runtime';
  import { AppRoutes } from '$lib/routes';
  import * as m from '$lib/paraglide/messages';

  interface BasicTaskCardProps {
    task: Task;
  }

  let { task }: BasicTaskCardProps = $props();
</script>

<Card.Root
  class="group relative flex h-full flex-col overflow-hidden border-border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
  <div
    class="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-primary/10 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
  ></div>

  <Card.Header class="relative">
    <div class="flex items-start justify-between gap-2">
      <span
        class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary"
      >
        #{task.id}
      </span>
    </div>
    <Card.Title
      class="mt-3 flex items-start gap-2 text-lg transition-colors group-hover:text-primary"
    >
      <FileText class="mt-0.5 h-5 w-5 flex-shrink-0" />
      <span class="break-words">{task.title}</span>
    </Card.Title>
  </Card.Header>

  <Card.Content class="relative mt-auto space-y-4">
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-sm">
        <Calendar class="h-4 w-4 text-muted-foreground" />
        <span class="text-muted-foreground">{m.admin_tasks_card_created()}</span>
        <span class="font-medium text-foreground">{formatDate(task.createdAt)}</span>
      </div>
    </div>

    <Button
      variant="default"
      href={localizeHref(`${AppRoutes.TaskDetails}${task.id}`)}
      class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {m.admin_tasks_card_view_details()}
    </Button>
  </Card.Content>
</Card.Root>
