<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import Clock from '@lucide/svelte/icons/clock';
  import CircleDashed from '@lucide/svelte/icons/circle-dashed';

  const stats = [
    {
      icon: ListTodo,
      label: 'Total Tasks',
      value: '24',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: '15',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Clock,
      label: 'In Progress',
      value: '6',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: CircleDashed,
      label: 'Not Started',
      value: '3',
      color: 'from-gray-500 to-gray-600'
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
            <p class="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
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
