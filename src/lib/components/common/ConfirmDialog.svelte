<script lang="ts">
  import * as Dialog from '#lib/components/ui/dialog/index.js';
  import { Button } from '#lib/components/ui/button/index.js';
  import * as m from '#lib/paraglide/messages.js';

  interface Props {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    destructive?: boolean;
    onConfirm: () => void | Promise<void>;
  }

  let {
    open = $bindable(),
    title,
    description,
    confirmLabel,
    destructive = false,
    onConfirm
  }: Props = $props();

  let busy = $state(false);

  async function confirm() {
    busy = true;
    try {
      await onConfirm();
    } finally {
      busy = false;
      open = false;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => (open = false)} disabled={busy}>
        {m.common_cancel()}
      </Button>
      <Button variant={destructive ? 'destructive' : 'default'} onclick={confirm} disabled={busy}>
        {confirmLabel}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
