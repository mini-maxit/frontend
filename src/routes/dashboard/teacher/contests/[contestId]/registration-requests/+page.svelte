<script lang="ts">
  import {
    getRegistrationRequests,
    approveRequest,
    rejectRequest
  } from './registration-requests.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
  } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import UserCheck from '@lucide/svelte/icons/user-check';
  import UserX from '@lucide/svelte/icons/user-x';
  import Users from '@lucide/svelte/icons/users';
  import * as m from '$lib/paraglide/messages';
  import { formatDistanceToNow } from 'date-fns';

  interface Props {
    data: {
      contestId: number;
    };
  }

  let { data }: Props = $props();

  const requestsQuery = getRegistrationRequests(data.contestId);

  let processingUserId = $state<number | null>(null);

  async function handleApprove(userId: number) {
    processingUserId = userId;
    try {
      await approveRequest({ contestId: data.contestId, userId });
    } catch (error) {
      console.error('Failed to approve request:', error);
    } finally {
      processingUserId = null;
    }
  }

  async function handleReject(userId: number) {
    processingUserId = userId;
    try {
      await rejectRequest({ contestId: data.contestId, userId });
    } catch (error) {
      console.error('Failed to reject request:', error);
    } finally {
      processingUserId = null;
    }
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">
      {m.admin_registration_requests_title()}
    </h1>
  </div>

  <div class="space-y-4">
    {#if requestsQuery.error}
      <ErrorCard
        title={m.admin_registration_requests_load_error()}
        error={requestsQuery.error}
        onRetry={() => requestsQuery.refresh()}
      />
    {:else if requestsQuery.loading}
      <LoadingSpinner message={m.admin_registration_requests_loading()} />
    {:else if requestsQuery.current && requestsQuery.current.length === 0}
      <EmptyState
        title={m.admin_registration_requests_no_requests_title()}
        description={m.admin_registration_requests_no_requests_description()}
        icon={Users}
      />
    {:else if requestsQuery.current}
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {#each requestsQuery.current as request (request.id)}
          <Card>
            <CardHeader>
              <CardTitle>{request.user.username}</CardTitle>
              <CardDescription>
                {request.user.name}
                {request.user.surname}
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="space-y-2 text-sm">
                <div>
                  <span class="font-medium">{m.admin_registration_requests_email()}:</span>
                  <span class="text-muted-foreground"> {request.user.email}</span>
                </div>
                <div>
                  <span class="font-medium">{m.admin_registration_requests_role()}:</span>
                  <span class="text-muted-foreground"> {request.user.role}</span>
                </div>
                <div>
                  <span class="font-medium">{m.admin_registration_requests_requested()}:</span>
                  <span class="text-muted-foreground">
                    {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div class="flex gap-2 pt-2">
                <Button
                  class="flex-1"
                  variant="default"
                  disabled={processingUserId === request.userId}
                  onclick={() => handleApprove(request.userId)}
                >
                  <UserCheck class="mr-2 h-4 w-4" />
                  {m.admin_registration_requests_approve()}
                </Button>
                <Button
                  class="flex-1"
                  variant="outline"
                  disabled={processingUserId === request.userId}
                  onclick={() => handleReject(request.userId)}
                >
                  <UserX class="mr-2 h-4 w-4" />
                  {m.admin_registration_requests_reject()}
                </Button>
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</div>
