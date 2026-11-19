<script lang="ts">
  import { formatUserName } from '#lib/utils/user.js';
  import type { RegistrationRequest } from '#lib/dto/contest.js';
  import * as Table from '#lib/components/ui/table/index.js';
  import { Button } from '#lib/components/ui/button/index.js';
  import Check from '@lucide/svelte/icons/check';
  import X from '@lucide/svelte/icons/x';
  import { toast } from 'svelte-sonner';
  import { getContestsManagementInstance } from '#lib/services/index.js';
  import { showApiError } from '#lib/errors/backend-error.js';
  import { formatDate } from '#lib/utils.js';
  import * as m from '#lib/paraglide/messages.js';

  interface Props {
    contestId: number;
    requests: RegistrationRequest[];
    /** Called after a request is resolved; `approved` is true when a participant was added. */
    onResolved: (approved: boolean) => void;
  }

  let { contestId, requests, onResolved }: Props = $props();
  const contestsService = getContestsManagementInstance();
  let busyUserId = $state<number | null>(null);

  async function resolve(userId: number, approve: boolean) {
    if (!contestsService) return;
    busyUserId = userId;
    try {
      if (approve) {
        await contestsService.approveRegistrationRequest(contestId, userId);
        toast.success(m.registration_requests_approved());
      } else {
        await contestsService.rejectRegistrationRequest(contestId, userId);
        toast.success(m.registration_requests_rejected());
      }
      onResolved(approve);
    } catch (error) {
      showApiError(error);
    } finally {
      busyUserId = null;
    }
  }
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>{m.registration_requests_column_user()}</Table.Head>
      <Table.Head class="hidden md:table-cell">{m.admin_registration_requests_email()}</Table.Head>
      <Table.Head class="hidden sm:table-cell"
        >{m.admin_registration_requests_requested()}</Table.Head
      >
      <Table.Head class="text-right">{m.contest_participants_column_actions()}</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each requests as request (request.user.id)}
      <Table.Row>
        <Table.Cell class="font-medium">{formatUserName(request.user)}</Table.Cell>
        <Table.Cell class="hidden text-muted-foreground md:table-cell"
          >{request.user.email}</Table.Cell
        >
        <Table.Cell class="hidden text-muted-foreground sm:table-cell">
          {formatDate(request.createdAt)}
        </Table.Cell>
        <Table.Cell class="text-right">
          <div class="flex justify-end gap-2">
            <Button
              size="sm"
              disabled={busyUserId !== null}
              onclick={() => resolve(request.user.id, true)}
            >
              <Check class="h-4 w-4" />
              <span class="hidden sm:inline">{m.admin_registration_requests_approve()}</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busyUserId !== null}
              onclick={() => resolve(request.user.id, false)}
            >
              <X class="h-4 w-4" />
              <span class="hidden sm:inline">{m.admin_registration_requests_reject()}</span>
            </Button>
          </div>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
