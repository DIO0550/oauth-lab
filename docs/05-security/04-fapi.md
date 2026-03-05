# FAPI（Financial-grade API）

## FAPI とは

FAPI（Financial-grade API）は、OpenID Foundation が策定した**高セキュリティな API 保護のためのプロファイル**です。

金融 API（銀行、決済）を想定して設計されていますが、医療、行政など**高いセキュリティが求められる分野**にも適用されます。

## FAPI 1.0 のプロファイル

### Baseline Profile（基本）

最低限のセキュリティ要件:

- PKCE 必須（`S256`）
- `state` パラメータ必須
- リダイレクト URI の完全一致
- TLS 1.2 以上
- クライアント認証必須（`client_secret_basic` 以上）

### Advanced Profile（高度）

Baseline に加えて:

- **PAR**（Pushed Authorization Requests）必須
- **JARM**（JWT Secured Authorization Response Mode）またはハイブリッドフロー
- **送信者制約トークン**（mTLS or DPoP）
- リクエストオブジェクト（`request` or `request_uri`）
- `s_hash`（state のハッシュ）を ID Token に含める

## FAPI 2.0（Security Profile）

FAPI 1.0 を簡素化した次世代プロファイル:

| 要件 | FAPI 1.0 Advanced | FAPI 2.0 |
|------|-------------------|----------|
| PKCE | 必須 | 必須 |
| PAR | 必須 | 必須 |
| 送信者制約 | mTLS | mTLS or DPoP |
| リクエストオブジェクト | 必須 | PAR で代替 |
| レスポンスモード | JARM or Hybrid | 不要（PAR で保護） |
| Implicit / Hybrid | 条件付き許可 | 禁止 |

## FAPI のセキュリティ要件まとめ

```
通常の OAuth 2.0:
  Authorization Code + PKCE + state

FAPI 1.0 Baseline:
  + クライアント認証強化
  + TLS 必須
  + 短いトークン有効期限

FAPI 1.0 Advanced / FAPI 2.0:
  + PAR（パラメータの事前送信）
  + 送信者制約トークン（mTLS / DPoP）
  + より厳格な検証
```

## FAPI の適用事例

| 分野 | 適用例 |
|------|--------|
| 金融 | Open Banking（UK, EU, BR, AU）、電子決済 |
| 行政 | マイナンバー関連 API、デジタル ID |
| 医療 | 電子カルテ API、SMART on FHIR |
| 通信 | CAMARA API（モバイルネットワーク API） |

## 日本における FAPI

- **全銀協 OpenAPI** — 銀行 API の標準として FAPI ベースのガイドラインを採用
- **マイナンバー** — デジタル庁が FAPI 2.0 ベースの仕様を検討

## 参考仕様

- [FAPI 1.0 Baseline](https://openid.net/specs/openid-financial-api-part-1-1_0.html)
- [FAPI 1.0 Advanced](https://openid.net/specs/openid-financial-api-part-2-1_0.html)
- [FAPI 2.0 Security Profile](https://openid.bitbucket.io/fapi/fapi-2_0-security-profile.html)
