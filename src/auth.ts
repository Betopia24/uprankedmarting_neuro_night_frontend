import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

// ✅ Extend NextAuth types (for user, token, session)
declare module "next-auth" {
  interface Session {
    id: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: string;
    email: string;
    role: string;
    access_token: string;
    refresh_token: string;
    exp: number;
  }
}

const API_BASE = process.env.API_BASE_URL;
if (!API_BASE) throw new Error("API_BASE_URL environment variable is required");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await axios.post(
            `${API_BASE}/auth/organization/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const data = response.data;
          console.log("Login response:", data);

          if (!data.access_token || !data.refresh_token) {
            return null;
          }

          return {
            id: data.id || data.sub || String(credentials.email),
            email: String(credentials.email),
            role: data.role || "organization_admin",
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1h
          };
        } catch (err) {
          console.error("Login error:", err);
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" },
  jwt: { maxAge: 60 * 60 },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.accessToken = user.access_token;
        token.refreshToken = user.refresh_token;
        token.exp = user.exp;
        return token;
      }

      // Refresh if expiring (5min buffer)
      if (token.exp && Date.now() / 1000 > token.exp - 300) {
        try {
          const refreshed = await axios.post(
            `${API_BASE}/auth/organization/refresh`,
            {
              refresh_token: token.refreshToken,
            }
          );

          token.accessToken = refreshed.data.access_token;
          token.refreshToken = refreshed.data.refresh_token;
          token.exp =
            Math.floor(Date.now() / 1000) + (refreshed.data.expires_in || 3600);
        } catch (err) {
          console.warn("Token refresh failed:", err);
          token.error = "RefreshAccessTokenError";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "organization_admin";
      }
      (session as any).accessToken =
        typeof token.accessToken === "string" ? token.accessToken : "";
      (session as any).refreshToken =
        typeof token.refreshToken === "string" ? token.refreshToken : "";
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
});
