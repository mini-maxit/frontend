<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import UserCircle from '@lucide/svelte/icons/user-circle';
  import Mail from '@lucide/svelte/icons/mail';
  import AtSign from '@lucide/svelte/icons/at-sign';
  import Calendar from '@lucide/svelte/icons/calendar';
</script>

<Card.Root class="shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
  <Card.Header>
    <Card.Title class="text-2xl">User Information</Card.Title>
  </Card.Header>
  <Card.Content class="space-y-6">
    <!-- Avatar Section -->
    <div class="flex justify-center">
      <div
        class="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg transition-transform duration-300 hover:scale-105"
      >
        <UserCircle class="h-20 w-20 text-primary-foreground" />
      </div>
    </div>

    <!-- User Details -->
    <div class="space-y-4">
      <div class="text-center">
        <h3 class="text-2xl font-bold text-foreground">John Doe</h3>
        <div
          class="mt-2 inline-block rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1 text-sm font-medium text-primary-foreground shadow-md"
        >
          Student
        </div>
      </div>

      <div class="space-y-3 pt-4">
        <!-- Email -->
        <div
          class="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
        >
          <Mail class="h-5 w-5 text-primary" />
          <span class="text-sm text-muted-foreground">john.doe@university.edu</span>
        </div>

        <!-- Username -->
        <div
          class="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
        >
          <AtSign class="h-5 w-5 text-primary" />
          <span class="text-sm text-muted-foreground">@johndoe</span>
        </div>

        <!-- Join Date -->
        <div
          class="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
        >
          <Calendar class="h-5 w-5 text-primary" />
          <span class="text-sm text-muted-foreground">Joined September 2024</span>
        </div>
      </div>
    </div>
  </Card.Content>
</Card.Root>
