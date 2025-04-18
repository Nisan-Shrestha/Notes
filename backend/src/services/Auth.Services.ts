import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import type { StringValue } from "ms";
import config from "../config";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "../models/User.Model";
import { AuthTokens, CreateUserDTO, LoginDTO } from "../schemas/Auth.Schema";
import { BaseError } from "../utils/BaseError";
import prisma from "../config/prismaClient";
import { User } from "@prisma/client";

export async function checkUsername(username: string): Promise<boolean> {
  const user = await getUserByUsername(username.toLowerCase());
  if (user) {
    throw new BaseError(StatusCodes.CONFLICT, "Username is already taken");
  }
  return !user;
}

export async function signup(
  userInfo: CreateUserDTO
): Promise<AuthTokens & { user: Omit<User, "hashedPassword"> }> {
  userInfo.username = userInfo.username.toLowerCase();
  userInfo.email = userInfo.email.toLowerCase();

  const [emailExists, usernameExists] = await Promise.all([
    getUserByEmail(userInfo.email),
    getUserByUsername(userInfo.username),
  ]);

  if (emailExists) {
    throw new BaseError(StatusCodes.CONFLICT, "Email is already taken");
  }

  if (usernameExists) {
    throw new BaseError(StatusCodes.CONFLICT, "Username is already taken");
  }

  const hashedPassword = await bcrypt.hash(userInfo.password, 10);
  const { password, ...userCreateData } = { ...userInfo, hashedPassword };

  const createdUser = await createUser(userCreateData);

  const payload = {
    id: createdUser.id,
    name: createdUser.name,
    username: createdUser.username,
    email: createdUser.email,
  };

  if (!config.jwt.secret)
    throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, "Secret not Setup.");

  const jwtSecret = config.jwt.secret;

  const accessToken = sign(payload, jwtSecret, {
    expiresIn: "1d",
  });
  const refreshToken = sign(payload, jwtSecret, {
    expiresIn: "1d",
  });

  const { hashedPassword: hp, ...userWithoutPassword } = createdUser;
  return { accessToken, refreshToken, user: userWithoutPassword };
}

export async function login(
  credentials: LoginDTO
): Promise<AuthTokens & { user: Omit<User, "hashedPassword"> }> {
  const identifier = credentials.identifier.toLowerCase();

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  const user = isEmail
    ? await getUserByEmail(identifier)
    : await getUserByUsername(identifier);

  if (!user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.hashedPassword
  );
  if (!isPasswordValid) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const payload = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
  };

  if (!config.jwt.secret)
    throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, "Secret not Setup.");

  const jwtSecret = config.jwt.secret;

  const accessToken = sign(payload, jwtSecret, {
    expiresIn: config.jwt.accessTokenExpiry as StringValue,
  });
  const refreshToken = sign(payload, jwtSecret, {
    expiresIn: config.jwt.refreshTokenExpiry as StringValue,
  });
  const { hashedPassword, ...userWithoutPassword } = user;
  return { accessToken, refreshToken, user: userWithoutPassword };
}

export async function refreshToken(
  token: string
): Promise<AuthTokens & { user: Omit<User, "hashedPassword"> }> {
  let payload: JwtPayload;

  if (!config.jwt.secret)
    throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, "Secret not Setup.");
  const jwtSecret = config.jwt.secret;

  try {
    payload = verify(token, jwtSecret) as JwtPayload;
  } catch {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }
  const { exp, iat, nbf, ...cleanPayload } = payload;

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });
  if (!user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  const accessToken = sign(cleanPayload, jwtSecret, {
    expiresIn: config.jwt.accessTokenExpiry as StringValue,
  });
  const newRefreshToken = sign(cleanPayload, jwtSecret, {
    expiresIn: config.jwt.refreshTokenExpiry as StringValue,
  });

  const { hashedPassword, ...userWithoutPassword } = user;
  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: userWithoutPassword,
  };
}

export async function getSelf(
  token: string
): Promise<Omit<User, "hashedPassword">> {
  let payload: JwtPayload;
  if (!config.jwt.secret)
    throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, "Secret not Setup.");
  const jwtSecret = config.jwt.secret;

  try {
    payload = verify(token, jwtSecret) as JwtPayload;
  } catch {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }
  const { exp, iat, nbf, ...cleanPayload } = payload;

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });
  if (!user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }
  const { hashedPassword, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
