import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new Hono();

// 設定
const CLIENT_ID = "oauth-lab-client";
const CLIENT_SECRET = "oauth-lab-secret";
const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || "http://auth-server:8080";
// ブラウザからアクセスする認可サーバーのURL（Docker外からのアクセス）
const AUTH_SERVER_EXTERNAL_URL = process.env.AUTH_SERVER_EXTERNAL_URL || "http://localhost:8080";
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:3001";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const REDIRECT_URI = `${FRONTEND_URL}/callback`;

// セッション管理（学習用の簡易実装）
const sessions = new Map();

// ============================================================
// トップページ
// ============================================================
app.get("/", (c) => {
  const sessionId = c.req.header("Cookie")?.match(/session=([^;]+)/)?.[1];
  const session = sessions.get(sessionId);
  const accessToken = session?.accessToken;

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>OAuth Lab - クライアントアプリ</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; background: #f0f2f5; color: #333; }
    .header { background: #1976d2; color: white; padding: 16px 24px; }
    .header h1 { font-size: 1.3rem; }
    .container { max-width: 800px; margin: 24px auto; padding: 0 16px; }
    .card { background: white; border-radius: 8px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .card h2 { font-size: 1.1rem; margin-bottom: 12px; color: #1976d2; }
    .btn { display: inline-block; padding: 10px 20px; border-radius: 4px; text-decoration: none;
      font-size: 0.95rem; cursor: pointer; border: none; }
    .btn-primary { background: #1976d2; color: white; }
    .btn-primary:hover { background: #1565c0; }
    .btn-danger { background: #d32f2f; color: white; }
    .btn-secondary { background: #757575; color: white; }
    .btn-secondary:hover { background: #616161; }
    .status { padding: 12px; border-radius: 4px; margin-bottom: 16px; }
    .status.ok { background: #e8f5e9; color: #2e7d32; }
    .status.no { background: #fff3e0; color: #e65100; }
    pre { background: #263238; color: #eeffff; padding: 16px; border-radius: 4px;
      overflow-x: auto; font-size: 0.85rem; white-space: pre-wrap; margin-top: 8px; }
    .flow-diagram { font-family: monospace; font-size: 0.8rem; line-height: 1.6; white-space: pre;
      background: #fafafa; padding: 16px; border-radius: 4px; border: 1px solid #e0e0e0; overflow-x: auto; }
    #result { margin-top: 12px; }
    .btn-group { display: flex; gap: 8px; flex-wrap: wrap; }
  </style>
</head>
<body>
  <div class="header">
    <h1>OAuth Lab - OAuthを学ぶための実験環境</h1>
  </div>
  <div class="container">
    <div class="card">
      <h2>Authorization Code Flow</h2>
      <div class="flow-diagram">
+--------+                               +---------------+
|        |---(1) Authorization Request--->|               |
|        |                                | Authorization |
| Client |<--(2) Authorization Code------|    Server     |
|  App   |                                |  :8080        |
|        |---(3) Token Request----------->|               |
| :3000  |<--(4) Access Token------------|               |
|        |                                +---------------+
|        |
|        |---(5) API Request (Bearer)---->+---------------+
|        |                                |   Resource    |
|        |<--(6) Protected Resource------|    Server     |
+--------+                                |  :3001        |
                                          +---------------+</div>
    </div>

    <div class="card">
      <h2>Step 1: 認可リクエスト</h2>
      ${accessToken
        ? '<div class="status ok">ログイン済み - アクセストークンを保持しています</div>'
        : '<div class="status no">未ログイン - 認可サーバーでログインしてください</div>'
      }
      ${accessToken
        ? '<a href="/logout" class="btn btn-danger">ログアウト</a>'
        : '<a href="/login" class="btn btn-primary">認可サーバーにログイン</a>'
      }
    </div>

    ${accessToken ? \`
    <div class="card">
      <h2>Step 2: 保護されたリソースにアクセス</h2>
      <p style="margin-bottom:12px;">取得したアクセストークンを使ってBackend APIにリクエストします。</p>
      <div class="btn-group">
        <button class="btn btn-primary" onclick="fetchAPI('/api/profile')">プロフィール取得</button>
        <button class="btn btn-secondary" onclick="fetchAPI('/api/posts')">投稿一覧取得</button>
        <button class="btn btn-secondary" onclick="fetchAPI('/public')">公開API（トークン不要）</button>
      </div>
      <div id="result"></div>
    </div>

    <div class="card">
      <h2>現在のアクセストークン</h2>
      <pre>\${accessToken}</pre>
    </div>
    \` : \`
    <div class="card">
      <h2>公開APIのテスト</h2>
      <p style="margin-bottom:12px;">トークンなしでもアクセスできる公開エンドポイント</p>
      <button class="btn btn-secondary" onclick="fetchAPI('/public')">公開API取得</button>
      <div id="result"></div>
    </div>
    \`}
  </div>

  <script>
    async function fetchAPI(path) {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '<p>Loading...</p>';
      try {
        const res = await fetch('/proxy' + path);
        const data = await res.json();
        resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
      } catch (err) {
        resultDiv.innerHTML = '<pre style="color:#ef5350;">Error: ' + err.message + '</pre>';
      }
    }
  </script>
</body>
</html>`;

  return c.html(html);
});

// ============================================================
// ログイン: 認可サーバーにリダイレクト
// ============================================================
app.get("/login", (c) => {
  const state = Math.random().toString(36).substring(2);

  // セッションにstateを保存（CSRF対策）
  const sessionId = Math.random().toString(36).substring(2);
  sessions.set(sessionId, { state });

  const authUrl = new URL(`${AUTH_SERVER_EXTERNAL_URL}/authorize`);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", "read");
  authUrl.searchParams.set("state", state);

  console.log(`[Frontend] 認可リクエスト: ${authUrl.toString()}`);

  c.header("Set-Cookie", `session=${sessionId}; Path=/; HttpOnly`);
  return c.redirect(authUrl.toString());
});

// ============================================================
// コールバック: 認可コードを受け取り、トークンと交換
// ============================================================
app.get("/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  if (error) {
    return c.text(`認可エラー: ${error}`, 400);
  }

  if (!code) {
    return c.text("認可コードがありません", 400);
  }

  // state検証（CSRF対策）
  const sessionId = c.req.header("Cookie")?.match(/session=([^;]+)/)?.[1];
  const session = sessions.get(sessionId);
  if (!session || session.state !== state) {
    return c.text("Error: state mismatch（CSRF攻撃の可能性）", 400);
  }

  console.log(`[Frontend] 認可コード受信: ${code}`);

  // 認可コードをアクセストークンと交換
  try {
    const tokenResponse = await fetch(`${AUTH_SERVER_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return c.text(`トークン取得エラー: ${tokenData.error} - ${tokenData.error_description}`, 400);
    }

    console.log(`[Frontend] アクセストークン取得成功: ${tokenData.access_token}`);

    // セッションにアクセストークンを保存
    session.accessToken = tokenData.access_token;
    session.state = null;

    return c.redirect("/");
  } catch (err) {
    console.error("[Frontend] トークン交換エラー:", err);
    return c.text(`トークン交換に失敗しました: ${err.message}`, 500);
  }
});

// ============================================================
// プロキシ: フロントエンドからBackendへのAPIリクエストを中継
// ============================================================
app.get("/proxy/*", async (c) => {
  const path = c.req.path.replace("/proxy", "");
  const sessionId = c.req.header("Cookie")?.match(/session=([^;]+)/)?.[1];
  const session = sessions.get(sessionId);

  const headers = {};
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  try {
    const response = await fetch(`${BACKEND_URL}${path}`, { headers });
    const data = await response.json();
    return c.json(data, response.status);
  } catch (err) {
    return c.json({ error: "Backend APIへの接続に失敗しました", detail: err.message }, 502);
  }
});

// ============================================================
// ログアウト
// ============================================================
app.get("/logout", (c) => {
  const sessionId = c.req.header("Cookie")?.match(/session=([^;]+)/)?.[1];
  if (sessionId) {
    sessions.delete(sessionId);
  }
  c.header("Set-Cookie", "session=; Path=/; HttpOnly; Max-Age=0");
  return c.redirect("/");
});

// ============================================================
// ヘルスチェック
// ============================================================
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "frontend" });
});

// ============================================================
// サーバー起動
// ============================================================
const port = 3000;
console.log(`[Frontend] Starting on port ${port}`);
serve({ fetch: app.fetch, port });
