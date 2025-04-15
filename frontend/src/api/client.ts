import { AuthResponse } from "@/types/Auth.types";
import { clearAuthData, getAuthToken, setAuthToken } from "@/utils/auth";
import { config } from "@/utils/config";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  authenticated?: boolean;
  skipRefreshToken?: boolean;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

const BE_URL = config.apiUrl;

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const requestsQueue: Array<{
  resolve: (value: boolean) => void;
}> = [];

const processQueue = (success: boolean) => {
  requestsQueue.forEach((p) => p.resolve(success));
  requestsQueue.length = 0;
};

const refreshToken = async (): Promise<boolean> => {
  if (isRefreshing) {
    return new Promise<boolean>((resolve) => {
      requestsQueue.push({ resolve });
    });
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${BE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data: AuthResponse = (await response.json()).data;
      setAuthToken(data.accessToken);
      isRefreshing = false;
      processQueue(true);
      return true;
    } catch (error) {
      console.error("Error refreshing token:", error);

      clearAuthData();
      isRefreshing = false;
      processQueue(false);
      return false;
    }
  })();
  return refreshPromise;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    headers = {},
    body,
    authenticated = true,
    skipRefreshToken = false,
  } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (authenticated) {
    const token = getAuthToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${BE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    if (response.status === 401 && authenticated && !skipRefreshToken) {
      const refreshSuccessful = await refreshToken();
      console.log("Refresh token successful:", refreshSuccessful);
      if (refreshSuccessful) {
        return apiRequest<T>(endpoint, {
          ...options,
          skipRefreshToken: true,
        });
      }

      return {
        data: null,
        error: "Session expired. Please log in again.",
        status: 401,
      };
    }

    let data = null;
    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      return {
        data: null,
        error: data?.message || "An unexpected error occurred",
        status: response.status,
      };
    }

    return {
      data: data.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}

// Helper functions for different HTTP methods
export const get = <T>(
  endpoint: string,
  options?: Omit<RequestOptions, "method" | "body">
) => apiRequest<T>(endpoint, { ...options, method: "GET" });

export const post = <T>(
  endpoint: string,
  body: unknown,
  options?: Omit<RequestOptions, "method">
) => apiRequest<T>(endpoint, { ...options, method: "POST", body });

export const put = <T>(
  endpoint: string,
  body: unknown,
  options?: Omit<RequestOptions, "method">
) => apiRequest<T>(endpoint, { ...options, method: "PUT", body });

export const patch = <T>(
  endpoint: string,
  body: unknown,
  options?: Omit<RequestOptions, "method">
) => apiRequest<T>(endpoint, { ...options, method: "PATCH", body });

export const del = <T>(
  endpoint: string,
  options?: Omit<RequestOptions, "method">
) => apiRequest<T>(endpoint, { ...options, method: "DELETE" });
