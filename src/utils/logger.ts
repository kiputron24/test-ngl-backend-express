import winston from "winston";

import datetime from "./datetime";

interface LogMeta {
  url?: string;
  fromIp?: string;
  duration?: number;
}

interface LogEntry extends winston.Logform.TransformableInfo {
  meta?: LogMeta;
}

const winston_config = {
  format: winston.format.combine(
    winston.format.colorize({ all: true }),

    winston.format.printf((log: LogEntry) => {
      const timestamp = datetime.log();
      const { level } = log;
      let { message } = log;

      const resLog = `${timestamp} [${level}] : `;

      if (log.meta) {
        const { url, fromIp, duration } = log.meta;

        if (url) message = `[${message}] ${log.meta.url}`;
        if (fromIp) message = `${fromIp} | ${message}`;
        if (duration !== undefined) message = `${message} (${duration}ms)`;
      }

      return resLog + message;
    })
  ),
};

const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.File({
      filename: "./logs/app.log",
      format: winston.format.combine(winston.format.uncolorize()),
    }),

    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
      format: winston.format.combine(winston.format.uncolorize()),
    }),

    new winston.transports.Console(),
  ],

  format: winston_config.format,
});

export default logger;
