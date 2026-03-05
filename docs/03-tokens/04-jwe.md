# JWE（JSON Web Encryption）

## JWE とは

JWE（RFC 7516）は、JSON データを**暗号化**するための仕様です。JWS が「改ざん防止（署名）」であるのに対し、JWE は「盗聴防止（暗号化）」を提供します。

## JWS vs JWE

| | JWS（署名） | JWE（暗号化） |
|---|-----------|-------------|
| **目的** | 改ざん防止・発行者証明 | 機密性の保護 |
| **ペイロード** | 誰でも読める（Base64URL） | 暗号化されて読めない |
| **部品数** | 3 parts | 5 parts |
| **使い所** | ID Token, Access Token | 機密データの送信 |

```
JWS: 中身は見えるが改ざんできない（封筒に署名）
JWE: 中身が見えない（封筒を暗号化）
JWS + JWE: 中身が見えず改ざんもできない（署名して暗号化）
```

## JWE の構造（5パート）

```
BASE64URL(Header)
.
BASE64URL(Encrypted Key)
.
BASE64URL(IV)
.
BASE64URL(Ciphertext)
.
BASE64URL(Authentication Tag)
```

| パート | 説明 |
|--------|------|
| Header | 暗号化アルゴリズム等のメタデータ |
| Encrypted Key | コンテンツ暗号化鍵（CEK）を受信者の公開鍵で暗号化したもの |
| IV | 初期化ベクトル（ランダム値） |
| Ciphertext | 暗号化されたペイロード |
| Authentication Tag | 認証タグ（改ざん検知） |

## JWE Header

```json
{
  "alg": "RSA-OAEP",
  "enc": "A256GCM",
  "kid": "enc-key-1"
}
```

| パラメータ | 説明 |
|-----------|------|
| `alg` | 鍵暗号化アルゴリズム（CEK をどう暗号化するか） |
| `enc` | コンテンツ暗号化アルゴリズム（ペイロードをどう暗号化するか） |
| `kid` | 使用する鍵の ID |
| `zip` | 圧縮アルゴリズム（`DEF` = Deflate） |

## 暗号化アルゴリズム

### 鍵暗号化アルゴリズム（`alg`）

| アルゴリズム | 説明 |
|------------|------|
| `RSA-OAEP` | RSA-OAEP（推奨） |
| `RSA-OAEP-256` | RSA-OAEP + SHA-256 |
| `A128KW` | AES Key Wrap (128 bit) |
| `A256KW` | AES Key Wrap (256 bit) |
| `dir` | CEK を直接使用（鍵暗号化なし） |
| `ECDH-ES` | 楕円曲線 Diffie-Hellman |
| `ECDH-ES+A128KW` | ECDH-ES + AES Key Wrap |

### コンテンツ暗号化アルゴリズム（`enc`）

| アルゴリズム | 説明 |
|------------|------|
| `A128GCM` | AES-GCM (128 bit) |
| `A256GCM` | AES-GCM (256 bit)（推奨） |
| `A128CBC-HS256` | AES-CBC + HMAC-SHA-256 |
| `A256CBC-HS512` | AES-CBC + HMAC-SHA-512 |

## JWE の暗号化手順

```
1. Content Encryption Key (CEK) をランダム生成

2. CEK を受信者の公開鍵で暗号化
   encrypted_key = RSA-OAEP(CEK, recipient_public_key)

3. IV（初期化ベクトル）をランダム生成

4. ペイロードを CEK で暗号化
   (ciphertext, tag) = AES-256-GCM(payload, CEK, IV, AAD)
   ※ AAD = BASE64URL(Header)

5. JWE を組み立て
   jwe = BASE64URL(Header) + "." +
         BASE64URL(encrypted_key) + "." +
         BASE64URL(IV) + "." +
         BASE64URL(ciphertext) + "." +
         BASE64URL(tag)
```

## JWE の復号手順

```
1. JWE を "." で5つに分割

2. Header をデコードして alg と enc を取得

3. Encrypted Key を自分の秘密鍵で復号 → CEK を取得
   CEK = RSA-OAEP-DECRYPT(encrypted_key, my_private_key)

4. Ciphertext を CEK で復号
   payload = AES-256-GCM-DECRYPT(ciphertext, CEK, IV, AAD, tag)
```

## Nested JWT（署名 + 暗号化）

JWS で署名した後、JWE で暗号化するパターン:

```
1. ペイロードを JWS で署名 → signed_jwt
2. signed_jwt を JWE で暗号化 → encrypted_jwe

Header に "cty": "JWT" を設定して、中身が JWT であることを示す:
{
  "alg": "RSA-OAEP",
  "enc": "A256GCM",
  "cty": "JWT"        ← ネストされた JWT であることを示す
}
```

> OIDC では ID Token を暗号化する場合、まず署名してから暗号化する（Sign-then-Encrypt）。

## OAuth/OIDC での JWE の用途

| 用途 | 説明 |
|------|------|
| 暗号化された ID Token | クライアントに渡す ID Token の機密性を保護 |
| 暗号化されたリクエストオブジェクト | 認可リクエストのパラメータを暗号化 |
| 暗号化された UserInfo レスポンス | ユーザー情報の機密性を保護 |

## 参考 RFC

- [RFC 7516](https://datatracker.ietf.org/doc/html/rfc7516) - JSON Web Encryption (JWE)
- [RFC 7518](https://datatracker.ietf.org/doc/html/rfc7518) - JSON Web Algorithms (JWA)
