import { NextApiRequest, NextApiResponse } from "next";
import { cloudSpeechToText } from "../../../server/ai/speech-to-text/cloud";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { audio, config } = req.body;

    if (!audio || !audio.content) {
      return res.status(400).json({ error: "Missing audio data" });
    }

    const result = await cloudSpeechToText({ audio, config });

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Speech-to-text API error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
