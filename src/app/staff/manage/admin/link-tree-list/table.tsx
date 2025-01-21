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
import { deleteLinkTree } from "@/server/actions/deleteLinkTree";
import type { ButtonColor, FontAwesomeIcon } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useTransition, useState, useCallback } from "react";

export type LinkTreeData = {
  id: string;
  name: string;
  url: string;
  button_color: ButtonColor;
  button_icon: FontAwesomeIcon;
  visitsCount: number; // Total visits count
  visitsLast24h: number; // Visits in the last 24 hours
  visitsLast72h: number; // Visits in the last 72 hours
  visitsLastWeek: number; // Visits in the last week
  visitsLastMonth: number; // Visits in the last month
};

export const LinkTreeList = ({ data }: { data: LinkTreeData[] }) => {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    setPendingId(id);
    startTransition(async () => {
      await deleteLinkTree({ id });
      setPendingId(null);
    });
  }, []);

  const columns: ColumnDef<LinkTreeData>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: ({ row }) => (
        <Link href={row.original.url} target="_blank">
          <p className="max-w-[200px] overflow-auto whitespace-nowrap hover:text-black/50">
            {row.original.url}
          </p>
        </Link>
      ),
    },
    {
      accessorKey: "visitsCount",
      header: "Total",
      cell: ({ row }) => <p>{row.original.visitsCount}</p>,
    },
    {
      accessorKey: "visitsLast24h",
      header: "24h",
      cell: ({ row }) => <p>{row.original.visitsLast24h}</p>,
    },
    {
      accessorKey: "visitsLast72h",
      header: "72h",
      cell: ({ row }) => <p>{row.original.visitsLast72h}</p>,
    },
    {
      accessorKey: "visitsLastWeek",
      header: "Week",
      cell: ({ row }) => <p>{row.original.visitsLastWeek}</p>,
    },
    {
      accessorKey: "visitsLastMonth",
      header: "Month",
      cell: ({ row }) => <p>{row.original.visitsLastMonth}</p>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const linkTree = row.original;

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
                <Link
                  href={`/staff/manage/admin/edit-link-tree/${linkTree.id}`}
                >
                  Edit Link
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const confirm = window.confirm(
                    `Are you sure you want to delete this link tree? "${linkTree.name}"`,
                  );
                  if (!confirm) return;
                  handleDelete(linkTree.id);
                }}
              >
                {isPending && pendingId === linkTree.id ? (
                  <DotsLoader
                    modifier="secondary"
                    size="sm"
                    className="m-auto"
                  />
                ) : (
                  "Delete Link Tree"
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
