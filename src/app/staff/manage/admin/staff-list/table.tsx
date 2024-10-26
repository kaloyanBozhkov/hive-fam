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
import { deleteStaff } from "@/server/actions/deleteStaff";
import { Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

export type Staff = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: Role;
  phone: string;
  created_at: Date;
};

export const columns: ColumnDef<Staff>[] = [
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
    accessorKey: "surname",
    header: "Surname",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "phone",
    header: "Phone",
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
      const user = row.original;
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
              <Link href={`/staff/manage/admin/edit-staff/${user.id}`}>
                Edit User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const confirm = window.confirm(
                  "Are you sure you want to delete this user? " +
                    user.name +
                    " " +
                    user.surname,
                );
                if (!confirm) return;
                startTransition(async () => {
                  await deleteStaff({ id: user.id });
                });
              }}
            >
              {!isPending ? (
                "Delete User"
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

export const StaffList = ({ data }: { data: Staff[] }) => {
  return <DataTable columns={columns} data={data} />;
};
