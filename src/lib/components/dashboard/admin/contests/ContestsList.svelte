<script lang="ts">
  import AdminContestCard from '$lib/components/dashboard/contests/AdminContestCard.svelte';
  import type { Contest } from '$lib/dto/contest';

  interface Props {
    contests: Contest[];
  }

  let { contests }: Props = $props();
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each contests as contest (contest.id)}
    <AdminContestCard {contest} />
  {/each}
</div>
