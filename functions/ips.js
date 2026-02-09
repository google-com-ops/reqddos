import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req, res) {
  try {
    const ips = await redis.smembers("ip_list");
    const total = await redis.get("total_requests");

    res.status(200).json({
      total_requests: total || 0,
      total_ips: ips.length,
      ips
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
