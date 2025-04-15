import { IUser } from "@/types/Auth.types";

const TOKEN_KEY = "access_token";
const USER_KEY = "user";

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = (): IUser | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const setStoredUser = (user: IUser | null): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const clearAuthData = (): void => {
  removeAuthToken();
  removeStoredUser();
};
