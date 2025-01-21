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
import { useCallback, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Currency, MediaType } from "@prisma/client";
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
import { Switch } from "../../shadcn/Switch.shadcn";
import { MultiMediaUploadField } from "./fields/MultiMediaUploadField";
import { addDays } from "date-fns";
import { Checkbox } from "../../shadcn/Checkbox.shadcn";
import { createUUID } from "@/utils/common";
import {
  Card,
  CardFooter,
  CardContent,
  CardTitle,
  CardHeader,
} from "../../shadcn/Card.shadcn";

export const DEFAULT_TICKET_PRICE = 10;
export const MIN_TICKET_PRICE = 1;

const event = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    date: z.date(),
    end_date: z.date().nullable().default(null),
    // array of bucketPaths for media, in order of appearance
    poster_media: z
      .array(
        z.object({ bucket_path: z.string(), type: z.nativeEnum(MediaType) }),
      )
      .min(1),
    external_event_url: z.string().url("Invalid URL").optional(),
    venue_id: z.string().uuid("Invalid venue ID"),
    is_published: z.boolean().default(false),
    is_free: z.boolean(),
    price_currency: z.nativeEnum(Currency),
    ticket_types: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        description: z.string().nullable().default(null),
        price: z
          .number()
          .min(MIN_TICKET_PRICE, "Ticket price must be greater than 1"),
        available_tickets_of_type: z.number().min(0),
        is_visible: z.boolean(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.is_free && data.ticket_types.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ticket types are required if the event is not free",
        path: ["ticket_types"],
      });
    }
    if (data.is_free && data.ticket_types.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ticket types are not allowed if the event is free",
        path: ["ticket_types"],
      });
    }

    if (data.end_date && data.end_date < data.date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["end_date"],
      });
    }
  });

const defaultTicketType = {
  id: createUUID(),
  label: "Regular Access",
  price: DEFAULT_TICKET_PRICE,
  available_tickets_of_type: 100,
  is_visible: true,
  description: null,
};

const AddEventForm = ({
  className,
  onAdd,
  venues,
  defaultCurrency,
  organizationId,
}: {
  className?: string;
  onAdd: (
    eventData: z.infer<typeof event>,
  ) => Promise<{ success: boolean; error?: string }>;
  venues: { id: string; name: string }[];
  defaultCurrency: Currency;
  organizationId: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof event>>({
    resolver: zodResolver(event),
    defaultValues: {
      title: "",
      description: "",
      date: addDays(new Date(), 1),
      end_date: null,
      poster_media: [],
      external_event_url: undefined,
      venue_id: "",
      is_free: false,
      is_published: false,
      ticket_types: [defaultTicketType],
      price_currency: defaultCurrency,
    },
  });
  const onToggleFreeEvent = useCallback((isFree: boolean) => {
    if (!form.getFieldState("is_free").isDirty) return;
    form.setValue("ticket_types", isFree ? [] : [defaultTicketType]);
    form.setValue("is_free", isFree);
    form.trigger("ticket_types").catch((e) => {
      console.error(e);
    });
  }, []);

  const handleSubmit = async (data: z.infer<typeof event>) => {
    startTransition(async () => {
      console.log(data);
      const result = await onAdd(data);
      if (result.success) {
        form.reset();
        router.push("/staff/manage/event/event-list");
      } else {
        form.setError("title", { message: result.error });
      }
    });
  };

  const isFreeField = form.getValues().is_free;

  useEffect(() => {
    onToggleFreeEvent(isFreeField);
  }, [isFreeField, onToggleFreeEvent]);

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
                <Select onChange={field.onChange} defaultValue={field.value}>
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
                    max={
                      form.watch("end_date")?.toISOString().slice(0, 16) ??
                      undefined
                    }
                    value={
                      field.value instanceof Date &&
                      !isNaN(field.value.getTime())
                        ? field.value.toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) => {
                      if (!e.target.value) {
                        field.onChange(null);
                        return "";
                      }
                      const localDate = new Date(e.target.value);
                      const utcDate = new Date(
                        localDate.getTime() -
                          localDate.getTimezoneOffset() * 60000,
                      );
                      field.onChange(utcDate);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    min={
                      form.watch("date")?.toISOString().slice(0, 16) ??
                      undefined
                    }
                    value={
                      field.value instanceof Date &&
                      !isNaN(field.value.getTime())
                        ? field.value.toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) => {
                      if (!e.target.value) {
                        field.onChange(null);
                        return "";
                      }
                      const localDate = new Date(e.target.value);
                      const utcDate = new Date(
                        localDate.getTime() -
                          localDate.getTimezoneOffset() * 60000,
                      );
                      field.onChange(utcDate);
                    }}
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
          />
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
          {!form.getValues().is_free && (
            <Stack className="gap-4">
              {form.watch("ticket_types").map((ticketType, index) => {
                return (
                  <Stack key={ticketType.id} className="gap-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="-mb-10 text-[22px]">
                          Ticket #{index + 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Stack className="gap-2 pt-6">
                          <FormField
                            control={form.control}
                            name={`ticket_types.${index}.label`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <Stack>
                                    <p>Ticket Name</p>
                                  </Stack>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ""
                                          ? ""
                                          : String(e.target.value),
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
                            name={`ticket_types.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <Stack>
                                    <p>Ticket Description (optional)</p>
                                  </Stack>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ""
                                          ? ""
                                          : String(e.target.value),
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
                            name={`ticket_types.${index}.price`}
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
                                        e.target.value === ""
                                          ? ""
                                          : Number(e.target.value),
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
                            name={`ticket_types.${index}.available_tickets_of_type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <Stack>
                                    <p>Available Tickets</p>
                                  </Stack>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ""
                                          ? ""
                                          : Number(e.target.value),
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </Stack>
                      </CardContent>
                      <CardFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const currentTickets =
                              form.getValues().ticket_types;
                            const remaining = currentTickets.filter(
                              (ticketToDelete) =>
                                ticketToDelete.id !== ticketType.id,
                            );
                            form.setValue("ticket_types", remaining);
                            form.trigger("ticket_types").catch((e) => {
                              console.error(e);
                            });
                          }}
                        >
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  </Stack>
                );
              })}
              <Button
                className="lg:w-fit"
                type="button"
                onClick={() => {
                  form.setValue("ticket_types", [
                    ...form.getValues().ticket_types,
                    {
                      label: "New Ticket",
                      price: 10,
                      available_tickets_of_type: 100,
                      is_visible: true,
                      id: createUUID(),
                      description: null,
                    },
                  ]);
                }}
              >
                Add New Ticket Type
              </Button>
            </Stack>
          )}
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
