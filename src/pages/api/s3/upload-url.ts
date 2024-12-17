import { env } from "@/env";
import { getBucketName, s3 } from "@/server/s3/s3";
import { S3Service } from "@/utils/s3/service";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

// Define the query schema
const querySchema = z.object({
  fileName: z.string().min(1, "fileName is required"),
  fileType: z.string().min(1, "fileType is required"),
  organizationId: z.string().uuid("Organization ID is required"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      // Validate query parameters
      const { fileName, fileType, organizationId } = querySchema.parse(
        req.query,
      );

      const params = {
        Bucket: getBucketName(),
        Key: S3Service.getBucketPath(organizationId, fileName),
        Expires: 300,
        ContentType: fileType,
      };

      const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

      return res.status(200).json({ uploadUrl });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid request parameters",
          details: error.errors,
        });
      }

      console.error("Error generating pre-signed URL:", error);
      return res.status(500).json({ error: "Failed to generate upload URL" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
