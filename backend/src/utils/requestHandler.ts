import { Response, NextFunction } from "express";
import { Request } from "../interfaces/Auth.Interface";
import loggerWithNameSpace from "./logger";

const logger = loggerWithNameSpace("Request Hanlder");

export function handleRequest(callbacks: Function) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callbacks(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
