"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import Stack from "../../layouts/Stack.layout";
import { LinkType } from "@prisma/client";
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

const link = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  type: z.nativeEnum(LinkType),
});

const AddLinkForm = ({
  className,
  onAdd,
}: {
  className?: string;
  onAdd: (
    linkData: z.infer<typeof link>,
  ) => Promise<{ success: boolean; error?: string }>;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof link>>({
    resolver: zodResolver(link),
    defaultValues: {
      name: "",
      url: "",
      type: LinkType.INSTAGRAM,
    },
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: z.infer<typeof link>) => {
    startTransition(async () => {
      const result = await onAdd(data);
      if (result.success) {
        form.reset();
        router.push("/staff/manage/admin/link-list");
      } else {
        form.setError("name", { message: result.error });
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select link type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(LinkType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Add Link
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default AddLinkForm;
