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
import { Textarea } from "../../shadcn/Textarea.shadcn";

const venue = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  maps_url: z.string().url("Invalid URL"),
  max_guests: z.number().int().positive("Must be a positive number"),
});

const AddVenueForm = ({
  className,
  onAdd,
}: {
  className?: string;
  onAdd: (
    venueData: z.infer<typeof venue>,
  ) => Promise<{ success: boolean; error?: string }>;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof venue>>({
    resolver: zodResolver(venue),
    defaultValues: {
      name: "",
      description: "",
      maps_url: "",
      max_guests: 400,
    },
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: z.infer<typeof venue>) => {
    startTransition(async () => {
      const result = await onAdd(data);
      if (result.success) {
        form.reset();
        router.push("/staff/manage/event/venue-list");
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
              <FormItem className="mt-0r">
                <FormLabel className="mr-auto">Venue Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage className="col-span-2 w-full" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="mt-0">
                <FormLabel className="mr-auto">Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage className="col-span-2 w-full" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maps_url"
            render={({ field }) => (
              <FormItem className="mt-0">
                <FormLabel className="mr-auto">Maps URL</FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage className="col-span-2 w-full" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max_guests"
            render={({ field }) => (
              <FormItem className="mt-0">
                <FormLabel className="mr-auto">Max Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
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
            Add Venue
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default AddVenueForm;