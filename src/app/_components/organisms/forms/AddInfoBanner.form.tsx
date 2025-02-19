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
import LexicalEditor from "../../molecules/LexicalEditor";

const infoBanner = z.object({
  subtitle: z.string().min(1, "Subtitle is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  background_data_url: z.string().min(1, "Background image is required"),
  background_video_url: z.string().optional().nullable(),
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
      order: currentMaxOrder + 1,
    },
  });

  const handleSubmit = async (data: z.infer<typeof infoBanner>) => {
    const latestData = { ...data };

    startTransition(async () => {
      const result = await onAdd(latestData);
      if (result.success) {
        form.reset();
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
                  <LexicalEditor
                    editable
                    onChanged={field.onChange}
                    initialValue={field.value}
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
