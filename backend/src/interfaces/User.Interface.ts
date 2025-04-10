import { UUID } from "node:crypto";

export interface IUser {
  id: UUID;
  username: string;
  name: string;
  email: string;
  passwordHash: string | null;
}