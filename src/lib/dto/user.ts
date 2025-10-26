export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserRegisterDto {
  email: string;
  name: string;
  surname: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  username: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
}

export interface UserChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}
