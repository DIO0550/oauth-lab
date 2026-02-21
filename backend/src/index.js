import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || "http://auth-server:8080";

app.use("/*", cors({ origin: "*" }));

// ============================================================
// 保護されたリソース（学習用のダミーデータ）
// ============================================================
const resources = {
  profile: {
    id: 1,
    name: "Test User",
    email: "testuser@example.com",
    bio: "OAuth学習中のテストユーザーです",
  },
  posts: [
    { id: 1, title: "OAuthを学び始めた", body: "Authorization Code Flowを理解する" },
    { id: 2, title: "トークンの仕組み", body: "アクセストークンでAPIにアクセスする" },
    { id: 3, title: "スコープの概念", body: "トークンの権限を制限する仕組み" },
  ],
};

// ============================================================
// トークン検証ミドルウェア
// - Authorizationヘッダーからトークンを取り出す
// - 認可サーバーの /introspect エンドポイントで検証する
// ============================================================
async function verifyToken(c, next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      { error: "missing_token", message: "Authorization ヘッダーに Bearer トークンが必要です" },
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

    const tokenInfo = await introspectResponse.json();

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
    console.error("[Backend] トークン検証エラー:", err.message);
    return c.json(
      { error: "server_error", message: "トークンの検証に失敗しました" },
      500
    );
  }
}

// ============================================================
// 公開エンドポイント（トークン不要）
// ============================================================
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "backend" });
});

app.get("/public", (c) => {
  return c.json({
    message: "これは公開エンドポイントです。トークンなしでアクセスできます。",
  });
});

// ============================================================
// 保護されたエンドポイント（トークン必要）
// ============================================================
app.get("/api/profile", verifyToken, (c) => {
  const tokenInfo = c.get("tokenInfo");
  return c.json({
    message: "保護されたリソースへのアクセス成功",
    user: tokenInfo.username,
    data: resources.profile,
  });
});

app.get("/api/posts", verifyToken, (c) => {
  const tokenInfo = c.get("tokenInfo");
  return c.json({
    message: "保護されたリソースへのアクセス成功",
    user: tokenInfo.username,
    data: resources.posts,
  });
});

// ============================================================
// サーバー起動
// ============================================================
const port = 3001;
console.log(`[Backend] Starting on port ${port}`);
serve({ fetch: app.fetch, port });
