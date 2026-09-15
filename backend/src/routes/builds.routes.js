import { Router } from "express";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  favoriteSchema,
  idParamSchema,
  previewBuildSchema,
  saveBuildSchema,
  updateBuildSchema,
} from "../validators/schemas.js";
import * as builds from "../controllers/builds.controller.js";

export const partsRouter = Router();
partsRouter.get("/", builds.listParts);

export const buildsRouter = Router();
buildsRouter.post("/preview", optionalAuth, validate(previewBuildSchema), builds.previewBuild);
buildsRouter.get("/", requireAuth, builds.listBuilds);
buildsRouter.post("/", requireAuth, validate(saveBuildSchema), builds.createBuild);
buildsRouter.get("/:id", requireAuth, validate(idParamSchema), builds.getBuild);
buildsRouter.put("/:id", requireAuth, validate(updateBuildSchema), builds.updateBuild);
buildsRouter.delete("/:id", requireAuth, validate(idParamSchema), builds.deleteBuild);

export const favoritesRouter = Router();
favoritesRouter.get("/", requireAuth, builds.listFavorites);
favoritesRouter.post("/", requireAuth, validate(favoriteSchema), builds.addFavorite);
favoritesRouter.delete("/:id", requireAuth, builds.removeFavorite);
