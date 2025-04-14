import { NextFunction, Request, Response } from "express";
import { BaseError } from "../utils/BaseError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("ErrorHandler");

export const errorHandler = (
  err: BaseError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.message} | Traceback:\n${err.stack}`);

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
    next();
  }
  const statusCode = err instanceof BaseError ? err.statusCode : 500;
  const message =
    err instanceof BaseError ? err.message : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
