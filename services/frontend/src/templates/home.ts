// ============================================================
// HTML テンプレート
// ============================================================

export function homePage(accessToken?: string): string {
  const loggedIn = !!accessToken;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OAuth Lab - クライアントアプリ</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f5f5; color: #333; }
    .container { max-width: 640px; margin: 40px auto; padding: 0 20px; }
    h1 { font-size: 1.6rem; margin-bottom: 8px; }
    .subtitle { color: #666; margin-bottom: 24px; }
    .card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card h2 { font-size: 1.1rem; margin-bottom: 12px; }
    .btn { display: inline-block; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 0.95rem; cursor: pointer; border: none; }
    .btn-primary { background: #4f46e5; color: white; }
    .btn-primary:hover { background: #4338ca; }
    .btn-secondary { background: #e5e7eb; color: #333; }
    .btn-secondary:hover { background: #d1d5db; }
    .token-display { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin: 12px 0; word-break: break-all; font-family: monospace; font-size: 0.85rem; color: #166534; }
    .status { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; }
    .status-ok { background: #dcfce7; color: #166534; }
    .status-no { background: #fee2e2; color: #991b1b; }
    #result { margin-top: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 0.85rem; white-space: pre-wrap; display: none; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  </style>
</head>
<body>
  <div class="container">
    <h1>OAuth Lab</h1>
    <p class="subtitle">OAuth 2.0 Authorization Code Flow 学習環境</p>

    <!-- 認証ステータス -->
    <div class="card">
      <h2>認証ステータス</h2>
      ${loggedIn
        ? `<span class="status status-ok">認証済み</span>
           <div class="token-display">Access Token: ${accessToken}</div>`
        : `<span class="status status-no">未認証</span>
           <p style="margin-top:12px">認可サーバーにログインしてアクセストークンを取得してください。</p>`
      }
      <div style="margin-top: 16px;">
        ${loggedIn
          ? ''
          : '<a href="/login" class="btn btn-primary">認可サーバーにログイン</a>'
        }
      </div>
    </div>

    <!-- API テスト -->
    <div class="card">
      <h2>API テスト</h2>
      <p style="margin-bottom:12px; color:#666; font-size:0.9rem;">リソースサーバーのエンドポイントを呼び出します。</p>
      <div class="actions">
        <button class="btn btn-secondary" onclick="callApi('/proxy/public')">公開API</button>
        <button class="btn btn-secondary" onclick="callApi('/proxy/api/profile')" ${loggedIn ? '' : 'disabled'}>プロフィール取得</button>
        <button class="btn btn-secondary" onclick="callApi('/proxy/api/posts')" ${loggedIn ? '' : 'disabled'}>投稿一覧取得</button>
      </div>
      <div id="result"></div>
    </div>

    <!-- フロー説明 -->
    <div class="card">
      <h2>OAuth 2.0 Authorization Code Flow</h2>
      <ol style="padding-left: 20px; line-height: 1.8; font-size: 0.9rem; color: #555;">
        <li>クライアントが認可サーバーの <code>/authorize</code> にリダイレクト</li>
        <li>ユーザーがログインして認可を承認</li>
        <li>認可サーバーが認可コードをクライアントに返却</li>
        <li>クライアントが認可コードをアクセストークンと交換</li>
        <li>アクセストークンでリソースサーバーにアクセス</li>
      </ol>
    </div>
  </div>

  <script>
    async function callApi(path) {
      const resultDiv = document.getElementById('result');
      resultDiv.style.display = 'block';
      resultDiv.textContent = '読み込み中...';
      try {
        const res = await fetch(path);
        const data = await res.json();
        resultDiv.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        resultDiv.textContent = 'エラー: ' + err.message;
      }
    }
  </script>
</body>
</html>`;
}
