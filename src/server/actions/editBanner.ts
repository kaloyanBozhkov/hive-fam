"use server";

import { BannerSlideType, Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

const errorMessages: Record<string, string> = {
  P2002: "A banner with this order already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to update banner.",
  default: "An unexpected error occurred. Please try again.",
};

type InfoBannerData = {
  id: string;
  type: "INFO";
  order: number;
  subtitle: string;
  title: string;
  content: string;
  background_data_url: string;
  background_video_url?: string | null;
};

type AlbumBannerData = {
  id: string;
  type: "ALBUM";
  order: number;
  album_name: string;
  album_subtitle: string;
  link: string;
  cover_data_url: string;
  is_single: boolean;
};

type BannerData = InfoBannerData | AlbumBannerData;

function isInfoBanner(banner: BannerData): banner is InfoBannerData {
  return banner.type === "INFO";
}

function isAlbumBanner(banner: BannerData): banner is AlbumBannerData {
  return banner.type === "ALBUM";
}

export async function editBanner(bannerData: BannerData) {
  try {
    const user = await getJWTUser();
    if (!([Role.ADMIN, Role.KOKO] as Role[]).includes(user.role))
      throw new Error("Unauthorized");

    const banner = await db.banner_slide.findUnique({
      where: { id: bannerData.id },
      include: { info_slide: true, album_slide: true },
    });

    if (!banner) throw new Error("Banner not found");

    // Use a transaction to update both the slide and banner
    const result = await db.$transaction(async (tx) => {
      if (isInfoBanner(bannerData) && banner.info_slide) {
        await tx.info_slide.update({
          where: { id: banner.info_slide.id },
          data: {
            subtitle: bannerData.subtitle,
            title: bannerData.title,
            content: bannerData.content,
            background_data_url: bannerData.background_data_url,
            background_video_url: bannerData.background_video_url,
          },
        });
      } else if (isAlbumBanner(bannerData) && banner.album_slide) {
        await tx.album_slide.update({
          where: { id: banner.album_slide.id },
          data: {
            album_name: bannerData.album_name,
            album_subtitle: bannerData.album_subtitle,
            link: bannerData.link,
            cover_data_url: bannerData.cover_data_url,
            is_single: bannerData.is_single,
          },
        });
      }

      // Update banner order if changed
      if (banner.order !== bannerData.order) {
        await tx.banner_slide.update({
          where: { id: bannerData.id },
          data: { order: bannerData.order },
        });
      }
    });

    revalidatePath("/staff/manage/admin/banner-list");

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to edit banner:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}
