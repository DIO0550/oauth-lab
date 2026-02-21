import { Hono } from "hono";
import { sessions } from "../session.js";

const CLIENT_ID = "oauth-lab-client";
// ブラウザからアクセスする認可サーバーのURL（Docker外からのアクセス）
const AUTH_SERVER_EXTERNAL_URL =
  process.env.AUTH_SERVER_EXTERNAL_URL || "http://localhost:8080";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const REDIRECT_URI = `${FRONTEND_URL}/callback`;

const app = new Hono();

// ============================================================
// ログイン: 認可サーバーにリダイレクト
// ============================================================
app.get("/login", (c) => {
  const state = Math.random().toString(36).substring(2);

  // セッションにstateを保存（CSRF対策）
  const sessionId = Math.random().toString(36).substring(2);
  sessions.set(sessionId, { state });

  const authUrl = new URL(`${AUTH_SERVER_EXTERNAL_URL}/authorize`);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", "read");
  authUrl.searchParams.set("state", state);

  console.log(`[Frontend] 認可リクエスト: ${authUrl.toString()}`);

  c.header("Set-Cookie", `session=${sessionId}; Path=/; HttpOnly`);
  return c.redirect(authUrl.toString());
});

export default app;
