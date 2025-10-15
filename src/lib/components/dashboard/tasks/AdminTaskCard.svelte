<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import FileText from '@lucide/svelte/icons/file-text';
  import Calendar from '@lucide/svelte/icons/calendar';
  import User from '@lucide/svelte/icons/user';
  import Clock from '@lucide/svelte/icons/clock';
  import type { Task } from '$lib/dto/task';
  import * as m from '$lib/paraglide/messages';

  interface AdminTaskCardProps {
    task: Task;
  }

  let { task }: AdminTaskCardProps = $props();

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
</script>

<Card.Root
  class="group relative flex h-full flex-col overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
>
  <!-- Gradient Background Overlay -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-5 transition-opacity duration-300 group-hover:opacity-10"
  ></div>

  <Card.Header class="relative">
    <div class="flex items-start justify-between gap-2">
      <span
        class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary"
      >
        {m.admin_tasks_card_id_prefix()}{task.id}
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
    <!-- Task Metadata -->
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-sm">
        <Calendar class="h-4 w-4 text-muted-foreground" />
        <span class="text-muted-foreground">{m.admin_tasks_card_created()}</span>
        <span class="font-medium text-foreground">{formatDate(task.createdAt)}</span>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <Clock class="h-4 w-4 text-muted-foreground" />
        <span class="text-muted-foreground">{m.admin_tasks_card_updated()}</span>
        <span class="font-medium text-foreground">{formatDate(task.updatedAt)}</span>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <User class="h-4 w-4 text-muted-foreground" />
        <span class="text-muted-foreground">{m.admin_tasks_card_created_by()}</span>
        <span class="font-medium text-foreground"
          >{m.admin_tasks_card_user_prefix()}{task.createdBy}</span
        >
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <Button
        variant="outline"
        class="flex-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      >
        {m.admin_tasks_card_view_details()}
      </Button>
      <Button
        variant="default"
        class="flex-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      >
        {m.admin_tasks_card_manage()}
      </Button>
    </div>
  </Card.Content>
</Card.Root>
