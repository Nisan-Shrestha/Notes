import { z } from "zod";

// regex that allows only letters (upper/lower) and digits, at least one character
const alphanumericRegex = /^[a-zA-Z0-9]+$/;

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    username: z
      .string()
      .regex(alphanumericRegex, "Username must be alphanumeric"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(3, "Username or email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>["body"];
export type LoginDTO = z.infer<typeof loginSchema>["body"];

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
