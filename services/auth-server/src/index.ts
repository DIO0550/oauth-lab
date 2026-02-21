import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import authorizeRoutes from "./routes/authorize.js";
import tokenRoutes from "./routes/token.js";
import introspectRoutes from "./routes/introspect.js";
import userinfoRoutes from "./routes/userinfo.js";

const app = new Hono();

app.use("/*", cors({ origin: "*" }));

// ルート登録
app.route("/", authorizeRoutes);
app.route("/", tokenRoutes);
app.route("/", introspectRoutes);
app.route("/", userinfoRoutes);

// ヘルスチェック
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "auth-server" });
});

const port = 8080;
console.log(`[Auth Server] Starting on port ${port}`);
serve({ fetch: app.fetch, port });
