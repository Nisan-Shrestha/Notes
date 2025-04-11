import { Prisma } from "@prisma/client";
import prisma from "../config/prismaClient";
import { CreateUserDTO } from "../schemas/Auth.Schema";

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const getUserByUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: { username },
  });
};

// Create a user
export const createUser = async (data: Prisma.UserCreateArgs["data"]) => {
  return prisma.user.create({
    data,
  });
};
