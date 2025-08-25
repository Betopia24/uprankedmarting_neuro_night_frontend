import fetchWithAuth from "./fetchWithAuth";

export async function getUser() {
  try {
    return await fetchWithAuth<{ id: string; email: string; role: string }>(
      "/auth/me"
    );
  } catch {
    return null;
  }
}
