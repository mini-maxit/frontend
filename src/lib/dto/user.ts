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
