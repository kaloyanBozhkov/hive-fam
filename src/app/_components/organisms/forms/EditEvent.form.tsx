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
import { useEffect, useRef, useTransition } from "react";
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
import { MIN_TICKET_PRICE } from "./AddEvent.form";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardHeader,
} from "../../shadcn/Card.shadcn";
import { createUUID } from "@/utils/common";
import LexicalEditor from "../../molecules/LexicalEditor";

const event = z
  .object({
    id: z.string().uuid(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    date: z.date(),
    end_date: z.date().nullable().default(null),
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
    event_photos_url: z.string().url().optional().nullable(),
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
    // for edit we can allow ticket types to be set while its free
    // if (data.is_free && data.ticket_types.length > 0) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Ticket types are not allowed if the event is free",
    //     path: ["ticket_types"],
    //   });
    // }
    if (data.end_date && data.end_date < data.date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["end_date"],
      });
    }
  });

const EditEventForm = ({
  className,
  initialData,
  onEdit,
  venues,
  organizationId,
  ticketTypesIdsThatCannotBeDeleted,
}: {
  className?: string;
  initialData: z.infer<typeof event>;
  onEdit: (
    eventData: z.infer<typeof event>,
  ) => Promise<{ success: boolean; error?: string }>;
  venues: { id: string; name: string }[];
  organizationId: string;
  ticketTypesIdsThatCannotBeDeleted: string[];
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof event>>({
    resolver: zodResolver(event),
    defaultValues: initialData,
  });
  const prevPricing = useRef(initialData.ticket_types);

  const onToggleFreeEvent = (isFree: boolean) => {
    if (!form.getFieldState("is_free").isDirty) return;
    form.setValue("ticket_types", isFree ? [] : prevPricing.current);
    form.setValue("is_free", isFree);
    form.trigger("ticket_types").catch((e) => {
      console.error(e);
    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <Select onChange={field.onChange} value={field.value}>
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
                  <LexicalEditor
                    editable
                    onChanged={field.onChange}
                    initialValue={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => {
              return (
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
              );
            }}
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
                            <FormField
                              control={form.control}
                              name={`ticket_types.${index}.is_visible`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Visible
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                      Toggle this off to hide the ticket type
                                      from the public.
                                      <br />
                                      Useful when tickes of this type have
                                      already been sold.
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
                          </Stack>
                        </CardContent>
                        <CardFooter>
                          {ticketTypesIdsThatCannotBeDeleted.includes(
                            ticketType.id,
                          ) ? (
                            <p className="text-xs text-red-500">
                              This ticket type cannot be deleted as it has sold
                              tickets. You can still toggle it as invisible.
                            </p>
                          ) : (
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
                          )}
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
                        label: "Regular Admission",
                        price: 10,
                        available_tickets_of_type: 100,
                        is_visible: true,
                        id: createUUID(),
                        description: null,
                      },
                    ]);
                    form.trigger("ticket_types").catch((e) => {
                      console.error(e);
                    });
                  }}
                >
                  Add New Ticket Type
                </Button>
              </Stack>
              <FormField
                control={form.control}
                name={`price_currency`}
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
