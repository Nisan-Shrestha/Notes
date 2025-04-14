import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as AuthService from "../services/Auth.Services";
import { BaseError } from "../utils/BaseError";
import { refreshTokenCookieOptions } from "../utils/cookieOptions";
import loggerWithNameSpace from "../utils/logger";
import { returnResponse } from "../utils/requestHandler";

const logger = loggerWithNameSpace("AuthController");

export async function signup(req: Request, res: Response, next: NextFunction) {
  const data = res.locals.validated.body;

  const serviceResponse = await AuthService.signup(data);

  if (!serviceResponse)
    throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, "Signup Failed");
  res.cookie(
    "refreshToken",
    serviceResponse.refreshToken,
    refreshTokenCookieOptions
  );

  returnResponse(
    res,
    { accessToken: serviceResponse.accessToken },
    "User Created Successfully",
    StatusCodes.CREATED
  );
  return;
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const data = res.locals.validated.body;

  const serviceResponse = await AuthService.login(data);

  if (!serviceResponse)
    throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, "Login Failed");

  res.cookie(
    "refreshToken",
    serviceResponse.refreshToken,
    refreshTokenCookieOptions
  );

  returnResponse(
    res,
    { accessToken: serviceResponse.accessToken },
    "User Logged In Successfully",
    StatusCodes.OK
  );
  return;
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "Refresh token not provided");
  }

  const serviceResponse = await AuthService.refreshToken(token);
  if (!serviceResponse) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "Could not refresh token");
  }

  res.cookie(
    "refreshToken",
    serviceResponse.refreshToken,
    refreshTokenCookieOptions
  );

  returnResponse(
    res,
    { accessToken: serviceResponse.accessToken },
    "Token refreshed successfully",
    StatusCodes.OK
  );
  return;
}
