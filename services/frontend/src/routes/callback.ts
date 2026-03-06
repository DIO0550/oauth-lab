// ============================================================
// /callback - 認可コード受信 & トークン交換
// 認可サーバーからの認可コードをアクセストークンに交換する
// ============================================================

import { Hono } from "hono";
import { getSessionId, getSession } from "../session.js";

const callback = new Hono();

// 認可サーバーのURL（サーバー間通信なので内部URL）
const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || "http://localhost:8080";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

callback.get("/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  console.log("[Frontend] コールバック受信:", { code: code?.slice(0, 8) + "...", state });

  // --- エラーチェック ---
  if (error) {
    return c.text(`認可エラー: ${error}`, 400);
  }

  if (!code) {
    return c.text("認可コードがありません", 400);
  }

  // --- state パラメータ検証（CSRF対策） ---
  const sessionId = getSessionId(c.req.header("Cookie"));
  const session = sessionId ? getSession(sessionId) : undefined;

  if (!session || session.state !== state) {
    console.log("[Frontend] state 不一致 - CSRF の可能性");
    return c.text("state パラメータが一致しません（CSRF対策）", 400);
  }

  // --- 認可コードをアクセストークンに交換 ---
  console.log("[Frontend] トークン交換リクエスト送信...");

  try {
    const tokenResponse = await fetch(`${AUTH_SERVER_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${FRONTEND_URL}/callback`,
        client_id: "oauth-lab-client",
        client_secret: "oauth-lab-secret",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.log("[Frontend] トークン交換失敗:", tokenData);
      return c.text(`トークン交換エラー: ${tokenData.error}`, 400);
    }

    console.log("[Frontend] アクセストークン取得成功!");

    // --- セッションにトークンを保存 ---
    session.accessToken = tokenData.access_token;

    // --- トップページにリダイレクト ---
    return c.redirect("/");
  } catch (error) {
    console.error("[Frontend] トークン交換中にエラー:", error);
    return c.text("トークン交換中にエラーが発生しました", 500);
  }
});

export default callback;
