<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { m } from '$lib/paraglide/messages.js';
  import { enhance } from '$app/forms';
</script>

<div class="container mx-auto px-4 py-8">
  <div class="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
    <h2 class="mb-4 text-2xl font-semibold">Welcome to MaxIT Dashboard!</h2>
    <p class="text-muted-foreground">
      You are now logged in. This area is protected and requires authentication.
    </p>
  </div>

  <div class="mt-4 mb-8 flex items-center justify-between">
    <h1 class="text-3xl font-bold">{m.header_dashboard()}</h1>
    <form method="POST" action="?/logout" use:enhance>
      <Button type="submit" variant="outline">Logout</Button>
    </form>
  </div>
</div>
