import { NextFunction, Request, Response } from "express";
import { z } from "zod";
// import { BadRequest } from "../error/BadRequest";
import loggerWithNameSpace from "../utils/logger";
import { ZodSchema } from "zod";
import { BaseError } from "../utils/BaseError";

type AnySchema = ZodSchema<any, any>;

const logger = loggerWithNameSpace("SchemaValidation");

export const validateZod =
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
      return next(new BaseError(400, "Request validation failed"));
    }

    const { body, params, query } = parseResult.data;
    req.body = body;
    req.params = params;
    req.query = query;
    next();
  };
