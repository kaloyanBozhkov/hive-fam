"use client";

import DotsLoader from "@/app/_components/atoms/DotsLoader.atom";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import { DataTable } from "@/app/_components/shadcn/DataTable.shadcn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/_components/shadcn/DropdownMenu.shadcn";
import { Switch } from "@/app/_components/shadcn/Switch.shadcn";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useTransition, useState, useCallback } from "react";

export type EventParticipant = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  country: string;
  approved: boolean;
  created_at: Date;
  custom_payload: string;
};

export const EventParticipantsTable = ({
  data,
  deleteParticipant,
  approveParticipant,
  onRefresh,
}: {
  data: EventParticipant[];
  deleteParticipant: (id: string) => Promise<void>;
  approveParticipant: (id: string, approved: boolean) => Promise<void>;
  onRefresh: () => Promise<void>;
}) => {
  const [, startTransition] = useTransition();
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const handleApprove = useCallback((id: string, approved: boolean) => {
    setPendingIds([...pendingIds, id]);
    startTransition(async () => {
      void (await approveParticipant(id, approved));
      setPendingIds(pendingIds.filter((id) => id !== id));
      void (await onRefresh());
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDeletingIds([...deletingIds, id]);
    startTransition(async () => {
      void (await deleteParticipant(id));
      setDeletingIds(deletingIds.filter((id) => id !== id));
      void (await onRefresh());
    });
  }, []);

  const columns: ColumnDef<EventParticipant>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return <p>{`${row.original.name} ${row.original.surname}`}</p>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "approved",
      header: "Approved",
      cell: ({ row }) => {
        return (
          <Switch
            checked={row.original.approved}
            onCheckedChange={(checked) => {
              void handleApprove(row.original.id, checked);
            }}
            disabled={pendingIds.includes(row.original.id)}
          />
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Registered At",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return <p>{format(date, "PPp")}</p>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const participant = row.original;

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
              <DropdownMenuItem
                onClick={() => {
                  const confirm = window.confirm(
                    `Are you sure you want to delete this participant? "${participant.name} ${participant.surname}"`,
                  );
                  if (!confirm) return;
                  void handleDelete(participant.id);
                }}
              >
                {deletingIds.includes(participant.id) ? (
                  <DotsLoader
                    modifier="secondary"
                    size="sm"
                    className="m-auto"
                  />
                ) : (
                  "Delete Participant"
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
