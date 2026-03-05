# DPoP（Demonstrating Proof-of-Possession）

## DPoP とは

DPoP（RFC 9449）は、アクセストークンを**送信者に紐づける**仕組みです。

通常の Bearer トークンは「持っていれば誰でも使える」ため、漏洩するとそのまま悪用されます。DPoP はトークン使用時に**秘密鍵による証明**を要求することで、この問題を解決します。

## Bearer Token vs DPoP Token

```
Bearer Token（従来）:
  トークンを持っている → API にアクセスできる
  → トークンが漏洩したら誰でも使える ❌

DPoP Token:
  トークンを持っている + 秘密鍵で署名できる → API にアクセスできる
  → トークンが漏洩しても秘密鍵がなければ使えない ✅
```

## DPoP のフロー

```
┌──────────┐                     ┌──────────────────┐
│  Client  │                     │ Authorization    │
│          │                     │ Server           │
└────┬─────┘                     └───────┬──────────┘
     │                                   │
     │  0. 鍵ペア生成（公開鍵 + 秘密鍵）    │
     │                                   │
     │  1. POST /token                   │
     │     + DPoP: <DPoP Proof JWT>      │
     │────────────────────────────────→│
     │                                   │
     │  2. DPoP-bound access_token       │
     │     token_type: "DPoP"            │
     │←───────────────────────────────│
     │                                   │
     │  3. GET /api/resource              │
     │     Authorization: DPoP <token>    │
     │     DPoP: <新しい DPoP Proof JWT>   │
     │─────────────────────────────────→ Resource Server
```

## DPoP Proof JWT

DPoP Proof は、API リクエストごとにクライアントが生成する JWT:

### Header

```json
{
  "typ": "dpop+jwt",
  "alg": "ES256",
  "jwk": {
    "kty": "EC",
    "crv": "P-256",
    "x": "...",
    "y": "..."
  }
}
```

### Payload

```json
{
  "jti": "unique-id-123",
  "htm": "POST",
  "htu": "https://auth.example.com/token",
  "iat": 1735689600,
  "ath": "fUHyO2r2Z3DZ53EsNrWBb0xWXoaNy59IiKCAqksmQEo"
}
```

| クレーム | 説明 |
|---------|------|
| jti | 一意識別子（リプレイ攻撃防止） |
| htm | HTTP メソッド |
| htu | リクエスト先 URL |
| iat | 発行時刻 |
| ath | アクセストークンのハッシュ（API呼び出し時） |

## DPoP vs mTLS

| | DPoP | mTLS (RFC 8705) |
|---|------|------|
| **レイヤー** | アプリケーション層 | TLS 層 |
| **証明書** | 自己生成の鍵ペア | X.509 証明書 |
| **導入の容易さ** | 比較的容易 | インフラ変更が必要 |
| **ブラウザ対応** | JavaScript で実装可 | ブラウザ証明書が必要 |
| **適用範囲** | SPA, モバイル | サーバー間通信 |

## 参考 RFC

- [RFC 9449](https://datatracker.ietf.org/doc/html/rfc9449) - OAuth 2.0 Demonstrating Proof of Possession (DPoP)
- [RFC 8705](https://datatracker.ietf.org/doc/html/rfc8705) - OAuth 2.0 Mutual-TLS Client Authentication
