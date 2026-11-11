<script lang="ts">
  import { Button } from '#lib/components/ui/button/index.js';
  import Upload from '@lucide/svelte/icons/upload';
  import * as m from '#lib/paraglide/messages.js';

  interface TasksUploadButtonProps {
    onclick: () => void;
  }

  let { onclick }: TasksUploadButtonProps = $props();
</script>

<Button variant="gradient" size="lg" {onclick}>
  <Upload />
  {m.admin_tasks_upload_title()}
</Button>
