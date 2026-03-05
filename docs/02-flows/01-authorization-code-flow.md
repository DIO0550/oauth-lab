# Authorization Code Flow

## フロー全体像

```
+--------+                               +---------------+
|        |---(1) Authorization Request--->|               |
|        |                                | Authorization |
| Client |<--(2) Authorization Code------|    Server     |
|  App   |                                |               |
|        |---(3) Token Request----------->|               |
|        |<--(4) Access Token------------|               |
|        |                                +---------------+
|        |
|        |---(5) API Request (Bearer)---->+---------------+
|        |                                |   Resource    |
|        |<--(6) Protected Resource------|    Server     |
+--------+                                +---------------+
```

## 各ステップの詳細

### (1) 認可リクエスト

クライアントがユーザーを認可サーバーの `/authorize` にリダイレクトします。

```
GET /authorize?
  response_type=code&
  client_id=oauth-lab-client&
  redirect_uri=http://localhost:3000/callback&
  scope=read&
  state=xyz
```

| パラメータ | 説明 |
|-----------|------|
| response_type | `code` を指定（認可コードを要求） |
| client_id | 事前登録されたクライアントID |
| redirect_uri | 認可後のリダイレクト先 |
| scope | 要求する権限の範囲 |
| state | CSRF対策用のランダム文字列 |

### (2) 認可コードの発行

TODO: ユーザー認証→同意→リダイレクトの流れを詳述

### (3) トークンリクエスト

TODO: クライアント認証を含むトークン交換の詳細

### (4) アクセストークンの取得

TODO: トークンレスポンスの構造

### (5)(6) APIアクセス

TODO: Bearer トークンの利用方法

## 対応するソースコード

| ステップ | ファイル |
|----------|---------|
| (1) 認可リクエスト | `services/frontend/src/routes/login.ts` |
| (2) 認可コード発行 | `services/auth-server/src/routes/authorize.ts` |
| (3)(4) トークン交換 | `services/frontend/src/routes/callback.ts` + `services/auth-server/src/routes/token.ts` |
| (5)(6) API アクセス | `services/frontend/src/proxy.ts` + `services/backend/src/middleware/auth.ts` |
