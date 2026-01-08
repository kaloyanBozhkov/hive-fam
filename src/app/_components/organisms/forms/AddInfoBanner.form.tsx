"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import Stack from "../../layouts/Stack.layout";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "../../shadcn/Form.shadcn";
import { Button } from "../../shadcn/Button.shadcn";
import { Input } from "../../shadcn/Input.shadcn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/Select.shadcn";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploadField } from "./fields/FileUploadField";
import TextEditor from "../../molecules/lexical/TextEditor";

const infoBanner = z.object({
  subtitle: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  background_data_url: z.string().min(1, "Background image is required"),
  background_video_url: z.string().optional().nullable(),
  background_image_position: z.enum(["CENTER", "TOP", "BOTTOM"]).default("CENTER"),
  background_video_position: z.enum(["CENTER", "TOP", "BOTTOM"]).default("CENTER"),
  order: z.number().int().min(0),
});

const AddInfoBannerForm = ({
  className,
  onAdd,
  currentMaxOrder,
  organizationId,
}: {
  className?: string;
  currentMaxOrder: number;
  organizationId: string;
  onAdd: (
    bannerData: z.infer<typeof infoBanner>,
  ) => Promise<{ success: boolean; error?: string }>;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null,
  );

  const form = useForm<z.infer<typeof infoBanner>>({
    resolver: zodResolver(infoBanner),
    defaultValues: {
      subtitle: "",
      title: "",
      content: "",
      background_data_url: "",
      background_video_url: null,
      background_image_position: "CENTER",
      background_video_position: "CENTER",
      order: currentMaxOrder + 1,
    },
  });

  const handleSubmit = async (data: z.infer<typeof infoBanner>) => {
    // Check payload size (2MB = 2,097,152 bytes)
    const payloadSize = new Blob([JSON.stringify(data)]).size;
    const maxSize = 2097152; // 2MB

    if (payloadSize > maxSize) {
      form.setError("background_data_url", {
        message: `Total data size (${(payloadSize / 1048576).toFixed(2)}MB) exceeds 2MB limit. Please use a smaller image or compress it.`,
      });
      return;
    }

    const latestData = { ...data };

    startTransition(async () => {
      const result = await onAdd(latestData);
      if (result.success) {
        form.reset();
        router.push("/staff/manage/admin/banner-list");
      } else {
        form.setError("background_data_url", { message: result.error });
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (warn if > 1.5MB as base64 encoding increases size by ~33%)
      const fileSizeInMB = file.size / 1048576;
      if (fileSizeInMB > 1.5) {
        form.setError("background_data_url", {
          message: `Warning: Image size (${fileSizeInMB.toFixed(2)}MB) may exceed 2MB limit after encoding. Consider using a smaller image.`,
        });
      } else {
        form.clearErrors("background_data_url");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue("background_data_url", result);
        setBackgroundPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={twMerge("w-full space-y-8", className)}
      >
        <Stack className="gap-[20px]">
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? ""
                          : parseInt(e.target.value, 10),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input type="text" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input type="text" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <TextEditor
                    onChanged={field.onChange}
                    content={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="background_data_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFileChange(e);
                    }}
                  />
                </FormControl>
                {backgroundPreview && (
                  <img
                    src={backgroundPreview}
                    alt="Background preview"
                    className="mt-2 max-h-40 object-contain"
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="background_image_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image Position</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CENTER">Center</SelectItem>
                    <SelectItem value="TOP">Top</SelectItem>
                    <SelectItem value="BOTTOM">Bottom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="background_video_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Video Position</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CENTER">Center</SelectItem>
                    <SelectItem value="TOP">Top</SelectItem>
                    <SelectItem value="BOTTOM">Bottom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FileUploadField
            form={form}
            name="background_video_url"
            label="Background Video (Optional)"
            organizationId={organizationId}
            accept="video/mp4"
          />
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Add Info Banner
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default AddInfoBannerForm;
