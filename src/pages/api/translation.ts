import type { NextApiRequest, NextApiResponse } from "next";
import { v2 } from "@google-cloud/translate";
import { env } from "@/env";

type ResponseData = {
  translation?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const translate = new v2.Translate({
      projectId: env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID,
      key: env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY,
    });

    const [translation] = await translate.translate(text, {
      from: "bg",
      to: "en",
    });

    return res.status(200).json({ translation });
  } catch (error) {
    console.error("Translation error:", error);
    return res.status(500).json({ error: "Translation failed" });
  }
}
