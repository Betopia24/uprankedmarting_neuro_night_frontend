"use client";
import { env } from "@/env";
import { loginPath } from "@/paths";

// Type definitions
interface AuthResponse {
  accessToken: string;
}

interface APIError {
  message: string;
  code?: string;
  status: number;
}

interface RequestOptions extends RequestInit {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

type UploadProgressCallback = (progress: UploadProgress) => void;

// Custom error classes
class APIClientError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "APIClientError";
    this.status = status;
    this.code = code;
  }
}

class NetworkError extends Error {
  constructor(message: string = "Network request failed") {
    super(message);
    this.name = "NetworkError";
  }
}

class TokenRefreshError extends Error {
  constructor(message: string = "Token refresh failed") {
    super(message);
    this.name = "TokenRefreshError";
  }
}

class APIClient {
  private accessToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;
  private readonly baseUrl: string;
  private readonly defaultTimeout: number = 30000; // 30 seconds

  constructor() {
    this.baseUrl = env.NEXT_PUBLIC_API_URL;

    // Validate environment
    if (!this.baseUrl) {
      throw new Error(
        "NEXT_PUBLIC_API_URL is not defined in environment variables"
      );
    }
  }

  /**
   * Set the access token for authenticated requests
   */
  setAccessToken(token: string): void {
    if (!token || typeof token !== "string") {
      this.accessToken;
    }
    this.accessToken = token;
  }

  /**
   * Clear the access token
   */
  clearAccessToken(): void {
    this.accessToken = null;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Refresh the access token with singleton pattern to prevent multiple concurrent refreshes
   */
  private async refreshToken(): Promise<string | null> {
    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.defaultTimeout
      );

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data: AuthResponse = await response.json();

        if (!data.accessToken) {
          throw new TokenRefreshError("No access token in refresh response");
        }

        this.accessToken = data.accessToken;
        return data.accessToken;
      }

      // Clear token and redirect on refresh failure
      this.clearAccessToken();
      if (typeof window !== "undefined") {
        window.location.href = loginPath();
      }
      return null;
    } catch (error) {
      this.clearAccessToken();

      if (error instanceof Error && error.name === "AbortError") {
        throw new TokenRefreshError("Token refresh timeout");
      }

      if (typeof window !== "undefined") {
        window.location.href = loginPath();
      }
      return null;
    }
  }

  /**
   * Create request headers with proper type safety
   */
  private createHeaders(
    options: RequestOptions = {},
    isFormData: boolean = false
  ): Headers {
    const headers = new Headers(options.headers);

    // Add Authorization header if token is available
    if (this.accessToken) {
      headers.set("Authorization", `${this.accessToken}`);
    }

    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  }

  /**
   * Main request method with comprehensive error handling and retry logic
   */
  async request<T = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL provided");
    }

    const fullUrl = `${this.baseUrl}${url}`;
    const isFormData = options.body instanceof FormData;
    const headers = this.createHeaders(options, isFormData);

    // Setup timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);

    try {
      console.log("API Request:", {
        url: fullUrl,
        method: options.method || "GET",
      });

      // First request attempt
      let response = await fetch(fullUrl, {
        ...options,
        headers,
        credentials: "omit",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 - Token expired
      if (response.status === 401 && this.accessToken) {
        console.log("Token expired, attempting refresh...");

        const newAccessToken = await this.refreshToken();

        if (newAccessToken) {
          // Update headers with new token
          headers.set("Authorization", `${newAccessToken}`);

          // Setup new timeout for retry
          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(
            () => retryController.abort(),
            this.defaultTimeout
          );

          try {
            // Retry request with new token
            response = await fetch(fullUrl, {
              ...options,
              headers,
              credentials: "omit",
              signal: retryController.signal,
            });

            clearTimeout(retryTimeoutId);
            console.log("Request retried successfully with new token");
          } catch (retryError) {
            clearTimeout(retryTimeoutId);
            throw retryError;
          }
        }
      }

      // Handle other error status codes
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorCode: string | undefined;

        try {
          const errorData: APIError = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorCode = errorData.code;
        } catch {
          // If JSON parsing fails, use default error message
        }

        throw new APIClientError(errorMessage, response.status, errorCode);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof APIClientError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new NetworkError("Request timeout");
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new NetworkError("Network connection failed");
      }

      throw new NetworkError(
        error instanceof Error ? error.message : "Unknown network error"
      );
    }
  }

  /**
   * GET request with caching support
   */
  async get<T = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<Response> {
    const requestOptions: RequestOptions = {
      ...options,
      method: "POST",
    };

    if (data !== undefined) {
      if (data instanceof FormData) {
        requestOptions.body = data;
      } else {
        requestOptions.body = JSON.stringify(data);
      }
    }

    return this.request<T>(url, requestOptions);
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<Response> {
    const requestOptions: RequestOptions = {
      ...options,
      method: "PUT",
    };

    if (data !== undefined) {
      if (data instanceof FormData) {
        requestOptions.body = data;
      } else {
        requestOptions.body = JSON.stringify(data);
      }
    }

    return this.request<T>(url, requestOptions);
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<Response> {
    const requestOptions: RequestOptions = {
      ...options,
      method: "PATCH",
    };

    if (data !== undefined) {
      if (data instanceof FormData) {
        requestOptions.body = data;
      } else {
        requestOptions.body = JSON.stringify(data);
      }
    }

    return this.request<T>(url, requestOptions);
  }

  /**
   * Upload file with FormData
   */
  async uploadFile(
    url: string,
    formData: FormData,
    options: RequestOptions = {},
    onProgress?: UploadProgressCallback
  ): Promise<Response> {
    if (!(formData instanceof FormData)) {
      throw new Error("Expected FormData instance");
    }

    // Note: Progress tracking requires XMLHttpRequest, not fetch
    // For now, we use the standard request method
    return this.request(url, {
      ...options,
      method: "POST",
      body: formData,
    });
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    url: string,
    files: File[],
    fieldName: string = "files",
    options: RequestOptions = {},
    onProgress?: UploadProgressCallback
  ): Promise<Response> {
    if (!Array.isArray(files)) {
      throw new Error("Files must be an array");
    }

    if (files.length === 0) {
      throw new Error("No files provided for upload");
    }

    // Validate all files
    files.forEach((file, index) => {
      if (!(file instanceof File)) {
        throw new Error(`Item at index ${index} is not a File instance`);
      }
    });

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(fieldName, file);
    });

    return this.uploadFile(url, formData, options, onProgress);
  }

  /**
   * Upload with mixed data (files + JSON data)
   */
  async uploadWithData<T extends Record<string, unknown>>(
    url: string,
    data: T,
    files: File[] = [],
    options: RequestOptions = {},
    onProgress?: UploadProgressCallback
  ): Promise<Response> {
    if (typeof data !== "object" || data === null) {
      throw new Error("Data must be a valid object");
    }

    if (!Array.isArray(files)) {
      throw new Error("Files must be an array");
    }

    const formData = new FormData();

    // Append regular data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Append files
    files.forEach((file, index) => {
      if (!(file instanceof File)) {
        throw new Error(`File at index ${index} is not a File instance`);
      }
      formData.append("files", file);
    });

    return this.uploadFile(url, formData, options, onProgress);
  }

  /**
   * Helper method to parse JSON response safely
   */
  async parseJSON<T = unknown>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new APIClientError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error("Failed to parse JSON response");
    }
  }

  /**
   * Convenience method for GET requests that return JSON
   */
  async getJSON<T = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const response = await this.get(url, options);
    return this.parseJSON<T>(response);
  }

  /**
   * Convenience method for POST requests that return JSON
   */
  async postJSON<T = unknown>(
    url: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const response = await this.post(url, data, options);
    return this.parseJSON<T>(response);
  }

  /**
   * Convenience method for PUT requests that return JSON
   */
  async putJSON<T = unknown>(
    url: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const response = await this.put(url, data, options);
    return this.parseJSON<T>(response);
  }

  /**
   * Invalidate Next.js cache by tag (only works in server actions/components)
   * Pass the revalidateTag function from your server action
   */
  async invalidateCache(
    tags: string[],
    revalidateFn?: (tag: string) => Promise<void> | void
  ): Promise<void> {
    if (typeof window !== "undefined") {
      console.warn(
        "Cache invalidation is only available in server components/actions"
      );
      return;
    }

    if (revalidateFn) {
      for (const tag of tags) {
        try {
          await revalidateFn(tag);
        } catch (error) {
          console.warn(`Failed to revalidate tag ${tag}:`, error);
        }
      }
    }
  }

  /**
   * Invalidate Next.js cache by path (only works in server actions/components)
   * Pass the revalidatePath function from your server action
   */
  async invalidatePath(
    path: string,
    revalidateFn?: (path: string) => Promise<void> | void
  ): Promise<void> {
    if (typeof window !== "undefined") {
      console.warn(
        "Cache invalidation is only available in server components/actions"
      );
      return;
    }

    if (revalidateFn) {
      try {
        await revalidateFn(path);
      } catch (error) {
        console.warn(`Failed to revalidate path ${path}:`, error);
      }
    }
  }

  /**
   * Check if client is properly configured
   */
  isConfigured(): boolean {
    return Boolean(this.baseUrl);
  }

  /**
   * Check if client is authenticated
   */
  isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }

  /**
   * Get health status of the API client
   */
  async healthCheck(): Promise<{ status: "ok" | "error"; timestamp: number }> {
    try {
      const response = await this.get("/health", {
        next: { revalidate: 0 }, // Don't cache health checks
      });

      return {
        status: response.ok ? "ok" : "error",
        timestamp: Date.now(),
      };
    } catch {
      return {
        status: "error",
        timestamp: Date.now(),
      };
    }
  }
}

// Export singleton instance and types
export const apiClient = new APIClient();
export type {
  APIError,
  RequestOptions,
  UploadProgress,
  UploadProgressCallback,
};
export { APIClientError, NetworkError, TokenRefreshError };
