// "use server";

// import NextAuth from "next-auth";
// import type { NextAuthConfig, User, Session } from "next-auth";
// import type { JWT } from "next-auth/jwt";
// import Credentials from "next-auth/providers/credentials";
// import axios, { AxiosError } from "axios";

// // Environment validation
// const API_BASE = process.env.API_BASE_URL;
// if (!API_BASE) {
//   throw new Error("API_BASE_URL environment variable is required");
// }

// // API response types
// interface LoginResponse {
//   access_token: string;
//   refresh_token: string;
//   token_type?: string;
//   expires_in?: number;
//   id: string;
//   role: string;
//   email?: string;
//   name?: string;
// }

// interface RefreshResponse {
//   access_token: string;
//   refresh_token: string;
//   token_type?: string;
//   expires_in?: number;
// }

// // Custom user type for our app
// interface AppUser {
//   id: string;
//   email?: string | null;
//   name?: string | null;
//   role: string;
//   access_token: string;
//   refresh_token: string;
// }

// // Extend NextAuth types
// declare module "next-auth" {
//   interface User {
//     role: string;
//     access_token: string;
//     refresh_token: string;
//   }

//   interface Session {
//     id: string;
//     email?: string | null;
//     name?: string | null;
//     role: string;
//     accessToken?: string;
//     refreshToken?: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     accessToken?: string;
//     refreshToken?: string;
//     role?: string;
//   }
// }

// // Credential validation schema
// interface ValidCredentials {
//   username: string;
//   password: string;
// }

// function validateCredentials(credentials: Partial<Record<string, unknown>>) {
//   return !!(
//     credentials.username &&
//     credentials.password &&
//     typeof credentials.username === "string" &&
//     typeof credentials.password === "string" &&
//     credentials.username.trim().length > 0 &&
//     credentials.password.trim().length > 0
//   );
// }

// // Error handling utilities
// function isAxiosError(error: unknown): error is AxiosError {
//   return axios.isAxiosError(error);
// }

// function logError(error: unknown, context: string): void {
//   if (isAxiosError(error)) {
//     console.error(`${context} - API Error:`, {
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       data: error.response?.data,
//       url: error.config?.url,
//     });
//   } else if (error instanceof Error) {
//     console.error(`${context} - Error:`, {
//       message: error.message,
//       name: error.name,
//       stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
//     });
//   } else {
//     console.error(`${context} - Unknown error:`, error);
//   }
// }

// // Authentication functions
// async function authenticateUser(
//   credentials: ValidCredentials
// ): Promise<AppUser | null> {
//   try {
//     const formData = new URLSearchParams({
//       grant_type: "password",
//       username: credentials.username.trim(),
//       password: credentials.password,
//     });

//     const response = await axios.post<LoginResponse>(
//       `${API_BASE}/auth/organization/login`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Accept: "application/json",
//         },
//         timeout: 15000,
//         validateStatus: (status) => status === 200,
//       }
//     );

//     const data = response.data;

//     // Validate required fields
//     if (!data.access_token || !data.refresh_token || !data.id || !data.role) {
//       console.error("Invalid login response - missing required fields");
//       return null;
//     }

//     return {
//       id: data.id,
//       email: data.email || credentials.username,
//       name: data.name || null,
//       role: data.role,
//       access_token: data.access_token,
//       refresh_token: data.refresh_token,
//     };
//   } catch (error) {
//     logError(error, "Authentication failed");
//     return null;
//   }
// }

// async function refreshToken(
//   token: string
// ): Promise<{ accessToken: string; refreshToken: string } | null> {
//   try {
//     const response = await axios.post<RefreshResponse>(
//       `${API_BASE}/auth/organization/refresh`,
//       { refresh_token: token },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         timeout: 10000,
//         validateStatus: (status) => status === 200,
//       }
//     );

//     const data = response.data;

//     if (!data.access_token || !data.refresh_token) {
//       console.error("Invalid refresh response - missing tokens");
//       return null;
//     }

//     return {
//       accessToken: data.access_token,
//       refreshToken: data.refresh_token,
//     };
//   } catch (error) {
//     logError(error, "Token refresh failed");
//     return null;
//   }
// }

// // Token expiration check
// function shouldRefreshToken(exp?: number): boolean {
//   if (!exp) return false;
//   // Refresh 5 minutes before expiry
//   const REFRESH_BUFFER = 5 * 60; // 5 minutes in seconds
//   return Date.now() >= (exp - REFRESH_BUFFER) * 1000;
// }

// // NextAuth configuration
// const authConfig: NextAuthConfig = {
//   providers: [
//     Credentials({
//       name: "credentials",
//       credentials: {
//         username: {
//           label: "Email",
//           type: "email",
//           placeholder: "Enter your email",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//           placeholder: "Enter your password",
//         },
//       },
//       authorize: async (credentials): Promise<User | null> => {
//         try {
//           // Validate input
//           if (!validateCredentials(credentials)) {
//             console.error("Invalid credentials format");
//             return null;
//           }

//           // Authenticate user
//           const { username, password } = credentials as {
//             username: string;
//             password: string;
//           };
//           const user = await authenticateUser({ username, password });
//           if (!user) {
//             return null;
//           }

//           // Return user in NextAuth User format
//           return {
//             id: user.id,
//             email: user.email,
//             name: user.name,
//             role: user.role,
//             access_token: user.access_token,
//             refresh_token: user.refresh_token,
//           };
//         } catch (error) {
//           logError(error, "Authorization error");
//           return null;
//         }
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//     maxAge: 60 * 60, // 1 hour
//   },

//   jwt: {
//     maxAge: 60 * 60, // 1 hour
//   },

//   callbacks: {
//     jwt: async ({ token, user }): Promise<JWT> => {
//       // Initial sign in
//       if (user) {
//         token.sub = user.id;
//         token.role = user.role;
//         token.accessToken = user.access_token;
//         token.refreshToken = user.refresh_token;
//         return token;
//       }

//       // Handle token refresh
//       if (shouldRefreshToken(token.exp) && token.refreshToken) {
//         const refreshed = await refreshToken(token.refreshToken);

//         if (refreshed) {
//           token.accessToken = refreshed.accessToken;
//           token.refreshToken = refreshed.refreshToken;
//           console.log("Token refreshed successfully");
//         } else {
//           console.warn(
//             "Token refresh failed - user will need to re-authenticate"
//           );
//           // Clear tokens to force re-authentication
//           delete token.accessToken;
//           delete token.refreshToken;
//         }
//       }

//       return token;
//     },

//     session: async ({ session, token }): Promise<Session> => {
//       if (token.sub) {
//         session.user.id = token.sub;
//       }

//       if (token.role) {
//         session.user.role = token.role;
//       }

//       session.accessToken = token.accessToken;
//       session.refreshToken = token.refreshToken;

//       return session;
//     },
//   },

//   pages: {
//     signIn: "/auth/login",
//     error: "/auth/error",
//   },

//   events: {
//     signOut: async (event) => {
//       // Optional: Invalidate tokens on server
//       const token = "token" in event ? event.token : undefined;
//       if (token && token.accessToken) {
//         try {
//           await axios.post(
//             `${API_BASE}/auth/organization/logout`,
//             {},
//             {
//               headers: {
//                 Authorization: `Bearer ${token.accessToken}`,
//               },
//               timeout: 5000,
//             }
//           );
//           console.log("Server-side logout completed");
//         } catch (error) {
//           logError(error, "Server-side logout failed");
//         }
//       }
//     },
//   },

//   trustHost: true,
//   debug: process.env.NODE_ENV === "development",
// };

// export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
// export { authConfig };

import { handlers } from "@/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;
