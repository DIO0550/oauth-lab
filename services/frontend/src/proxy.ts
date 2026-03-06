// ============================================================
// /proxy/* - Backend APIへのプロキシ
// アクセストークンを自動付与してリソースサーバーにリクエスト
// ============================================================

import { Hono } from "hono";
import { getSessionId, getSession } from "./session.js";

const proxy = new Hono();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

proxy.get("/proxy/*", async (c) => {
  // /proxy/api/profile → /api/profile
  const path = c.req.path.replace(/^\/proxy/, "");

  const sessionId = getSessionId(c.req.header("Cookie"));
  const session = sessionId ? getSession(sessionId) : undefined;
  const accessToken = session?.accessToken;

  console.log("[Frontend] プロキシリクエスト:", path, accessToken ? "(トークンあり)" : "(トークンなし)");

  try {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BACKEND_URL}${path}`, { headers });
    const data = await response.json();

    return c.json(data, response.status as 200);
  } catch (error) {
    console.error("[Frontend] プロキシエラー:", error);
    return c.json({ error: "proxy_error", message: "バックエンドへの接続に失敗しました" }, 502);
  }
});

export default proxy;
