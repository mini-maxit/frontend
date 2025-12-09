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
  } from '$lib/components/ui/sidebar';
  import { m } from '$lib/paraglide/messages.js';
  import { AppRoutes } from '$lib/routes.js';
  import { getLocale, setLocale, localizeHref } from '$lib/paraglide/runtime';
  import { page } from '$app/state';
  import MaxitLogo from '$lib/assets/MaxitLogo.svelte';
  import { UserRole } from '$lib/dto/jwt';

  // Lucide icons
  import FileText from '@lucide/svelte/icons/file-text';
  import Trophy from '@lucide/svelte/icons/trophy';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import Globe from '@lucide/svelte/icons/globe';
  import UserCircle from '@lucide/svelte/icons/user-circle';
  import Users from '@lucide/svelte/icons/users';
  import Languages from '@lucide/svelte/icons/languages';
  import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
  import Activity from '@lucide/svelte/icons/activity';
  import LogOut from '@lucide/svelte/icons/log-out';
  import SidebarTrigger from '../ui/sidebar/sidebar-trigger.svelte';
  import { userStore } from '$lib/stores/user-store.svelte';
  import { getClientAuthInstance } from '$lib/services';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

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

  const publicMenuItems = [
    {
      title: () => m.sidebar_available_contests(),
      href: localizeHref(AppRoutes.AvailableContests),
      icon: Trophy
    },
    {
      title: () => m.sidebar_available_tasks(),
      href: localizeHref(AppRoutes.AvailableTasks),
      icon: Globe
    }
  ];

  const teacherMenuItems = [
    {
      title: () => m.sidebar_admin_contests(),
      href: localizeHref(AppRoutes.TeacherContests),
      icon: Trophy
    },
    {
      title: () => m.sidebar_admin_tasks(),
      href: localizeHref(AppRoutes.TeacherTasks),
      icon: ListTodo
    }
  ];

  const adminMenuItems = [
    {
      title: () => m.sidebar_admin_monitoring(),
      href: localizeHref(AppRoutes.Admin),
      icon: Activity
    },
    {
      title: () => m.sidebar_admin_users(),
      href: localizeHref(AppRoutes.AdminUsers),
      icon: Users
    }
  ];

  function isActive(href: string): boolean {
    return page.url.pathname === href;
  }

  const currentLang = $derived(getLocale());
</script>

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
    <!-- Admin Dashboard Section -->
    {#if user.role === UserRole.Admin}
      <SidebarGroup>
        <SidebarGroupLabel>{m.sidebar_admin()}</SidebarGroupLabel>
        <SidebarMenu>
          {#each adminMenuItems as item (item.href)}
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
      </SidebarGroup>
    {/if}

    {#if user.role === UserRole.Teacher || user.role === UserRole.Admin}
      <SidebarGroup>
        <SidebarGroupLabel>{m.sidebar_teacher()}</SidebarGroupLabel>
        <SidebarMenu>
          {#each teacherMenuItems as item (item.href)}
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
      </SidebarGroup>
    {/if}

    <!-- User Activity Section -->
    <SidebarGroup>
      <SidebarGroupLabel>{m.sidebar_your_section()}</SidebarGroupLabel>
      <SidebarMenu>
        {#each userMenuItems as item (item.href)}
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
    </SidebarGroup>

    <!-- Public Section -->
    <SidebarGroup>
      <SidebarGroupLabel>{m.sidebar_public_section()}</SidebarGroupLabel>
      <SidebarMenu>
        {#each publicMenuItems as item (item.href)}
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
    </SidebarGroup>
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
                const authService = getClientAuthInstance();
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
