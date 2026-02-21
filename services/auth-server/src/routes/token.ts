import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { clients, authCodes, accessTokens } from "../store.js";

const app = new Hono();

// ============================================================
// 3. トークンエンドポイント POST /token
//    - クライアントが認可コードとアクセストークンを交換する
// ============================================================
app.post("/token", async (c) => {
  const body = await c.req.parseBody();
  const grant_type = body["grant_type"] as string;
  const code = body["code"] as string;
  const redirect_uri = body["redirect_uri"] as string;
  const client_id = body["client_id"] as string;
  const client_secret = body["client_secret"] as string;

  if (grant_type !== "authorization_code") {
    return c.json({ error: "unsupported_grant_type" }, 400);
  }

  // クライアント認証
  const client = clients.get(client_id);
  if (!client || client.client_secret !== client_secret) {
    return c.json({ error: "invalid_client" }, 401);
  }

  // 認可コードの検証
  const authCode = authCodes.get(code);
  if (!authCode) {
    return c.json(
      { error: "invalid_grant", error_description: "Unknown authorization code" },
      400
    );
  }

  if (authCode.client_id !== client_id) {
    return c.json(
      { error: "invalid_grant", error_description: "Client mismatch" },
      400
    );
  }

  if (authCode.redirect_uri !== redirect_uri) {
    return c.json(
      { error: "invalid_grant", error_description: "Redirect URI mismatch" },
      400
    );
  }

  if (Date.now() > authCode.expires_at) {
    authCodes.delete(code);
    return c.json(
      { error: "invalid_grant", error_description: "Authorization code expired" },
      400
    );
  }

  // 認可コードは1回だけ使用可能（使い終わったら削除）
  authCodes.delete(code);

  // アクセストークンを発行
  const accessToken = uuidv4();
  accessTokens.set(accessToken, {
    username: authCode.username,
    scope: authCode.scope,
    client_id: authCode.client_id,
    created_at: Date.now(),
    // アクセストークンは1時間で有効期限切れ
    expires_at: Date.now() + 60 * 60 * 1000,
  });

  console.log(
    `[Auth Server] アクセストークン発行: ${accessToken} (user: ${authCode.username})`
  );

  return c.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    scope: authCode.scope,
  });
});

export default app;
