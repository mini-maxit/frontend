<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import Users from '@lucide/svelte/icons/users';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';

  const groups = [
    {
      name: 'Data Structures & Algorithms',
      members: 45,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Advanced Programming Techniques',
      members: 32,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Web Development Fundamentals',
      members: 58,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Machine Learning Basics',
      members: 28,
      color: 'from-orange-500 to-orange-600'
    }
  ];
</script>

<Card.Root class="shadow-lg transition-all duration-300 hover:shadow-xl">
  <Card.Header>
    <Card.Title class="flex items-center gap-2 text-2xl">
      <Users class="h-6 w-6 text-primary" />
      Your Groups
    </Card.Title>
  </Card.Header>
  <Card.Content class="space-y-4">
    <div class="space-y-3">
      {#each groups as group}
        <div
          class="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r {group.color} opacity-5 transition-opacity duration-300 group-hover:opacity-10"
          ></div>

          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br {group.color} shadow-md transition-transform duration-300 group-hover:scale-110"
              >
                <Users class="h-6 w-6 text-white" />
              </div>
              <div>
                <h4
                  class="font-semibold text-foreground transition-colors group-hover:text-primary"
                >
                  {group.name}
                </h4>
                <p class="text-sm text-muted-foreground">
                  {group.members} members
                </p>
              </div>
            </div>

            <ArrowRight
              class="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
            />
          </div>
        </div>
      {/each}
    </div>

    <Button
      variant="outline"
      class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      View All Groups
    </Button>
  </Card.Content>
</Card.Root>
