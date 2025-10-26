import { form } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { UserService } from '$lib/services/UserService';
import { getRequestEvent } from '$app/server';
import * as v from 'valibot';

const passwordChangeSchema = v.object({
  oldPassword: v.pipe(v.string(), v.nonEmpty('Current password is required')),
  newPassword: v.pipe(
    v.string(),
    v.minLength(8, 'Password must be at least 8 characters'),
    v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
    v.regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
    v.regex(/\d/, 'Password must contain at least one number'),
    v.regex(/[^A-Za-z\d]/, 'Password must contain at least one special character')
  ),
  newPasswordConfirm: v.string() // Only basic string validation, equality check is separate
});

export const changePassword = form(
  v.pipe(
    passwordChangeSchema,
    v.forward(
      v.partialCheck(
        [['newPassword'], ['newPasswordConfirm']],
        (input) => input.newPassword === input.newPasswordConfirm,
        'Passwords do not match'
      ),
      ['newPasswordConfirm']
    )
  ),
  async (data, invalid) => {
    try {
      const { cookies } = getRequestEvent();
      const apiClient = createApiClient(cookies);
      const userService = new UserService(apiClient);

      // Get current user to get their ID
      const currentUser = await userService.getCurrentUser();

      // Change password
      await userService.changePassword(currentUser.id, data);

      return { success: true, message: 'Password changed successfully' };
    } catch (err: unknown) {
      console.error('Password change failed:', err);

      if (err && typeof err === 'object' && 'status' in err) {
        if (err.status === 400) {
          invalid('Current password is incorrect');
        } else if (err.status === 401) {
          invalid('You are not authorized to perform this action');
        } else {
          invalid('Failed to change password. Please try again.');
        }
      } else {
        invalid('Failed to change password. Please try again.');
      }
    }
  }
);
