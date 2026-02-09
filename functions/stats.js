import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req, res) {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "unknown";

    const total = await redis.incr("total_requests");
    await redis.sadd("ip_list", ip);

    res.status(200).json({
      success: true,
      total_requests: total,
      your_ip: ip
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
