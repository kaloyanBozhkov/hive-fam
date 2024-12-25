import { getBucketName, s3 } from "@/server/s3/s3";
import { S3Service } from "@/utils/s3/service";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const querySchema = z.object({
  bucketPath: z.string().min(1, "bucketPath is required"),
  organizationId: z.string().uuid("Organization ID is required"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    try {
      const { bucketPath, organizationId } = querySchema.parse(req.query);

      await s3
        .deleteObject({
          Bucket: getBucketName(),
          Key: S3Service.getBucketPath(organizationId, bucketPath),
        })
        .promise();

      return res.status(204).end();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid request parameters",
          details: error.errors,
        });
      }

      console.error("Error deleting media:", error);
      return res.status(500).json({ error: "Failed to delete media" });
    }
  }

  res.setHeader("Allow", ["DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
