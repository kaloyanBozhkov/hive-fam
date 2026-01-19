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
import { deleteCustomQR } from "@/server/actions/qr/deleteCustomQR";
import { resetCustomQRVisits } from "@/server/actions/qr/resetCustomQRVisits";
import { forceDownload } from "@/utils/common";
import { generateQRCodeDataURL, viewQRCodeInNewTab } from "@/utils/qr";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Download,
  MoreHorizontal,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, useState, useCallback } from "react";

export type CustomQRData = {
  id: string;
  description: string | null;
  forward_to_url: string;
  visit_count: number;
  last_visited_at: Date | null;
  created_at: Date;
  organization_id: string;
  qr_contents: string;
};

export const CustomQRList = ({ data }: { data: CustomQRData[] }) => {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [resetPendingId, setResetPendingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = useCallback(
    (customQR: CustomQRData) => {
      setPendingId(customQR.id);
      startTransition(async () => {
        await deleteCustomQR(customQR.id, customQR.organization_id);
        setPendingId(null);
        router.refresh();
      });
    },
    [router],
  );

  const handleResetVisits = useCallback(
    (customQR: CustomQRData) => {
      setResetPendingId(customQR.id);
      startTransition(async () => {
        await resetCustomQRVisits(customQR.id, customQR.organization_id);
        setResetPendingId(null);
        router.refresh();
      });
    },
    [router],
  );

  const handleViewQR = useCallback(
    async (customQR: CustomQRData) => {
      try {
        const qrCodeDataURL = await generateQRCodeDataURL(
          customQR.qr_contents,
          customQR.organization_id
        );

        viewQRCodeInNewTab({
          id: customQR.id,
          description: customQR.description,
          forward_to_url: customQR.forward_to_url,
          visit_count: customQR.visit_count,
          qrCodeDataURL,
          qr_contents: customQR.qr_contents,
        });
      } catch (error) {
        alert("Failed to generate QR code for viewing");
      }
    },
    [],
  );

  const handleDownload = useCallback(
    async (customQR: CustomQRData) => {
      try {
        const qrCodeDataURL = await generateQRCodeDataURL(
          customQR.qr_contents,
          customQR.organization_id
        );
        console.log("qrCodeDataURL", qrCodeDataURL);
        forceDownload(qrCodeDataURL, `${customQR.id}.png`);
      } catch (error) {
        alert("Failed to download QR code");
      }
    },
    [],
  );

  const columns: ColumnDef<CustomQRData>[] = [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description;
        return (
          description ?? (
            <span className="italic text-gray-400">No description</span>
          )
        );
      },
    },
    {
      accessorKey: "forward_to_url",
      header: "Forward URL",
      cell: ({ row }) => (
        <Link href={row.original.forward_to_url} target="_blank">
          <p className="max-w-[200px] overflow-auto whitespace-nowrap hover:text-black/50">
            {row.original.forward_to_url}
          </p>
        </Link>
      ),
    },
    {
      accessorKey: "visit_count",
      header: "Visits",
    },
    {
      accessorKey: "last_visited_at",
      header: "Last Visit",
      cell: ({ row }) => {
        const lastVisit = row.original.last_visited_at;
        return lastVisit ? format(lastVisit, "MMM dd, yyyy HH:mm") : "Never";
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => format(row.original.created_at, "MMM dd, yyyy"),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customQR = row.original;

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
              <DropdownMenuItem onClick={() => handleViewQR(customQR)}>
                <Eye className="mr-2 h-4 w-4" />
                View QR Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload(customQR)}>
                <Download className="mr-2 h-4 w-4" />
                Download QR
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/staff/manage/admin/edit-custom-qr/${customQR.id}`}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit QR
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const confirm = window.confirm(
                    `Are you sure you want to reset visit count for this QR? This will set visits to 0 and clear the last visit time.`,
                  );
                  if (!confirm) return;
                  handleResetVisits(customQR);
                }}
              >
                {resetPendingId === customQR.id ? (
                  <DotsLoader
                    modifier="secondary"
                    size="sm"
                    className="m-auto"
                  />
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Visits
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const displayName = customQR.description ?? customQR.id;
                  const confirm = window.confirm(
                    `Are you sure you want to delete this custom QR? "${displayName}"`,
                  );
                  if (!confirm) return;
                  handleDelete(customQR);
                }}
              >
                {isPending && pendingId === customQR.id ? (
                  <DotsLoader
                    modifier="secondary"
                    size="sm"
                    className="m-auto"
                  />
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete QR
                  </>
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
