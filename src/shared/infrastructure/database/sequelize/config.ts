// src/shared/infrastructure/database/sequelize/config.ts
import { SSL_OPTIONS } from "./constants";

export function getSSLConfig() {
  return process.env.NODE_ENV !== "production" ? false : SSL_OPTIONS;
}
