import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError, asyncHandler } from "./errorHandler.js";

function readToken(req) {
  const cookieToken = req.cookies?.[env.COOKIE_NAME];
  if (cookieToken) return cookieToken;

  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return null;
}

export async function attachUser(req) {
  const token = readToken(req);
  if (!token) return null;

  const payload = jwt.verify(token, env.JWT_SECRET);
  if (!payload?.sub) return null;

  const user = await User.findById(payload.sub).select("-passwordHash").lean();
  return user;
}

export const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    req.user = await attachUser(req);
  } catch {
    req.user = null;
  }
  next();
});

export const requireAuth = asyncHandler(async (req, res, next) => {
  try {
    const user = await attachUser(req);
    if (!user) {
      throw new AppError("Authentication required", 401);
    }
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Authentication required", 401);
  }
});

export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  if (req.user.role !== "admin") {
    throw new AppError("Admin access required", 403);
  }
  next();
});
