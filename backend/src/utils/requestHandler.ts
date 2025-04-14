import { User } from "@prisma/client";
import { Request as ExpressRequest, NextFunction, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { BaseError } from "./BaseError";
import loggerWithNameSpace from "./logger";

const logger = loggerWithNameSpace("Request Hanlder");

export interface Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends ExpressRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: Pick<User, "id" | "username" | "name" | "email">;
}

export function handleRequest(callbacks: Function) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callbacks(req, res, next);
    } catch (e) {
      logger.error("Error in request handler");
      const error =
        e instanceof BaseError
          ? e
          : new BaseError(500, "Internal Server Error", e as Error);
      next(error);
    }
  };
}

export function returnResponse(
  res: Response,
  data: any,
  message?: string,
  statusCode: number = 200
) {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}
