import { Hono } from "hono";

const app = new Hono();

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

export default app;
