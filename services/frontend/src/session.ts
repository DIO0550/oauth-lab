// ============================================================
// セッション管理（学習用の簡易実装）
// ============================================================

export interface Session {
  state?: string;
  accessToken?: string;
}

export const sessions = new Map<string, Session>();
