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
import { Copy, MoreHorizontal } from "lucide-react";
import { useTransition, useState, useCallback } from "react";
import type { Currency } from "@prisma/client";

export type EventTicket = {
  id: string;
  price: number;
  currency: Currency;
  scanned: boolean;
  scanned_at: Date | null;
  created_at: Date;
  is_free: boolean;
  count: number;
  order_session_id: string;

  owner: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string | null;
  };

  ticket_type: {
    id: string;
    label: string;
    description: string | null;
    price: number;
  } | null;
};

export const EventSoldTicketsTable = ({
  data,
  deleteTicket,
  updateTicketScanStatus,
  onRefresh,
}: {
  data: EventTicket[];
  deleteTicket: (id: string) => Promise<void>;
  updateTicketScanStatus: (id: string, scanned: boolean) => Promise<void>;
  onRefresh: () => Promise<void>;
}) => {
  const [, startTransition] = useTransition();
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleScanStatus = useCallback(
    (id: string, scanned: boolean) => {
      setPendingIds([...pendingIds, id]);
      startTransition(async () => {
        await updateTicketScanStatus(id, scanned);
        setPendingIds(pendingIds.filter((pendingId) => pendingId !== id));
        await onRefresh();
      });
    },
    [pendingIds, updateTicketScanStatus, onRefresh],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setDeletingIds([...deletingIds, id]);
      startTransition(async () => {
        await deleteTicket(id);
        setDeletingIds(deletingIds.filter((deletingId) => deletingId !== id));
        await onRefresh();
      });
    },
    [deletingIds, deleteTicket, onRefresh],
  );

  const copyEmailsToClipboard = useCallback(() => {
    // Extract all unique emails from data
    const emails = [...new Set(data.map((ticket) => ticket.owner.email))];
    const emailString = emails.join(", ");

    // Copy to clipboard
    navigator.clipboard
      .writeText(emailString)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy emails: ", err);
      });
  }, [data]);

  const columns: ColumnDef<EventTicket>[] = [
    {
      accessorKey: "owner.name",
      header: "Purchaser",
      cell: ({ row }) => {
        return (
          <p>{`${row.original.owner.name} ${row.original.owner.surname}`}</p>
        );
      },
    },
    {
      accessorKey: "owner.email",
      header: "Email",
      cell: ({ row }) => row.original.owner.email,
    },
    {
      accessorKey: "ticket_type",
      header: "Ticket Type",
      cell: ({ row }) => {
        return row.original.ticket_type ? (
          <p>{row.original.ticket_type.label}</p>
        ) : (
          <p className="text-muted-foreground">
            {row.original.is_free ? "Free Entry" : "Unknown Type"}
          </p>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Sale Price",
      cell: ({ row }) => {
        return (
          <p>
            {row.original.is_free
              ? "Free"
              : `${row.original.price} ${row.original.currency}`}
          </p>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Purchase Date",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return <p>{format(date, "PPp")}</p>;
      },
    },
    {
      accessorKey: "scanned",
      header: "Scanned",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            <Switch
              checked={row.original.scanned}
              onCheckedChange={(checked) => {
                handleScanStatus(row.original.id, checked);
              }}
              disabled={pendingIds.includes(row.original.id)}
            />
            {row.original.scanned_at && (
              <span className="text-xs text-muted-foreground">
                {format(new Date(row.original.scanned_at), "PPp")}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const ticket = row.original;

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
                    `Are you sure you want to delete this ticket? Purchaser: "${ticket.owner.name} ${ticket.owner.surname}"`,
                  );
                  if (!confirm) return;
                  handleDelete(ticket.id);
                }}
              >
                {deletingIds.includes(ticket.id) ? (
                  <DotsLoader
                    modifier="secondary"
                    size="sm"
                    className="m-auto"
                  />
                ) : (
                  "Delete Ticket"
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={copyEmailsToClipboard}
          variant="outline"
          className="flex items-center gap-2"
          disabled={data.length === 0}
        >
          <Copy size={16} />
          {copySuccess ? "Copied!" : "Copy All Emails"}
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};
