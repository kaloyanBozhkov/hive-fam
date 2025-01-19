"use client";

import DotsLoader from "@/app/_components/atoms/DotsLoader.atom";
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
import type { Currency } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useTransition, useState, useCallback } from "react";

export type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  external_event_url: string | null;
  event_photos_url: string | null;
  venue: {
    name: string;
  };
  created_at: Date;
  is_published: boolean;
  is_free: boolean;
  ticket_price: number;
  price_currency: Currency;
};

export const EventList = ({ data }: { data: Event[] }) => {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    setPendingId(id);
    startTransition(async () => {
      await deleteEvent({ id });
      setPendingId(null);
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
        const date = new Date(row.original.date);
        return <p>{format(date, "PPpp")}</p>;
      },
    },
    {
      accessorKey: "venue.name",
      header: "Venue",
    },
    {
      accessorKey: "ticket_price",
      header: "Price",
      cell: ({ row }) => {
        if (row.original.is_free) return <p>Free</p>;
        return (
          <p>
            {row.original.ticket_price} {row.original.price_currency}
          </p>
        );
      },
    },
    {
      accessorKey: "is_published",
      header: "Published",
      cell: ({ row }) => {
        const isPiblished = row.original.is_published;
        return <Switch checked={isPiblished} />;
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return <p>{format(date, "PPpp")}</p>;
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
