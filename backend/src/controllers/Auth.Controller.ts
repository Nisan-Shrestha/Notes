import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as AuthService from "../services/Auth.Services";
import { BaseError } from "../utils/BaseError";
import { refreshTokenCookieOptions } from "../utils/cookieOptions";
import loggerWithNameSpace from "../utils/logger";
import { returnResponse } from "../utils/requestHandler";

const logger = loggerWithNameSpace("AuthController");

export async function checkUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.params;
  const serviceResponse = await AuthService.checkUsername(username);
  if (!serviceResponse) {
    throw new BaseError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Username check failed"
    );
  }
  returnResponse(
    res,
    { available: serviceResponse },
    "Username check successful",
    StatusCodes.OK
  );
  return;
}

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
    { accessToken: serviceResponse.accessToken, user: serviceResponse.user },
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
    { accessToken: serviceResponse.accessToken, user: serviceResponse.user },
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
    { accessToken: serviceResponse.accessToken, user: serviceResponse.user },
    "Token refreshed successfully",
    StatusCodes.OK
  );
  return;
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  res.clearCookie("refreshToken");
  returnResponse(res, {}, "Logged out successfully", StatusCodes.OK);
}

export async function getSelf(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.refreshToken;
  const serviceResponse = await AuthService.getSelf(token);
  if (!serviceResponse) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "Could not fetch user");
  }
  const user = serviceResponse;
  if (!user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "User not found");
  }
  returnResponse(res, { user }, "User fetched successfully", StatusCodes.OK);
}
