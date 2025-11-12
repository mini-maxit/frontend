<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import Trophy from '@lucide/svelte/icons/trophy';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import FileText from '@lucide/svelte/icons/file-text';
  import Users from '@lucide/svelte/icons/users';

  const stats = [
    {
      icon: Trophy,
      label: 'Active Contests',
      value: '3',
      color: 'from-orange-500 to-red-600',
      description: 'Currently running'
    },
    {
      icon: ListTodo,
      label: 'Pending Tasks',
      value: '9',
      color: 'from-blue-500 to-blue-600',
      description: 'Need to complete'
    },
    {
      icon: FileText,
      label: 'Recent Submissions',
      value: '12',
      color: 'from-green-500 to-green-600',
      description: 'This week'
    },
    {
      icon: Users,
      label: 'Your Groups',
      value: '5',
      color: 'from-purple-500 to-purple-600',
      description: 'Member of'
    }
  ];
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
  {#each stats as stat}
    <Card.Root
      class="group relative overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br {stat.color} opacity-5 transition-opacity duration-300 group-hover:opacity-10"
      ></div>

      <Card.Content class="relative p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p class="mt-2 text-4xl font-bold text-foreground">{stat.value}</p>
            <p class="mt-1 text-xs text-muted-foreground">{stat.description}</p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br {stat.color} shadow-md transition-transform duration-300 group-hover:scale-110"
          >
            <stat.icon class="h-6 w-6 text-white" />
          </div>
        </div>

        <!-- Progress bar -->
        <div class="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            class="h-full origin-left scale-x-0 transform rounded-full bg-gradient-to-r {stat.color} transition-transform duration-500 group-hover:scale-x-100"
          ></div>
        </div>
      </Card.Content>
    </Card.Root>
  {/each}
</div>
