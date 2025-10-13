<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import Users from '@lucide/svelte/icons/users';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import FileText from '@lucide/svelte/icons/file-text';
  import Eye from '@lucide/svelte/icons/eye';
  import ClipboardList from '@lucide/svelte/icons/clipboard-list';

  interface GroupCardProps {
    name: string;
    memberCount: number;
    activeTasks: number;
    recentSubmissions: number;
    color: string;
  }

  let { name, memberCount, activeTasks, recentSubmissions, color }: GroupCardProps = $props();
</script>

<Card.Root
  class="group relative flex h-full flex-col overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
>
  <!-- Gradient Background Overlay -->
  <div
    class="absolute inset-0 bg-gradient-to-br {color} opacity-5 transition-opacity duration-300 group-hover:opacity-10"
  ></div>

  <Card.Header class="relative">
    <div class="flex items-start gap-3">
      <div
        class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br {color} shadow-md transition-transform duration-300 group-hover:scale-110"
      >
        <Users class="h-6 w-6 text-white" />
      </div>
      <div class="min-w-0 flex-1">
        <Card.Title class="text-lg transition-colors group-hover:text-primary">
          {name}
        </Card.Title>
        <p class="mt-1 text-sm text-muted-foreground">{memberCount} members</p>
      </div>
    </div>
  </Card.Header>

  <Card.Content class="relative mt-auto space-y-4">
    <!-- Quick Stats -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Active Tasks -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <ListTodo class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground">Active Tasks</span>
        </div>
        <p class="mt-1 text-xl font-bold text-foreground">{activeTasks}</p>
      </div>

      <!-- Recent Submissions -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <FileText class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground">Submissions</span>
        </div>
        <p class="mt-1 text-xl font-bold text-foreground">{recentSubmissions}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-2 pt-2">
      <Button
        variant="outline"
        class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      >
        <Eye class="mr-2 h-4 w-4" />
        View Group
      </Button>
      <Button
        variant="default"
        class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      >
        <ClipboardList class="mr-2 h-4 w-4" />
        View Tasks
      </Button>
    </div>
  </Card.Content>
</Card.Root>
