import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { loginSchema, registerSchema } from "../validators/schemas.js";
import * as auth from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), auth.register);
router.post("/login", validate(loginSchema), auth.login);
router.post("/logout", auth.logout);
router.get("/me", requireAuth, auth.me);
export default router;
