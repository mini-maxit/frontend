<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { AppRoutes } from '$lib/routes';
  import { localizeHref } from '$lib/paraglide/runtime';
  import Code from '@lucide/svelte/icons/code';
  import Trophy from '@lucide/svelte/icons/trophy';
  import BarChart from '@lucide/svelte/icons/bar-chart';
  import Search from '@lucide/svelte/icons/search';
  import Users from '@lucide/svelte/icons/users';
  import User from '@lucide/svelte/icons/user';

  const quickActions = [
    {
      icon: Code,
      title: 'Solve a Task',
      description: 'Start coding now',
      href: localizeHref(AppRoutes.AvailableTasks),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Trophy,
      title: 'Join a Contest',
      description: 'Compete with others',
      href: localizeHref(AppRoutes.AvailableContests),
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: BarChart,
      title: 'View Progress',
      description: 'Check your stats',
      href: localizeHref(AppRoutes.UserProfile),
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Search,
      title: 'Browse Tasks',
      description: 'Explore challenges',
      href: localizeHref(AppRoutes.AvailableTasks),
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'My Groups',
      description: 'View your groups',
      href: localizeHref(AppRoutes.UserGroups),
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: User,
      title: 'Profile',
      description: 'Manage account',
      href: localizeHref(AppRoutes.UserProfile),
      color: 'from-indigo-500 to-indigo-600'
    }
  ];
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#each quickActions as action}
    <a href={action.href}>
      <button
        class="group relative w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br {action.color} p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        ></div>

        <div class="relative flex items-start gap-4">
          <div
            class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
          >
            <action.icon class="h-7 w-7 text-white" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-white">{action.title}</h3>
            <p class="mt-1 text-sm text-white/80">{action.description}</p>
          </div>
        </div>
      </button>
    </a>
  {/each}
</div>
