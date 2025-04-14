import { Prisma, User } from "@prisma/client";
import prisma from "../config/prismaClient";
import { CreateUserDTO } from "../schemas/Auth.Schema";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { username },
  });
};

export const createUser = async (
  data: Prisma.UserCreateArgs["data"]
): Promise<User> => {
  return prisma.user.create({
    data,
  });
};
