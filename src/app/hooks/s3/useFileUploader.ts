import { useState } from "react";
import { S3Service } from "@/utils/s3/service";

type FileBucketPath = string;

export const useFileUploader = ({
  organizationId,
  onUploadProgress,
  onSuccessfulUpload,
}: {
  organizationId: string;
  onUploadProgress?: (progress: number) => void;
  onSuccessfulUpload?: (path: FileBucketPath, url?: string) => void;
}) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const uploadFile = async (
    e: React.ChangeEvent<HTMLInputElement> | File,
    overwriteName?: string,
  ) => {
    setUploadProgress(0);
    setIsUploading(false);
    setError(null);
    const file = e instanceof File ? e : e.target.files?.[0];
    if (!file) {
      alert("Please select a file first.");
      return "";
    }

    setIsUploading(true);
    setError(null);

    // Step 1: Get pre-signed URL
    const fileName = encodeURIComponent(overwriteName ?? file.name);
    const fileType = file.type;

    try {
      const uploadUrl = await S3Service.getPresignedUrl(
        fileName,
        fileType,
        organizationId,
      );

      // Step 2: Upload file to S3
      await S3Service.uploadFileToS3({
        uploadUrl,
        file,
        fileType,
        onUploadProgress,
      });
      const fileUrl = S3Service.getFileUrl(organizationId, fileName);
      const pathName = S3Service.getBucketPath(organizationId, fileName);
      onSuccessfulUpload?.(pathName, fileUrl);
      setIsUploading(false);
      return pathName;
    } catch (error) {
      console.warn(error);
      setError("Failed to upload file.");
      setIsUploading(false);
      return "";
    }
  };

  return {
    uploadProgress,
    isUploading,
    error,
    uploadFile,
  };
};
