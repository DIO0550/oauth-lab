// ============================================================
// /login - 認可リクエスト開始
// 認可サーバーの /authorize にリダイレクトする
// ============================================================

import { Hono } from "hono";
import crypto from "node:crypto";
import { createSession, setSessionCookie } from "../../session.js";

const login = new Hono();

// 認可サーバーの外部URL（ブラウザからアクセスするためlocalhost）
const AUTH_SERVER_EXTERNAL_URL = process.env.AUTH_SERVER_EXTERNAL_URL || "http://localhost:8080";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

login.get("/login", (c) => {
  // --- セッション作成 & state パラメータ生成（CSRF対策） ---
  const { sessionId, session } = createSession();
  const state = crypto.randomUUID();
  session.state = state;

  // --- 認可リクエストURL構築 ---
  const authUrl = new URL(`${AUTH_SERVER_EXTERNAL_URL}/authorize`);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", "oauth-lab-client");
  authUrl.searchParams.set("redirect_uri", `${FRONTEND_URL}/callback`);
  authUrl.searchParams.set("scope", "read openid profile");
  authUrl.searchParams.set("state", state);

  console.log("[Frontend] 認可リクエスト開始 → 認可サーバーにリダイレクト");
  console.log("[Frontend] state:", state);

  // --- セッションCookieを設定してリダイレクト ---
  c.header("Set-Cookie", setSessionCookie(sessionId));
  return c.redirect(authUrl.toString());
});

export default login;
