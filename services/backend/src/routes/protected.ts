// ============================================================
// /api/* - 保護されたエンドポイント（Bearer トークン必須）
// ============================================================

import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";

const protectedRoute = new Hono();

// --- 全 /api ルートにトークン検証ミドルウェアを適用 ---
protectedRoute.use("/api/*", authMiddleware);

// GET /api/profile - プロフィール取得
protectedRoute.get("/api/profile", (c) => {
  const tokenInfo = c.get("tokenInfo");
  console.log("[Backend] プロフィール取得:", tokenInfo.sub);

  return c.json({
    sub: tokenInfo.sub,
    name: "Test User",
    email: "testuser@example.com",
    scope: tokenInfo.scope,
  });
});

// GET /api/posts - 投稿一覧取得
protectedRoute.get("/api/posts", (c) => {
  const tokenInfo = c.get("tokenInfo");
  console.log("[Backend] 投稿一覧取得:", tokenInfo.sub);

  return c.json({
    posts: [
      { id: 1, title: "OAuth 2.0 を学び始めました", author: tokenInfo.sub, createdAt: "2024-01-15" },
      { id: 2, title: "認可コードフローを理解しました", author: tokenInfo.sub, createdAt: "2024-01-16" },
      { id: 3, title: "トークンイントロスペクションについて", author: tokenInfo.sub, createdAt: "2024-01-17" },
    ],
  });
});

export default protectedRoute;
