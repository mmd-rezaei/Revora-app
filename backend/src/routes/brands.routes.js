import { Router } from "express";
import * as cars from "../controllers/cars.controller.js";

const router = Router();
router.get("/", cars.listBrands);
router.get("/:slug", cars.getBrand);
export default router;
