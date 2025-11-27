import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await db.$queryRaw`SELECT 1`;
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Database connection failed", domain: req.headers.host });
  }
  res.status(200).json({ message: "OK", domain: req.headers.host });
}
