# トークン

## アクセストークン（Access Token）

保護されたリソースにアクセスするための資格情報です。

TODO: 以下を記述
- Opaque Token vs JWT
- トークンの有効期限
- Bearer Token の使い方（Authorization ヘッダー）
- Token Introspection（RFC 7662）

## リフレッシュトークン（Refresh Token）

アクセストークンを再取得するためのトークンです。

TODO: 以下を記述
- リフレッシュトークンの目的
- トークンローテーション
- セキュリティ上の注意点

## 対応するソースコード

| 概念 | ファイル |
|------|---------|
| トークン発行 | `services/auth-server/src/routes/token.ts` |
| トークン検証 | `services/auth-server/src/routes/introspect.ts` |
| Bearer トークン送信 | `services/frontend/src/proxy.ts` |
| トークン検証ミドルウェア | `services/backend/src/middleware/auth.ts` |

## 参考 RFC

- [RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750) - Bearer Token Usage
- [RFC 7662](https://datatracker.ietf.org/doc/html/rfc7662) - OAuth 2.0 Token Introspection
