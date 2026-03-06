// ============================================================
// インメモリデータストア（学習用）
// ============================================================

// --- テストユーザー ---
export interface User {
  username: string;
  password: string;
  profile: {
    sub: string;
    name: string;
    email: string;
  };
}

export const users: Record<string, User> = {
  testuser: {
    username: "testuser",
    password: "password",
    profile: {
      sub: "user-001",
      name: "Test User",
      email: "testuser@example.com",
    },
  },
};

// --- OAuth クライアント ---
export interface OAuthClient {
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  scopes: string[];
}

export const clients: Record<string, OAuthClient> = {
  "oauth-lab-client": {
    clientId: "oauth-lab-client",
    clientSecret: "oauth-lab-secret",
    redirectUris: ["http://localhost:3000/callback"],
    scopes: ["read", "openid", "profile"],
  },
};

// --- 認可コード（一時的に保存） ---
export interface AuthorizationCode {
  code: string;
  clientId: string;
  username: string;
  redirectUri: string;
  scope: string;
  expiresAt: number;
}

export const authorizationCodes: Record<string, AuthorizationCode> = {};

// --- アクセストークン ---
export interface AccessToken {
  token: string;
  clientId: string;
  username: string;
  scope: string;
  expiresAt: number;
}

export const accessTokens: Record<string, AccessToken> = {};
