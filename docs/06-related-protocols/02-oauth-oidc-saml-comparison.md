# OAuth 2.0 / OIDC / SAML 比較

## プロトコル比較表

| | OAuth 2.0 | OpenID Connect | SAML 2.0 |
|---|-----------|---------------|----------|
| **主目的** | 認可（Authorization） | 認証（Authentication） | 認証 + 認可 |
| **データ形式** | JSON | JSON / JWT | XML |
| **トークン** | Access Token, Refresh Token | ID Token (JWT) | Assertion (XML) |
| **トランスポート** | HTTPS + JSON | HTTPS + JSON/JWT | HTTP Redirect/POST + XML |
| **主な用途** | API アクセス制御 | ユーザー認証 + API | エンタープライズ SSO |
| **モバイル対応** | 良好 | 良好 | 困難 |
| **複雑さ** | 中 | 中 | 高 |
| **策定年** | 2012 (RFC 6749) | 2014 | 2005 |

## ユースケース別の選択指針

### OAuth 2.0 を選ぶべき場面

- サードパーティに API アクセスを委任したい
- マイクロサービス間のアクセス制御
- ユーザーの「認証」は不要で「認可」だけ必要

### OpenID Connect を選ぶべき場面

- 「Google でログイン」のようなソーシャルログイン
- SPA / モバイルアプリのユーザー認証
- OAuth 2.0 の認可 + ユーザー認証が両方必要

### SAML 2.0 を選ぶべき場面

- 企業内 SSO（Active Directory, Okta, etc.）
- レガシーシステムとの統合
- 厳密な属性ベースのアクセス制御が必要

## フロー比較

### OAuth 2.0 Authorization Code

```
Client → AuthZ Server: /authorize?response_type=code
User   → AuthZ Server: ログイン
AuthZ Server → Client: code
Client → AuthZ Server: POST /token (code + client_secret)
AuthZ Server → Client: access_token
Client → Resource Server: API call + Bearer token
```

### OpenID Connect

```
Client → AuthZ Server: /authorize?response_type=code&scope=openid
User   → AuthZ Server: ログイン
AuthZ Server → Client: code
Client → AuthZ Server: POST /token (code + client_secret)
AuthZ Server → Client: access_token + id_token (JWT)
Client: id_token を検証してユーザー情報を取得
```

### SAML 2.0 (SP-Initiated)

```
User   → SP: アクセス
SP     → IdP: SAMLRequest (HTTP Redirect)
User   → IdP: ログイン
IdP    → SP: SAMLResponse + Assertion (HTTP POST)
SP: Assertion の署名を検証
SP     → User: アクセス許可
```

## 認証と認可の違い

```
認証（Authentication / AuthN）
  → 「あなたは誰ですか？」を確認する
  → OIDC, SAML が対応

認可（Authorization / AuthZ）
  → 「あなたは何ができますか？」を制御する
  → OAuth 2.0 が対応
```

> OAuth 2.0 単体では「認証」はできません。OAuth でユーザー認証を行うには OIDC が必要です。

## トークン / Assertion の比較

| | OAuth Access Token | OIDC ID Token | SAML Assertion |
|---|-------------------|---------------|----------------|
| **形式** | 不透明文字列 or JWT | JWT | XML |
| **サイズ** | 小 | 中 | 大 |
| **署名** | 任意 | 必須 (JWS) | 必須 (XML Signature) |
| **有効期限** | 短い（分〜時間） | 短い（分〜時間） | 短い（分） |
| **含む情報** | スコープ | ユーザー情報 + クレーム | 属性 + 認証情報 |
| **検証方法** | Introspection or JWT検証 | JWT 署名検証 | XML 署名検証 |

## 組み合わせパターン

### SAML + OAuth（SAML Bearer Assertion）

エンタープライズで SAML IdP を使いつつ、API アクセスに OAuth を使うパターン:

```
1. User → IdP: SAML 認証
2. IdP → Client: SAML Assertion
3. Client → AuthZ Server: POST /token
     grant_type=urn:ietf:params:oauth:grant-type:saml2-bearer
     assertion=<Base64 SAML Assertion>
4. AuthZ Server → Client: access_token
```

参考: [RFC 7522](https://datatracker.ietf.org/doc/html/rfc7522) - SAML 2.0 Bearer Assertion for OAuth 2.0

## 参考仕様

- [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) - OAuth 2.0
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [SAML 2.0](http://docs.oasis-open.org/security/saml/v2.0/)
- [RFC 7522](https://datatracker.ietf.org/doc/html/rfc7522) - SAML 2.0 Bearer Assertion
