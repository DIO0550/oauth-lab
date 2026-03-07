// ============================================================
// /public - 公開エンドポイント（認証不要）
// ============================================================

import { Hono } from "hono";

const publicRoute = new Hono();

publicRoute.get("/public", (c) => {
  console.log("[Backend] 公開エンドポイントへのアクセス");
  return c.json({
    message: "これは公開エンドポイントです。トークンなしでアクセスできます。",
    timestamp: new Date().toISOString(),
  });
});

export default publicRoute;
