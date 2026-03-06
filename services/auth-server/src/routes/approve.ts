// ============================================================
// /approve - 認可承認エンドポイント
// ユーザー認証後、認可コードを発行してリダイレクト
// ============================================================

import { Hono } from "hono";
import crypto from "node:crypto";
import { users, clients, authorizationCodes } from "../store.js";

const approve = new Hono();

// POST /approve - 認証＆認可コード発行
approve.post("/approve", async (c) => {
  const body = await c.req.parseBody();
  const username = body["username"] as string;
  const password = body["password"] as string;
  const clientId = body["client_id"] as string;
  const redirectUri = body["redirect_uri"] as string;
  const scope = body["scope"] as string;
  const state = body["state"] as string;

  console.log("[Auth Server] 認可承認リクエスト:", { username, clientId });

  // --- ユーザー認証 ---
  const user = users[username];
  if (!user || user.password !== password) {
    return c.text("ユーザー名またはパスワードが間違っています", 401);
  }

  // --- クライアント検証 ---
  const client = clients[clientId];
  if (!client) {
    return c.text("不明なクライアントです", 400);
  }

  // --- 認可コード発行 ---
  const code = crypto.randomUUID();
  authorizationCodes[code] = {
    code,
    clientId,
    username,
    redirectUri,
    scope,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10分間有効
  };

  console.log("[Auth Server] 認可コード発行:", code);

  // --- クライアントにリダイレクト ---
  const redirectUrl = new URL(redirectUri);
  redirectUrl.searchParams.set("code", code);
  if (state) {
    redirectUrl.searchParams.set("state", state);
  }

  return c.redirect(redirectUrl.toString());
});

export default approve;
