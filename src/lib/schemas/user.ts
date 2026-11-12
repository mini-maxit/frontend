import * as v from 'valibot';
import { UserRole } from '#lib/dto/jwt.js';

/**
 * Schema for changing user password
 * Includes password complexity requirements and confirmation matching
 */
export const ChangePasswordSchema = v.pipe(
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

export type ChangePasswordInput = v.InferOutput<typeof ChangePasswordSchema>;

/**
 * Schema for updating user details (admin only)
 */
export const UpdateUserSchema = v.object({
  userId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid user ID')),
  name: v.pipe(
    v.string(),
    v.nonEmpty('Name is required'),
    v.minLength(3, 'Name must be at least 3 characters'),
    v.maxLength(50, 'Name cannot exceed 50 characters')
  ),
  surname: v.pipe(
    v.string(),
    v.nonEmpty('Surname is required'),
    v.minLength(3, 'Surname must be at least 3 characters'),
    v.maxLength(50, 'Surname cannot exceed 50 characters')
  ),
  email: v.pipe(v.string(), v.nonEmpty('Email is required'), v.email('Invalid email address')),
  role: v.picklist([UserRole.Student, UserRole.Teacher, UserRole.Admin], 'Invalid role')
});

export type UpdateUserInput = v.InferOutput<typeof UpdateUserSchema>;
