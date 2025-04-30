import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
import crypto from "crypto";
import { env } from "@/env";

// Ably webhook signature verification
const verifyAblySignature = (req: NextApiRequest, secret: string): boolean => {
  const signature = req.headers["x-ably-signature"] as string;
  if (!signature) return false;

  const body = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha256", secret).update(body).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hmac));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("hit");
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify the webhook is from Ably - you'll configure this key in the Ably dashboard
    // when setting up the Reactor Event rule
    const isValidRequest = verifyAblySignature(req, env.ABLY_API_KEY);
    if (!isValidRequest) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Parse the message data from Ably
    const messages = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid message format" });
    }

    // Process each message
    const savedMessages = await Promise.all(
      messages.map(async (message) => {
        // Extract relevant data from the Ably message
        const { id, name, connectionId, timestamp, data, encoding, channel } =
          message;

        // Parse message data if it's JSON
        const messageContent =
          encoding === "json" ? data : JSON.stringify(data);

        // Store message in database
        const savedMessage = await db.chat_messages.create({
          data: {
            id,
            channel,
            sender: connectionId,
            content: messageContent,
            timestamp: new Date(timestamp),
            // Add other fields based on your DB schema
          },
        });

        return savedMessage;
      }),
    );

    return res.status(200).json({
      success: true,
      count: savedMessages.length,
    });
  } catch (error) {
    console.error("Error processing Ably webhook:", error);
    return res.status(500).json({
      error: "Failed to process messages",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
