<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { showApiError } from '$lib/errors/backend-error';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Dialog from '$lib/components/ui/dialog';
  import UserPlus from '@lucide/svelte/icons/user-plus';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { SvelteSet } from 'svelte/reactivity';
  import type { User } from '$lib/dto/user';
  import { getContestsManagementInstance } from '$lib/services';

  interface Props {
    contestId: number;
    assignableUsers: User[];
    onSuccess?: () => void;
  }

  let { contestId, assignableUsers, onSuccess }: Props = $props();

  let dialogOpen = $state(false);
  let searchQuery = $state('');
  let selectedUserIds = new SvelteSet<number>();
  let submitting = $state(false);

  const contestsService = getContestsManagementInstance();

  let filteredUsers = $derived.by(() => {
    if (!searchQuery.trim()) return assignableUsers;
    const query = searchQuery.toLowerCase();
    return assignableUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        `${user.name} ${user.surname}`.toLowerCase().includes(query)
    );
  });

  function toggleUser(userId: number) {
    if (selectedUserIds.has(userId)) {
      selectedUserIds.delete(userId);
    } else {
      selectedUserIds.add(userId);
    }
  }

  async function handleSubmit() {
    if (!contestsService || selectedUserIds.size === 0) {
      toast.error(m.contest_participants_add_error());
      return;
    }

    submitting = true;
    try {
      await contestsService.addParticipantsToContest(contestId, Array.from(selectedUserIds));
      toast.success(m.contest_participants_add_success());
      dialogOpen = false;
      selectedUserIds.clear();
      searchQuery = '';
      if (onSuccess) onSuccess();
    } catch (error){
      console.error('Add participants to contest error:', error);
      showApiError(error, m.contest_participants_add_error());
    } finally {
      submitting = false;
    }
  }

  function resetForm() {
    selectedUserIds.clear();
    searchQuery = '';
  }
</script>

<Dialog.Root bind:open={dialogOpen} onOpenChange={(open) => !open && resetForm()}>
  <button
    onclick={() => (dialogOpen = true)}
    class="group relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-primary to-secondary p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div
      class="absolute inset-0 bg-linear-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    ></div>

    <div class="relative flex flex-col items-center gap-4 text-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
      >
        <UserPlus class="h-8 w-8 text-primary-foreground" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-primary-foreground">
          {m.contest_participants_add_title()}
        </h3>
        <p class="mt-1 text-sm text-primary-foreground/80">
          {m.contest_participants_add_description()}
        </p>
      </div>
    </div>
  </button>

  <Dialog.Content class="max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>{m.contest_participants_add_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.contest_participants_add_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-4">
      <!-- Search -->
      <div class="space-y-2">
        <Label for="search">{m.contest_participants_add_search_label()}</Label>
        <Input
          id="search"
          type="text"
          bind:value={searchQuery}
          placeholder={m.contest_participants_add_search_placeholder()}
          class="transition-all duration-200 focus:ring-2 focus:ring-primary"
        />
      </div>

      <!-- Selected Count -->
      <div class="flex items-center justify-end">
        <span class="text-sm text-muted-foreground">
          {m.contest_participants_add_selected_count({
            count: selectedUserIds.size.toString()
          })}
        </span>
      </div>

      <!-- User List -->
      {#if filteredUsers.length === 0}
        <p class="text-sm text-muted-foreground">{m.contest_participants_no_users_available()}</p>
      {:else}
        <div class="max-h-96 space-y-2 overflow-y-auto rounded-md border p-4">
          {#each filteredUsers as user (user.id)}
            <div class="flex items-center space-x-3 rounded-md p-2 hover:bg-accent">
              <Checkbox
                id={`participant-${user.id}`}
                checked={selectedUserIds.has(user.id)}
                onCheckedChange={() => toggleUser(user.id)}
              />
              <label
                for={`participant-${user.id}`}
                class="flex-1 cursor-pointer space-y-1 text-sm leading-none"
              >
                <div class="font-medium">{user.username}</div>
                <div class="text-muted-foreground">
                  {user.name} {user.surname} · {user.email}
                </div>
              </label>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <Dialog.Footer>
      <Button
        type="button"
        variant="outline"
        onclick={() => (dialogOpen = false)}
        disabled={submitting}
      >
        {m.contest_participants_add_cancel()}
      </Button>
      <Button
        type="button"
        onclick={handleSubmit}
        disabled={selectedUserIds.size === 0 || submitting}
      >
        {submitting ? 'Adding...' : m.contest_participants_add_submit()}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
