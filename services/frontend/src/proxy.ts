import { Hono } from "hono";
import { sessions } from "./session.js";

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:3001";

const app = new Hono();

// ============================================================
// プロキシ: フロントエンドからBackendへのAPIリクエストを中継
// ============================================================
app.get("/proxy/*", async (c) => {
  const path = c.req.path.replace("/proxy", "");
  const sessionId = c.req.header("Cookie")?.match(/session=([^;]+)/)?.[1];
  const session = sessions.get(sessionId ?? "");

  const headers: Record<string, string> = {};
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  try {
    const response = await fetch(`${BACKEND_URL}${path}`, { headers });
    const data = await response.json();
    return c.json(data, response.status as 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json(
      { error: "Backend APIへの接続に失敗しました", detail: message },
      502
    );
  }
});

export default app;
