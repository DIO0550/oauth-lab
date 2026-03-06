// ============================================================
// Frontend - クライアントアプリ（OAuth 2.0 Client）
// ポート: 3000
// ============================================================

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import home from "./routes/home.js";
import login from "./routes/login.js";
import callback from "./routes/callback.js";
import proxy from "./proxy.js";

const app = new Hono();

// --- ルート登録 ---
app.route("/", home);
app.route("/", login);
app.route("/", callback);
app.route("/", proxy);

// --- ヘルスチェック ---
app.get("/health", (c) => c.json({ status: "ok", service: "frontend" }));

// --- サーバー起動 ---
console.log("[Frontend] 起動中... http://localhost:3000");
serve({
  fetch: app.fetch,
  port: 3000,
});
