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
import { PosterType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

export type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  poster_data_url: string;
  poster_type: PosterType;
  external_event_url: string | null;
  event_photos_url: string | null;
  venue: {
    name: string;
  };
  created_at: Date;
  is_published: boolean;
};

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <p className="max-w-[100px] overflow-auto whitespace-nowrap">
        {row.original.id}
      </p>
    ),
  },
  {
    accessorKey: "poster_data_url",
    header: "Poster",
    cell: ({ row }) => (
      <img
        src={row.original.poster_data_url}
        alt="poster"
        className="h-10 w-10 rounded-sm"
      />
    ),
  },
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
  // {
  //   accessorKey: "poster_type",
  //   header: "Poster Type",
  // },
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
      const [isPending, startTransition] = useTransition();

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
                startTransition(async () => {
                  await deleteEvent({ id: event.id });
                });
              }}
            >
              {!isPending ? (
                "Delete Event"
              ) : (
                <DotsLoader modifier="secondary" size="sm" className="m-auto" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const EventList = ({ data }: { data: Event[] }) => {
  return <DataTable columns={columns} data={data} />;
};