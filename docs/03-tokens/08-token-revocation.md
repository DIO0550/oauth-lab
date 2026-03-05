# Token Revocation

## 概要

Token Revocation（RFC 7009）は、発行済みのアクセストークンやリフレッシュトークンを**無効化**するための仕組みです。

ユーザーがログアウトした場合や、トークンの漏洩が疑われる場合に使用します。

## ユースケース

- ユーザーのログアウト処理
- セッションの強制終了
- トークン漏洩時の緊急対応
- ユーザーによるアプリ連携の解除

## リボケーションリクエスト

```
POST /revoke
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

token=eyJhbGci...&
token_type_hint=access_token
```

| パラメータ | 説明 |
|-----------|------|
| token | 無効化するトークン |
| token_type_hint | トークンの種類のヒント（`access_token` または `refresh_token`） |

## レスポンス

成功時は常に `200 OK` を返します（トークンが存在しない場合も同様）。

```
HTTP/1.1 200 OK
```

> **注意:** エラーを返さないのは、トークンの存在を攻撃者に知らせないためです。

## リフレッシュトークンの連鎖無効化

リフレッシュトークンを無効化した場合、そのリフレッシュトークンから派生したアクセストークンも無効化するべきです（SHOULD）。

```
リフレッシュトークン → 無効化
  └─ 関連するアクセストークン → 無効化
```

## 実装上の考慮事項

- **JWT（自己完結型）トークン** の場合、即座の無効化が難しい
  - ブラックリスト方式: 無効化されたトークンのリストを管理
  - 短い有効期限: アクセストークンの有効期限を短く設定
- **Opaque トークン** の場合、ストアから削除するだけで無効化可能

## 参考 RFC

- [RFC 7009](https://datatracker.ietf.org/doc/html/rfc7009) - OAuth 2.0 Token Revocation
