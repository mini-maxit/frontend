<script lang="ts">
  import AdminContestCard from '$lib/components/dashboard/contests/AdminContestCard.svelte';
  import type { CreatedContest } from '$lib/dto/contest';

  interface Props {
    contests: CreatedContest[];
  }

  let { contests }: Props = $props();
</script>

<div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
  {#each contests as contest (contest.id)}
    <AdminContestCard {contest} />
  {/each}
</div>
