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
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const customQR = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  forward_to_url: z.string().url("Invalid URL"),
});

const EditCustomQRForm = ({
  className,
  onEdit,
  initialData,
}: {
  className?: string;
  onEdit: (
    qrData: z.infer<typeof customQR>,
  ) => Promise<{ success: boolean; error?: string }>;
  initialData: {
    id: string;
    description: string | null;
    forward_to_url: string;
  };
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof customQR>>({
    resolver: zodResolver(customQR),
    defaultValues: {
      id: initialData.id,
      description: initialData.description ?? "",
      forward_to_url: initialData.forward_to_url,
    },
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: z.infer<typeof customQR>) => {
    startTransition(async () => {
      const result = await onEdit(data);
      if (result.success) {
        router.push("/staff/manage/admin/custom-qr-list");
      } else {
        form.setError("description", { message: result.error });
      }
    });
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="e.g., Instagram profile link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="forward_to_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forward to URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Update Custom QR
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default EditCustomQRForm; 