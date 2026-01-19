<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Dialog from '$lib/components/ui/dialog';
  import Users from '@lucide/svelte/icons/users';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { SvelteSet } from 'svelte/reactivity';
  import type { Group } from '$lib/dto/group';
  import { getContestsManagementInstance } from '$lib/services';

  interface Props {
    contestId: number;
    assignableGroups: Group[];
    onSuccess?: () => void;
  }

  let { contestId, assignableGroups, onSuccess }: Props = $props();

  let dialogOpen = $state(false);
  let searchQuery = $state('');
  let selectedGroupIds = $state(new SvelteSet<number>());
  let submitting = $state(false);

  const contestsService = getContestsManagementInstance();

  let filteredGroups = $derived.by(() => {
    if (!searchQuery.trim()) return assignableGroups;
    const query = searchQuery.toLowerCase();
    return assignableGroups.filter((group) => group.name.toLowerCase().includes(query));
  });

  function toggleGroup(groupId: number) {
    const newSet = new SvelteSet(selectedGroupIds);
    if (newSet.has(groupId)) {
      newSet.delete(groupId);
    } else {
      newSet.add(groupId);
    }
    selectedGroupIds = newSet;
  }

  async function handleSubmit() {
    if (!contestsService || selectedGroupIds.size === 0) {
      toast.error(m.contest_groups_add_error());
      return;
    }

    submitting = true;
    try {
      await contestsService.addGroupsToContest(contestId, Array.from(selectedGroupIds));
      toast.success(m.contest_groups_add_success());
      dialogOpen = false;
      selectedGroupIds = new SvelteSet();
      searchQuery = '';
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Add groups to contest error:', error);
      toast.error(m.contest_groups_add_error());
    } finally {
      submitting = false;
    }
  }

  function resetForm() {
    selectedGroupIds = new SvelteSet();
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
        <Users class="h-8 w-8 text-primary-foreground" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-primary-foreground">
          {m.contest_groups_add_title()}
        </h3>
        <p class="mt-1 text-sm text-primary-foreground/80">
          {m.contest_groups_add_description()}
        </p>
      </div>
    </div>
  </button>

  <Dialog.Content class="max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>{m.contest_groups_add_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.contest_groups_add_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-4">
      <!-- Search -->
      <div class="space-y-2">
        <Label for="search">{m.contest_groups_add_search_label()}</Label>
        <Input
          id="search"
          type="text"
          bind:value={searchQuery}
          placeholder={m.contest_groups_add_search_placeholder()}
          class="transition-all duration-200 focus:ring-2 focus:ring-primary"
        />
      </div>

      <!-- Selected Count -->
      <div class="flex items-center justify-end">
        <span class="text-sm text-muted-foreground">
          {m.contest_groups_add_selected_count({ count: selectedGroupIds.size.toString() })}
        </span>
      </div>

      <!-- Group List -->
      {#if filteredGroups.length === 0}
        <p class="text-sm text-muted-foreground">{m.contest_groups_no_groups_available()}</p>
      {:else}
        <div class="max-h-96 space-y-2 overflow-y-auto rounded-md border p-4">
          {#each filteredGroups as group (group.id)}
            <div class="flex items-center space-x-3 rounded-md p-2 hover:bg-accent">
              <Checkbox
                id={`group-${group.id}`}
                checked={selectedGroupIds.has(group.id)}
                onCheckedChange={() => toggleGroup(group.id)}
              />
              <label
                for={`group-${group.id}`}
                class="flex-1 cursor-pointer space-y-1 text-sm leading-none"
              >
                <div class="font-medium">{group.name}</div>
                <div class="text-muted-foreground">ID: #{group.id}</div>
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
        {m.contest_groups_add_cancel()}
      </Button>
      <Button
        type="button"
        onclick={handleSubmit}
        disabled={selectedGroupIds.size === 0 || submitting}
      >
        {submitting ? 'Adding...' : m.contest_groups_add_submit()}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
