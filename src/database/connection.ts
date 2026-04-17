import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import env from "../config/env";
import * as schema from "./schema";

const pool = mysql.createPool({
  host: env.DB.HOST,
  port: env.DB.PORT,
  user: env.DB.USER,
  password: env.DB.PASSWORD,
  database: env.DB.NAME,
});

const db = drizzle(pool, { schema, mode: "default" });

export default db;
