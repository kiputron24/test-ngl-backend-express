import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { ErrorHandler } from "../config/http";

interface ValidationError {
  path?: string;
  msg?: string;
}

type ErrorData = ValidationError | ValidationError[] | unknown;

const ErrorHandlerMiddleware = (
  err: ErrorHandler | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  const isErrorHandler = err instanceof ErrorHandler;
  const message =
    isErrorHandler && (err as ErrorHandler).status
      ? err.message
      : "Internal Server Error";

  let errors: ErrorData | (string | ValidationError)[] | null = isErrorHandler
    ? (err as ErrorHandler).data
    : null;

  if (message === "Invalid data") {
    const arr_check = errors instanceof Array;

    if (!arr_check) errors = [errors];

    const result: (string | ValidationError)[] = [];
    let key = 0;
    const keys: Record<string, number> = {};

    (errors as unknown[]).forEach((val: unknown) => {
      const validation = val as ValidationError;
      const { path, msg } = validation;

      if (path && msg) {
        if (!keys[path]) {
          keys[path] = 1;
          result[key] = msg;
          key += 1;
        }
      } else {
        result[key] = validation;
        key += 1;
      }
    });

    errors = result;
  } else {
    errors = errors instanceof Array ? errors : errors ? [errors] : null;
  }

  logger.warn(message);

  const statusCode = isErrorHandler ? (err as ErrorHandler).status || 500 : 500;

  res.status(statusCode).send({
    meta: {
      status: "failure",
      message,
      code: statusCode,
    },
    errors,
  });
};

export default ErrorHandlerMiddleware;
