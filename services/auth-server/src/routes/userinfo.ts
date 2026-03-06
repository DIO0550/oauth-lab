// ============================================================
// /userinfo - ユーザー情報エンドポイント（OIDC）
// アクセストークンからユーザー情報を返す
// ============================================================

import { Hono } from "hono";
import { accessTokens, users } from "../store.js";

const userinfo = new Hono();

// GET /userinfo - ユーザー情報取得
userinfo.get("/userinfo", (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "invalid_token" }, 401);
  }

  const tokenValue = authHeader.slice(7);
  const tokenData = accessTokens[tokenValue];

  if (!tokenData || tokenData.expiresAt < Date.now()) {
    return c.json({ error: "invalid_token" }, 401);
  }

  const user = users[tokenData.username];
  if (!user) {
    return c.json({ error: "invalid_token" }, 401);
  }

  console.log("[Auth Server] ユーザー情報返却:", user.profile.sub);

  return c.json(user.profile);
});

export default userinfo;
