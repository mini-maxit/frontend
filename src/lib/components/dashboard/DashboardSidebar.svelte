<script lang="ts">
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
  } from '#lib/components/ui/sidebar/index.js';
  import { m } from '#lib/paraglide/messages.js';
  import { AppRoutes } from '#lib/routes.js';
  import { getLocale, setLocale, localizeHref } from '#lib/paraglide/runtime.js';
  import { page } from '$app/state';
  import MaxitLogo from '#lib/assets/MaxitLogo.svelte';
  import { UserRole } from '#lib/dto/jwt.js';

  // Lucide icons
  import FileText from '@lucide/svelte/icons/file-text';
  import Trophy from '@lucide/svelte/icons/trophy';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import UserCircle from '@lucide/svelte/icons/user-circle';
  import Users from '@lucide/svelte/icons/users';
  import Languages from '@lucide/svelte/icons/languages';
  import Code from '@lucide/svelte/icons/code';
  import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
  import Activity from '@lucide/svelte/icons/activity';
  import LogOut from '@lucide/svelte/icons/log-out';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import SidebarTrigger from '../ui/sidebar/sidebar-trigger.svelte';
  import { userStore } from '#lib/stores/user-store.svelte.js';
  import { getAuthInstance } from '#lib/services/index.js';
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { onMount } from 'svelte';

  const user = $derived(userStore.getUserUnsafe());
  const userMenuItems = [
    {
      title: () => m.sidebar_your_submissions(),
      href: localizeHref(AppRoutes.UserSubmissions),
      icon: FileText
    },
    {
      title: () => m.sidebar_your_contests(),
      href: localizeHref(AppRoutes.UserContests),
      icon: Trophy
    },
    {
      title: () => m.sidebar_your_tasks(),
      href: localizeHref(AppRoutes.UserTasks),
      icon: ListTodo
    }
  ];

  const teacherMenuItems = [
    {
      title: () => m.sidebar_admin_contests(),
      href: localizeHref(AppRoutes.TeacherContests),
      icon: Trophy
    },
    {
      title: () => m.sidebar_groups(),
      href: localizeHref(AppRoutes.TeacherGroups),
      icon: Users
    },
    {
      title: () => m.sidebar_admin_tasks(),
      href: localizeHref(AppRoutes.TeacherTasks),
      icon: ListTodo
    }
  ];

  const adminMenuItems = [
    {
      title: () => m.admin_contests_all_contests(),
      href: localizeHref(`${AppRoutes.TeacherContests}?scope=all`),
      icon: Trophy
    },
    {
      title: () => m.admin_tasks_all_tasks(),
      href: localizeHref(`${AppRoutes.TeacherTasks}?scope=all`),
      icon: ListTodo
    },
    {
      title: () => m.sidebar_admin_monitoring(),
      href: localizeHref(AppRoutes.AdminWorkerMonitoring),
      icon: Activity
    },
    {
      title: () => m.sidebar_admin_users(),
      href: localizeHref(AppRoutes.AdminUsers),
      icon: Users
    },
    {
      title: () => m.sidebar_admin_languages(),
      href: localizeHref(AppRoutes.AdminLanguages),
      icon: Code
    }
  ];

  // Compare scope too, so "Contests" and admin "All Contests" (?scope=all) aren't both active;
  // other query params (pagination, sort) must not affect highlighting
  function isActive(href: string): boolean {
    const target = new URL(href, page.url.origin);
    return (
      page.url.pathname === target.pathname &&
      page.url.searchParams.get('scope') === target.searchParams.get('scope')
    );
  }

  const currentLang = $derived(getLocale());

  type MenuItem = { title: () => string; href: string; icon: typeof Trophy };

  const COLLAPSED_STORAGE_KEY = 'sidebar-collapsed';

  // Admin starts folded; the user's saved choice is applied on mount (SSR can't read localStorage)
  const collapsed = $state<Record<string, boolean>>({ admin: true });

  onMount(() => {
    try {
      Object.assign(collapsed, JSON.parse(localStorage.getItem(COLLAPSED_STORAGE_KEY) ?? '{}'));
    } catch {
      // unreadable or blocked storage: keep defaults
    }
    // Never hide the link for the page we landed on (not saved, so the preference is kept)
    const groups = {
      admin: adminMenuItems,
      teacher: teacherMenuItems,
      user: userMenuItems
    };
    for (const [key, items] of Object.entries(groups)) {
      if (items.some((item) => isActive(item.href))) collapsed[key] = false;
    }
  });

  function toggleGroup(key: string) {
    collapsed[key] = !collapsed[key];
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, JSON.stringify(collapsed));
    } catch {
      // storage unavailable (private mode etc.): folding still works for this session
    }
  }
</script>

{#snippet menuGroup(key: string, label: string, items: MenuItem[])}
  <SidebarGroup>
    <SidebarGroupLabel>
      {#snippet child({ props })}
        <button
          type="button"
          {...props}
          class="{props.class} w-full cursor-pointer justify-between hover:text-sidebar-primary-foreground"
          aria-expanded={!collapsed[key]}
          aria-controls="sidebar-group-{key}"
          onclick={() => toggleGroup(key)}
        >
          <span>{label}</span>
          <ChevronRight class="transition-transform {collapsed[key] ? '' : 'rotate-90'}" />
        </button>
      {/snippet}
    </SidebarGroupLabel>
    {#if !collapsed[key]}
      <SidebarMenu id="sidebar-group-{key}">
        {#each items as item (item.href)}
          <SidebarMenuItem>
            <SidebarMenuButton isActive={isActive(item.href)}>
              {#snippet child({ props })}
                <a href={item.href} {...props}>
                  <item.icon />
                  <span>{item.title()}</span>
                </a>
              {/snippet}
            </SidebarMenuButton>
          </SidebarMenuItem>
        {/each}
      </SidebarMenu>
    {/if}
  </SidebarGroup>
{/snippet}

<Sidebar>
  <SidebarHeader>
    <div class="flex items-center justify-center px-2 py-4">
      <MaxitLogo width={120} height={120} primaryColor={false} />
    </div>
    <SidebarTrigger class="absolute right-4" />
    <div class="flex items-center justify-between border-t px-2 py-2">
      <div class="flex items-center gap-2">
        <Languages class="h-4 w-4" />
        <span class="pointer-events-none text-sm font-medium">Language</span>
      </div>
      <div class="flex gap-1">
        <SidebarMenuButton
          size="sm"
          isActive={currentLang === 'en'}
          onclick={() => setLocale('en')}
          class="h-7 px-3"
        >
          EN
        </SidebarMenuButton>
        <SidebarMenuButton
          size="sm"
          isActive={currentLang === 'pl'}
          onclick={() => setLocale('pl')}
          class="h-7 px-3"
        >
          PL
        </SidebarMenuButton>
      </div>
    </div>

    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={isActive(localizeHref(AppRoutes.Dashboard))}>
          {#snippet child({ props })}
            <a href={localizeHref(AppRoutes.Dashboard)} {...props}>
              <LayoutDashboard />
              <span>{m.sidebar_dashboard()}</span>
            </a>
          {/snippet}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>

  <SidebarContent>
    {#if user.role === UserRole.Admin}
      {@render menuGroup('admin', m.sidebar_admin(), adminMenuItems)}
    {/if}

    {#if user.role === UserRole.Teacher || user.role === UserRole.Admin}
      {@render menuGroup('teacher', m.sidebar_teacher(), teacherMenuItems)}
    {/if}

    {@render menuGroup('user', m.sidebar_your_section(), userMenuItems)}
  </SidebarContent>

  <!-- Footer with Profile Link -->
  <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={isActive(localizeHref(AppRoutes.UserProfile))}>
          {#snippet child({ props })}
            <a href={localizeHref(AppRoutes.UserProfile)} {...props}>
              <UserCircle />
              <span>{m.sidebar_profile()}</span>
            </a>
          {/snippet}
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
          {#snippet child({ props })}
            <button
              type="button"
              {...props}
              onclick={async () => {
                if (!browser) return;
                const authService = getAuthInstance();
                if (authService) {
                  await authService.logout();
                  goto(AppRoutes.Login);
                }
              }}
            >
              <LogOut />
              <span>{m.sidebar_logout()}</span>
            </button>
          {/snippet}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
</Sidebar>
