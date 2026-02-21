import { serve } from "@hono/node-server";
import { Hono } from "hono";
import homeRoutes from "./routes/home.js";
import loginRoutes from "./routes/login.js";
import callbackRoutes from "./routes/callback.js";
import proxyRoutes from "./proxy.js";

const app = new Hono();

// ルート登録
app.route("/", homeRoutes);
app.route("/", loginRoutes);
app.route("/", callbackRoutes);
app.route("/", proxyRoutes);

// ヘルスチェック
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "frontend" });
});

const port = 3000;
console.log(`[Frontend] Starting on port ${port}`);
serve({ fetch: app.fetch, port });
