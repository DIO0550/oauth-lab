// ============================================================
// Auth Server - 認可サーバー（OAuth 2.0 Authorization Server）
// ポート: 8080
// ============================================================

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import authorize from "./routes/step01/authorize.js";
import approve from "./routes/step01/approve.js";
import token from "./routes/step01/token.js";
import introspect from "./routes/step01/introspect.js";
import userinfo from "./routes/step01/userinfo.js";

const app = new Hono();

// --- CORS設定 ---
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST"],
  })
);

// ============================================================
// ルート登録（OAuth 2.0 Authorization Code Flow のステップ順）
// ============================================================

// --- Step 1: 認可リクエスト ---
// クライアントからの認可リクエストを受け取り、ログインフォームを表示
app.route("/", authorize);

// --- Step 2: ユーザー認証 & 認可承認 ---
// ユーザーが認証情報を送信 → 認可コードを発行してクライアントにリダイレクト
app.route("/", approve);

// --- Step 3: トークン交換 ---
// クライアントが認可コードをアクセストークンに交換
app.route("/", token);

// --- Step 4: トークン検証（リソースサーバー向け） ---
// リソースサーバーからのトークンイントロスペクションリクエストに応答
app.route("/", introspect);

// --- Step 5: ユーザー情報取得（OIDC） ---
// アクセストークンでユーザー情報を返却
app.route("/", userinfo);

// --- ヘルスチェック ---
app.get("/health", (c) => c.json({ status: "ok", service: "auth-server" }));

// --- サーバー起動 ---
console.log("[Auth Server] 起動中... http://localhost:8080");
serve({
  fetch: app.fetch,
  port: 8080,
});
