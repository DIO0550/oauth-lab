# OAuth 2.0 概要

## OAuth とは

OAuth 2.0 は **認可（Authorization）** のためのフレームワークです（RFC 6749）。

ユーザーが自分のリソース（データ）へのアクセス権を、パスワードを共有することなく、サードパーティアプリケーションに委譲できる仕組みです。

## 登場人物（ロール）

| ロール | 説明 | このLabでの対応 |
|--------|------|-----------------|
| Resource Owner | リソースの所有者（ユーザー） | ブラウザで操作するあなた |
| Client | リソースにアクセスしたいアプリ | Frontend (:3000) |
| Authorization Server | トークンを発行するサーバー | Auth Server (:8080) |
| Resource Server | 保護されたリソースを持つサーバー | Backend (:3001) |

## なぜ OAuth が必要なのか

TODO: パスワード共有の問題点、権限の最小化、トークンの取消可能性について記述

## OAuth 2.0 のグラントタイプ

| グラントタイプ | 用途 |
|----------------|------|
| Authorization Code | Webアプリ向け（最も安全） |
| Authorization Code + PKCE | SPA / モバイルアプリ向け |
| Client Credentials | サーバー間通信（ユーザー不在） |
| ~~Implicit~~ | 非推奨（セキュリティ上の問題） |
| ~~Resource Owner Password~~ | 非推奨 |

## 参考 RFC

- [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) - The OAuth 2.0 Authorization Framework
- [RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750) - Bearer Token Usage
