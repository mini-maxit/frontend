<script lang="ts">
  import { logout } from './logout.remote';
  import { Button } from '$lib/components/ui/button';
  import { m } from '$lib/paraglide/messages.js';
  import { toast } from 'svelte-sonner';
  import { isHttpError } from '@sveltejs/kit';
  import type { LayoutServerLoad } from './$types';

  let { data }: { data: LayoutServerLoad } = $props();
</script>

<div class="container mx-auto px-4 py-8">
  <div class="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
    <h2 class="mb-4 text-2xl font-semibold">Welcome to MaxIT Dashboard!</h2>
    <p class="text-muted-foreground">
      You are now logged in. This area is protected and requires authentication.
    </p>

    <div class="mt-6 space-y-2">
      <h3 class="text-xl font-semibold">User Information (from JWT)</h3>
      <div class="grid gap-2 text-sm">
        <div class="flex gap-2">
          <span class="font-medium">User ID:</span>
          <span class="text-muted-foreground">{data.user.userId}</span>
        </div>
        <div class="flex gap-2">
          <span class="font-medium">Role:</span>
          <span class="text-muted-foreground">{data.user.role}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-4 mb-8 flex items-center justify-between">
    <h1 class="text-3xl font-bold">{m.header_dashboard()}</h1>
    <form
      {...logout.enhance(async ({ submit }) => {
        try {
          await submit();
        } catch (error: { message?: string } | unknown) {
          if (isHttpError(error)) {
            toast.error(error.body.message);
          } else {
            toast.error(m.error_default_message());
          }
        }
      })}
    >
      <Button type="submit" variant="outline">Logout</Button>
    </form>
  </div>
</div>
