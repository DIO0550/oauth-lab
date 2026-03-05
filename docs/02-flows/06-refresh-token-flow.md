# リフレッシュトークンフロー

## 概要

リフレッシュトークンフローは、期限切れのアクセストークンを**ユーザーの再認証なしに**新しいアクセストークンに交換する仕組みです（RFC 6749 Section 6）。

## なぜ必要か

```
アクセストークン: 短命（数分〜数時間）
  → 漏洩した場合のリスクを最小化

リフレッシュトークン: 長命（数日〜数ヶ月）
  → ユーザー体験の向上（再ログイン不要）
```

## フロー

```
┌──────────┐                          ┌──────────────────┐
│  Client  │                          │ Authorization    │
│          │                          │ Server           │
└────┬─────┘                          └───────┬──────────┘
     │                                        │
     │  1. POST /token                        │
     │     grant_type=refresh_token            │
     │     refresh_token=<refresh_token>       │
     │     client_id=<client_id>               │
     │     client_secret=<client_secret>       │
     │───────────────────────────────────────→│
     │                                        │
     │  2. 新しい access_token                 │
     │     (+ 新しい refresh_token)            │
     │←──────────────────────────────────────│
```

## トークンリクエスト

```http
POST /token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token=dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4
&client_id=oauth-lab-client
&client_secret=oauth-lab-secret
&scope=read openid
```

### パラメータ

| パラメータ | 必須 | 説明 |
|-----------|------|------|
| grant_type | ✅ | `refresh_token` 固定 |
| refresh_token | ✅ | 以前に発行されたリフレッシュトークン |
| client_id | ✅ | クライアント識別子 |
| client_secret | 条件付き | Confidential Client の場合必須 |
| scope | | 元のスコープ以下のスコープを指定可能 |

## レスポンス

```json
{
  "access_token": "new-access-token-xyz",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "new-refresh-token-abc",
  "scope": "read openid"
}
```

## リフレッシュトークンローテーション

セキュリティのため、リフレッシュトークンの使用時に**新しいリフレッシュトークンを発行**し、古いものを無効化するパターン:

```
1回目: refresh_token_A → access_token_1 + refresh_token_B
2回目: refresh_token_B → access_token_2 + refresh_token_C
3回目: refresh_token_C → access_token_3 + refresh_token_D

※ refresh_token_A を再利用 → 全トークン無効化（漏洩検知）
```

### 漏洩検知の仕組み

```
正規ユーザー: refresh_token_A → refresh_token_B を取得
攻撃者:       refresh_token_A を盗んで使用
              → サーバーが「既に使用済み」を検知
              → refresh_token_B も含めて全て無効化
              → ユーザーは再ログインが必要
```

## セキュリティ考慮事項

1. **保存場所** — リフレッシュトークンは安全な場所に保存（HttpOnly Cookie, Secure Storage）
2. **ローテーション** — 使用ごとに新しいトークンに交換
3. **有効期限** — 適切な有効期限を設定
4. **スコープ縮小** — リフレッシュ時にスコープを縮小可能（拡大は不可）
5. **取消** — 不要になったリフレッシュトークンは即座に Revoke

## 参考 RFC

- [RFC 6749 Section 6](https://datatracker.ietf.org/doc/html/rfc6749#section-6) - Refreshing an Access Token
- [RFC 6819](https://datatracker.ietf.org/doc/html/rfc6819) - OAuth 2.0 Threat Model (Section 4.5.2)
