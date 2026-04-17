import { Request, Response, NextFunction } from "express";
import { urlFormatter } from "../config/http";
import logger from "../utils/logger";

interface RequestMeta {
  url: string;
  fromIp: string | undefined;
  duration?: number;
}

const requestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const url = urlFormatter(req);
  const fromIp =
    (req.headers["x-forwarded-for"] as string)?.split(",").shift() ||
    req.socket?.remoteAddress;

  logger.info({ message: req.method, meta: { url, fromIp } });

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger.info({
      message: `${req.method} completed`,
      meta: { url, fromIp, duration },
    });
  });

  next();
};

export default requestHandler;
