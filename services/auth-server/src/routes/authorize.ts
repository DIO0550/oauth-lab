import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { clients, users, authCodes } from "../store.js";

const app = new Hono();

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
  const client = clients.get(clientId ?? "");
  if (!client) {
    return c.text("Error: Unknown client_id", 400);
  }

  if (responseType !== "code") {
    return c.text("Error: response_type must be 'code'", 400);
  }

  if (!redirectUri || !client.redirect_uris.includes(redirectUri)) {
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
  const username = body["username"] as string;
  const password = body["password"] as string;
  const client_id = body["client_id"] as string;
  const redirect_uri = body["redirect_uri"] as string;
  const scope = body["scope"] as string;
  const state = body["state"] as string;

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

export default app;
