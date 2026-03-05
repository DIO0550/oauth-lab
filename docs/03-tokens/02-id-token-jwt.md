# ID Token と JWT

## JWT（JSON Web Token）とは

JWT (RFC 7519) は JSON データに署名を付けた、コンパクトなトークン形式です。

```
eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlciJ9.signature
 ↑ Header            ↑ Payload              ↑ Signature
```

## JWT の構造

### Header

```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

### Payload（OIDC ID Token の場合）

```json
{
  "iss": "http://localhost:8080",
  "sub": "testuser",
  "aud": "oauth-lab-client",
  "exp": 1700000000,
  "iat": 1699996400,
  "nonce": "abc123"
}
```

### 必須クレーム（ID Token）

| クレーム | 説明 |
|----------|------|
| iss | 発行者（Issuer） |
| sub | 主体（Subject = ユーザーID） |
| aud | 受信者（Audience = client_id） |
| exp | 有効期限（Expiration） |
| iat | 発行日時（Issued At） |

## 署名アルゴリズム

TODO: 以下を記述
- HS256（対称鍵）vs RS256（非対称鍵）
- JWK（JSON Web Key）
- 署名の検証方法

## 参考 RFC

- [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) - JSON Web Token (JWT)
- [RFC 7515](https://datatracker.ietf.org/doc/html/rfc7515) - JSON Web Signature (JWS)
- [RFC 7517](https://datatracker.ietf.org/doc/html/rfc7517) - JSON Web Key (JWK)
