import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { z } from "zod";
import { authConfig } from "./auth.config";
import type { User } from "@/lib/definitions";

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
