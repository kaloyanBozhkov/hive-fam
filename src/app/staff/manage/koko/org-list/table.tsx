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
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useTransition } from "react";
import { deleteOrg } from "@/server/actions/deleteOrg";

export type Org = {
  id: string;
  name: string;
  created_at: Date;
};

export const columns: ColumnDef<Org>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <p className="max-w-[100px] overflow-auto whitespace-nowrap">
          {row.original.id}
        </p>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return <p>{format(date, "PPpp")}</p>; // "PPpp" format: "Apr 29, 2023, 1:25:50 PM"
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const org = row.original;
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const confirm = window.confirm(
                  "Are you sure you want to delete this org? " + org.name,
                );
                if (!confirm) return;
                startTransition(async () => {
                  await deleteOrg({ id: org.id });
                });
              }}
            >
              {!isPending ? (
                "Delete Org"
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

export const OrgTable = ({ data }: { data: Org[] }) => {
  return <DataTable columns={columns} data={data} />;
};
