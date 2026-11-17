import { kv } from "@vercel/kv";

export const config = {
  runtime: "edge",
};

const VISITOR_EXPIRATION_SECONDS = 86400;

function getClientIp(request) {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

export default async function handler(request) {
  try {
    const ip = getClientIp(request);
    const visitorKey = `visitor:${ip}`;

    const isNewVisitor = await kv.set(visitorKey, "1", {
      nx: true,
      ex: VISITOR_EXPIRATION_SECONDS,
    });

    if (isNewVisitor) {
      await kv.incr("visitor_count");
    }

    const count = (await kv.get("visitor_count")) || 0;

    return new Response(
      JSON.stringify({
        success: true,
        totalCount: count,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
