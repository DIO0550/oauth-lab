// ============================================================
// /introspect - トークンイントロスペクション（RFC 7662）
// リソースサーバーがトークンの有効性を検証する
// ============================================================

import { Hono } from "hono";
import { accessTokens } from "../store.js";

const introspect = new Hono();

// POST /introspect - トークン検証
introspect.post("/introspect", async (c) => {
  const body = await c.req.parseBody();
  const tokenValue = body["token"] as string;

  console.log("[Auth Server] イントロスペクションリクエスト:", tokenValue?.slice(0, 8) + "...");

  if (!tokenValue) {
    return c.json({ active: false });
  }

  const tokenData = accessTokens[tokenValue];
  if (!tokenData || tokenData.expiresAt < Date.now()) {
    // 期限切れトークンは削除
    if (tokenData) delete accessTokens[tokenValue];
    return c.json({ active: false });
  }

  return c.json({
    active: true,
    sub: tokenData.username,
    client_id: tokenData.clientId,
    scope: tokenData.scope,
    exp: Math.floor(tokenData.expiresAt / 1000),
    token_type: "Bearer",
  });
});

export default introspect;
