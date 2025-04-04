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
import { deleteBannerSlide } from "@/server/actions/deleteBannerSlide";
import { type BannerSlideType } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useTransition, useState, useCallback } from "react";

export type BannerSlide = {
  id: string;
  type: BannerSlideType;
  order: number;
  info_slide?: {
    title: string;
    subtitle: string | null;
  } | null;
  album_slide?: {
    album_name: string;
    album_subtitle: string;
  } | null;
};

export const BannerList = ({ data }: { data: BannerSlide[] }) => {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    setPendingId(id);
    startTransition(async () => {
      await deleteBannerSlide({ id });
      setPendingId(null);
    });
  }, []);

  const columns: ColumnDef<BannerSlide>[] = [
    {
      accessorKey: "order",
      header: "Order",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const slide = row.original;
        if (slide.type === "INFO") {
          return slide.info_slide?.title;
        }
        return slide.album_slide?.album_name;
      },
    },
    {
      accessorKey: "subtitle",
      header: "Subtitle",
      cell: ({ row }) => {
        const slide = row.original;
        if (slide.type === "INFO") {
          return slide.info_slide?.subtitle;
        }
        return slide.album_slide?.album_subtitle;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const slide = row.original;

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
                <Link href={`/staff/manage/admin/edit-banner/${slide.id}`}>
                  Edit Banner
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const confirm = window.confirm(
                    `Are you sure you want to delete this banner?`,
                  );
                  if (!confirm) return;
                  handleDelete(slide.id);
                }}
              >
                {isPending && pendingId === slide.id ? (
                  <DotsLoader
                    modifier="secondary"
                    size="sm"
                    className="m-auto"
                  />
                ) : (
                  "Delete Banner"
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
