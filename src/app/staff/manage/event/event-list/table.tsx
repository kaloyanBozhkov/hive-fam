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
import { Switch } from "@/app/_components/shadcn/Switch.shadcn";
import { deleteEvent } from "@/server/actions/deleteEvent";
import { formatDateToTimezone } from "@/utils/fe";
import type { Currency } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useTransition, useState, useCallback, Fragment } from "react";

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

  const handleDelete = useCallback((id: string) => {
    setPendingId(id);
    startTransition(async () => {
      void (await deleteEvent({ id }));
      setPendingId(null);
      void (await refresh());
    });
  }, []);

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

  return <DataTable columns={columns} data={data} />;
};
