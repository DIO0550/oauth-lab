// ============================================================
// Bearer トークン検証ミドルウェア
// 認可サーバーの /introspect エンドポイントでトークンを検証
// ============================================================

import { createMiddleware } from "hono/factory";

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || "http://localhost:8080";

// トークンイントロスペクション結果の型
interface IntrospectionResult {
  active: boolean;
  sub?: string;
  client_id?: string;
  scope?: string;
}

export const authMiddleware = createMiddleware<{
  Variables: {
    tokenInfo: IntrospectionResult;
  };
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[Backend] トークンなし - アクセス拒否");
    return c.json({ error: "unauthorized", message: "Bearer トークンが必要です" }, 401);
  }

  const token = authHeader.slice(7);
  console.log("[Backend] トークン検証中:", token.slice(0, 8) + "...");

  // --- 認可サーバーにトークンイントロスペクション ---
  try {
    const response = await fetch(`${AUTH_SERVER_URL}/introspect`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token }),
    });

    const result: IntrospectionResult = await response.json();

    if (!result.active) {
      console.log("[Backend] トークン無効 - アクセス拒否");
      return c.json({ error: "invalid_token", message: "トークンが無効または期限切れです" }, 401);
    }

    console.log("[Backend] トークン有効:", { sub: result.sub, scope: result.scope });
    c.set("tokenInfo", result);
    await next();
  } catch (error) {
    console.error("[Backend] イントロスペクションエラー:", error);
    return c.json({ error: "server_error", message: "トークン検証に失敗しました" }, 500);
  }
});
