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

export async function addInfoBanner(bannerData: {
  subtitle: string;
  title: string;
  content: string;
  background_data_url: string;
  background_video_url?: string | null;
  order: number;
}) {
  try {
    const user = await getJWTUser();
    if (!([Role.ADMIN, Role.KOKO] as Role[]).includes(user.role))
      throw new Error("Unauthorized");

    // Use a transaction to create both the info slide and banner slide
    const result = await db.$transaction(async (tx) => {
      // Create the info slide first
      const infoSlide = await tx.info_slide.create({
        data: {
          subtitle: bannerData.subtitle,
          title: bannerData.title,
          content: bannerData.content,
          background_data_url: bannerData.background_data_url,
          background_video_url: bannerData.background_video_url,
        },
      });

      // Create the banner slide with the info slide reference
      const bannerSlide = await tx.banner_slide.create({
        data: {
          type: BannerSlideType.INFO,
          order: bannerData.order,
          organization_id: user.organization_id,
          info_slide_id: infoSlide.id,
        },
      });

      return { infoSlide, bannerSlide };
    });

    revalidatePath("/staff/manage/admin/banner-list");

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to add info banner:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}
