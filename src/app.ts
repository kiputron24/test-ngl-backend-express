import express from "express";
import cors from "cors";
import helmet from "helmet";
import moment from "moment";
import { sql } from "drizzle-orm";

import env from "./config/env";
import logger from "./utils/logger";
import router from "./routes";
import requestHandler from "./middleware/request-handler";
import ErrorHandlerMiddleware from "./middleware/error-handler";
import db from "./database/connection";

const app = express();

const port = env.SERVER.PORT;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestHandler);

app.use("/api", router());

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Not Found",
  });
});

app.use(ErrorHandlerMiddleware);

app.listen(port, async () => {
  console.clear();
  logger.info(`Server is running on port ${port}`);
  moment.locale("id");

  try {
    await db.execute(sql`SELECT 1`);
    logger.info("Database connected successfully");
  } catch (err) {
    logger.error("Database connection failed", err);
  }
});
