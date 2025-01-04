"use client";

import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "../shadcn/Button.shadcn";
import { MediaType } from "@prisma/client";
import Stack from "../layouts/Stack.layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import DotsLoader from "../atoms/DotsLoader.atom";
import { createUUID, moveItemInArray } from "@/utils/common";
import { twMerge } from "tailwind-merge";
import { S3Service } from "@/utils/s3/service";

interface MediaFile extends File {
  preview: string;
  id: string;
}

type UploadedMediaFile = {
  id: string;
  bucket_path: string;
  type: MediaType;
};

interface MediaSelectProps {
  onChange?: (media: (MediaFile | UploadedMediaFile)[]) => void;
  maxFiles: number;
  mediaType?: MediaType | "BOTH";
  withUploadIndicator?: boolean;
  // optional: specify which files were uploaded successfully
  uploadReadyFiles?: File[];
  alreadySelectedMedia?: UploadedMediaFile[];
}

export default function MediaSelect({
  onChange,
  maxFiles,
  mediaType = MediaType.IMAGE,
  withUploadIndicator,
  uploadReadyFiles,
  alreadySelectedMedia = [],
}: MediaSelectProps) {
  const [media, setMedia] =
    useState<(MediaFile | UploadedMediaFile)[]>(alreadySelectedMedia);
  const setMediaAndNotify = useCallback(
    (newMedias: (MediaFile | UploadedMediaFile)[]) => {
      setMedia(newMedias);
      onChange?.(newMedias);
    },
    [onChange],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      const newMedia = files.slice(0, maxFiles - media.length).map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("video/")
            ? URL.createObjectURL(file)
            : URL.createObjectURL(file),
          id: createUUID(),
        }),
      );
      setMediaAndNotify([...media, ...newMedia].slice(0, maxFiles));
    },
    [media, setMediaAndNotify, maxFiles],
  );

  const removeMedia = useCallback(
    (index: number) => {
      const newMedia = [...media];
      if ("preview" in newMedia[index]!)
        URL.revokeObjectURL(newMedia[index].preview);
      newMedia.splice(index, 1);
      setMediaAndNotify(newMedia);
    },
    [setMediaAndNotify, media],
  );

  const handleMoveUp = (index: number) => {
    const updatedMedia = moveItemInArray(media, index, "up");
    setMediaAndNotify(updatedMedia);
  };

  const handleMoveDown = (index: number) => {
    const updatedMedia = moveItemInArray(media, index, "down");
    setMediaAndNotify(updatedMedia);
  };

  const isUploadingMedia =
    withUploadIndicator &&
    media.some((file) => {
      if ("bucket_path" in file) return;
      const isUploaded = uploadReadyFiles?.includes(file);
      return !isUploaded;
    });

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("file-input")?.click();
          }}
          disabled={media.length >= maxFiles}
        >
          {media.length === 0 ? "Add Media" : "Add More Media"}
        </Button>
        <input
          id="file-input"
          type="file"
          accept={(() => {
            switch (mediaType) {
              case "IMAGE":
                return "image/*";
              case "VIDEO":
                return "video/mp4,video/webm,video/ogg";
              default:
                return "image/*,video/*";
            }
          })()}
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="mt-2 text-sm text-gray-500">
          {media.length}/{maxFiles} files selected. {maxFiles - media.length}{" "}
          remaining.
        </p>
      </div>
      <ul className="space-y-2">
        {media.map((file, index) => {
          const isNewFile = !("bucket_path" in file);
          const isUploaded = isNewFile && uploadReadyFiles?.includes(file);
          const isVideo = isNewFile
            ? file.type.startsWith("video/")
            : file.type === MediaType.VIDEO;

          return (
            <li
              key={file.id}
              className="flex items-center space-x-2 rounded-lg bg-white p-2 shadow"
              tabIndex={0}
            >
              {media.length > 1 && (
                <Stack className="gap-2">
                  <Button
                    type="button"
                    className={twMerge(
                      "size-[20px]",
                      isUploadingMedia ? "opacity-80" : "",
                    )}
                    size="sm"
                    onClick={() => handleMoveUp(index)}
                    disabled={isUploadingMedia}
                  >
                    <FontAwesomeIcon icon={faChevronUp} size="1x" />
                  </Button>
                  <Button
                    type="button"
                    className={twMerge(
                      "size-[20px]",
                      isUploadingMedia ? "opacity-80" : "",
                    )}
                    size="sm"
                    onClick={() => handleMoveDown(index)}
                    disabled={isUploadingMedia}
                  >
                    <FontAwesomeIcon icon={faChevronDown} size="1x" />
                  </Button>
                </Stack>
              )}
              <div className="relative h-20 w-20 flex-shrink-0">
                {isVideo ? (
                  <video
                    src={
                      isNewFile
                        ? file.preview
                        : S3Service.getFileUrlFromFullPath(file.bucket_path)
                    }
                    className="h-full w-full rounded object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={
                      isNewFile
                        ? file.preview
                        : S3Service.getFileUrlFromFullPath(file.bucket_path)
                    }
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full rounded object-cover"
                  />
                )}
              </div>
              <Stack className="flex-grow gap-2">
                <Stack>
                  {isNewFile ? (
                    <>
                      <p className="truncate text-wrap break-words break-all text-sm font-medium leading-[16px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <p className="truncate text-wrap break-words break-all text-sm font-medium leading-[16px]">
                      {S3Service.getFileUrlFromFullPath(file.bucket_path)}
                    </p>
                  )}
                </Stack>
                {withUploadIndicator &&
                  isNewFile &&
                  (isUploaded ? (
                    <p className="text-[14px] text-green-600">Upload ready</p>
                  ) : (
                    <DotsLoader
                      className="-ml-4 opacity-80"
                      size="xs"
                      modifier="secondary"
                    />
                  ))}
              </Stack>
              <button
                onClick={() => removeMedia(index)}
                className="rounded-full bg-red-100 p-1 text-red-600 transition-colors hover:bg-red-200"
              >
                <X size={16} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
