import config from "../config";
import ms, { StringValue } from "ms";

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: ms(config.jwt.refreshTokenExpiry as StringValue),
};
