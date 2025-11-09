<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import Clock from '@lucide/svelte/icons/clock';
  import Code from '@lucide/svelte/icons/code';

  const activities = [
    {
      taskName: 'Binary Search Tree Implementation',
      status: 'success',
      language: 'Python',
      date: '2 hours ago',
      score: '100/100'
    },
    {
      taskName: 'Dynamic Programming Challenge',
      status: 'failed',
      language: 'C++',
      date: '5 hours ago',
      score: '45/100'
    },
    {
      taskName: 'Graph Traversal Algorithm',
      status: 'success',
      language: 'Java',
      date: '1 day ago',
      score: '95/100'
    },
    {
      taskName: 'String Manipulation Task',
      status: 'success',
      language: 'JavaScript',
      date: '2 days ago',
      score: '100/100'
    },
    {
      taskName: 'Sorting Algorithm Optimization',
      status: 'failed',
      language: 'Python',
      date: '3 days ago',
      score: '60/100'
    }
  ];
</script>

<Card.Root class="shadow-lg transition-all duration-300 hover:shadow-xl">
  <Card.Header>
    <Card.Title class="flex items-center gap-2 text-2xl">
      <Clock class="h-6 w-6 text-primary" />
      Recent Activity
    </Card.Title>
  </Card.Header>
  <Card.Content>
    <div class="max-h-96 space-y-4 overflow-y-auto pr-2">
      {#each activities as activity, index}
        <div
          class="group relative rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-accent hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-2">
                <h4
                  class="font-semibold text-foreground transition-colors group-hover:text-primary"
                >
                  {activity.taskName}
                </h4>
              </div>

              <div class="flex flex-wrap items-center gap-3 text-sm">
                <!-- Language Badge -->
                <div class="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
                  <Code class="h-3 w-3 text-primary" />
                  <span class="text-primary">{activity.language}</span>
                </div>

                <!-- Score -->
                <span class="font-medium text-muted-foreground">{activity.score}</span>

                <!-- Date -->
                <span class="text-muted-foreground">{activity.date}</span>
              </div>
            </div>

            <!-- Status Icon -->
            <div class="flex-shrink-0">
              {#if activity.status === 'success'}
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 transition-transform duration-300 group-hover:scale-110"
                >
                  <CheckCircle class="h-5 w-5 text-green-500" />
                </div>
              {:else}
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 transition-transform duration-300 group-hover:scale-110"
                >
                  <XCircle class="h-5 w-5 text-red-500" />
                </div>
              {/if}
            </div>
          </div>
        </div>

        {#if index < activities.length - 1}
          <Separator class="my-2" />
        {/if}
      {/each}
    </div>
  </Card.Content>
</Card.Root>
