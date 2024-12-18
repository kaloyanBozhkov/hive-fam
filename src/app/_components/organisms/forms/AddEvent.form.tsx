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
  FormDescription,
} from "../../shadcn/Form.shadcn";
import { Button } from "../../shadcn/Button.shadcn";
import { Input } from "../../shadcn/Input.shadcn";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Currency, PosterType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/Select.shadcn";
import { Textarea } from "../../shadcn/Textarea.shadcn";
import Group from "../../layouts/Group.layout";
import Link from "next/link";
import { useState } from "react";
import { Switch } from "../../shadcn/Switch.shadcn";

const event = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date(),
  poster_data_url: z.string(),
  poster_type: z.nativeEnum(PosterType),
  external_event_url: z.string().url("Invalid URL").optional(),
  venue_id: z.string().uuid("Invalid venue ID"),
  is_published: z.boolean().default(false),
  ticket_price: z.number().min(0, "Ticket price must be greater than 1"),
  price_currency: z.nativeEnum(Currency),
});

const AddEventForm = ({
  className,
  onAdd,
  venues,
  defaultCurrency,
}: {
  className?: string;
  onAdd: (
    eventData: z.infer<typeof event>,
  ) => Promise<{ success: boolean; error?: string }>;
  venues: { id: string; name: string }[];
  defaultCurrency: Currency;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof event>>({
    resolver: zodResolver(event),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      poster_data_url: undefined,
      poster_type: PosterType.IMAGE,
      external_event_url: undefined,
      venue_id: "",
      is_published: false,
      ticket_price: 10,
      price_currency: defaultCurrency,
    },
  });

  const handleSubmit = (data: z.infer<typeof event>) => {
    startTransition(async () => {
      const result = await onAdd(data);
      if (result.success) {
        form.reset();
        router.push("/staff/manage/event/event-list");
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
        form.setValue("poster_data_url", result);
        setPosterPreview(result);
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
            name="is_published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Publish</FormLabel>
                  <FormDescription>
                    Make this event visible to the public
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="venue_id"
            render={({ field }) => (
              <FormItem>
                <Group className="w-full items-center justify-between">
                  <FormLabel>Venue</FormLabel>
                  <Button variant="outline" asChild>
                    <Link href="/staff/manage/event/add-venue">Add Venue</Link>
                  </Button>
                </Group>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a venue" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name}
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
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
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    {...field}
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="poster_data_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poster</FormLabel>
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
                {posterPreview && (
                  <img
                    src={posterPreview}
                    alt="Poster preview"
                    className="mt-2 max-h-40 object-contain"
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="poster_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poster Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select poster type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PosterType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="external_event_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External Event URL</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ticket_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value),
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
            name="price_currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Add Event
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default AddEventForm;
