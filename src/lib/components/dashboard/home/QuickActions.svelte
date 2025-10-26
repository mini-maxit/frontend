<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { AppRoutes } from '$lib/routes';
  import { localizeHref } from '$lib/paraglide/runtime';
  import Code from '@lucide/svelte/icons/code';
  import Trophy from '@lucide/svelte/icons/trophy';
  import BarChart from '@lucide/svelte/icons/bar-chart';
  import Users from '@lucide/svelte/icons/users';
  import User from '@lucide/svelte/icons/user';
  import FileText from '@lucide/svelte/icons/file-text';
  import * as m from '$lib/paraglide/messages';

  const quickActions = [
    {
      icon: Code,
      title: m.quick_actions_solve_task(),
      description: m.quick_actions_solve_task_description(),
      href: localizeHref(AppRoutes.AvailableTasks)
    },
    {
      icon: Trophy,
      title: m.quick_actions_join_contest(),
      description: m.quick_actions_join_contest_description(),
      href: localizeHref(AppRoutes.AvailableContests)
    },
    {
      icon: FileText,
      title: m.quick_actions_my_submissions(),
      description: m.quick_actions_my_submissions_description(),
      href: localizeHref(AppRoutes.UserSubmissions)
    },
    {
      icon: Users,
      title: m.quick_actions_my_groups(),
      description: m.quick_actions_my_groups_description(),
      href: localizeHref(AppRoutes.UserGroups)
    },
    {
      icon: BarChart,
      title: m.quick_actions_my_contests(),
      description: m.quick_actions_my_contests_description(),
      href: localizeHref(AppRoutes.UserContests)
    },
    {
      icon: User,
      title: m.quick_actions_profile(),
      description: m.quick_actions_profile_description(),
      href: localizeHref(AppRoutes.UserProfile)
    }
  ];
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each quickActions as action}
    <a href={action.href} class="group flex">
      <Card.Root
        class="flex w-full flex-col transition-all hover:border-primary/50 hover:shadow-lg"
      >
        <Card.Content class="flex flex-1 items-start gap-4 py-6">
          <div
            class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <action.icon class="h-6 w-6" />
          </div>
          <div class="flex-1 space-y-1">
            <h3 class="leading-none font-semibold tracking-tight">{action.title}</h3>
            <p class="text-sm text-muted-foreground">{action.description}</p>
          </div>
        </Card.Content>
      </Card.Root>
    </a>
  {/each}
</div>
