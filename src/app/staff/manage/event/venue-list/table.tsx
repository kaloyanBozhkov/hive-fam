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
import { deleteVenue } from "@/server/actions/deleteVenue";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useTransition, useState, useCallback } from "react";

export type Venue = {
  id: string;
  name: string;
  description: string;
  maps_url: string;
  max_guests: number;
  created_at: Date;
  updated_at: Date;
};

export const VenueList = ({ data }: { data: Venue[] }) => {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    setPendingId(id);
    startTransition(async () => {
      await deleteVenue({ id });
      setPendingId(null);
    });
  }, []);

  const columns: ColumnDef<Venue>[] = [
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
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <p className="max-w-[200px] truncate">{row.original.description}</p>
      ),
    },
    {
      accessorKey: "max_guests",
      header: "Max Guests",
    },
    {
      accessorKey: "maps_url",
      header: "Maps URL",
      cell: ({ row }) => (
        <Link href={row.original.maps_url}>
          <p className="w-[100px] overflow-auto whitespace-nowrap hover:text-black/50">
            {row.original.maps_url}
          </p>
        </Link>
      ),
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
        const venue = row.original;

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
                <Link href={`/staff/manage/event/edit-venue/${venue.id}`}>
                  Edit Venue
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const confirm = window.confirm(
                    `Are you sure you want to delete this venue? "${venue.name}"`,
                  );
                  if (!confirm) return;
                  handleDelete(venue.id);
                }}
              >
                {isPending && pendingId === venue.id ? (
                  <DotsLoader
                    modifier="secondary"
                    size="sm"
                    className="m-auto"
                  />
                ) : (
                  "Delete Venue"
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
