import { Redis } from "@upstash/redis";
import fetch from "node-fetch";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req, res) {
  const body = req.body;
  const message = body.message;
  if (!message) return res.status(200).end();

  const chatId = message.chat.id;
  const text = message.text;

  // Hanya owner
  if (chatId.toString() !== process.env.ADMIN_ID) return res.status(200).end();

  if (text === "/export") {
    const ips = await redis.smembers("ip_list");
    const fileContent = ips.join("\n");

    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendDocument`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        document: `data:text/plain;base64,${Buffer.from(fileContent).toString("base64")}`,
        filename: "proxy.txt"
      })
    });
  }

  res.status(200).end();
}