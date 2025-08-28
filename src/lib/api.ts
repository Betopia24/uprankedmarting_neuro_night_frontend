"use client";
import { env } from "@/env";
import { loginPath } from "@/paths";

class APIClient {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(env.NEXT_PUBLIC_API_URL + "/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        this.accessToken = accessToken;
        return accessToken;
      }

      window.location.href = loginPath();
      return null;
    } catch {
      window.location.href = loginPath();
      return null;
    }
  }

  async request(url: string, options: RequestInit = {}): Promise<Response> {
    const backendUrl = env.NEXT_PUBLIC_API_URL;

    // Create headers without automatically setting Content-Type for FormData
    const headers = new Headers(options.headers);

    // Add token if available (but not for FormData to let browser set boundary)
    if (this.accessToken && !(options.body instanceof FormData)) {
      headers.set("Authorization", `${this.accessToken}`);
    } else if (this.accessToken) {
      // For FormData, we still need Authorization but let browser set Content-Type
      headers.set("Authorization", `${this.accessToken}`);
    }

    // ✅ DIRECT CALL TO YOUR EXTERNAL BACKEND
    let response = await fetch(`${backendUrl}${url}`, {
      ...options,
      headers,
      credentials: "omit",
    });

    // Handle token expiration
    if (response.status === 401 && this.accessToken) {
      const newAccessToken = await this.refreshToken();

      if (newAccessToken) {
        headers.set("Authorization", `${newAccessToken}`);
        // ✅ RETRY DIRECT CALL WITH NEW TOKEN
        response = await fetch(`${backendUrl}${url}`, {
          ...options,
          headers,
          credentials: "omit",
        });
      }
    }

    return response;
  }

  // Standard JSON methods
  async get(url: string) {
    return this.request(url, { method: "GET" });
  }

  async post(url: string, data: unknown) {
    const headers = new Headers();
    if (data && !(data instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    return this.request(url, {
      method: "POST",
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async put(url: string, data?: unknown) {
    const headers = new Headers();
    if (data && !(data instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    return this.request(url, {
      method: "PUT",
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // ✅ MULTIPART FORM DATA UPLOAD METHODS
  async uploadFile(url: string, formData: FormData) {
    return this.request(url, {
      method: "POST",
      body: formData,
      // Note: Don't set Content-Type header - browser will set it with boundary
    });
  }

  async uploadFiles(url: string, files: File[], fieldName: string = "files") {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(fieldName, file);
    });
    return this.uploadFile(url, formData);
  }

  async uploadWithData(
    url: string,
    data: Record<string, unknown>,
    files: File[] = []
  ) {
    const formData = new FormData();

    // Append regular data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Append files
    files.forEach((file, index) => {
      formData.append("files", file);
    });

    return this.uploadFile(url, formData);
  }
}

export const apiClient = new APIClient();
