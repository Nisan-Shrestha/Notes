import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as AuthService from "../services/Auth.Services";
import loggerWithNameSpace from "../utils/logger";
import { BaseError } from "../utils/BaseError";

const logger = loggerWithNameSpace("AuthController");

export async function signup(req: Request, res: Response, next: NextFunction) {
  const data = req.body;

  let serviceResponse = await AuthService.signup(data);

  if (serviceResponse) {
    res.status(StatusCodes.CREATED).json({
      message: "Signed Up succesfully.",
      payload: {
        accessToken: serviceResponse.accessToken,
        refreshToken: serviceResponse.refreshToken,
      },
    });
    return;
  }

  throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR,"Signup Failed");
}
