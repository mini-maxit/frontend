import { form } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { UserService } from '$lib/services/UserService';
import { getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { error } from 'console';

const passwordChangeSchema = v.pipe(
  v.object({
    oldPassword: v.pipe(v.string(), v.nonEmpty('Current password is required')),
    newPassword: v.pipe(
      v.string(),
      v.minLength(8, 'Password must be at least 8 characters'),
      v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
      v.regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
      v.regex(/\d/, 'Password must contain at least one digit'),
      v.regex(/[^A-Za-z\d]/, 'Password must contain at least one special character')
    ),
    newPasswordConfirm: v.pipe(v.string(), v.nonEmpty('Please confirm your new password'))
  }),
  v.forward(
    v.partialCheck(
      [['newPassword'], ['newPasswordConfirm']],
      (input) => input.newPassword === input.newPasswordConfirm,
      'Passwords do not match'
    ),
    ['newPasswordConfirm']
  )
);

export const changePassword = form(passwordChangeSchema, async (data) => {
  try {
    const { cookies } = getRequestEvent();
    const apiClient = createApiClient(cookies);
    const userService = new UserService(apiClient);

    // Get current user to get their ID
    const currentUser = await userService.getCurrentUser();

    // Change password
    await userService.changePassword(currentUser.id, data);

    return { success: true };
  } catch (err: unknown) {
    console.error('Password change failed:', err);
    error(500, 'Password change failed');
  }
});
