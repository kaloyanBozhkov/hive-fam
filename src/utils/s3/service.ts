import axios from "axios";

export class S3Service {
  /**
   * Get a pre-signed URL from the API route
   * @param fileName - Name of the file
   * @param fileType - MIME type of the file
   * @returns A pre-signed upload URL
   */
  static async getPresignedUrl(
    fileName: string,
    fileType: string,
    organizationId: string,
  ): Promise<string> {
    const response = await axios.get<{ uploadUrl: string }>(
      "/api/s3/upload-url",
      {
        params: { fileName, fileType, organizationId },
      },
    );

    if (response.status !== 200) {
      throw new Error("Failed to get pre-signed URL");
    }

    return response.data.uploadUrl;
  }

  /**
   * Upload the file to S3 using the pre-signed URL
   * @param uploadUrl - Pre-signed URL
   * @param file - File to be uploaded
   * @param fileType - MIME type of the file
   */
  static async uploadFileToS3({
    uploadUrl,
    file,
    onUploadProgress,
    fileType,
  }: {
    uploadUrl: string;
    file: File;
    fileType: string;
    onUploadProgress?: (progress: number) => void;
  }): Promise<void> {
    const response = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": fileType,
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
        );
        console.log(`Upload Progress: ${progress}%`);
        onUploadProgress?.(progress);
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to upload file to S3");
    }
  }

  static getBucketPath(organizationId: string, fileName: string) {
    return `${organizationId}/${fileName}`;
  }

  static getBaseUrl() {
    // @TODO replace with NEXT_PUBLIC env var
    return "https://kems-bucket.s3.eu-central-1.amazonaws.com";
  }
  static getFileUrlFromFullPath(path: string) {
    return `${S3Service.getBaseUrl()}/${path}`;
  }

  static getFileUrl(orgId: string, fileName: string) {
    return `${S3Service.getBaseUrl()}/${orgId}/${fileName}`;
  }
}
