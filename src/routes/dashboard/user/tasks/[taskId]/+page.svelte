<script lang="ts">
  import DevelopmentOverlay from '$lib/components/DevelopmentOverlay.svelte';
  import { goto } from '$app/navigation';
</script>

<DevelopmentOverlay onBack={() => goto('/dashboard/user/tasks')} />
