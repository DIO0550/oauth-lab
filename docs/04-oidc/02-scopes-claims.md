# スコープとクレーム

## スコープ（Scope）

スコープはクライアントが要求する権限の範囲を定義します。

### OAuth 2.0 のスコープ

スコープは自由に定義できます。このLabでは `read` スコープを使用しています。

### OIDC 標準スコープ

| スコープ | 返されるクレーム |
|----------|------------------|
| openid | sub |
| profile | name, family_name, given_name, ... |
| email | email, email_verified |
| address | address |
| phone | phone_number, phone_number_verified |

## クレーム（Claim）

クレームはトークンに含まれるユーザーに関する情報です。

TODO: 以下を記述
- ID Token のクレーム
- UserInfo レスポンスのクレーム
- カスタムクレーム
- クレームの要求方法（claims パラメータ）

## 参考仕様

- [RFC 6749 Section 3.3](https://datatracker.ietf.org/doc/html/rfc6749#section-3.3) - Access Token Scope
- [OpenID Connect Core 1.0 Section 5.4](https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims) - Requesting Claims using Scope Values
