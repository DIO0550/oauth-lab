# Protocol Templates

プロトコルタイプごとのPhase構成、アクター配置、ステップ定義。プロトコルの技術的内容（パラメータ値、エンドポイント仕様等）はClaudeの知識を使って記述すること。

## 目次

1. [テンプレート一覧](#テンプレート一覧)
2. [OAuth 2.0 Authorization Code](#oauth-20-authorization-code)
3. [OAuth 2.0 Authorization Code + PKCE](#oauth-20-pkce)
4. [OAuth 2.0 Client Credentials](#oauth-20-client-credentials)
5. [OAuth 2.0 Device Authorization](#oauth-20-device-authorization)
6. [OpenID Connect (Authorization Code)](#openid-connect)
7. [SAML 2.0 (SP-Initiated SSO)](#saml-20)
8. [JWT Lifecycle](#jwt-lifecycle)
9. [カスタムプロトコル対応](#カスタムプロトコル対応)

---

## テンプレート一覧

| プロトコル | Phase数 | アクター構成 | RFC/仕様 |
|-----------|---------|-------------|---------|
| OAuth 2.0 Authorization Code | 4 | Owner, Client, AuthServer, ResourceServer | RFC 6749 |
| OAuth 2.0 + PKCE | 4 | Owner, Client(Public), AuthServer, ResourceServer | RFC 7636 |
| OAuth 2.0 Client Credentials | 2 | Client, AuthServer, ResourceServer, (なし) | RFC 6749 |
| OAuth 2.0 Device Authorization | 4 | Owner(Device), Owner(Browser), AuthServer, Client | RFC 8628 |
| OpenID Connect | 4 | EndUser, RP(Client), OP(AuthServer), UserInfo | OpenID Connect Core |
| SAML 2.0 SP-Initiated | 3 | User, SP, IdP, (属性ストア) | SAML 2.0 |
| JWT Lifecycle | 3 | Client, AuthServer, ResourceServer, (なし) | RFC 7519 |

---

## OAuth 2.0 Authorization Code

**ファイル名**: `oauth2-authorization-code-flow.svg`
**バッジ**: `RFC 6749` + `authorization_code`
**viewBox**: `0 0 1100 3200` (4 Phase × 720 + header)

### アクター配置 (2x2)

```
左上: リソース所有者 (owner)      右上: 認可サーバー (authsv)
左下: クライアント (client)       右下: リソースサーバー (ressv)
```

### Phase構成

#### Phase 1: 認可リクエスト
- カラー: `#22d3ee`
- アクティブ: owner, authsv, client
- グレーアウト: ressv

| Step | 方向 | 矢印型 | 色 | ラベル |
|------|------|--------|------|--------|
| 1 | owner → client | 垂直下 | purple | ログインボタン押下 |
| 2 | client → authsv | 斜め右上 (dash) | cyan → amber | 認可リクエスト (フロントチャネル) |

パラメータ表示: `response_type=code`, `client_id`, `scope`, `state`

#### Phase 2: 認証 + 認可コード返却
- カラー: `#f59e0b`
- アクティブ: owner, authsv, client
- グレーアウト: ressv

| Step | 方向 | 矢印型 | 色 | ラベル |
|------|------|--------|------|--------|
| 3 | authsv → owner | 水平左 (dash) | amber → purple | 認証・同意画面を表示 |
| 4 | owner → authsv | 水平右 | purple → amber | ユーザー認証 + スコープ同意 |
| 5 | authsv → client | 斜め左下 | amber → cyan | 認可コード返却 (302 Redirect) |

パラメータ表示: `code=SplxlOBe...`, `state=abc`

#### Phase 3: トークン交換 (バックチャネル)
- カラー: `#22c55e`
- アクティブ: client, authsv
- グレーアウト: owner, ressv
- 特殊ラベル: 🔒 サーバー間通信

| Step | 方向 | 矢印型 | 色 | ラベル |
|------|------|--------|------|--------|
| 6 | client → authsv | 斜め右上 | green → amber | トークンリクエスト (POST) |
| 7 | authsv → client | 斜め左下 | green → cyan | トークン発行 |

パラメータ表示: `grant_type=authorization_code`, `code=...`, `client_secret=...`
トークン表示: `access_token + refresh_token`

#### Phase 4: リソースアクセス
- カラー: `#3b82f6`
- アクティブ: client, ressv
- グレーアウト: owner, authsv

| Step | 方向 | 矢印型 | 色 | ラベル |
|------|------|--------|------|--------|
| 8 | client → ressv | 水平右 | blue | APIリクエスト (Bearer Token) |
| 9 | ressv → client | 水平左 (dash) | blue → cyan | 保護リソース返却 (200 OK) |

パラメータ表示: `Authorization: Bearer {access_token}`

### セキュリティポイント (Phase 1サイドバーに表示)

1. 🛡 state パラメータ — CSRF攻撃を防止
2. 🔒 バックチャネル交換 — サーバー間で安全に実行
3. ⏱ 短寿命の認可コード — 一回限り使用

---

## OAuth 2.0 PKCE

**ファイル名**: `oauth2-pkce-flow.svg`
**バッジ**: `RFC 7636` + `authorization_code + PKCE`
**viewBox**: `0 0 1100 3200` (4 Phase)

### アクター配置

```
左上: リソース所有者 (owner)       右上: 認可サーバー (authsv)
左下: クライアント/SPA (client)   右下: リソースサーバー (ressv)
```

### Phase構成

OAuth 2.0 Authorization Codeとほぼ同じだが以下が異なる：

- **Phase 1 Step 2**: パラメータに `code_challenge` と `code_challenge_method=S256` を追加
- **Phase 3 Step 6**: パラメータに `code_verifier` を追加、`client_secret` は不要
- **セキュリティポイント**: state に加え「PKCE: code_verifier + code_challenge」を追加

---

## OAuth 2.0 Client Credentials

**ファイル名**: `oauth2-client-credentials-flow.svg`
**バッジ**: `RFC 6749` + `client_credentials`
**viewBox**: `0 0 1100 1620` (2 Phase)

### アクター配置

```
左上: (なし — dimbox)              右上: 認可サーバー (authsv)
左下: クライアント (client)         右下: リソースサーバー (ressv)
```

### Phase構成

#### Phase 1: トークン取得
- カラー: `#22c55e`
- アクティブ: client, authsv

| Step | 方向 | 矢印型 | 色 | ラベル |
|------|------|--------|------|--------|
| 1 | client → authsv | 斜め右上 | green → amber | トークンリクエスト (POST) |
| 2 | authsv → client | 斜め左下 | green → cyan | アクセストークン発行 |

パラメータ: `grant_type=client_credentials`, `client_id`, `client_secret`, `scope`

#### Phase 2: リソースアクセス
- カラー: `#3b82f6`
- アクティブ: client, ressv

| Step | 方向 | 矢印型 | 色 | ラベル |
|------|------|--------|------|--------|
| 3 | client → ressv | 水平右 | blue | APIリクエスト |
| 4 | ressv → client | 水平左 (dash) | blue → cyan | リソース返却 |

---

## OAuth 2.0 Device Authorization

**ファイル名**: `oauth2-device-flow.svg`
**バッジ**: `RFC 8628` + `urn:ietf:params:oauth:grant-type:device_code`
**viewBox**: `0 0 1100 3200` (4 Phase)

### アクター配置

```
左上: デバイス (client — ラベル変更)  右上: 認可サーバー (authsv)
左下: ユーザー/ブラウザ (browser)    右下: リソースサーバー (ressv)
```

### Phase構成

#### Phase 1: デバイスコード取得
- アクティブ: device, authsv
- Steps: デバイス→認可サーバー (POST /device/authorization), 認可サーバー→デバイス (device_code + user_code + verification_uri)

#### Phase 2: ユーザー認証
- アクティブ: device, browser, authsv
- Steps: デバイスがuser_codeを表示, ユーザーがブラウザでverification_uriにアクセス, ユーザーがuser_codeを入力+同意

#### Phase 3: トークン取得 (ポーリング)
- アクティブ: device, authsv
- Steps: デバイスがポーリング (POST /token grant_type=device_code), 認可サーバーがaccess_token返却

#### Phase 4: リソースアクセス
- 標準パターン

---

## OpenID Connect

**ファイル名**: `oidc-authorization-code-flow.svg`
**バッジ**: `OpenID Connect Core` + `code + id_token`
**viewBox**: `0 0 1100 3200` (4 Phase)

### アクター配置

```
左上: エンドユーザー (owner — ラベル変更)  右上: OPサーバー (authsv — ラベル変更)
左下: RPクライアント (client — ラベル変更)  右下: UserInfoエンドポイント (ressv — ラベル変更)
```

### Phase構成

OAuth 2.0 Authorization Codeベースだが以下が異なる：

- **Phase 1 Step 2**: `scope=openid profile email`, `nonce` パラメータ追加
- **Phase 3 Step 7**: `access_token` に加え `id_token` (JWT) が返却される
- **Phase 4**: UserInfoエンドポイントへのアクセス (任意)
- **セキュリティポイント**: `nonce` パラメータ (リプレイ攻撃防止)、`id_token` の署名検証

---

## SAML 2.0

**ファイル名**: `saml2-sp-initiated-flow.svg`
**バッジ**: `SAML 2.0` + `SP-Initiated SSO`
**viewBox**: `0 0 1100 2480` (3 Phase)

### アクター配置

```
左上: ユーザー (owner — ラベル変更)   右上: IdP (authsv — ラベル変更)
左下: SP (client — ラベル変更)       右下: (なし — dimbox or 属性ストア)
```

### Phase構成

#### Phase 1: 認証リクエスト
- Steps: ユーザー→SP (リソースアクセス), SP→IdP (AuthnRequest via Browser POST/Redirect)

#### Phase 2: 認証 + アサーション発行
- Steps: IdP→ユーザー (認証画面), ユーザー→IdP (認証), IdP→SP (SAMLResponse + Assertion via Browser POST)

#### Phase 3: セッション確立
- Steps: SP→ユーザー (セッションCookie発行 + リソース返却)

---

## JWT Lifecycle

**ファイル名**: `jwt-lifecycle-flow.svg`
**バッジ**: `RFC 7519` + `JSON Web Token`
**viewBox**: `0 0 1100 2480` (3 Phase)

### アクター配置

```
左上: (なし — dimbox)               右上: 認証サーバー (authsv)
左下: クライアント (client)          右下: APIサーバー (ressv — ラベル変更)
```

### Phase構成

#### Phase 1: JWT取得
- Steps: クライアント→認証サーバー (認証), 認証サーバー→クライアント (JWT発行)
- JWT構造表示: Header.Payload.Signature

#### Phase 2: JWT利用
- Steps: クライアント→APIサーバー (Bearer JWT), APIサーバーが署名検証+claims確認
- 署名検証フロー表示

#### Phase 3: JWT更新/失効
- Steps: クライアント→認証サーバー (refresh_token), 新JWT発行, 失効処理

---

## カスタムプロトコル対応

上記テンプレートに無いプロトコルの場合、以下の手順でPhase構成を設計する:

1. **アクターを4つ以内で特定**: プロトコルに登場するエンティティを最大4つ選ぶ
2. **ステップを時系列で列挙**: プロトコルの全ステップを番号付きで書き出す
3. **Phaseに分割**: 以下の基準でグルーピング
   - 同じアクターペア間のやり取りを1 Phaseにまとめる
   - チャネルが切り替わるタイミングで分割（フロント→バック等）
   - 1 Phaseあたり矢印2〜3本が目安
4. **矢印ルーティング選択**: 水平・垂直・斜めから重ならない組み合わせを選ぶ
5. **グレーアウト判定**: 各Phaseで矢印の始点・終点に含まれないアクターをグレーアウト

### 矢印ルーティングの選択ガイド

```
2アクター (左下-右上):
  斜め往路 + 斜め復路 (Yオフセット) — Phase 3型

2アクター (下段同士):
  水平往路 + 水平復路 — Phase 4型

3アクター (上段2 + 左下1):
  上段水平 × 2 + 斜め × 1 — Phase 2型

全アクター:
  非推奨 — Phase分割して矢印を減らすこと
```
