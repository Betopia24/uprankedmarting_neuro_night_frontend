export type Role = "organization_admin" | "super_admin" | "agent";

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  sub?: string;
  role?: Role;
  accessToken?: string;
  refreshToken?: string;
  exp?: number;
}
