import { UserRole } from './jwt';

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserRegisterDto {
  email: string;
  name: string;
  surname: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  role: UserRole;
  createdAt: string;
}

export interface UserChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface UserEditDto {
  email?: string;
  name?: string;
  surname?: string;
  role?: UserRole;
}
