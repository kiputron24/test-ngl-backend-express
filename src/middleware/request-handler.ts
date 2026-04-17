import { Request, Response, NextFunction } from "express";
import { urlFormatter } from "../config/http";
import logger from "../utils/logger";

interface RequestMeta {
  url: string;
  fromIp: string | undefined;
}

const requestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const url = urlFormatter(req);
  const fromIp =
    (req.headers["x-forwarded-for"] as string)?.split(",").shift() ||
    req.socket?.remoteAddress;

  logger.info({ message: req.method, meta: { url, fromIp } });

  next();
};

export default requestHandler;
