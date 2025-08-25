import serverAuthFetch, { type ServerAuthFetchResult } from "./serverAuthFetch";
import accessTokenMemory from "./accessTokenMemory";

export type FetchWithAuthResult<T> = {
  data?: T;
  accessToken?: string;
  role?: string;
  unauthorized: boolean;
};

export default async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<FetchWithAuthResult<T>> {
  const res: ServerAuthFetchResult<T> | null = await serverAuthFetch(
    endpoint,
    options
  );

  if (!res) return { unauthorized: true };

  if (typeof window !== "undefined") {
    accessTokenMemory.set({
      accessToken: res.accessToken,
      role: res.role as "super_admin" | "organization_admin" | "agent",
    });
  }

  return {
    data: res.data,
    accessToken: res.accessToken,
    role: res.role,
    unauthorized: false,
  };
}
