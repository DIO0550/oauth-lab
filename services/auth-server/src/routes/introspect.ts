import { Hono } from "hono";
import { accessTokens } from "../store.js";

const app = new Hono();

// ============================================================
// 4. トークン検証エンドポイント POST /introspect
//    - リソースサーバー(Backend)がトークンの有効性を確認する
//    - RFC 7662 Token Introspection
// ============================================================
app.post("/introspect", async (c) => {
  const body = await c.req.parseBody();
  const token = body["token"] as string;

  const tokenData = accessTokens.get(token);

  if (!tokenData || Date.now() > tokenData.expires_at) {
    return c.json({ active: false });
  }

  return c.json({
    active: true,
    username: tokenData.username,
    scope: tokenData.scope,
    client_id: tokenData.client_id,
    exp: Math.floor(tokenData.expires_at / 1000),
  });
});

export default app;
