import { Router } from "express";
import { optionalAuth, requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  carsQuerySchema,
  idParamSchema,
  rejectCarSchema,
  submitCarSchema,
} from "../validators/schemas.js";
import * as cars from "../controllers/cars.controller.js";

const router = Router();

router.get("/", optionalAuth, validate(carsQuerySchema), cars.listCars);
router.post("/submit", requireAuth, validate(submitCarSchema), cars.submitCar);
router.post("/", requireAuth, requireAdmin, validate(submitCarSchema), cars.createCarAdmin);
router.get("/:id", optionalAuth, cars.getCar);
router.put("/:id", requireAuth, requireAdmin, validate(submitCarSchema), cars.updateCar);
router.delete("/:id", requireAuth, requireAdmin, validate(idParamSchema), cars.deleteCar);
router.patch("/:id/approve", requireAuth, requireAdmin, validate(idParamSchema), cars.approveCar);
router.patch("/:id/reject", requireAuth, requireAdmin, validate(rejectCarSchema), cars.rejectCar);

export default router;
