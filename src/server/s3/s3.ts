import { env } from "@/env";
import { S3 } from "aws-sdk";

export const s3 = new S3({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  signatureVersion: "v4",
});

export const getBucketName = () => env.AWS_BUCKET_NAME;
