// ============================================================
// / - トップページ
// ============================================================

import { Hono } from "hono";
import { getSessionId, getSession } from "../session.js";
import { homePage } from "../templates/home.js";

const home = new Hono();

home.get("/", (c) => {
  const sessionId = getSessionId(c.req.header("Cookie"));
  const session = sessionId ? getSession(sessionId) : undefined;

  console.log("[Frontend] トップページ表示:", session?.accessToken ? "認証済み" : "未認証");

  return c.html(homePage(session?.accessToken));
});

export default home;
