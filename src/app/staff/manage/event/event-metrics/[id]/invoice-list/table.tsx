"use client";

import { Button } from "@/app/_components/shadcn/Button.shadcn";
import { DataTable } from "@/app/_components/shadcn/DataTable.shadcn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/_components/shadcn/DropdownMenu.shadcn";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { TaxCalculationTypeToLabel } from "@/utils/pricing";
import type { TaxCalculationType } from "@prisma/client";

export type Invoice = {
  id: string;
  order_session_id: string;
  total_amount: number;
  amount_discount: number;
  currency: string;
  tax_percentage: number;
  tax_calculation_type: TaxCalculationType;
  total_tax_amount: number | null;
  created_at: Date;
  _count: {
    tickets: number;
  };
};

export const InvoiceList = ({ data }: { data: Invoice[] }) => {
  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "order_session_id",
      header: "Order ID",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <p className="max-w-[100px] overflow-auto">
            {invoice.order_session_id}
          </p>
        );
      },
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <p>
            {invoice.total_amount} {invoice.currency}
          </p>
        );
      },
    },
    {
      accessorKey: "amount_discount",
      header: "Discount",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <p>
            {invoice.amount_discount} {invoice.currency}
          </p>
        );
      },
    },
    {
      accessorKey: "_count.tickets",
      header: "Tickets ordered",
    },
    {
      accessorKey: "created_at",
      header: "Ordered At",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return <p>{format(date, "PPp")}</p>;
      },
    },

    {
      accessorKey: "total_tax_amount",
      header: "Tax Amount",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <p>
            {invoice.total_tax_amount
              ? `${invoice.total_tax_amount} ${invoice.currency}`
              : "N/A"}
          </p>
        );
      },
    },
    {
      accessorKey: "tax_percentage",
      header: "Tax Percentage",
      cell: ({ row }) => {
        const invoice = row.original;
        return <p>{invoice.tax_percentage}%</p>;
      },
    },
    {
      accessorKey: "tax_calculation_type",
      header: "Tax Calculation Type",
      cell: ({ row }) => {
        const invoice = row.original;
        return <p>{TaxCalculationTypeToLabel(invoice.tax_calculation_type)}</p>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const invoice = row.original;

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
                  target="_blank"
                  href={`/order/${invoice.order_session_id}`}
                >
                  View Order
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
};
