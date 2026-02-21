import { Hono } from "hono";
import { renderHome } from "../templates/home.js";
import { sessions } from "../session.js";

const app = new Hono();

// ============================================================
// トップページ
// ============================================================
app.get("/", (c) => {
  const sessionId = c.req.header("Cookie")?.match(/session=([^;]+)/)?.[1];
  const session = sessions.get(sessionId ?? "");
  const accessToken = session?.accessToken;

  return c.html(renderHome(accessToken));
});

// ============================================================
// ログアウト
// ============================================================
app.get("/logout", (c) => {
  const sessionId = c.req.header("Cookie")?.match(/session=([^;]+)/)?.[1];
  if (sessionId) {
    sessions.delete(sessionId);
  }
  c.header("Set-Cookie", "session=; Path=/; HttpOnly; Max-Age=0");
  return c.redirect("/");
});

export default app;
