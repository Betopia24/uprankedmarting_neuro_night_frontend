import NextAuth, { type DefaultSession } from "next-auth";
import { UserRole } from "@/lib/definitions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}
