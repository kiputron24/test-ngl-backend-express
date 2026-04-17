import url from "url";
import { Request, Response } from "express";
import logger from "../utils/logger";

interface ErrorData {
  [key: string]: unknown;
}

interface ResponseMeta {
  status: "success" | "error";
  message: string;
  code: number;
}

interface SuccessResponse {
  meta: ResponseMeta;
  data?: unknown;
}

interface ErrorResponse {
  meta: ResponseMeta;
  error: unknown;
}

type HttpResponseBody = SuccessResponse | ErrorResponse;

class ErrorHandler extends Error {
  status: number;
  data: ErrorData | null;

  constructor(message: string, status: number, data: ErrorData | null = null) {
    super();
    this.message = message;
    this.status = status;
    this.data = data;
  }
}

function urlFormatter(request: Request): string {
  return url.format({
    protocol: request.protocol,
    host: request.get("host"),
    pathname: request.originalUrl,
  });
}

function httpResponse(
  response: Response,
  status: "success" | "error",
  message: string,
  data: unknown = null,
  code: number | null = null
): Response {
  logger.info(message);

  if (!code) code = status === "success" ? 200 : 400;

  const result: HttpResponseBody = {
    meta: {
      status,
      message,
      code,
    },
  } as HttpResponseBody;

  if (status === "success") {
    if (data) (result as SuccessResponse).data = data;
  } else {
    (result as ErrorResponse).error = data;
  }

  return response.status(code).send(result);
}

export { urlFormatter, httpResponse, ErrorHandler };
