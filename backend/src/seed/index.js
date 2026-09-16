import { connectDb, disconnectDb } from "../config/database.js";
import { seedDatabase } from "./run.js";

const reset = process.env.SEED_FORCE === "1" || process.env.SEED_FORCE === "true";

connectDb()
  .then(() => seedDatabase({ reset }))
  .then(() => disconnectDb())
  .catch((err) => {
    console.error("Seed failed");
    console.error(err.message);
    process.exit(1);
  });
