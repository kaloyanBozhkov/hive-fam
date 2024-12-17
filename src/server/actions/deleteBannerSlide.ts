"use server";

import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

export async function deleteBannerSlide(data: { id: string }) {
  try {
    const user = await getJWTUser();
    if (!([Role.KOKO, Role.ADMIN] as Role[]).includes(user.role))
      throw new Error("Unauthorized");

    const banner = await db.banner_slide.findUnique({
      where: { id: data.id },
      include: { info_slide: true, album_slide: true },
    });

    if (!banner) throw new Error("Banner not found");

    // Start a transaction to delete related slides and the banner
    await db.$transaction(async (tx) => {
      // Delete info_slide if exists
      if (banner.info_slide) {
        await tx.info_slide.delete({
          where: { id: banner.info_slide.id },
        });
      }

      // Delete album_slide if exists
      if (banner.album_slide) {
        await tx.album_slide.delete({
          where: { id: banner.album_slide.id },
        });
      }

      // Delete the banner_slide
      await tx.banner_slide.delete({
        where: { id: data.id },
      });
    });

    revalidatePath("/staff/manage/admin/banner-list");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete banner:", error);
    return { success: false, error };
  }
}
