import { Hono } from "hono";
import { verifyToken, type TokenInfo } from "../middleware/auth.js";

const app = new Hono();

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
// 保護されたエンドポイント（トークン必要）
// ============================================================
app.get("/api/profile", verifyToken, (c) => {
  const tokenInfo = c.get("tokenInfo") as TokenInfo;
  return c.json({
    message: "保護されたリソースへのアクセス成功",
    user: tokenInfo.username,
    data: resources.profile,
  });
});

app.get("/api/posts", verifyToken, (c) => {
  const tokenInfo = c.get("tokenInfo") as TokenInfo;
  return c.json({
    message: "保護されたリソースへのアクセス成功",
    user: tokenInfo.username,
    data: resources.posts,
  });
});

export default app;
