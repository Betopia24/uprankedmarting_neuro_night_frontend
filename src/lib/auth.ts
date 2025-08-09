// lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE) throw new Error("NEXT_PUBLIC_API_URL is required in env");

type RemoteLogin = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number; // seconds
  user: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
};

// authOptions: credentials provider that forwards to external API
export const authOptions = {
  session: { strategy: "jwt" }, // JWT-only session
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        // Call your external API's login endpoint
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          // Return null to indicate failure — client will handle
          return null;
        }

        const data = (await res.json()) as RemoteLogin;

        if (!data || !data.accessToken || !data.user?.id) return null;

        // We return a minimal user object; fields are appended to JWT in jwt callback
        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role ?? "user",
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          accessTokenExpiresAt: data.expiresIn
            ? Date.now() + data.expiresIn * 1000
            : undefined,
        } as any;
      },
    }),
  ],
  callbacks: {
    // Store tokens & role in JWT
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpiresAt = (user as any).accessTokenExpiresAt;
      }
      // No automated refresh here in frontend-only skeleton; backend should issue fresh tokens
      return token;
    },

    // Expose selected fields to session()
    async session({ session, token }) {
      session.user = {
        id: token.sub as string,
        name: session.user?.name ?? null,
        email: session.user?.email ?? null,
        role: token.role as any,
      };
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
