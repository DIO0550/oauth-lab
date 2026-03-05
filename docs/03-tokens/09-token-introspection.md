# Token Introspection

## 概要

Token Introspection（RFC 7662）は、リソースサーバーが認可サーバーに対してトークンの**有効性や関連情報を問い合わせる**ための仕組みです。

Opaque トークン（不透明トークン）を使用する場合に特に重要です。

## ユースケース

- リソースサーバーがトークンの有効性を確認
- トークンに紐づくスコープやユーザー情報の取得
- 集中的なトークン管理・ポリシー適用

## Introspection リクエスト

```
POST /introspect
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(resource_server_id:resource_server_secret)

token=eyJhbGci...&
token_type_hint=access_token
```

## レスポンス（有効なトークン）

```json
{
  "active": true,
  "scope": "read write",
  "client_id": "oauth-lab-client",
  "username": "testuser",
  "token_type": "Bearer",
  "exp": 1735689600,
  "iat": 1735686000,
  "sub": "user-123",
  "aud": "https://api.example.com",
  "iss": "https://auth.example.com"
}
```

## レスポンス（無効なトークン）

```json
{
  "active": false
}
```

> 無効なトークンの場合、`active: false` のみ返します。追加情報は返しません。

## JWT との使い分け

| 観点 | JWT（自己完結型） | Introspection |
|------|------------------|---------------|
| 検証方法 | 署名をローカルで検証 | 認可サーバーに問い合わせ |
| ネットワーク | 不要 | 毎回必要 |
| リアルタイム無効化 | 困難 | 可能 |
| トークンサイズ | 大きい | 小さい（Opaque） |
| スケーラビリティ | 高い | 認可サーバーに依存 |

## セキュリティ考慮事項

- Introspection エンドポイントへのアクセスは**認証が必須**
- レスポンスはキャッシュ可能だが、キャッシュ時間を短く設定すべき
- HTTPS 通信が必須

## 参考 RFC

- [RFC 7662](https://datatracker.ietf.org/doc/html/rfc7662) - OAuth 2.0 Token Introspection
