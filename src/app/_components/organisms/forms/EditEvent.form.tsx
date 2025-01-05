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
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "../../shadcn/Textarea.shadcn";
import { Currency, MediaType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/Select.shadcn";
import { Switch } from "../../shadcn/Switch.shadcn";
import { MultiMediaUploadField } from "./fields/MultiMediaUploadField";
import { Checkbox } from "../../shadcn/Checkbox.shadcn";
import { DEFAULT_TICKET_PRICE, MIN_TICKET_PRICE } from "./AddEvent.form";

const event = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date(),
  // array of bucketPaths for media, in order of appearance
  poster_media: z
    .array(
      z.object({
        bucket_path: z.string(),
        type: z.nativeEnum(MediaType),
        id: z.string(),
        order: z.number(),
      }),
    )
    .min(1),
  external_event_url: z.string().url("Invalid URL").optional(),
  venue_id: z.string().uuid("Invalid venue ID"),
  is_published: z.boolean(),
  ticket_price: z
    .number()
    .min(MIN_TICKET_PRICE, "Ticket price must be greater than 1")
    .optional(),
  price_currency: z.nativeEnum(Currency),
  event_photos_url: z.string().url().optional().nullable(),
  is_free: z.boolean(),
});

const EditEventForm = ({
  className,
  initialData,
  onEdit,
  venues,
  organizationId,
}: {
  className?: string;
  initialData: z.infer<typeof event>;
  onEdit: (
    eventData: z.infer<typeof event>,
  ) => Promise<{ success: boolean; error?: string }>;
  venues: { id: string; name: string }[];
  organizationId: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof event>>({
    resolver: zodResolver(event),
    defaultValues: initialData,
  });

  const onToggleFreeEvent = (isFree: boolean) => {
    if (!form.getFieldState("is_free").isDirty) return;
    form.setValue("ticket_price", DEFAULT_TICKET_PRICE);
    form.setValue("is_free", isFree);
  };
  const handleSubmit = (data: z.infer<typeof event>) => {
    startTransition(async () => {
      const result = await onEdit(data);
      if (result.success) {
        router.push("/staff/manage/event/event-list");
      } else {
        form.setError("title", { message: result.error });
      }
    });
  };

  const isFreeField = form.getValues().is_free;

  useEffect(() => {
    onToggleFreeEvent(isFreeField);
  }, [isFreeField]);

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
                <FormLabel>Venue</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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
          <MultiMediaUploadField
            form={form}
            name="poster_media"
            label="Poster Media"
            organizationId={organizationId}
            maxFiles={10}
            alreadySelectedMedia={initialData.poster_media}
          />
          <FormField
            control={form.control}
            name="external_event_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External Event URL</FormLabel>
                <FormControl>
                  <Input type="url" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!form.getValues().is_free && (
            <>
              <FormField
                control={form.control}
                name="ticket_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Stack>
                        <p>Ticket Price</p>
                        <p className="font-light text-gray-400">
                          Note: minimum price is around 0.1 USD
                        </p>
                      </Stack>
                    </FormLabel>
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
            </>
          )}
          <FormField
            control={form.control}
            name="is_free"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      label="This event is FREE"
                      subtitle="By making this event free, tickets will be generated without a need to pay"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="event_photos_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Photos Url (Optional)</FormLabel>
                <FormControl>
                  <Input type="text" {...field} value={field.value ?? ""} />
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
            Update Event
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default EditEventForm;
