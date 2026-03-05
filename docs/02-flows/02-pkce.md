# PKCE（Proof Key for Code Exchange）

## PKCEとは

PKCE (RFC 7636) は Authorization Code Flow を公開クライアント（SPA、モバイルアプリ）でも安全に利用するための拡張です。

TODO: 以下を記述
- code_verifier と code_challenge の仕組み
- S256 変換（SHA-256 ハッシュ + Base64URL エンコード）
- 認可コード横取り攻撃の防止
- 実装例

## フロー

```
Client                           Auth Server
  |                                   |
  |-- (1) code_challenge ------------>|
  |       + Authorization Request     |
  |                                   |
  |<-- (2) Authorization Code --------|
  |                                   |
  |-- (3) code_verifier ------------->|
  |       + Token Request             |
  |                                   |
  |   Auth Server が                  |
  |   SHA256(code_verifier) ==        |
  |   code_challenge を検証           |
  |                                   |
  |<-- (4) Access Token --------------|
```

## 参考 RFC

- [RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636) - Proof Key for Code Exchange
