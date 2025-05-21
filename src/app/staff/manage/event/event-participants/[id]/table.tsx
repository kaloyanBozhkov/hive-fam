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
import { NotesDialog } from "@/app/_components/molecules/NotesDialog.molecule";
import { JsonValue } from "@prisma/client/runtime/library";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy, MoreHorizontal, FileEdit } from "lucide-react";
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
  notes?: string | null;

  // TODO show in modal or smth, table - readable
  custom_payload: JsonValue | null;
};

export const EventParticipantsTable = ({
  data,
  deleteParticipant,
  approveParticipant,
  updateParticipantNotes,
  onRefresh,
}: {
  data: EventParticipant[];
  deleteParticipant: (id: string) => Promise<void>;
  approveParticipant: (id: string, approved: boolean) => Promise<void>;
  updateParticipantNotes: (id: string, notes: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}) => {
  const [, startTransition] = useTransition();
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<EventParticipant | null>(null);

  const handleApprove = useCallback(
    (id: string, approved: boolean) => {
      setPendingIds([...pendingIds, id]);
      startTransition(async () => {
        void (await approveParticipant(id, approved));
        setPendingIds(pendingIds.filter((pendingId) => pendingId !== id));
        void (await onRefresh());
      });
    },
    [pendingIds, approveParticipant, onRefresh],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setDeletingIds([...deletingIds, id]);
      startTransition(async () => {
        void (await deleteParticipant(id));
        setDeletingIds(deletingIds.filter((deletingId) => deletingId !== id));
        void (await onRefresh());
      });
    },
    [deletingIds, deleteParticipant, onRefresh],
  );

  const handleEditNotes = useCallback((participant: EventParticipant) => {
    setSelectedParticipant(participant);
    setNotesDialogOpen(true);
  }, []);

  const handleSaveNotes = useCallback(
    async (notes: string) => {
      if (selectedParticipant) {
        await updateParticipantNotes(selectedParticipant.id, notes);
        void (await onRefresh());
      }
    },
    [selectedParticipant, updateParticipantNotes, onRefresh],
  );

  const copyEmailsToClipboard = useCallback(() => {
    // Extract all unique emails from data
    const emails = [...new Set(data.map((participant) => participant.email))];
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
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => {
        const notes = row.original.notes;
        return (
          <div className="flex items-center">
            {notes ? (
              <div className="max-w-[200px] truncate" title={notes}>
                {notes}
              </div>
            ) : (
              <span className="text-gray-400">No notes</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditNotes(row.original)}
              className="ml-2"
            >
              <FileEdit className="h-4 w-4" />
            </Button>
          </div>
        );
      },
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
              <DropdownMenuItem onClick={() => handleEditNotes(participant)}>
                Edit Notes
              </DropdownMenuItem>
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

      {selectedParticipant && (
        <NotesDialog
          isOpen={notesDialogOpen}
          onClose={() => setNotesDialogOpen(false)}
          onSave={handleSaveNotes}
          initialNotes={selectedParticipant.notes ?? ""}
          title={`Edit Notes - ${selectedParticipant.name} ${selectedParticipant.surname}`}
        />
      )}
    </div>
  );
};
