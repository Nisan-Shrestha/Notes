import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "../hooks/useAuth";
import { IUser } from "../types/Auth.types";
import {
  getAuthToken,
  getStoredUser,
  removeStoredUser,
  setStoredUser,
} from "@/utils/auth";
import { authService } from "@/api/services/authService";
import { toast } from "react-toastify";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);

        try {
          const { data, error } = await authService.getCurrentUser();
          if (data) {
            setUser(data.user);
            setStoredUser(data.user);
          } else if (error) {
            await logout();
          }
        } catch (err) {
          console.error("Auth initialization error:", err);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    setError(null);
    toast.dismiss();
    try {
      const { data, error } = await authService.login({ identifier, password });

      if (error) {
        setError(error);
        toast.error("Login failed. Please check your credentials.");
        throw new Error(error);
      }

      if (data?.user) {
        setUser(data.user);
        setStoredUser(data.user);
      }
      toast.success("Login successful");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    username: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await authService.signup({
        email,
        password,
        name,
        username,
      });

      if (error) {
        setError(error);
        toast.error(error);
        throw new Error(error);
      }

      if (data?.user) {
        setUser(data.user);
        setStoredUser(data.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      removeStoredUser();
      setIsLoading(false);
    }
  };

  const checkUsername = async (username: string) => {
    try {
      const { data, error } = await authService.checkUsernameAvailability(
        username
      );
      if (error) {
        if (error === "Failed to fetch") {
          toast.error("Network error. Can't connect to server.");
        }
        setError(error);
        throw new Error(error);
      }
      if (data) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking username availability:", error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    checkUsername,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
