import { User } from "@prisma/client";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import config from "../config";
import { BaseError } from "../utils/BaseError";
import loggerWithNameSpace from "../utils/logger";
import { Request } from "../utils/requestHandler";

const logger = loggerWithNameSpace("RequestLogger");

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "Access token missing");
  }

  if (!config.jwt.secret)
    throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, "Secret not Setup.");

  const jwtSecret = config.jwt.secret;
  verify(token, jwtSecret, (err, user) => {
    if (err) {
      throw new BaseError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }
    req.user = user as Pick<User, "id" | "username" | "name" | "email">;
    next();
  });
}
