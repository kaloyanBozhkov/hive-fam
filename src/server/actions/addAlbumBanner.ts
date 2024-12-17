"use server";

import { BannerSlideType, Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

const errorMessages: Record<string, string> = {
  P2002: "A banner with this order already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to create banner.",
  default: "An unexpected error occurred. Please try again.",
};

export async function addAlbumBanner(bannerData: {
  album_name: string;
  album_subtitle: string;
  link: string;
  cover_data_url: string;
  is_single: boolean;
  order: number;
}) {
  try {
    const user = await getJWTUser();
    if (!([Role.ADMIN, Role.KOKO] as Role[]).includes(user.role))
      throw new Error("Unauthorized");

    // Use a transaction to create both the album slide and banner slide
    const result = await db.$transaction(async (tx) => {
      // Create the album slide first
      const albumSlide = await tx.album_slide.create({
        data: {
          album_name: bannerData.album_name,
          album_subtitle: bannerData.album_subtitle,
          link: bannerData.link,
          cover_data_url: bannerData.cover_data_url,
          is_single: bannerData.is_single,
        },
      });

      // Create the banner slide with the album slide reference
      const bannerSlide = await tx.banner_slide.create({
        data: {
          type: BannerSlideType.ALBUM,
          order: bannerData.order,
          organization_id: user.organization_id,
          album_slide_id: albumSlide.id,
        },
      });

      return { albumSlide, bannerSlide };
    });

    revalidatePath("/staff/manage/admin/banner-list");

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to add album banner:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}
