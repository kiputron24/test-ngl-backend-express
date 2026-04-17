import dotenv from "dotenv";

dotenv.config();

const env = {
  SERVER: {
    PORT: process.env.PORT || 3000,
  },
  DB: {
    HOST: process.env.DB_HOST || "localhost",
    PORT: Number(process.env.DB_PORT) || 3306,
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "",
    NAME: process.env.DB_NAME || "nlg",
  },
};

export default env;
