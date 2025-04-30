import { env } from "@/env";
import Ably from "ably";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Set cache control headers to prevent caching
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = new Ably.Rest({
      key: env.ABLY_API_KEY,
    });

    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: "chat-user-" + Math.random().toString(36).substring(2, 15),
    });

    console.log(`Request: ${JSON.stringify(tokenRequestData)}`);
    return res.status(200).json(tokenRequestData);
  } catch (error) {
    console.error("Error generating Ably token:", error);
    return res.status(500).json({ error: "Failed to generate token" });
  }
}
