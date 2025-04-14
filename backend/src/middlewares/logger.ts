import { NextFunction, Response } from "express";
import loggerWithNameSpace from "../utils/logger";
import { Request } from "../utils/requestHandler";

const logger = loggerWithNameSpace("RequestLogger");

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method}: ${req.url}`);
  next();
}
