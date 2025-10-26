<script lang="ts">
  import DevelopmentOverlay from '$lib/components/DevelopmentOverlay.svelte';
</script>

<DevelopmentOverlay onBack={() => window.history.back()} />
