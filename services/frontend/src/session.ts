// ============================================================
// セッション管理（インメモリ）
// 学習用のため簡易的なMap実装
// ============================================================

import crypto from "node:crypto";

interface Session {
  accessToken?: string;
  state?: string;
}

const sessions = new Map<string, Session>();

// セッションIDを取得または生成
export function getSessionId(cookie: string | undefined): string | null {
  if (!cookie) return null;
  const match = cookie.match(/session_id=([^;]+)/);
  return match ? match[1] : null;
}

export function createSession(): { sessionId: string; session: Session } {
  const sessionId = crypto.randomUUID();
  const session: Session = {};
  sessions.set(sessionId, session);
  return { sessionId, session };
}

export function getSession(sessionId: string): Session | undefined {
  return sessions.get(sessionId);
}

export function setSessionCookie(sessionId: string): string {
  return `session_id=${sessionId}; Path=/; HttpOnly`;
}
