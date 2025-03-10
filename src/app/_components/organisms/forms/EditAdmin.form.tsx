"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import Stack from "../../layouts/Stack.layout";
import { Role } from "@prisma/client";
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
import Group from "../../layouts/Group.layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/Select.shadcn";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const admin = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  surname: z.string(),
  role: z.nativeEnum(Role).default(Role.ADMIN),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
  phone: z.string(),
  organization_id: z.string().uuid(),
});

const EditAdminForm = ({
  className,
  initialData,
  orgs,
  onEdit,
}: {
  className?: string;
  orgs: { id: string; name: string }[];
  initialData: z.infer<typeof admin>;
  onEdit: (
    staffData: z.infer<typeof admin>,
  ) => Promise<{ success: boolean; error?: string }>;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof admin>>({
    resolver: zodResolver(admin),
    defaultValues: initialData,
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: z.infer<typeof admin>) => {
    startTransition(async () => {
      const result = await onEdit(data);
      if (result.success) {
        form.reset();
        router.push("/staff/manage/koko/admin-list");
      } else {
        form.setError("email", { message: result.error });
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
            name="organization_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-auto">
                  <Stack>
                    <p className="text-[18px] leading-[120%]">Organization</p>
                  </Stack>
                </FormLabel>
                <Select onChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {orgs.map(({ id, name }) => (
                      <SelectItem key={id} value={id}>
                        {name}
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
            name="email"
            render={({ field }) => (
              <FormItem className="mt-0r">
                <FormLabel className="mr-auto">
                  <Stack>
                    <p className="text-[18px] leading-[120%]">Email</p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage className="col-span-2 w-full" />
              </FormItem>
            )}
          />
          <Group className="w-full gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-0 flex-1">
                  <FormLabel className="mr-auto">
                    <Stack>
                      <p className="text-[18px] leading-[120%]">Name</p>
                    </Stack>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-2 w-full" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem className="mt-0 flex-1">
                  <FormLabel className="mr-auto">
                    <Stack>
                      <p className="text-[18px] leading-[120%]">Surname</p>
                    </Stack>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-2 w-full" />
                </FormItem>
              )}
            />
          </Group>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="mt-0">
                <FormLabel className="mr-auto">
                  <Stack>
                    <p className="text-[18px] leading-[120%]">Phone</p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage className="col-span-2 w-full" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mt-0">
                <FormLabel className="mr-auto">
                  <Stack>
                    <p className="text-[18px] leading-[120%]">
                      Password (optional)
                    </p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage className="col-span-2 w-full" />
              </FormItem>
            )}
          />
          <input type="hidden" {...form.register("role")} value={Role.ADMIN} />
          <input
            type="hidden"
            {...form.register("id")}
            value={initialData.id}
          />
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Update Admin
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default EditAdminForm;
