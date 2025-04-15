export interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    username: string
  ) => Promise<void>;
  logout: () => void;
  checkUsername: (username: string) => Promise<boolean>;
  error: string | null;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  name: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  username: string;
  name: string;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
}