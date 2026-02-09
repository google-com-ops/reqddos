import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  // Tambah counter total requests
  const total = await redis.incr("total_requests");

  // Simpan IP unik
  await redis.sadd("ip_list", ip);

  res.status(200).json({ total_requests: total, your_ip: ip });
}