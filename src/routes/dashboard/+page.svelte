<script lang="ts">
  import StudentHome from '#lib/components/dashboard/home/StudentHome.svelte';
  import TeacherHome from '#lib/components/dashboard/home/TeacherHome.svelte';
  import AdminHome from '#lib/components/dashboard/home/AdminHome.svelte';
  import { userStore } from '#lib/stores/user-store.svelte.js';
  import { UserRole } from '#lib/dto/jwt.js';
  import * as m from '#lib/paraglide/messages.js';
  import { getLocale } from '#lib/paraglide/runtime.js';

  // User is already fetched by dashboard layout, just read from store
  const user = $derived(userStore.getUserUnsafe());

  const dateString = new Date().toLocaleDateString(getLocale(), {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
</script>

<div class="mx-auto w-full max-w-7xl px-0 py-4 sm:px-2 lg:py-8">
  <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
    <h1 class="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
      {m.home_greeting({ name: user.name })}
    </h1>
    <p class="text-sm text-muted-foreground first-letter:uppercase">{dateString}</p>
  </div>

  <div class="mt-2">
    {#if user.role === UserRole.Admin}
      <AdminHome />
    {:else if user.role === UserRole.Teacher}
      <TeacherHome />
    {:else}
      <StudentHome />
    {/if}
  </div>
</div>
