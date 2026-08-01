export type UserRole = 'student' | 'instructor' | 'admin' | 'super_admin';

export type UserStatus = 'active' | 'suspended' | 'banned';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

/** Returned from auth endpoints — never includes the password hash */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
}

/** Shape of the JWT access token payload */
export interface JwtPayload {
  sub: string;       // user id
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
