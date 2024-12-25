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
import { MediaType } from "@prisma/client";
import Stack from "@/app/_components/layouts/Stack.layout";

interface MediaUploadFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  organizationId: string;
  maxFiles: number;
  alreadySelectedMedia?: AlreadyUploadedMedia[];
}

type UploadedMedia = {
  id: string;
  order: number;
  bucket_path: string;
  type: MediaType;
};

type MediaFile = File & { id: string };

type AlreadyUploadedMedia = {
  id: string;
  bucket_path: string;
  type: MediaType;
};
type SelectedMedia = AlreadyUploadedMedia | MediaFile;

export const MultiMediaUploadField = <T extends FieldValues>({
  form,
  /* form value must satisfy { bucket_path: string, type: MediaType, order: number }[] */
  name,
  label,
  organizationId,
  maxFiles,
  alreadySelectedMedia = [],
}: MediaUploadFieldProps<T>) => {
  const currentMedias = useRef<SelectedMedia[]>(alreadySelectedMedia);
  const [isUploadingMultipleFiles, setIsUploadingMultipleFIles] =
    useState(false);
  const [uploadReadyFiles, setUploadReadyFiles] = useState<File[]>([]);
  const { uploadFile } = useFileUploader({ organizationId });
  const handleMediaChange = async (allMedias: SelectedMedia[]) => {
    form.setValue(name, [] as PathValue<T, Path<T>>);
    setIsUploadingMultipleFIles(true);
    const medias = allMedias.filter(
      (media) => !("url" in media),
    ) as MediaFile[];
    let newMedia = [...medias];
    if (currentMedias.current.length)
      newMedia = medias.filter(
        (media) => !currentMedias.current.find((m) => m.id === media.id),
      );

    // new media that will be uploded
    const mediasWithBucketPath: Omit<UploadedMedia, "order">[] = [];

    await Promise.all(
      newMedia.map(async (file) => {
        // @TODO add signals and abort controller on remove of media
        const bucketPath = await uploadFile(file, file.id);
        mediasWithBucketPath.push({
          id: file.id,
          bucket_path: bucketPath,
          type: file.type.startsWith("image/")
            ? MediaType.IMAGE
            : MediaType.VIDEO,
        });
        setUploadReadyFiles((prev) => [...prev, file]);
        return bucketPath;
      }),
    );

    const currentMedia = [...currentMedias.current, ...mediasWithBucketPath];
    const formattedMedia = medias.map((media, order) => {
      const curr = currentMedia.find((cMedia) => cMedia.id === media.id)!;
      return {
        ...curr,
        order,
      };
    }) as SelectedMedia[];

    currentMedias.current = formattedMedia;
    setIsUploadingMultipleFIles(false);
    return currentMedias.current;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Stack>
              <MediaSelect
                onChange={async (data) => {
                  field.onChange(await handleMediaChange(data));
                }}
                maxFiles={maxFiles}
                mediaType="BOTH"
                withUploadIndicator
                uploadReadyFiles={uploadReadyFiles}
                alreadySelectedMedia={alreadySelectedMedia}
              />
              {isUploadingMultipleFiles && <p className="mt-2">Uploading...</p>}
            </Stack>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
