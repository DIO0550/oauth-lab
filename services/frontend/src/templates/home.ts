export function renderHome(accessToken: string | undefined): string {
  return `<!DOCTYPE html>
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
| Client |&lt;--(2) Authorization Code------| Server        |
|  App   |                                |  :8080        |
|        |---(3) Token Request----------->|               |
| :3000  |&lt;--(4) Access Token------------|               |
|        |                                +---------------+
|        |
|        |---(5) API Request (Bearer)---->+---------------+
|        |                                |   Resource    |
|        |&lt;--(6) Protected Resource------| Server        |
+--------+                                |  :3001        |
                                          +---------------+</div>
    </div>

    <div class="card">
      <h2>Step 1: 認可リクエスト</h2>
      ${
        accessToken
          ? '<div class="status ok">ログイン済み - アクセストークンを保持しています</div>'
          : '<div class="status no">未ログイン - 認可サーバーでログインしてください</div>'
      }
      ${
        accessToken
          ? '<a href="/logout" class="btn btn-danger">ログアウト</a>'
          : '<a href="/login" class="btn btn-primary">認可サーバーにログイン</a>'
      }
    </div>

    ${
      accessToken
        ? `
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
      <pre>${accessToken}</pre>
    </div>
    `
        : `
    <div class="card">
      <h2>公開APIのテスト</h2>
      <p style="margin-bottom:12px;">トークンなしでもアクセスできる公開エンドポイント</p>
      <button class="btn btn-secondary" onclick="fetchAPI('/public')">公開API取得</button>
      <div id="result"></div>
    </div>
    `
    }
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
}
