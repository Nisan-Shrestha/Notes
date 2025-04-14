import { NextFunction, Request, Response } from "express";
// import { BadRequest } from "../error/BadRequest";
import { ZodSchema } from "zod";
import { BaseError } from "../utils/BaseError";
import loggerWithNameSpace from "../utils/logger";

type AnySchema = ZodSchema<any, any>;

const logger = loggerWithNameSpace("SchemaValidation");

export const validateReqSchema =
  (schema: AnySchema) => (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      logger.error("Validation failed", { errors });
      next(
        new BaseError(
          400,
          `${errors[0].path}.${errors[0].message}`,
          parseResult.error
        )
      );
      return;
    }

    res.locals.validated = parseResult.data;
    next();
  };
