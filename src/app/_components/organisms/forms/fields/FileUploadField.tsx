"use client";
import { useFileUploader } from "@/app/hooks/s3/useFileUploader";
import { Input } from "../../../shadcn/Input.shadcn";
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
import Stack from "@/app/_components/layouts/Stack.layout";
import Group from "@/app/_components/layouts/Group.layout";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import { createUUID } from "@/utils/common";
import { S3Service } from "@/utils/s3/service";

interface FileUploadFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  organizationId: string;
  accept?: string;
  required?: boolean;
}

export const FileUploadField = <T extends FieldValues>({
  form,
  name,
  label,
  organizationId,
  accept = "*/*",
}: FileUploadFieldProps<T>) => {
  const [progress, setProgress] = useState(0);
  const [dirty, setDirty] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    isUploading,
    error: uploadError,
    uploadFile,
  } = useFileUploader({
    organizationId,
    onUploadProgress: setProgress,
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(false);
    try {
      const bucketPath = await uploadFile(e, createUUID());
      setDirty(true);
      form.setValue(
        name,
        S3Service.getFileUrlFromFullPath(bucketPath) as PathValue<T, Path<T>>,
      );
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const hasFileUploaded = !!field.value;
        return (
          <FormItem>
            <FormLabel>
              <Group className="w-full items-center justify-between">
                <Group className="items-center gap-2">
                  {label}{" "}
                  {isUploading && progress > 0 && progress < 100
                    ? ` - Uploading ${progress}%`
                    : ""}
                  {field.value && dirty && (
                    <span className="text-sm text-green-600">
                      File uploaded!
                    </span>
                  )}
                  {uploadError && (
                    <span className="text-sm text-red-500">{uploadError}</span>
                  )}
                </Group>
                {field.value && (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (fileRef.current) fileRef.current.value = "";
                      form.setValue(name, null as PathValue<T, Path<T>>);
                    }}
                  >
                    Clear File
                  </Button>
                )}
              </Group>
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                {hasFileUploaded && (
                  <Stack>
                    <video controls crossOrigin="anonymous">
                      <source src={field.value} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Stack>
                )}
                <Input
                  ref={fileRef}
                  className={hasFileUploaded ? "hidden" : ""}
                  type="file"
                  accept={accept}
                  onChange={handleChange}
                  disabled={isUploading}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
