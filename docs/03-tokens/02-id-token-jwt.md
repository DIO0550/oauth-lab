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

### HS256（HMAC + SHA-256）— 対称鍵

発行者と検証者が**同じ秘密鍵**を共有する方式:

```
署名 = HMAC-SHA256(Base64URL(Header) + "." + Base64URL(Payload), shared_secret)
```

- 計算が高速
- 鍵の共有が必要 → 検証者が限定される
- 認可サーバーとリソースサーバーが同一の場合に有効

### RS256（RSA + SHA-256）— 非対称鍵

**秘密鍵で署名**し、**公開鍵で検証**する方式:

```
署名 = RSA-SHA256(Base64URL(Header) + "." + Base64URL(Payload), private_key)
検証 = RSA-VERIFY(署名, public_key)
```

- 秘密鍵は認可サーバーのみが保持
- 公開鍵を公開すれば誰でも検証可能（JWKS エンドポイント）
- OIDC では RS256 が推奨

### アルゴリズム比較

| | HS256 | RS256 | ES256 |
|---|-------|-------|-------|
| **方式** | 対称鍵 | RSA 非対称鍵 | 楕円曲線 非対称鍵 |
| **鍵** | 共有秘密鍵 | 公開鍵 + 秘密鍵 | 公開鍵 + 秘密鍵 |
| **速度** | 高速 | 中 | 高速 |
| **鍵サイズ** | 256 bit | 2048+ bit | 256 bit |
| **用途** | 内部用 | OIDC 標準 | モバイル/IoT |

### JWK（JSON Web Key）

署名検証用の公開鍵を JSON で表現する形式（RFC 7517）:

```json
{
  "kty": "RSA",
  "kid": "key-id-1",
  "use": "sig",
  "alg": "RS256",
  "n": "0vx7agoebGcQ...",
  "e": "AQAB"
}
```

### JWKS エンドポイント

認可サーバーが公開鍵を配信する URL:

```
GET /.well-known/jwks.json

{
  "keys": [
    { "kty": "RSA", "kid": "key-1", "use": "sig", ... },
    { "kty": "RSA", "kid": "key-2", "use": "sig", ... }
  ]
}
```

### 署名の検証手順

```
1. JWT の Header から kid と alg を取得
2. JWKS エンドポイントから対応する公開鍵を取得
3. alg に基づいて署名を検証
4. Payload のクレームを検証:
   - iss: 期待する発行者と一致するか
   - aud: 自分の client_id と一致するか
   - exp: 有効期限が切れていないか
   - iat: 発行日時が妥当か
```

> 詳細は [03-jws.md](./03-jws.md)、[04-jwk.md](./04-jwk.md) を参照

## 参考 RFC

- [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) - JSON Web Token (JWT)
- [RFC 7515](https://datatracker.ietf.org/doc/html/rfc7515) - JSON Web Signature (JWS)
- [RFC 7516](https://datatracker.ietf.org/doc/html/rfc7516) - JSON Web Encryption (JWE)
- [RFC 7517](https://datatracker.ietf.org/doc/html/rfc7517) - JSON Web Key (JWK)
- [RFC 7518](https://datatracker.ietf.org/doc/html/rfc7518) - JSON Web Algorithms (JWA)
- [RFC 8725](https://datatracker.ietf.org/doc/html/rfc8725) - JWT Best Current Practices
