# JWS（JSON Web Signature）

## JWS とは

JWS（RFC 7515）は、JSON データに**デジタル署名**または **MAC（メッセージ認証コード）** を付与するための仕様です。JWT の署名部分は JWS で実現されています。

## JOSE ファミリーの関係

```
JOSE（JSON Object Signing and Encryption）
├── JWT  (RFC 7519) — トークンのフォーマット（Header + Payload + Signature）
├── JWS  (RFC 7515) — 署名の仕組み ← このドキュメント
├── JWE  (RFC 7516) — 暗号化の仕組み
├── JWK  (RFC 7517) — 鍵の表現
└── JWA  (RFC 7518) — アルゴリズムの定義
```

## JWS のシリアライゼーション形式

### Compact Serialization（コンパクト形式）

JWT で使われる最も一般的な形式:

```
BASE64URL(Header) . BASE64URL(Payload) . BASE64URL(Signature)
```

例:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiJ0ZXN0dXNlciIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJ9
.
dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk...
```

特徴:
- 1つの署名のみ
- URL セーフ
- HTTP ヘッダーや URL パラメータに使用可能

### JSON Serialization（JSON 形式）

```json
{
  "payload": "eyJzdWIiOiJ0ZXN0dXNlciJ9",
  "signatures": [
    {
      "protected": "eyJhbGciOiJSUzI1NiJ9",
      "header": { "kid": "key-1" },
      "signature": "dBjftJeZ4CVP..."
    },
    {
      "protected": "eyJhbGciOiJFUzI1NiJ9",
      "header": { "kid": "key-2" },
      "signature": "DtEhU3ljbEg8..."
    }
  ]
}
```

特徴:
- **複数の署名**を付与可能
- 保護されないヘッダー（`header`）を含められる
- API レスポンスのボディで使用

## JWS Header パラメータ

| パラメータ | 説明 | 例 |
|-----------|------|-----|
| `alg` | 署名アルゴリズム（必須） | `RS256`, `ES256`, `HS256` |
| `typ` | トークンタイプ | `JWT`, `at+jwt` |
| `kid` | 鍵 ID（JWKS から鍵を特定） | `"key-2024-01"` |
| `jku` | JWK Set の URL | `"https://auth.example.com/.well-known/jwks.json"` |
| `jwk` | 公開鍵を直接埋め込み | `{ "kty": "RSA", ... }` |
| `x5c` | X.509 証明書チェーン | `["MIIC+DCCAe..."]` |
| `crit` | 必須パラメータのリスト | `["exp", "b64"]` |

## 署名アルゴリズム（JWA）

### HMAC 系（対称鍵）

```
HS256 = HMAC + SHA-256  (鍵: 256 bit 以上)
HS384 = HMAC + SHA-384  (鍵: 384 bit 以上)
HS512 = HMAC + SHA-512  (鍵: 512 bit 以上)
```

署名:
```
HMAC-SHA256(
  ASCII(BASE64URL(Header) + "." + BASE64URL(Payload)),
  secret_key
)
```

### RSA 系（非対称鍵）

```
RS256 = RSASSA-PKCS1-v1_5 + SHA-256  (鍵: 2048 bit 以上)
RS384 = RSASSA-PKCS1-v1_5 + SHA-384
RS512 = RSASSA-PKCS1-v1_5 + SHA-512
PS256 = RSASSA-PSS + SHA-256          (より安全な RSA パディング)
PS384 = RSASSA-PSS + SHA-384
PS512 = RSASSA-PSS + SHA-512
```

> OIDC では RS256 のサポートが**必須**。PS256 はより安全な代替手段。

### 楕円曲線系（非対称鍵）

```
ES256  = ECDSA + P-256 + SHA-256  (鍵: 256 bit)
ES384  = ECDSA + P-384 + SHA-384  (鍵: 384 bit)
ES512  = ECDSA + P-521 + SHA-512  (鍵: 521 bit)
EdDSA  = Ed25519 / Ed448           (最新、高速)
```

> ES256 は鍵サイズが小さく高速。モバイルや IoT に適する。

### none（署名なし）

```
alg: "none" → 署名なし（Unsecured JWS）
```

> **本番環境では絶対に使用しないこと。** alg: none 攻撃の対象になる。

## JWS の署名生成手順

```
1. Header を JSON で構築
   { "alg": "RS256", "typ": "JWT", "kid": "key-1" }

2. Payload を JSON で構築
   { "sub": "testuser", "iss": "http://localhost:8080", "exp": 1700000000 }

3. 署名入力を生成
   signing_input = BASE64URL(Header) + "." + BASE64URL(Payload)

4. 秘密鍵で署名
   signature = RSA-SHA256(signing_input, private_key)

5. JWS を組み立て
   jws = signing_input + "." + BASE64URL(signature)
```

## JWS の署名検証手順

```
1. JWS を "." で分割 → [header_b64, payload_b64, signature_b64]

2. Header をデコードして alg と kid を取得

3. alg が許可されたアルゴリズムか確認
   → "none" や想定外のアルゴリズムを拒否

4. kid に対応する公開鍵を JWKS から取得

5. 署名を検証
   signing_input = header_b64 + "." + payload_b64
   VERIFY(signing_input, BASE64URL_DECODE(signature_b64), public_key)

6. Payload のクレームを検証（exp, iss, aud 等）
```

## Detached Payload（分離ペイロード）

ペイロードを JWS に含めず、別経路で送る方式:

```
# 通常の JWS
eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlciJ9.dBjftJeZ4CVP...

# Detached Payload（ペイロード部分が空）
eyJhbGciOiJSUzI1NiJ9..dBjftJeZ4CVP...
```

用途: HTTP リクエストボディの完全性を JWS で保証（FAPI で使用）

## 参考 RFC

- [RFC 7515](https://datatracker.ietf.org/doc/html/rfc7515) - JSON Web Signature (JWS)
- [RFC 7518](https://datatracker.ietf.org/doc/html/rfc7518) - JSON Web Algorithms (JWA)
- [RFC 8725](https://datatracker.ietf.org/doc/html/rfc8725) - JWT Best Current Practices
