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

// ============================================================
// ルート登録（OAuth 2.0 Authorization Code Flow のステップ順）
// ============================================================

// --- トップページ（認証状態の表示） ---
app.route("/", home);

// --- Step 1: 認可リクエスト開始 ---
// state パラメータ生成 → 認可サーバーの /authorize にリダイレクト
app.route("/", login);

// --- Step 3: コールバック（認可コード受信 & トークン交換） ---
// 認可サーバーから認可コードを受信 → /token でアクセストークンに交換
app.route("/", callback);

// --- Step 5: リソースアクセス（APIプロキシ） ---
// アクセストークンを付与してバックエンドAPIにプロキシ
app.route("/", proxy);

// --- ヘルスチェック ---
app.get("/health", (c) => c.json({ status: "ok", service: "frontend" }));

// --- サーバー起動 ---
console.log("[Frontend] 起動中... http://localhost:3000");
serve({
  fetch: app.fetch,
  port: 3000,
});
