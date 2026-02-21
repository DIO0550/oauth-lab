import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import publicRoutes from "./routes/public.js";
import protectedRoutes from "./routes/protected.js";

const app = new Hono();

app.use("/*", cors({ origin: "*" }));

// ルート登録
app.route("/", publicRoutes);
app.route("/", protectedRoutes);

const port = 3001;
console.log(`[Backend] Starting on port ${port}`);
serve({ fetch: app.fetch, port });
