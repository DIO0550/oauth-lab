import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { v4 as uuidv4 } from "uuid";

const app = new Hono();

app.use("/*", cors({ origin: "*" }));

// ============================================================
// インメモリストア（学習用のためDBは使わない）
// ============================================================

// 登録済みクライアント（本来はDB管理）
const clients = new Map([
  [
    "oauth-lab-client",
    {
      client_id: "oauth-lab-client",
      client_secret: "oauth-lab-secret",
      redirect_uris: ["http://localhost:3000/callback"],
      name: "OAuth Lab Frontend",
    },
  ],
]);

// 登録済みユーザー（本来はDB管理）
const users = new Map([
  [
    "testuser",
    {
      username: "testuser",
      password: "password",
      name: "Test User",
      email: "testuser@example.com",
    },
  ],
]);

// 発行済みの認可コード
const authCodes = new Map();

// 発行済みのアクセストークン
const accessTokens = new Map();

// ============================================================
// 1. 認可エンドポイント GET /authorize
//    - クライアントがユーザーをリダイレクトさせる先
//    - ログインフォームを表示する
// ============================================================
app.get("/authorize", (c) => {
  const clientId = c.req.query("client_id");
  const redirectUri = c.req.query("redirect_uri");
  const responseType = c.req.query("response_type");
  const scope = c.req.query("scope") || "";
  const state = c.req.query("state") || "";

  // クライアントの検証
  const client = clients.get(clientId);
  if (!client) {
    return c.text("Error: Unknown client_id", 400);
  }

  if (responseType !== "code") {
    return c.text("Error: response_type must be 'code'", 400);
  }

  if (!client.redirect_uris.includes(redirectUri)) {
    return c.text("Error: Invalid redirect_uri", 400);
  }

  // ログイン & 認可画面を表示（学習用に1ページにまとめている）
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>OAuth Lab - 認可サーバー ログイン</title>
  <style>
    body { font-family: sans-serif; max-width: 480px; margin: 60px auto; padding: 0 20px; background: #f5f5f5; }
    .card { background: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 1.4rem; color: #333; margin-bottom: 8px; }
    .app-name { color: #666; font-size: 0.9rem; margin-bottom: 24px; }
    .scope { background: #e3f2fd; padding: 8px 12px; border-radius: 4px; margin-bottom: 24px; font-size: 0.9rem; }
    label { display: block; margin-bottom: 4px; font-weight: bold; font-size: 0.9rem; }
    input[type="text"], input[type="password"] {
      width: 100%; padding: 10px; margin-bottom: 16px; border: 1px solid #ddd;
      border-radius: 4px; box-sizing: border-box; font-size: 1rem;
    }
    button { width: 100%; padding: 12px; background: #1976d2; color: white; border: none;
      border-radius: 4px; font-size: 1rem; cursor: pointer; }
    button:hover { background: #1565c0; }
    .hint { margin-top: 16px; font-size: 0.8rem; color: #999; }
  </style>
</head>
<body>
  <div class="card">
    <h1>ログイン & 認可</h1>
    <p class="app-name">「${client.name}」がアクセスを要求しています</p>
    ${scope ? `<div class="scope">要求されたスコープ: <strong>${scope}</strong></div>` : ""}
    <form method="POST" action="/approve">
      <input type="hidden" name="client_id" value="${clientId}">
      <input type="hidden" name="redirect_uri" value="${redirectUri}">
      <input type="hidden" name="scope" value="${scope}">
      <input type="hidden" name="state" value="${state}">
      <label>ユーザー名</label>
      <input type="text" name="username" required>
      <label>パスワード</label>
      <input type="password" name="password" required>
      <button type="submit">許可してログイン</button>
    </form>
    <p class="hint">テストユーザー: testuser / password</p>
  </div>
</body>
</html>`;

  return c.html(html);
});

// ============================================================
// 2. 認可承認エンドポイント POST /approve
//    - ユーザーがログインして認可を承認する
//    - 認可コードを発行してクライアントにリダイレクト
// ============================================================
app.post("/approve", async (c) => {
  const body = await c.req.parseBody();
  const { username, password, client_id, redirect_uri, scope, state } = body;

  // ユーザー認証
  const user = users.get(username);
  if (!user || user.password !== password) {
    return c.text("Error: Invalid username or password", 401);
  }

  // 認可コードを発行
  const code = uuidv4();
  authCodes.set(code, {
    client_id,
    redirect_uri,
    username,
    scope,
    created_at: Date.now(),
    // 認可コードは10分で有効期限切れ
    expires_at: Date.now() + 10 * 60 * 1000,
  });

  console.log(`[Auth Server] 認可コード発行: ${code} (user: ${username})`);

  // クライアントにリダイレクト（認可コードを付与）
  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set("code", code);
  if (state) {
    redirectUrl.searchParams.set("state", state);
  }

  return c.redirect(redirectUrl.toString());
});

// ============================================================
// 3. トークンエンドポイント POST /token
//    - クライアントが認可コードとアクセストークンを交換する
// ============================================================
app.post("/token", async (c) => {
  const body = await c.req.parseBody();
  const { grant_type, code, redirect_uri, client_id, client_secret } = body;

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
    return c.json({ error: "invalid_grant", error_description: "Unknown authorization code" }, 400);
  }

  if (authCode.client_id !== client_id) {
    return c.json({ error: "invalid_grant", error_description: "Client mismatch" }, 400);
  }

  if (authCode.redirect_uri !== redirect_uri) {
    return c.json({ error: "invalid_grant", error_description: "Redirect URI mismatch" }, 400);
  }

  if (Date.now() > authCode.expires_at) {
    authCodes.delete(code);
    return c.json({ error: "invalid_grant", error_description: "Authorization code expired" }, 400);
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

  console.log(`[Auth Server] アクセストークン発行: ${accessToken} (user: ${authCode.username})`);

  return c.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    scope: authCode.scope,
  });
});

// ============================================================
// 4. トークン検証エンドポイント POST /introspect
//    - リソースサーバー(Backend)がトークンの有効性を確認する
//    - RFC 7662 Token Introspection
// ============================================================
app.post("/introspect", async (c) => {
  const body = await c.req.parseBody();
  const { token } = body;

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

// ============================================================
// ヘルスチェック
// ============================================================
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "auth-server" });
});

// ============================================================
// サーバー起動
// ============================================================
const port = 8080;
console.log(`[Auth Server] Starting on port ${port}`);
serve({ fetch: app.fetch, port });
