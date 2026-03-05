# JWK（JSON Web Key）/ JWKS

## JWK とは

JWK（RFC 7517）は、暗号鍵を **JSON 形式で表現**するための仕様です。OAuth/OIDC では、署名検証用の公開鍵を配布するために使用されます。

## なぜ JWK が必要か

```
従来:
  PEM 形式の証明書ファイルを手動で配布
  → 鍵の更新が面倒、自動化しにくい

JWK:
  JSON 形式で HTTPS エンドポイントから取得
  → 自動的に最新の鍵を取得、ローテーションが容易
```

## JWK の構造

### RSA 公開鍵の例

```json
{
  "kty": "RSA",
  "kid": "auth-server-key-2024",
  "use": "sig",
  "alg": "RS256",
  "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4...",
  "e": "AQAB"
}
```

### 楕円曲線公開鍵の例

```json
{
  "kty": "EC",
  "kid": "ec-key-2024",
  "use": "sig",
  "alg": "ES256",
  "crv": "P-256",
  "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
  "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0"
}
```

## JWK パラメータ

### 共通パラメータ

| パラメータ | 必須 | 説明 |
|-----------|------|------|
| `kty` | ✅ | 鍵タイプ（`RSA`, `EC`, `OKP`, `oct`） |
| `kid` | 推奨 | 鍵 ID（JWT Header の kid と一致させる） |
| `use` | | 用途（`sig` = 署名, `enc` = 暗号化） |
| `alg` | | アルゴリズム（`RS256`, `ES256` 等） |
| `key_ops` | | 鍵操作（`sign`, `verify`, `encrypt`, `decrypt` 等） |

### RSA 固有パラメータ

| パラメータ | 説明 |
|-----------|------|
| `n` | Modulus（公開鍵の法） |
| `e` | Exponent（公開鍵の指数、通常 `AQAB` = 65537） |
| `d` | 秘密鍵の指数（**秘密鍵のみ**） |
| `p`, `q` | 素因数（**秘密鍵のみ**） |

### EC（楕円曲線）固有パラメータ

| パラメータ | 説明 |
|-----------|------|
| `crv` | 曲線名（`P-256`, `P-384`, `P-521`） |
| `x` | X 座標 |
| `y` | Y 座標 |
| `d` | 秘密鍵の値（**秘密鍵のみ**） |

## JWKS（JWK Set）

複数の JWK をまとめた集合:

```json
{
  "keys": [
    {
      "kty": "RSA",
      "kid": "key-2024-01",
      "use": "sig",
      "alg": "RS256",
      "n": "0vx7agoebGcQ...",
      "e": "AQAB"
    },
    {
      "kty": "RSA",
      "kid": "key-2024-02",
      "use": "sig",
      "alg": "RS256",
      "n": "pjdss8ZaDfEH...",
      "e": "AQAB"
    }
  ]
}
```

## JWKS エンドポイント

認可サーバーが公開鍵を配信する標準エンドポイント:

```
GET /.well-known/jwks.json
```

OIDC Discovery の `jwks_uri` で URL が公開される:

```json
{
  "issuer": "http://localhost:8080",
  "jwks_uri": "http://localhost:8080/.well-known/jwks.json",
  ...
}
```

## 鍵ローテーション

セキュリティのために定期的に鍵を更新する手順:

```
Phase 1: 旧鍵のみ
  JWKS: [key-A (active)]
  JWT署名: key-A で署名

Phase 2: 新鍵を追加（両方公開）
  JWKS: [key-A (active), key-B (new)]
  JWT署名: まだ key-A で署名

Phase 3: 新鍵で署名開始
  JWKS: [key-A (old), key-B (active)]
  JWT署名: key-B で署名
  ※ key-A はまだ JWKS に残す（古い JWT の検証用）

Phase 4: 旧鍵を削除
  JWKS: [key-B (active)]
  ※ key-A で署名された JWT が全て期限切れになってから
```

### ローテーションのポイント

1. **kid で鍵を識別** — JWT Header の `kid` で対応する公開鍵を特定
2. **キャッシュ** — JWKS をキャッシュし、未知の `kid` が来たら再取得
3. **移行期間** — 新旧の鍵を一定期間併存させる
4. **秘密鍵の安全な破棄** — ローテーション完了後、旧秘密鍵を完全に削除

## JWKS のキャッシュ戦略

```
1. JWKS を取得してキャッシュ（TTL: 数時間〜1日）

2. JWT 検証時:
   a. kid に対応する鍵がキャッシュにある → そのまま使用
   b. kid に対応する鍵がない → JWKS を再取得
   c. 再取得しても見つからない → 検証失敗

3. レート制限:
   JWKS の再取得は最短でも数秒間隔を空ける
   → 攻撃者が大量の不正 kid で DoS を仕掛けるのを防止
```

## 参考 RFC

- [RFC 7517](https://datatracker.ietf.org/doc/html/rfc7517) - JSON Web Key (JWK)
- [RFC 7518](https://datatracker.ietf.org/doc/html/rfc7518) - JSON Web Algorithms (JWA)
