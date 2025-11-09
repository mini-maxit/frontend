<script lang="ts">
  import Upload from '@lucide/svelte/icons/upload';
  import * as m from '$lib/paraglide/messages';

  interface TasksUploadButtonProps {
    onclick: () => void;
  }

  let { onclick }: TasksUploadButtonProps = $props();
</script>

<button
  {onclick}
  class="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-secondary p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
>
  <div
    class="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
  ></div>

  <div class="relative flex flex-col items-center gap-4 text-center">
    <div
      class="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
    >
      <Upload class="h-8 w-8 text-primary-foreground" />
    </div>
    <div>
      <h3 class="text-lg font-bold text-primary-foreground">
        {m.admin_tasks_upload_title()}
      </h3>
      <p class="mt-1 text-sm text-primary-foreground/80">
        {m.admin_tasks_upload_description()}
      </p>
    </div>
  </div>
</button>
