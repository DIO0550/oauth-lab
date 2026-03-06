// ============================================================
// /token - トークンエンドポイント
// 認可コードをアクセストークンと交換する
// ============================================================

import { Hono } from "hono";
import crypto from "node:crypto";
import { clients, authorizationCodes, accessTokens } from "../store.js";

const token = new Hono();

// POST /token - トークン交換
token.post("/token", async (c) => {
  const body = await c.req.parseBody();
  const grantType = body["grant_type"] as string;
  const code = body["code"] as string;
  const redirectUri = body["redirect_uri"] as string;
  const clientId = body["client_id"] as string;
  const clientSecret = body["client_secret"] as string;

  console.log("[Auth Server] トークンリクエスト:", { grantType, clientId });

  // --- grant_type 検証 ---
  if (grantType !== "authorization_code") {
    return c.json({ error: "unsupported_grant_type" }, 400);
  }

  // --- クライアント認証 ---
  const client = clients[clientId];
  if (!client || client.clientSecret !== clientSecret) {
    return c.json({ error: "invalid_client" }, 401);
  }

  // --- 認可コード検証 ---
  const authCode = authorizationCodes[code];
  if (!authCode) {
    return c.json({ error: "invalid_grant", error_description: "認可コードが無効です" }, 400);
  }

  if (authCode.clientId !== clientId) {
    return c.json({ error: "invalid_grant", error_description: "クライアントIDが一致しません" }, 400);
  }

  if (authCode.redirectUri !== redirectUri) {
    return c.json({ error: "invalid_grant", error_description: "redirect_uriが一致しません" }, 400);
  }

  if (authCode.expiresAt < Date.now()) {
    delete authorizationCodes[code];
    return c.json({ error: "invalid_grant", error_description: "認可コードの有効期限が切れています" }, 400);
  }

  // --- 認可コードを無効化（1回限り使用） ---
  delete authorizationCodes[code];

  // --- アクセストークン発行 ---
  const accessToken = crypto.randomUUID();
  accessTokens[accessToken] = {
    token: accessToken,
    clientId,
    username: authCode.username,
    scope: authCode.scope,
    expiresAt: Date.now() + 60 * 60 * 1000, // 1時間有効
  };

  console.log("[Auth Server] アクセストークン発行:", accessToken);

  return c.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    scope: authCode.scope,
  });
});

export default token;
