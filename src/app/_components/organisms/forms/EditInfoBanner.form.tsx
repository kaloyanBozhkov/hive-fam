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
import { Textarea } from "../../shadcn/Textarea.shadcn";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploadField } from "./fields/FileUploadField";

const infoBanner = z.object({
  id: z.string(),
  type: z.literal("INFO"),
  subtitle: z.string().min(1, "Subtitle is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  background_data_url: z.string().min(1, "Background image is required"),
  background_video_url: z.string().url().optional().nullable(),
  order: z.number().int().min(0),
});

const EditInfoBannerForm = ({
  className,
  initialData,
  onEdit,
  organizationId,
}: {
  className?: string;
  initialData: z.infer<typeof infoBanner>;
  organizationId: string;
  onEdit: (
    bannerData: z.infer<typeof infoBanner>,
  ) => Promise<{ success: boolean; error?: string }>;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    initialData.background_data_url,
  );

  const form = useForm<z.infer<typeof infoBanner>>({
    resolver: zodResolver(infoBanner),
    defaultValues: initialData,
  });

  const handleSubmit = (data: z.infer<typeof infoBanner>) => {
    startTransition(async () => {
      const result = await onEdit(data);
      if (result.success) {
        router.push("/staff/manage/admin/banner-list");
      } else {
        form.setError("title", { message: result.error });
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
                      field.onChange(parseInt(e.target.value, 10))
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
                  <Input type="text" {...field} />
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
                  <Input type="text" {...field} />
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
                  <Textarea {...field} />
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
          <FileUploadField
            form={form}
            name="background_video_url"
            label="Background Video (Optional)"
            organizationId={organizationId}
            accept="video/mp4"
          />
          <input type="hidden" {...form.register("id")} />
          <input type="hidden" {...form.register("type")} />
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Update Banner
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default EditInfoBannerForm;