"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Path, useForm } from "react-hook-form";
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
import { Textarea } from "../../shadcn/Textarea.shadcn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/Select.shadcn";
import { Currency } from "@prisma/client";

const organization = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  display_name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  brand_logo_data_url: z.string().optional().nullable(),
  favicon_data_url: z.string().optional().nullable(),
});

const EditOrganizationForm = ({
  className,
  initialData,
  onEdit,
}: {
  className?: string;
  initialData: z.infer<typeof organization>;
  onEdit: (
    organizationData: z.infer<typeof organization>,
  ) => Promise<{ success: boolean; error?: string }>;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof organization>>({
    resolver: zodResolver(organization),
    defaultValues: initialData,
  });

  const handleSubmit = (data: z.infer<typeof organization>) => {
    startTransition(async () => {
      const result = await onEdit(data);
      if (result.success) {
        router.push("/staff/manage/admin");
      } else {
        form.setError("name", { message: result.error });
      }
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: Path<z.infer<typeof organization>>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue(name, result);
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
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand_logo_data_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Logo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "brand_logo_data_url")}
                  />
                </FormControl>
                {field.value && (
                  <img
                    src={field.value}
                    alt="Logo preview"
                    className="mt-2 max-h-40 object-contain"
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="favicon_data_url"
            render={({ field }) => {
              // fallback to brand_logo_data_url if set
              const favicon = field.value;

              return (
                <FormItem>
                  <FormLabel>Favicon (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "favicon_data_url")}
                    />
                  </FormControl>
                  {favicon && (
                    <img
                      src={favicon}
                      alt="Favicon preview"
                      className="mt-2 max-h-40 object-contain"
                    />
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <input type="hidden" {...form.register("id")} />
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Update Details
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default EditOrganizationForm;
