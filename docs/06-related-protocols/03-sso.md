# SSO（シングルサインオン）

## SSO とは

SSO（Single Sign-On）は、**一度のログインで複数のサービスにアクセスできる仕組み**です。

```
┌──────────────────────────────────────────────┐
│           SSO なし                             │
│                                               │
│  App A → ログイン → 利用                       │
│  App B → ログイン → 利用   ← 毎回ログインが必要  │
│  App C → ログイン → 利用                       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│           SSO あり                             │
│                                               │
│  IdP → ログイン（1回だけ）                      │
│  App A → 自動認証 → 利用                       │
│  App B → 自動認証 → 利用   ← 追加ログイン不要    │
│  App C → 自動認証 → 利用                       │
└──────────────────────────────────────────────┘
```

## SSO の実現方式

| 方式 | プロトコル | 特徴 |
|------|-----------|------|
| SAML SSO | SAML 2.0 | エンタープライズ向け、XML ベース |
| OIDC SSO | OpenID Connect | モダンアプリ向け、JSON/JWT ベース |
| Kerberos | Kerberos v5 | Windows AD 環境（オンプレミス） |
| CAS | CAS Protocol | 大学・研究機関で使用 |

## OIDC による SSO

OpenID Connect を使った SSO が最もモダンなアプローチ:

```
┌────────┐    ┌────────┐    ┌──────────────┐
│ App A  │    │ App B  │    │  OIDC Provider│
│(RP)    │    │(RP)    │    │  (IdP/OP)    │
└───┬────┘    └───┬────┘    └──────┬───────┘
    │             │                │
    │ 1. /authorize                │
    │────────────────────────────→│
    │             │    2. ログイン  │
    │             │    + セッション │
    │             │    Cookie発行  │
    │ 3. id_token │                │
    │←───────────────────────────│
    │             │                │
    │     4. App B にアクセス       │
    │             │ 5. /authorize  │
    │             │───────────────→│
    │             │ 6. セッション有 │
    │             │    → ログイン   │
    │             │    スキップ     │
    │             │ 7. id_token    │
    │             │←──────────────│
```

ポイント: IdP でのセッション Cookie により、2回目以降はログイン画面が表示されない。

## セッション管理

### IdP セッションと RP セッション

```
IdP セッション: IdP サーバーで管理（ログイン状態）
     ↓
RP セッション: 各アプリで管理（アプリ固有のセッション）
```

- IdP セッションが切れる → 全アプリで再認証が必要
- RP セッションが切れる → そのアプリだけ再認証（IdP セッションが有効なら即時）

### ログアウトの種類

| 方式 | 説明 |
|------|------|
| RP-Initiated Logout | アプリからログアウトリクエストを送る |
| Front-Channel Logout | ブラウザ経由で全 RP にログアウト通知 |
| Back-Channel Logout | サーバー間で直接ログアウト通知 |
| Single Logout (SLO) | 1回のログアウトで全サービスからログアウト |

### OIDC RP-Initiated Logout

```
GET /logout?
  id_token_hint=<id_token>&
  post_logout_redirect_uri=http://localhost:3000/&
  state=abc123
```

## IdP (Identity Provider) の例

| IdP | 対応プロトコル | 用途 |
|-----|---------------|------|
| Okta | SAML, OIDC | エンタープライズ |
| Auth0 | OIDC, SAML | 汎用 |
| Azure AD | SAML, OIDC, WS-Fed | Microsoft 環境 |
| Google Identity | OIDC | コンシューマー |
| Keycloak | SAML, OIDC | OSS |

## 参考仕様

- [OpenID Connect Session Management 1.0](https://openid.net/specs/openid-connect-session-1_0.html)
- [OpenID Connect RP-Initiated Logout 1.0](https://openid.net/specs/openid-connect-rpinitiated-1_0.html)
- [OpenID Connect Back-Channel Logout 1.0](https://openid.net/specs/openid-connect-backchannel-1_0.html)
- [OpenID Connect Front-Channel Logout 1.0](https://openid.net/specs/openid-connect-frontchannel-1_0.html)
