import type { MiddlewareHandler } from "hono";

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || "http://auth-server:8080";

export interface TokenInfo {
  active: boolean;
  username: string;
  scope: string;
  client_id: string;
  exp: number;
}

// ============================================================
// トークン検証ミドルウェア
// - Authorizationヘッダーからトークンを取り出す
// - 認可サーバーの /introspect エンドポイントで検証する
// ============================================================
export const verifyToken: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      {
        error: "missing_token",
        message: "Authorization ヘッダーに Bearer トークンが必要です",
      },
      401
    );
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    // 認可サーバーにトークンの検証を依頼（Token Introspection）
    const introspectResponse = await fetch(`${AUTH_SERVER_URL}/introspect`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token }),
    });

    const tokenInfo: TokenInfo = await introspectResponse.json();

    if (!tokenInfo.active) {
      return c.json(
        { error: "invalid_token", message: "トークンが無効または期限切れです" },
        401
      );
    }

    // トークン情報をコンテキストに保存（後続のハンドラで利用可能）
    c.set("tokenInfo", tokenInfo);
    console.log(`[Backend] トークン検証成功: user=${tokenInfo.username}`);

    await next();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Backend] トークン検証エラー:", message);
    return c.json(
      { error: "server_error", message: "トークンの検証に失敗しました" },
      500
    );
  }
};
