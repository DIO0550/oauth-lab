# セキュリティ考慮事項

## OAuth 2.0 の主な攻撃ベクトル

### 1. CSRF攻撃（state パラメータ）

認可リクエストに `state` パラメータを含め、コールバックで検証することで防止します。

TODO: 攻撃シナリオと防御方法を詳述

### 2. 認可コード横取り攻撃（PKCE）

公開クライアントでは PKCE を使用して認可コードの横取りを防止します。

TODO: 攻撃シナリオと防御方法を詳述

### 3. リダイレクトURI の検証

認可サーバーは登録済みの redirect_uri と完全一致を検証する必要があります。

### 4. トークンの漏洩

TODO: 以下を記述
- HTTPS の必須化
- トークンの保存場所（Cookie vs localStorage）
- トークンの有効期限設定

### 5. クライアント認証

TODO: 以下を記述
- client_secret の安全な管理
- Confidential Client vs Public Client

## このLabでの簡略化

このLabは学習用のため、以下の点が本番環境とは異なります：

- HTTP を使用（本番では HTTPS 必須）
- インメモリストア（本番ではDB）
- シンプルなセッション管理（本番では安全なセッションライブラリを使用）
- パスワードの平文保存（本番ではハッシュ化）

## 参考

- [RFC 6819](https://datatracker.ietf.org/doc/html/rfc6819) - OAuth 2.0 Threat Model and Security Considerations
- [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
