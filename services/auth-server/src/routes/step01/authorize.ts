// ============================================================
// /authorize - 認可エンドポイント
// ユーザーを認証し、認可コードを発行する
// ============================================================

import { Hono } from "hono";
import { clients } from "../../store.js";

const authorize = new Hono();

// GET /authorize - ログインフォームを表示
authorize.get("/authorize", (c) => {
  const clientId = c.req.query("client_id");
  const redirectUri = c.req.query("redirect_uri");
  const responseType = c.req.query("response_type");
  const scope = c.req.query("scope") || "read";
  const state = c.req.query("state") || "";

  console.log("[Auth Server] 認可リクエスト受信:", {
    clientId,
    redirectUri,
    responseType,
    scope,
    state,
  });

  // --- クライアント検証 ---
  if (!clientId || !clients[clientId]) {
    return c.text("不明なクライアントです", 400);
  }

  if (responseType !== "code") {
    return c.text("response_type=code のみサポートしています", 400);
  }

  const client = clients[clientId];
  if (redirectUri && !client.redirectUris.includes(redirectUri)) {
    return c.text("無効な redirect_uri です", 400);
  }

  // --- ログインフォーム表示 ---
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OAuth Lab - ログイン</title>
  <style>
    body { font-family: sans-serif; max-width: 400px; margin: 80px auto; padding: 0 20px; }
    h1 { font-size: 1.4rem; color: #333; }
    .info { background: #f0f4ff; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; color: #555; }
    label { display: block; margin-top: 12px; font-weight: bold; font-size: 0.9rem; }
    input[type="text"], input[type="password"] { width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    button { margin-top: 20px; padding: 10px 24px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; }
    button:hover { background: #4338ca; }
  </style>
</head>
<body>
  <h1>認可サーバー - ログイン</h1>
  <div class="info">
    <strong>クライアント:</strong> ${clientId}<br>
    <strong>スコープ:</strong> ${scope}
  </div>
  <form method="POST" action="/approve">
    <input type="hidden" name="client_id" value="${clientId}">
    <input type="hidden" name="redirect_uri" value="${redirectUri || client.redirectUris[0]}">
    <input type="hidden" name="scope" value="${scope}">
    <input type="hidden" name="state" value="${state}">
    <label>ユーザー名</label>
    <input type="text" name="username" required>
    <label>パスワード</label>
    <input type="password" name="password" required>
    <button type="submit">ログインして認可する</button>
  </form>
</body>
</html>`;

  return c.html(html);
});

export default authorize;
