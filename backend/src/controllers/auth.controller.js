import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/authCookies.js";
import { toPublicUser } from "../utils/helpers.js";

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.validated.body;
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, name, role: "user" });
  const token = signToken(user._id);
  setAuthCookie(res, token);
  res.status(201).json({ user: toPublicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email });
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !valid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken(user._id);
  setAuthCookie(res, token);
  res.json({ user: toPublicUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});
