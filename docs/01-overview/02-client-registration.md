# クライアント登録

## 概要

OAuth 2.0 では、クライアント（アプリケーション）が認可サーバーを利用する前に**事前登録**が必要です（RFC 6749 Section 2）。

登録時にクライアントの種類、リダイレクト URI、スコープなどを設定します。

## クライアントの種類

### Confidential Client（機密クライアント）

クライアントシークレットを安全に保持できるクライアント。

- Web サーバーアプリケーション
- バックエンド API サービス

```
# シークレットをサーバー側で安全に保持
CLIENT_SECRET=oauth-lab-secret  # サーバー環境変数
```

### Public Client（パブリッククライアント）

クライアントシークレットを安全に保持**できない**クライアント。

- SPA（Single Page Application）
- モバイルアプリ
- デスクトップアプリ

> パブリッククライアントは PKCE を使用してセキュリティを確保します。

## 登録情報

| 項目 | 説明 | 例 |
|------|------|-----|
| client_id | クライアントの識別子 | `oauth-lab-client` |
| client_secret | クライアントの秘密鍵（Confidential のみ） | `oauth-lab-secret` |
| redirect_uris | 許可されたリダイレクト URI の一覧 | `http://localhost:3000/callback` |
| grant_types | 使用するグラントタイプ | `authorization_code` |
| scope | 要求可能なスコープ | `read`, `openid`, `profile` |
| client_name | アプリケーション名 | `OAuth Lab Client` |

## リダイレクト URI の検証

リダイレクト URI は OAuth のセキュリティにおいて最も重要な要素の一つです。

### ルール

1. **完全一致** — パス、クエリ、フラグメントを含めた完全一致で検証
2. **HTTPS 必須** — 本番環境では HTTPS のみ許可（localhost は例外）
3. **ワイルドカード禁止** — `*.example.com` のようなパターンは不可
4. **オープンリダイレクト防止** — 未登録の URI へのリダイレクトを拒否

```
# 登録済み URI
http://localhost:3000/callback

# 検証
✅ http://localhost:3000/callback          → 完全一致
❌ http://localhost:3000/callback?extra=1   → クエリ不一致
❌ http://localhost:3000/callback/          → パス不一致
❌ http://evil.example.com/callback         → ホスト不一致
```

## 動的クライアント登録（RFC 7591）

認可サーバーが API で動的にクライアントを登録できる仕組み:

```
POST /register
Content-Type: application/json

{
  "redirect_uris": ["https://app.example.com/callback"],
  "client_name": "My New App",
  "grant_types": ["authorization_code"],
  "token_endpoint_auth_method": "client_secret_basic"
}
```

レスポンス:

```json
{
  "client_id": "generated-client-id",
  "client_secret": "generated-secret",
  "client_id_issued_at": 1735689600,
  "client_secret_expires_at": 0
}
```

## このLabでのクライアント設定

```
Client ID:     oauth-lab-client
Client Secret: oauth-lab-secret
Redirect URI:  http://localhost:3000/callback
Grant Type:    authorization_code
Scope:         read, openid, profile
```

## 参考 RFC

- [RFC 6749 Section 2](https://datatracker.ietf.org/doc/html/rfc6749#section-2) - Client Registration
- [RFC 7591](https://datatracker.ietf.org/doc/html/rfc7591) - OAuth 2.0 Dynamic Client Registration
