# CLAUDE.md

このファイルはClaude Code（claude.ai/code）がこのリポジトリで作業する際のガイドです。

## プロジェクト概要

OAuth 2.0 / OpenID Connect の仕組みを学ぶための実験環境（Learning Lab）です。

## アーキテクチャ

3つのサービスで構成され、すべて Hono + TypeScript で実装されています。

| サービス | ポート | 役割 | パス |
|----------|--------|------|------|
| Auth Server | 8080 | 認可サーバー（トークン発行・検証） | `services/auth-server/` |
| Backend | 3001 | リソースサーバー（保護されたAPI） | `services/backend/` |
| Frontend | 3000 | クライアントアプリ（ユーザーUI） | `services/frontend/` |

## 開発コマンド

```bash
# 全サービスを起動（DevContainer外から）
docker compose -f .devcontainer/docker-compose.yml up --build

# 個別サービスの開発（DevContainer内で）
cd services/auth-server && npm run dev
cd services/backend && npm run dev
cd services/frontend && npm run dev

# 依存関係のインストール（ワークスペース一括）
npm install --workspaces
```

## 技術スタック

- **Hono** - Web フレームワーク（全サービス共通）
- **TypeScript** - tsx で直接実行（ビルドステップ不要）
- **Node.js 20** - ランタイム
- **Docker Compose** - コンテナオーケストレーション
- **DevContainer** - 開発環境（Ubuntu 22.04）

## ディレクトリ構成ルール

- `services/` - 各マイクロサービスのソースコード
- `docs/` - OAuth/OIDC の学習ドキュメント
- `docker/` - Docker 関連の追加設定（DB init スクリプト等）
- `.devcontainer/` - DevContainer + Docker Compose 設定

## コーディング規約

- 日本語コメントを使用（学習用プロジェクトのため）
- 各ファイルにセクションコメントでブロックを明示
- インメモリストアを使用（学習用のためDB不使用、将来拡張予定）
- `console.log` でフロー確認用のログを出力（`[サービス名]` プレフィックス）

## テストユーザー

- ユーザー名: `testuser`
- パスワード: `password`

## OAuth クライアント情報

- Client ID: `oauth-lab-client`
- Client Secret: `oauth-lab-secret`
- Redirect URI: `http://localhost:3000/callback`
