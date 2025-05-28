"use client";

import DotsLoader from "@/app/_components/atoms/DotsLoader.atom";
import Stack from "@/app/_components/layouts/Stack.layout";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import { DataTable } from "@/app/_components/shadcn/DataTable.shadcn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/shadcn/DropdownMenu.shadcn";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/shadcn/Dialog.shadcn";
import { Switch } from "@/app/_components/shadcn/Switch.shadcn";
import { deleteEvent } from "@/server/actions/deleteEvent";
import { formatDateToTimezone } from "@/utils/fe";
import type { Currency } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Calendar,
  MapPin,
  Ticket,
  BarChart,
  Edit,
  MessageSquare,
  Users,
  Eye,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useTransition, useState, useCallback, Fragment } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/app/_hooks/useIsMobile";

export type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  time_zone?: string | null;
  external_event_url: string | null;
  event_photos_url: string | null;
  venue: {
    name: string;
  };
  created_at: Date;
  is_published: boolean;
  is_free: boolean;
  price_currency: Currency;
  ticket_types: {
    id: string;
    label: string;
    price: number;
  }[];
};

export const EventList = ({
  data,
  toggleEventPublished,
  refresh,
}: {
  data: Event[];
  toggleEventPublished: (id: string, published: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}) => {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDelete = useCallback(
    (id: string) => {
      setPendingId(id);
      startTransition(async () => {
        void (await deleteEvent({ id }));
        setPendingId(null);
        void (await refresh());
      });
    },
    [refresh],
  );

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "date",
      header: "Event Date",
      cell: ({ row }) => {
        const date = formatDateToTimezone(
          row.original.date,
          row.original.time_zone,
        );
        return <p>{format(date, "PPp")}</p>;
      },
    },
    {
      accessorKey: "venue.name",
      header: "Venue",
    },
    {
      accessorKey: "ticket_types",
      header: "Ticket Types",
      cell: ({ row }) => {
        if (row.original.is_free) return <p>Free</p>;
        return (
          <Stack className="flex-wrap gap-1">
            {row.original.ticket_types.map((ticket_type) => (
              <Fragment key={ticket_type.id}>
                <p className="max-w-[100px] text-[12px] leading-[100%]">
                  {ticket_type.label}
                </p>
                <p className="mb-1 max-w-[100px] text-[8px] leading-[100%]">
                  {ticket_type.price} {row.original.price_currency}
                </p>
              </Fragment>
            ))}
          </Stack>
        );
      },
    },
    {
      accessorKey: "is_published",
      header: "Published",
      cell: ({ row }) => {
        const isPiblished = row.original.is_published;
        return (
          <Switch
            checked={isPiblished}
            onCheckedChange={(checked) => {
              void toggleEventPublished(row.original.id, checked).then(refresh);
            }}
          />
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return <p>{format(date, "PPp")}</p>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/staff/manage/event/event-metrics/${event.id}`}>
                  Metrics
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/staff/manage/event/edit-event/${event.id}`}>
                  Edit Event
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/chat/${event.id}`}>View Chat</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/staff/manage/event/event-sold-tickets/${event.id}`}
                >
                  View Sold Tickets
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/staff/manage/event/event-participants/${event.id}`}
                >
                  View Participants
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const confirm = window.confirm(
                    `Are you sure you want to delete this event? "${event.title}"`,
                  );
                  if (!confirm) return;
                  handleDelete(event.id);
                }}
              >
                {isPending && pendingId === event.id ? (
                  <DotsLoader
                    modifier="secondary"
                    size="sm"
                    className="m-auto"
                  />
                ) : (
                  "Delete Event"
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      {/* Desktop view - hidden on mobile */}
      <div className="hidden md:block">
        <DataTable columns={columns} data={data} />
      </div>

      {/* Mobile view - hidden on desktop */}
      <div className="block md:hidden">
        <Stack className="gap-4">
          {data.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              toggleEventPublished={toggleEventPublished}
              refresh={refresh}
              handleDelete={handleDelete}
              isPending={isPending && pendingId === event.id}
            />
          ))}
          {data.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-gray-500">No events found</p>
            </div>
          )}
        </Stack>
      </div>
    </>
  );
};

// Mobile Event Card Component
const EventCard = ({
  event,
  toggleEventPublished,
  refresh,
  handleDelete,
  isPending,
}: {
  event: Event;
  toggleEventPublished: (id: string, published: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  handleDelete: (id: string) => void;
  isPending: boolean;
}) => {
  const eventDate = formatDateToTimezone(event.date, event.time_zone);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleActionClick = () => {
    setDialogOpen(false);
  };

  const handleDeleteClick = () => {
    const confirm = window.confirm(
      `Are you sure you want to delete this event? "${event.title}"`,
    );
    if (!confirm) return;
    handleDelete(event.id);
    setDialogOpen(false);
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      {/* Header with title and actions */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Event Actions</DialogTitle>
            </DialogHeader>
            <Stack className="gap-2 pt-4">
              <Link
                href={`/staff/manage/event/event-metrics/${event.id}`}
                onClick={handleActionClick}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent"
              >
                <BarChart className="h-5 w-5 text-muted-foreground" />
                <span>Metrics</span>
              </Link>

              <Link
                href={`/staff/manage/event/edit-event/${event.id}`}
                onClick={handleActionClick}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent"
              >
                <Edit className="h-5 w-5 text-muted-foreground" />
                <span>Edit Event</span>
              </Link>

              <Link
                href={`/chat/${event.id}`}
                onClick={handleActionClick}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent"
              >
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span>View Chat</span>
              </Link>

              <Link
                href={`/staff/manage/event/event-sold-tickets/${event.id}`}
                onClick={handleActionClick}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent"
              >
                <Ticket className="h-5 w-5 text-muted-foreground" />
                <span>View Sold Tickets</span>
              </Link>

              <Link
                href={`/staff/manage/event/event-participants/${event.id}`}
                onClick={handleActionClick}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent"
              >
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>View Participants</span>
              </Link>

              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-3 rounded-lg p-3 text-destructive hover:bg-destructive/10"
              >
                {isPending ? (
                  <DotsLoader
                    modifier="secondary"
                    size="sm"
                    className="m-auto"
                  />
                ) : (
                  <>
                    <Trash2 className="h-5 w-5" />
                    <span>Delete Event</span>
                  </>
                )}
              </button>
            </Stack>
          </DialogContent>
        </Dialog>
      </div>

      {/* Event details */}
      <Stack className="gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(eventDate, "PPp")}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{event.venue.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-muted-foreground" />
          {event.is_free ? (
            <span className="font-medium text-green-600">Free Event</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {event.ticket_types.map((ticket) => (
                <span
                  key={ticket.id}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                >
                  {ticket.label}: {ticket.price} {event.price_currency}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Published toggle */}
        <div className="mt-2 flex items-center justify-between border-t pt-3">
          <span className="text-sm font-medium">Published</span>
          <Switch
            checked={event.is_published}
            onCheckedChange={(checked) => {
              void toggleEventPublished(event.id, checked).then(refresh);
            }}
          />
        </div>

        {/* Created date */}
        <div className="text-xs text-muted-foreground">
          Created: {format(new Date(event.created_at), "PP")}
        </div>
      </Stack>
    </div>
  );
};
