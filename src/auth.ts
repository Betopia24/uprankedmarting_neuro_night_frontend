import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { z } from "zod";
import { authConfig } from "./auth.config";
import type { User } from "@/lib/definitions";

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // Replace with your actual user authentication logic
          if (email === "admin@example.com" && password === "password") {
            const user: User = {
              id: "1",
              name: "Admin User",
              email: "admin@example.com",
              role: "ADMIN",
            };
            return user;
          }
          if (email === "user@example.com" && password === "password") {
            const user: User = {
              id: "2",
              name: "Regular User",
              email: "user@example.com",
              role: "USER",
            };
            return user;
          }

          console.log("Invalid credentials");
          return null;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "apple") {
        try {
          const res = await fetch(`${EXTERNAL_API_URL}/auth/social-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            }),
          });

          if (!res.ok) {
            return false;
          }
          
          const externalUser = await res.json();
          user.id = externalUser.id;
          user.role = externalUser.role;

        } catch (error) {
          console.error("External API call failed:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as User["role"];
      }
      return session;
    },
  },
});
