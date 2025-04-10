import { Request, Response, NextFunction } from "express";
import { BaseError } from "../utils/BaseError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("ErrorHandler")

export const errorHandler = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  logger.error(err.message)

  const statusCode = err instanceof BaseError ? err.statusCode : 500;
  const message = err instanceof BaseError ? err.message : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
