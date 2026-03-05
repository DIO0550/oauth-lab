# PAR（Pushed Authorization Requests）

## PAR とは

PAR（RFC 9126）は、認可リクエストのパラメータを**事前にバックチャネルで送信**する仕組みです。

通常の認可リクエストはフロントチャネル（ブラウザのリダイレクト）でパラメータを送りますが、PAR ではバックチャネル（サーバー間通信）で事前に送信し、参照用の URI だけをフロントチャネルで使います。

## なぜ必要か

### 通常の認可リクエストの問題

```
GET /authorize?
  response_type=code&
  client_id=abc&
  redirect_uri=https://app.example.com/callback&
  scope=openid profile email&
  state=xyz&
  code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&
  code_challenge_method=S256&
  ... 多数のパラメータ ...
```

問題点:
- URL にパラメータが露出（ブラウザ履歴、ログ）
- URL 長の制限に引っかかる可能性
- パラメータの改ざんリスク

### PAR による解決

パラメータをサーバー間で送信し、URL に露出させない。

## PAR のフロー

```
┌──────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Client  │     │ Authorization    │     │   ユーザー        │
│          │     │ Server           │     │  (ブラウザ)       │
└────┬─────┘     └───────┬──────────┘     └───────┬──────────┘
     │                   │                        │
     │  1. POST /par     │                        │
     │  (全パラメータ)    │                        │
     │─────────────────→│                        │
     │                   │                        │
     │  2. request_uri   │                        │
     │←────────────────│                        │
     │                   │                        │
     │  3. リダイレクト    │                        │
     │  /authorize?request_uri=...&client_id=abc  │
     │───────────────────────────────────────────→│
     │                   │                        │
     │                   │  4. 通常の認可フロー     │
     │                   │←──────────────────────│
```

## PAR リクエスト

```http
POST /par HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Authorization: Basic <client_credentials>

response_type=code
&client_id=oauth-lab-client
&redirect_uri=http://localhost:3000/callback
&scope=openid profile
&state=abc123
&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
&code_challenge_method=S256
```

## PAR レスポンス

```json
{
  "request_uri": "urn:ietf:params:oauth:request_uri:6esc_11ACC5bwc014ltc14eY22c",
  "expires_in": 60
}
```

## 認可リクエスト（PAR 使用時）

```
GET /authorize?
  request_uri=urn:ietf:params:oauth:request_uri:6esc_11ACC5bwc014ltc14eY22c&
  client_id=oauth-lab-client
```

パラメータが `request_uri` のみになり、URL がシンプルに。

## PAR のメリット

1. **パラメータの機密性** — URL に露出しない
2. **改ざん防止** — サーバー間で事前登録済み
3. **URL 長の問題解消** — パラメータ数に制限なし
4. **クライアント認証** — PAR エンドポイントでクライアントを認証

## 参考 RFC

- [RFC 9126](https://datatracker.ietf.org/doc/html/rfc9126) - OAuth 2.0 Pushed Authorization Requests
