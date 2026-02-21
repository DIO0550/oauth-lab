# OAuth Lab

OAuth 2.0 Authorization Code Flow を学ぶための実験環境です。

## アーキテクチャ

```
+--------+                               +---------------+
|        |---(1) Authorization Request--->|               |
|        |                                | Authorization |
| Client |<--(2) Authorization Code------|    Server     |
|  App   |                                |  :8080        |
|        |---(3) Token Request----------->|               |
| :3000  |<--(4) Access Token------------|               |
|        |                                +---------------+
|        |
|        |---(5) API Request (Bearer)---->+---------------+
|        |                                |   Resource    |
|        |<--(6) Protected Resource------|    Server     |
+--------+                                |  :3001        |
                                          +---------------+
```

| サービス | ポート | 役割 |
|----------|--------|------|
| Frontend | 3000 | OAuth クライアント（ユーザーが操作するアプリ） |
| Backend | 3001 | リソースサーバー（保護されたAPI） |
| Auth Server | 8080 | 認可サーバー（トークン発行・検証） |

## 技術スタック

- **Hono** - 軽量Webフレームワーク（全サービス共通）
- **Node.js 20** - ランタイム
- **Docker Compose** - コンテナオーケストレーション
- **DevContainer** - 開発環境（Ubuntu 22.04ベース）

## 起動方法

### DevContainer（推奨）

VS Codeで「Reopen in Container」を選択すると、全サービスが自動で起動します。

### Docker Compose

```bash
docker compose up --build
```

起動後、ブラウザで http://localhost:3000 にアクセスしてください。

## 使い方

1. http://localhost:3000 にアクセス
2. 「認可サーバーにログイン」をクリック
3. 認可サーバーのログインフォームでログイン（`testuser` / `password`）
4. 認可後、クライアントアプリに戻りアクセストークンが取得される
5. 「プロフィール取得」「投稿一覧取得」で保護されたAPIにアクセス

## OAuth 2.0 フローの詳細

### 1. 認可リクエスト（Authorization Request）
クライアントがユーザーを認可サーバーの `/authorize` エンドポイントにリダイレクトします。

### 2. ユーザー認証 & 認可
ユーザーが認可サーバーでログインし、クライアントへのアクセスを許可します。

### 3. 認可コード（Authorization Code）
認可サーバーがクライアントの `/callback` に認可コードを付けてリダイレクトします。

### 4. トークン交換（Token Exchange）
クライアントが認可コードを認可サーバーの `/token` エンドポイントに送信し、アクセストークンと交換します。

### 5. APIアクセス
クライアントがアクセストークンを `Authorization: Bearer <token>` ヘッダーに付けてリソースサーバーにリクエストします。

### 6. トークン検証（Token Introspection）
リソースサーバーが認可サーバーの `/introspect` エンドポイントでトークンの有効性を検証します。

## エンドポイント一覧

### Auth Server (:8080)

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/authorize` | 認可エンドポイント（ログインフォーム表示） |
| POST | `/approve` | 認可承認（認可コード発行） |
| POST | `/token` | トークンエンドポイント（コード→トークン交換） |
| POST | `/introspect` | トークン検証（RFC 7662） |

### Backend (:3001)

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/public` | 公開エンドポイント（トークン不要） |
| GET | `/api/profile` | プロフィール取得（トークン必要） |
| GET | `/api/posts` | 投稿一覧取得（トークン必要） |

### Frontend (:3000)

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/` | トップページ |
| GET | `/login` | 認可リクエスト開始 |
| GET | `/callback` | 認可コード受信 & トークン交換 |
| GET | `/proxy/*` | Backend APIへのプロキシ |
