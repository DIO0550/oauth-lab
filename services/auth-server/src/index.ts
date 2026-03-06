// ============================================================
// Auth Server - 認可サーバー（OAuth 2.0 Authorization Server）
// ポート: 8080
// ============================================================

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import authorize from "./routes/authorize.js";
import approve from "./routes/approve.js";
import token from "./routes/token.js";
import introspect from "./routes/introspect.js";
import userinfo from "./routes/userinfo.js";

const app = new Hono();

// --- CORS設定 ---
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST"],
  })
);

// --- ルート登録 ---
app.route("/", authorize);
app.route("/", approve);
app.route("/", token);
app.route("/", introspect);
app.route("/", userinfo);

// --- ヘルスチェック ---
app.get("/health", (c) => c.json({ status: "ok", service: "auth-server" }));

// --- サーバー起動 ---
console.log("[Auth Server] 起動中... http://localhost:8080");
serve({
  fetch: app.fetch,
  port: 8080,
});
