// ============================================================
// インメモリストア（学習用のためDBは使わない）
// ============================================================

export interface Client {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
  name: string;
}

export interface User {
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface AuthCode {
  client_id: string;
  redirect_uri: string;
  username: string;
  scope: string;
  created_at: number;
  expires_at: number;
}

export interface AccessToken {
  username: string;
  scope: string;
  client_id: string;
  created_at: number;
  expires_at: number;
}

// 登録済みクライアント（本来はDB管理）
export const clients = new Map<string, Client>([
  [
    "oauth-lab-client",
    {
      client_id: "oauth-lab-client",
      client_secret: "oauth-lab-secret",
      redirect_uris: ["http://localhost:3000/callback"],
      name: "OAuth Lab Frontend",
    },
  ],
]);

// 登録済みユーザー（本来はDB管理）
export const users = new Map<string, User>([
  [
    "testuser",
    {
      username: "testuser",
      password: "password",
      name: "Test User",
      email: "testuser@example.com",
    },
  ],
]);

// 発行済みの認可コード
export const authCodes = new Map<string, AuthCode>();

// 発行済みのアクセストークン
export const accessTokens = new Map<string, AccessToken>();
