import { AuthResponse, LoginRequest, SignupRequest } from "@/types/Auth.types";
import { clearAuthData, setAuthToken } from "@/utils/auth";
import { toast } from "react-toastify";
import { get, post } from "../client";

export const authService = {
  async checkUsernameAvailability(username: string) {
    const response = await get<{ available: boolean }>(
      `/auth/check-username/${username}`,
      {
        authenticated: false,
        skipRefreshToken: true,
      }
    );
    return response;
  },

  async login(credentials: LoginRequest) {
    const response = await post<AuthResponse>("/auth/login", credentials, {
      authenticated: false,
      skipRefreshToken: true,
    });

    if (response.data) {
      setAuthToken(response.data.accessToken);
    }

    return response;
  },

  async signup(userData: SignupRequest) {
    const response = await post<AuthResponse>("/auth/signup", userData, {
      authenticated: false,
      skipRefreshToken: true,
    });

    if (response.data) {
      setAuthToken(response.data.accessToken);
    }

    return response;
  },

  async logout() {
    try {
      await post("/auth/logout", {});
      clearAuthData();
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      clearAuthData();
      return { success: false };
    } finally {
      toast.success("Logout successful");
    }
  },

  async getCurrentUser() {
    const response = await get<AuthResponse>("/auth/me");
    return response;
  },

  async refreshToken() {
    try {
      const response = await post<AuthResponse>(
        "/auth/refresh-token",
        {},
        {
          authenticated: false,
          skipRefreshToken: true,
        }
      );

      if (response.data?.accessToken) {
        setAuthToken(response.data.accessToken);
        return { success: true };
      }

      return { success: false, error: response.error };
    } catch (error) {
      clearAuthData();
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to refresh token",
      };
    }
  },
};
