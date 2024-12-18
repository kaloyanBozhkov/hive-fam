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
import { Currency } from "@prisma/client";
import { Select } from "../../shadcn/Select.shadcn";
import { SelectItem } from "../../shadcn/Select.shadcn";
import { SelectTrigger, SelectValue } from "../../shadcn/Select.shadcn";
import { SelectContent } from "../../shadcn/Select.shadcn";

const org = z.object({
  name: z.string(),
  default_currency: z.nativeEnum(Currency).default(Currency.EUR),
});

const AddOrgForm = ({
  className,
  onAdd,
}: {
  className?: string;
  onAdd: (
    orgData: z.infer<typeof org>,
  ) => Promise<{ success: boolean; error?: string }>;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof org>>({
    resolver: zodResolver(org),
    defaultValues: {
      name: "",
    },
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (data: z.infer<typeof org>) => {
    startTransition(async () => {
      const result = await onAdd(data);
      if (result.success) {
        form.reset();
        router.push("/staff/manage/koko/org-list");
      } else {
        form.setError("name", { message: result.error });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className={twMerge("w-full space-y-8", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Stack className="gap-[20px]">
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
            name="default_currency"
            render={({ field }) => (
              <FormItem className="mt-0 flex-1">
                <FormLabel className="mr-auto">
                  <Stack>
                    <p className="text-[18px] leading-[120%]">
                      Default Currency
                    </p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Currency).map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="col-span-2 w-full" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Add Organization
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default AddOrgForm;
