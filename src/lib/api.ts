"use client";

class APIClient {
  private accessToken: string | null = null;

  // This method is called from components to set the token after server-side auth
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        this.accessToken = accessToken;
        return accessToken;
      }

      // Refresh failed, redirect to login
      window.location.href = "/login";
      return null;
    } catch {
      window.location.href = "/login";
      return null;
    }
  }

  async request(url: string, options: RequestInit = {}): Promise<Response> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });

    if (this.accessToken) {
      headers.set("Authorization", `Bearer ${this.accessToken}`);
    }

    let response = await fetch(`${backendUrl}${url}`, {
      ...options,
      headers,
    });

    // Handle token expiration
    if (response.status === 401 && this.accessToken) {
      const newAccessToken = await this.refreshToken();

      if (newAccessToken) {
        headers.set("Authorization", `Bearer ${newAccessToken}`);
        response = await fetch(`${backendUrl}${url}`, {
          ...options,
          headers,
        });
      }
    }

    return response;
  }

  async get(url: string) {
    return this.request(url, { method: "GET" });
  }

  async post(url: string, data?: any) {
    return this.request(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new APIClient();
