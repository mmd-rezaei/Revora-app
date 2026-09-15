import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { loginSchema, registerSchema } from "../validators/schemas.js";
import * as auth from "../controllers/auth.controller.js";

const router = Router();

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again later." },
});

router.post("/register", authLimit, validate(registerSchema), auth.register);
router.post("/login", authLimit, validate(loginSchema), auth.login);
router.post("/logout", auth.logout);
router.get("/me", requireAuth, auth.me);

export default router;
