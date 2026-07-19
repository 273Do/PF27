import { defineMiddleware } from "astro:middleware";

import { getSelfIntro } from "./constants/curl";

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  const userAgent = request.headers.get("user-agent") ?? "";
  const isCurl = /curl\//i.test(userAgent);

  if (url.pathname === "/" && isCurl) {
    const selfIntro = await getSelfIntro();

    return new Response(selfIntro, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        Vary: "User-Agent",
      },
    });
  }

  return next();
});
