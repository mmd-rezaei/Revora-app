import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { connectDb } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { seedDatabase } from "./seed/run.js";
import authRoutes from "./routes/auth.routes.js";
import carsRoutes from "./routes/cars.routes.js";
import brandsRoutes from "./routes/brands.routes.js";
import { buildsRouter, favoritesRouter, partsRouter } from "./routes/builds.routes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "200kb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "revora-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/tuning-parts", partsRouter);
app.use("/api/builds", buildsRouter);
app.use("/api/favorites", favoritesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

connectDb()
  .then(() => seedDatabase())
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`REVORA API running on http://localhost:${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start API");
    console.error(err.message);
    process.exit(1);
  });
