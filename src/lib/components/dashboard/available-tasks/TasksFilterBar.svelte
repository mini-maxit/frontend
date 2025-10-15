<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import Search from '@lucide/svelte/icons/search';

  let searchQuery = $state('');
  let difficultyFilter = $state<'all' | 'easy' | 'medium' | 'hard'>('all');
  let statusFilter = $state<'all' | 'solved' | 'attempted' | 'not-attempted'>('all');

  const difficultyButtons = [
    { value: 'all' as const, label: 'All' },
    { value: 'easy' as const, label: 'Easy' },
    { value: 'medium' as const, label: 'Medium' },
    { value: 'hard' as const, label: 'Hard' }
  ];

  const statusButtons = [
    { value: 'all' as const, label: 'All' },
    { value: 'solved' as const, label: 'Solved' },
    { value: 'attempted' as const, label: 'Attempted' },
    { value: 'not-attempted' as const, label: 'Not Attempted' }
  ];
</script>

<div class="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
  <!-- Search Bar -->
  <div class="relative">
    <Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input type="text" placeholder="Search tasks..." bind:value={searchQuery} class="pl-10" />
  </div>

  <!-- Filters -->
  <div class="grid gap-4 sm:grid-cols-2">
    <!-- Difficulty Filter -->
    <div class="space-y-2">
      <p class="text-sm font-medium text-foreground">Difficulty</p>
      <div class="flex flex-wrap gap-2">
        {#each difficultyButtons as button}
          <Button
            variant={difficultyFilter === button.value ? 'default' : 'outline'}
            size="sm"
            onclick={() => (difficultyFilter = button.value)}
            class="transition-all duration-300"
          >
            {button.label}
          </Button>
        {/each}
      </div>
    </div>

    <!-- Status Filter -->
    <div class="space-y-2">
      <p class="text-sm font-medium text-foreground">Status</p>
      <div class="flex flex-wrap gap-2">
        {#each statusButtons as button}
          <Button
            variant={statusFilter === button.value ? 'default' : 'outline'}
            size="sm"
            onclick={() => (statusFilter = button.value)}
            class="transition-all duration-300"
          >
            {button.label}
          </Button>
        {/each}
      </div>
    </div>
  </div>
</div>
