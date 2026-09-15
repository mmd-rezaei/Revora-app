import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 2500 });
    console.log("Connected to MongoDB");
    return;
  } catch (err) {
    if (env.NODE_ENV === "production") {
      throw err;
    }
  }

  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const memory = await MongoMemoryServer.create();
  await mongoose.connect(memory.getUri("revora"));
  console.log("Local MongoDB not found. Using in-memory database for this session.");
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
