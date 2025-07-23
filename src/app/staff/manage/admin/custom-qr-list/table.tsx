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
import { fetchPostJSON, forceDownload } from "@/utils/common";
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

  const generateQRCode = useCallback(async (customQR: CustomQRData) => {
    try {
      const qrCodes = await fetchPostJSON<{ dataURL: string }[]>(
        `/api/qr/getQRCodes`,
        {
          qrs: [{ urlContent: customQR.qr_contents }],
          orgId: customQR.organization_id,
        },
      );
      const qrCodeDataURL = qrCodes[0]?.dataURL;
      if (qrCodeDataURL && typeof qrCodeDataURL === "string") {
        return qrCodeDataURL;
      } else {
        throw new Error("Invalid QR code response format");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw error;
    }
  }, []);

  const handleViewQR = useCallback(
    async (customQR: CustomQRData) => {
      try {
        const qrCodeDataURL = await generateQRCode(customQR);
        const newTab = window.open();
        if (newTab) {
          const description =
            customQR.description || `Custom QR ${customQR.id}`;
          newTab.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>QR Code - ${description}</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  background-color: #f5f5f5;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .container {
                  background: white;
                  padding: 30px;
                  border-radius: 12px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  text-align: center;
                }
                h1 {
                  margin: 0 0 20px 0;
                  color: #333;
                  font-size: 24px;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  border: 1px solid #ddd;
                  border-radius: 8px;
                }
                .info {
                  margin-top: 20px;
                  color: #666;
                  font-size: 14px;
                }
                .url {
                  word-break: break-all;
                  background: #f8f9fa;
                  padding: 8px 12px;
                  border-radius: 4px;
                  margin-top: 10px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>${description}</h1>
                <img src="${qrCodeDataURL}" alt="QR Code" />
                <div class="info">
                  <p><strong>Forwards to:</strong></p>
                  <div class="url">${customQR.forward_to_url}</div>
                  <p style="margin-top: 15px;"><strong>Visits:</strong> ${customQR.visit_count}</p>
                </div>
              </div>
            </body>
          </html>
        `);
          newTab.document.close();
        } else {
          alert("Please allow popups to view QR code");
        }
      } catch (error) {
        alert("Failed to generate QR code for viewing");
      }
    },
    [generateQRCode],
  );

  const handleDownload = useCallback(
    async (customQR: CustomQRData) => {
      try {
        const qrCodeDataURL = await generateQRCode(customQR);
        console.log("qrCodeDataURL", qrCodeDataURL);
        forceDownload(qrCodeDataURL, `${customQR.id}.png`);
      } catch (error) {
        alert("Failed to download QR code");
      }
    },
    [generateQRCode],
  );

  const columns: ColumnDef<CustomQRData>[] = [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description;
        return (
          description || (
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
                  const displayName = customQR.description || customQR.id;
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
