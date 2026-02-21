import { Hono } from "hono";
import { accessTokens, users } from "../store.js";

const app = new Hono();

// ============================================================
// OIDC UserInfo エンドポイント GET /userinfo
// - アクセストークンを使ってユーザー情報を返す
// - OpenID Connect Core 1.0 Section 5.3
// - TODO: ID Token (JWT) の実装時に拡張する
// ============================================================
app.get("/userinfo", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "invalid_token" }, 401);
  }

  const token = authHeader.slice("Bearer ".length);
  const tokenData = accessTokens.get(token);

  if (!tokenData || Date.now() > tokenData.expires_at) {
    return c.json({ error: "invalid_token" }, 401);
  }

  const user = users.get(tokenData.username);
  if (!user) {
    return c.json({ error: "invalid_token" }, 401);
  }

  // OIDC標準クレームを返す
  return c.json({
    sub: user.username,
    name: user.name,
    email: user.email,
  });
});

export default app;
