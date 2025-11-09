<script lang="ts">
  import SubmissionListRow from './SubmissionListRow.svelte';
  import type { Submission } from '$lib/dto/submission';

  interface SubmissionsListProps {
    submissions: Submission[];
  }

  let { submissions }: SubmissionsListProps = $props();
</script>

<div class="space-y-3">
  {#each submissions as submission (submission.id)}
    <SubmissionListRow {submission} />
  {/each}
</div>
