# OIDC Discovery とメタデータ

## 概要

OpenID Connect Discovery 1.0 は、OpenID Provider（OP）の設定情報を**自動的に取得**するための仕組みです。

クライアントはハードコーディングなしに、認可エンドポイントやトークンエンドポイントの URL を知ることができます。

## Well-Known エンドポイント

```
GET /.well-known/openid-configuration
```

## レスポンス例

```json
{
  "issuer": "https://auth.example.com",
  "authorization_endpoint": "https://auth.example.com/authorize",
  "token_endpoint": "https://auth.example.com/token",
  "userinfo_endpoint": "https://auth.example.com/userinfo",
  "jwks_uri": "https://auth.example.com/.well-known/jwks.json",
  "revocation_endpoint": "https://auth.example.com/revoke",
  "introspection_endpoint": "https://auth.example.com/introspect",
  "registration_endpoint": "https://auth.example.com/register",
  "scopes_supported": ["openid", "profile", "email"],
  "response_types_supported": ["code", "code id_token", "id_token"],
  "grant_types_supported": ["authorization_code", "refresh_token", "client_credentials"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
  "code_challenge_methods_supported": ["S256"]
}
```

## 主要なメタデータフィールド

| フィールド | 説明 |
|-----------|------|
| issuer | OP の識別子（必須） |
| authorization_endpoint | 認可エンドポイント URL |
| token_endpoint | トークンエンドポイント URL |
| userinfo_endpoint | UserInfo エンドポイント URL |
| jwks_uri | JWK Set の URL（署名検証鍵） |
| scopes_supported | サポートするスコープ一覧 |
| response_types_supported | サポートする response_type 一覧 |
| grant_types_supported | サポートするグラントタイプ一覧 |
| code_challenge_methods_supported | PKCE のサポートするメソッド |

## JWK Set エンドポイント

`jwks_uri` で公開される署名検証用の公開鍵セット:

```
GET /.well-known/jwks.json
```

```json
{
  "keys": [
    {
      "kty": "RSA",
      "kid": "key-1",
      "use": "sig",
      "alg": "RS256",
      "n": "0vx7agoebGcQSuu...",
      "e": "AQAB"
    }
  ]
}
```

## OAuth 2.0 Authorization Server Metadata

OAuth 2.0 にも同様のメタデータ仕組みがあります（RFC 8414）:

```
GET /.well-known/oauth-authorization-server
```

OIDC Discovery とほぼ同じ内容ですが、OIDC 固有のフィールド（`userinfo_endpoint` 等）は含みません。

## 参考仕様

- [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html)
- [RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414) - OAuth 2.0 Authorization Server Metadata
