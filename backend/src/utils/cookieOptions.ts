import ms, { StringValue } from "ms";
import config from "../config";

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: ms(config.jwt.refreshTokenExpiry as StringValue),
};
