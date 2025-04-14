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
import {
  ButtonColor,
  FontAwesomeIcon as FontAwesomeIconEnum,
} from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FontAwesomeIconMap } from "@/server/other/linkIcons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/Select.shadcn";

export const linkTreeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  order: z.number().min(0, "Order is required"),
  button_color: z.nativeEnum(ButtonColor).default(ButtonColor.SECONDARY),
  button_icon: z
    .nativeEnum(FontAwesomeIconEnum)
    .default(FontAwesomeIconEnum.LINK),
});

const EditLinkTreeForm = ({
  className,
  initialData,
  onEdit,
}: {
  className?: string;
  initialData: z.infer<typeof linkTreeSchema>;
  onEdit: (
    linkTreeData: z.infer<typeof linkTreeSchema>,
  ) => Promise<{ success: boolean; error?: string }>;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof linkTreeSchema>>({
    resolver: zodResolver(linkTreeSchema),
    defaultValues: initialData,
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: z.infer<typeof linkTreeSchema>) => {
    startTransition(async () => {
      const result = await onEdit(data).catch((error) =>
        form.setError("name", { message: error }),
      );
      router.push("/staff/manage/admin/link-tree-list");
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
                <FormLabel>Link Tree Name</FormLabel>
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
            name="button_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Color</FormLabel>
                <Select onChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select link background color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DEFAULT">Primary</SelectItem>
                    <SelectItem value="SECONDARY">Secondary</SelectItem>
                    <SelectItem value="OUTLINE">Outlined</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="button_icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Icon</FormLabel>
                <Select onChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(FontAwesomeIconEnum).map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <FontAwesomeIcon icon={FontAwesomeIconMap[icon]} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <input type="hidden" {...form.register("id")} />
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Update Link Tree
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default EditLinkTreeForm;
