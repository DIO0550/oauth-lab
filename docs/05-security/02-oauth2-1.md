# OAuth 2.1 の変更点

## 概要

OAuth 2.1 は OAuth 2.0（RFC 6749）のセキュリティベストプラクティスを統合した**改訂版**仕様です。新しい機能を追加するものではなく、既存のベストプラクティスを標準化したものです。

## OAuth 2.0 からの主な変更点

### 1. PKCE が必須

すべての Authorization Code フローで PKCE（RFC 7636）が**必須**になります。

```
# OAuth 2.0: PKCE はオプション
# OAuth 2.1: PKCE は必須
GET /authorize?
  response_type=code&
  client_id=my-app&
  code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&
  code_challenge_method=S256
```

### 2. Implicit フローの廃止

`response_type=token` は完全に削除されます。

| OAuth 2.0 | OAuth 2.1 |
|-----------|-----------|
| Implicit 使用可能（非推奨） | Implicit 完全廃止 |

### 3. Resource Owner Password Credentials の廃止

`grant_type=password` は完全に削除されます。

### 4. リダイレクト URI の厳密な一致

ワイルドカードやパターンマッチは禁止され、**完全一致**が必須になります。

```
# NG: パスの一部一致
登録: https://app.example.com/callback
要求: https://app.example.com/callback/extra  ← 拒否

# OK: 完全一致のみ
登録: https://app.example.com/callback
要求: https://app.example.com/callback  ← 許可
```

### 5. リフレッシュトークンの制約強化

- **Sender-Constrained** トークンまたは**ローテーション**が推奨
- パブリッククライアントではリフレッシュトークンのローテーションが必須

```
# トークンローテーション
リフレッシュトークン A → 新アクセストークン + 新リフレッシュトークン B
リフレッシュトークン A → 再利用 → 不正検出 → 全トークン無効化
```

### 6. Bearer トークンの URI クエリパラメータ禁止

```
# NG: クエリパラメータでトークンを送信
GET /api/resource?access_token=eyJhbGci...

# OK: Authorization ヘッダーで送信
GET /api/resource
Authorization: Bearer eyJhbGci...
```

## OAuth 2.0 と OAuth 2.1 の比較まとめ

| 項目 | OAuth 2.0 | OAuth 2.1 |
|------|-----------|-----------|
| PKCE | オプション | 必須 |
| Implicit | 非推奨 | 廃止 |
| ROPC | 非推奨 | 廃止 |
| リダイレクト URI | 部分一致可 | 完全一致必須 |
| リフレッシュトークンローテーション | オプション | 推奨/必須 |
| Bearer in URI | 非推奨 | 禁止 |

## 参考

- [OAuth 2.1 Draft](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1)
- [OAuth 2.0 Security BCP](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
