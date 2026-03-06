// ============================================================
// Backend - リソースサーバー（Protected API）
// ポート: 3001
// ============================================================

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import publicRoute from "./routes/public.js";
import protectedRoute from "./routes/protected.js";

const app = new Hono();

// --- CORS設定 ---
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST"],
    allowHeaders: ["Authorization", "Content-Type"],
  })
);

// ============================================================
// ルート登録（リソースサーバーの役割別）
// ============================================================

// --- 公開エンドポイント（トークン不要） ---
app.route("/", publicRoute);

// --- Step 5: 保護されたリソース（トークン必須） ---
// Bearer トークンを認可サーバーの /introspect で検証してからアクセスを許可
app.route("/", protectedRoute);

// --- ヘルスチェック ---
app.get("/health", (c) => c.json({ status: "ok", service: "backend" }));

// --- サーバー起動 ---
console.log("[Backend] 起動中... http://localhost:3001");
serve({
  fetch: app.fetch,
  port: 3001,
});
