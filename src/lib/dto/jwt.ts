export enum UserRole {
  Student = 'student',
  Teacher = 'teacher',
  Admin = 'admin'
}

export interface JWTClaims {
  user_id: number;
  role: UserRole;
  token_id: string;
  type: string;
  iat: number;
  exp: number;
}
