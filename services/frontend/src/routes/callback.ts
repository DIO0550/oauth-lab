import { Hono } from "hono";
import { sessions } from "../session.js";

const CLIENT_ID = "oauth-lab-client";
const CLIENT_SECRET = "oauth-lab-secret";
const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || "http://auth-server:8080";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const REDIRECT_URI = `${FRONTEND_URL}/callback`;

const app = new Hono();

// ============================================================
// コールバック: 認可コードを受け取り、トークンと交換
// ============================================================
app.get("/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  if (error) {
    return c.text(`認可エラー: ${error}`, 400);
  }

  if (!code) {
    return c.text("認可コードがありません", 400);
  }

  // state検証（CSRF対策）
  const sessionId = c.req.header("Cookie")?.match(/session=([^;]+)/)?.[1];
  const session = sessions.get(sessionId ?? "");
  if (!session || session.state !== state) {
    return c.text("Error: state mismatch（CSRF攻撃の可能性）", 400);
  }

  console.log(`[Frontend] 認可コード受信: ${code}`);

  // 認可コードをアクセストークンと交換
  try {
    const tokenResponse = await fetch(`${AUTH_SERVER_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return c.text(
        `トークン取得エラー: ${tokenData.error} - ${tokenData.error_description}`,
        400
      );
    }

    console.log(
      `[Frontend] アクセストークン取得成功: ${tokenData.access_token}`
    );

    // セッションにアクセストークンを保存
    session.accessToken = tokenData.access_token;
    session.state = undefined;

    return c.redirect("/");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Frontend] トークン交換エラー:", message);
    return c.text(`トークン交換に失敗しました: ${message}`, 500);
  }
});

export default app;
