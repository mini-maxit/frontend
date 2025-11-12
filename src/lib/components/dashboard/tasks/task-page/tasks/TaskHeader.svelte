<script lang="ts">
  import FileText from '@lucide/svelte/icons/file-text';
  import User from '@lucide/svelte/icons/user';
  import Calendar from '@lucide/svelte/icons/calendar';
  import * as m from '$lib/paraglide/messages';
  import { getLocale } from '$lib/paraglide/runtime';
  import { formatDate } from '$lib/utils';

  interface Props {
    id: number;
    title: string;
    createdByName: string;
    createdAt: string;
  }

  let { id, title, createdByName, createdAt }: Props = $props();
</script>

<div class="space-y-4">
  <div class="flex items-start justify-between">
    <div class="space-y-2">
      <h1 class="flex items-center gap-3 text-3xl font-bold text-foreground">
        <span
          class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary"
        >
          {m.task_badge_prefix()}{id}
        </span>
        <FileText class="h-8 w-8" />
        {title}
      </h1>
    </div>
  </div>

  <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
    <div class="flex items-center gap-2">
      <User class="h-4 w-4" />
      <span>{m.task_created_by()} <strong>{createdByName}</strong></span>
    </div>
    <div class="flex items-center gap-2">
      <Calendar class="h-4 w-4" />
      <span>{formatDate(createdAt)}</span>
    </div>
  </div>
</div>
