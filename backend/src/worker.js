import { DurableObject } from "cloudflare:workers";
import { createServer } from "node:http";
import { handleAsNodeRequest } from "cloudflare:node";
import app from "./app.js";
import { connectDb } from "./config/database.js";

const server = createServer(app);
server.listen(3000);

export class RevoraApi extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.dbReady = null;
  }

  async fetch(request) {
    if (!this.dbReady) {
      this.dbReady = connectDb();
    }

    try {
      await this.dbReady;
    } catch (error) {
      this.dbReady = null;
      console.error("MongoDB connection failed:", error.message);

      return Response.json(
        { error: "Database connection failed" },
        { status: 503 },
      );
    }

    return handleAsNodeRequest(3000, request);
  }
}

export default {
  async fetch(request, env) {
    const id = env.REVORA_API.idFromName("revora-api");
    return env.REVORA_API.get(id).fetch(request);
  },
};
