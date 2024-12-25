"use client";
import { useFileUploader } from "@/app/hooks/s3/useFileUploader";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../shadcn/Form.shadcn";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
import { useRef, useState } from "react";
import MediaSelect from "@/app/_components/organisms/MediaSelect.organism";
import { createUUID } from "@/utils/common";
import { MediaType } from "@prisma/client";
import Stack from "@/app/_components/layouts/Stack.layout";

interface MediaUploadFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  organizationId: string;
  maxFiles: number;
}

export const MultiMediaUploadField = <T extends FieldValues>({
  form,
  /* form value must satisfy { bucket_path: string, type: MediaType, order: number }[] */
  name,
  label,
  organizationId,
  maxFiles,
}: MediaUploadFieldProps<T>) => {
  const prevFiles = useRef<(File & { id: string })[]>([]);
  const [isUploadingMultipleFiles, setIsUploadingMultipleFIles] =
    useState(false);
  const [uploadReadyFiles, setUploadReadyFiles] = useState<File[]>([]);
  const { uploadFile } = useFileUploader({ organizationId });
  const handleMediaChange = async (medias: (File & { id: string })[]) => {
    form.setValue(name, [] as PathValue<T, Path<T>>);
    setIsUploadingMultipleFIles(true);
    let newMedia = [...medias];
    if (prevFiles.current.length)
      newMedia = medias.filter((media) => !prevFiles.current.includes(media));

    const mediasWithBucketPath = [];
    prevFiles.current = medias;
    const uploadedFiles = await Promise.all(
      newMedia.map(async (file, idx) => {
        const bucketPath = await uploadFile(file, file.id);
        mediasWithBucketPath.push({
          bucketPath,
          type: file.type.startsWith("image/")
            ? MediaType.IMAGE
            : MediaType.VIDEO,
          order: idx,
        });
        setUploadReadyFiles((prev) => [...prev, file]);
        return bucketPath;
      }),
    );

    form.setValue(name, uploadedFiles as PathValue<T, Path<T>>);
    setIsUploadingMultipleFIles(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Stack>
              <MediaSelect
                onChange={handleMediaChange}
                maxFiles={maxFiles}
                mediaType="BOTH"
                withUploadIndicator
                uploadReadyFiles={uploadReadyFiles}
              />
              {isUploadingMultipleFiles && <p>Uploading...</p>}
            </Stack>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
