import dotenv from "dotenv";

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const jwtSecret = required("JWT_SECRET");
if (jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters");
}

export const env = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: required("MONGODB_URI"),
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  COOKIE_NAME: "revora_token",
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL || "admin@revora.com",
  SEED_USER_EMAIL: process.env.SEED_USER_EMAIL || "user@revora.com",
  SEED_PASSWORD: process.env.SEED_PASSWORD || "admin123",
};
