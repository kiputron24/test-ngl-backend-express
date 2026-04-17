import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError } from "zod";
import { ErrorHandler } from "../config/http";

const validate =
  (
    schema: ZodObject<ZodRawShape>,
    source: "body" | "query" | "params" = "body"
  ) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      if (source === "body") {
        req.body = parsed;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        err.issues.forEach(e => {
          const key = e.path.join(".");
          if (!errors[key]) errors[key] = [];
          errors[key].push(e.message);
        });
        next(new ErrorHandler("Validation failed", 422, errors));
      } else {
        next(err);
      }
    }
  };

export default validate;
