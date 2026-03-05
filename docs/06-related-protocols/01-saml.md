# SAML 2.0（Security Assertion Markup Language）

## SAML とは

SAML 2.0 は **XML ベースの認証・認可プロトコル**で、主に**エンタープライズ SSO**（シングルサインオン）で使用されます。

> SAML は OAuth/OIDC とは**別のプロトコル**です。OAuth が「認可」を主目的とするのに対し、SAML は「認証」を主目的としています。

## 登場人物

| ロール | 説明 | OAuth での対応 |
|--------|------|---------------|
| Identity Provider (IdP) | ユーザーを認証するサーバー | Authorization Server |
| Service Provider (SP) | サービスを提供するアプリ | Client + Resource Server |
| Principal | ユーザー本人 | Resource Owner |

## SAML の認証フロー（SP-Initiated）

```
┌──────────┐     ┌──────────────────┐     ┌──────────────────┐
│ ユーザー  │     │ Service Provider │     │ Identity Provider│
│ (ブラウザ)│     │     (SP)         │     │     (IdP)        │
└────┬─────┘     └───────┬──────────┘     └───────┬──────────┘
     │  1. アクセス       │                        │
     │──────────────────→│                        │
     │                    │  2. SAMLRequest        │
     │                    │  (HTTP Redirect)       │
     │←─────────────────────────────────────────→│
     │                    │                        │
     │  3. ログイン画面    │                        │
     │←───────────────────────────────────────────│
     │  4. 認証情報入力    │                        │
     │────────────────────────────────────────────→│
     │                    │                        │
     │  5. SAMLResponse（Assertion）               │
     │←───────────────────────────────────────────│
     │  6. Assertion を    │                        │
     │     SP へ POST      │                        │
     │──────────────────→│                        │
     │                    │  7. Assertion 検証      │
     │  8. アクセス許可    │                        │
     │←─────────────────│                        │
```

## SAML Assertion の構造

SAML Assertion は XML 形式で、以下の3つの Statement を含みます:

### 1. Authentication Statement（認証）

ユーザーがいつ、どのように認証されたか:

```xml
<saml:AuthnStatement AuthnInstant="2024-01-01T00:00:00Z">
  <saml:AuthnContext>
    <saml:AuthnContextClassRef>
      urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
    </saml:AuthnContextClassRef>
  </saml:AuthnContext>
</saml:AuthnStatement>
```

### 2. Attribute Statement（属性）

ユーザーの属性情報:

```xml
<saml:AttributeStatement>
  <saml:Attribute Name="email">
    <saml:AttributeValue>user@example.com</saml:AttributeValue>
  </saml:Attribute>
  <saml:Attribute Name="displayName">
    <saml:AttributeValue>Test User</saml:AttributeValue>
  </saml:Attribute>
</saml:AttributeStatement>
```

### 3. Authorization Decision Statement（認可）

リソースへのアクセス可否（あまり使われない）。

## SAML のバインディング

| バインディング | 説明 |
|----------------|------|
| HTTP Redirect | クエリパラメータで SAMLRequest を送信 |
| HTTP POST | フォーム POST で SAMLResponse を送信 |
| HTTP Artifact | 参照トークンを送り、バックチャネルで取得 |
| SOAP | サーバー間直接通信 |

## SAML のメリット・デメリット

### メリット

- エンタープライズでの実績が豊富
- 詳細な属性情報を Assertion に含められる
- XML 署名による強力なセキュリティ

### デメリット

- XML ベースで冗長（OAuth/OIDC は JSON）
- モバイル / SPA との相性が悪い
- 実装が複雑

## 参考仕様

- [SAML 2.0 Core](http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
- [SAML 2.0 Bindings](http://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf)
