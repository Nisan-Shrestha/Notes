import { StatusCodes } from "http-status-codes";
import { CreateUserDTO } from "../schemas/Auth.Schema";
import { BaseError } from "../utils/BaseError";
import { createUser, getUserByEmail, getUserByUsername } from "../models/User.Model";

export async function signup(userInfo: CreateUserDTO) {
  userInfo.username = userInfo.username.toLowerCase();
  userInfo.email = userInfo.email.toLowerCase();

  const existingEmail = await getUserByEmail(userInfo.email);
  if (existingEmail) {
    throw new BaseError(StatusCodes.CONFLICT, "Email is already taken");
  }

  const existingUsername = await getUserByUsername(userInfo.username);
  if (existingUsername) {
    throw new BaseError(StatusCodes.CONFLICT, "Username is already taken");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const createdUser = await createUser({...userInfo, hashedPassword});

  const payload = {
    id: createdUser.id,
    name: createdUser.name,
    username: createdUser.username,
    email: createdUser.email,
    role: createdUser.role,
    pfpUrl: null,
  };

  if (!config.jwt.secret) {
    throw new Internal("Secret not Setup.");
  }

  const accessToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiryMS,
  });

  const refreshToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshTokenExpiryMS,
  });

  return {
    accessToken,
    refreshToken,
    username: payload.username,
    pfpUrl: payload.pfpUrl,
    redirected: false,
    promptUsernameChange: createdUser.id == createdUser.username,
  };
}
