import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: "admin" | "agent" | "user" | string | undefined;
    };
    accessToken?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: number;
  }
}
