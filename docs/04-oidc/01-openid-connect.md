# OpenID Connect (OIDC)

## OIDCとは

OpenID Connect は OAuth 2.0 の上に構築された **認証（Authentication）** のレイヤーです。

OAuth 2.0 だけでは「誰がログインしたか」を安全に確認する標準的な方法がありません。OIDCはこれを解決します。

## OAuth 2.0 と OIDC の違い

| | OAuth 2.0 | OIDC |
|--|-----------|------|
| 目的 | 認可（Authorization） | 認証（Authentication） |
| 発行されるもの | アクセストークン | アクセストークン + **ID Token** |
| scope | 任意 | `openid` が必須 |
| ユーザー情報 | 標準化なし | `/userinfo` エンドポイント |

## OIDC の主要な概念

TODO: 以下を記述
- ID Token（JWT形式）
- UserInfo エンドポイント
- 標準スコープ（openid, profile, email）
- 標準クレーム（sub, name, email, etc.）
- Discovery（.well-known/openid-configuration）

## 対応するソースコード

| 概念 | ファイル |
|------|---------|
| UserInfo エンドポイント | `services/auth-server/src/routes/userinfo.ts` |

## 参考仕様

- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html)
