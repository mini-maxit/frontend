import { query, command, getRequestEvent } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { ApiError } from '$lib/services/ApiService';
import { RegistrationRequestStatus } from '$lib/dto/contest';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getRegistrationRequests = query(v.number(), async (contestId: number) => {
  const { cookies, locals } = getRequestEvent();

  try {
    const contestService = createContestService(cookies, locals.user!.role);
    const requests = await contestService.getRegistrationRequests(
      contestId,
      RegistrationRequestStatus.Pending
    );

    return requests;
  } catch (err) {
    console.error('Failed to load registration requests:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load registration requests');
  }
});

export const approveRequest = command(
  v.object({
    contestId: v.pipe(v.number(), v.integer()),
    userId: v.pipe(v.number(), v.integer())
  }),
  async (data) => {
    const { cookies, locals } = getRequestEvent();

    try {
      const contestService = createContestService(cookies, locals.user!.role);
      await contestService.approveRegistrationRequest(data.contestId, data.userId);
      getRegistrationRequests(data.contestId).refresh();
      return { success: true };
    } catch (err) {
      console.error('Failed to approve registration request:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to approve registration request');
    }
  }
);

export const rejectRequest = command(
  v.object({
    contestId: v.pipe(v.number(), v.integer()),
    userId: v.pipe(v.number(), v.integer())
  }),
  async (data) => {
    const { cookies, locals } = getRequestEvent();

    try {
      const contestService = createContestService(cookies, locals.user!.role);
      await contestService.rejectRegistrationRequest(data.contestId, data.userId);
      getRegistrationRequests(data.contestId).refresh();
      return { success: true };
    } catch (err) {
      console.error('Failed to reject registration request:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to reject registration request');
    }
  }
);
