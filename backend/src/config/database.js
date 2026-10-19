import mongoose from "mongoose";
import { env } from "./env.js";

let connectionPromise;

export async function connectDb() {
  mongoose.set("strictQuery", true);

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    await connectionPromise;
    console.log("Connected to MongoDB");
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }
}

export async function disconnectDb() {
  connectionPromise = undefined;
  await mongoose.disconnect();
}
