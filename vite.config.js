import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import guestbookHandler from "./api/guestbook.js";

function localApiPlugin() {
  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use("/api/guestbook", async (req, res) => {
        try {
          const protocol = req.socket?.encrypted ? "https" : "http";
          const host = req.headers.host || "localhost:5173";
          const url = new URL(
            req.originalUrl || req.url,
            `${protocol}://${host}`,
          );
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const rawBody =
            chunks.length > 0 ? Buffer.concat(chunks).toString("utf-8") : null;

          const webReq = new Request(url.toString(), {
            method: req.method,
            headers: req.headers,
            body:
              req.method !== "GET" && req.method !== "HEAD" ? rawBody : null,
          });

          const webRes = await guestbookHandler(webReq);
          res.statusCode = webRes.status;
          webRes.headers.forEach((val, key) => res.setHeader(key, val));
          const bodyText = await webRes.text();
          res.end(bodyText);
        } catch {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ success: false, error: "Internal server error" }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  build: {
    sourcemap: true,
  },
});
