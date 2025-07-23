"use server";

import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export const deleteCustomQR = async (id: string, organization_id: string) => {
  const result = await db.custom_qr_code.delete({
    where: {
      id,
      organization_id, // Ensure user can only delete QRs from their org
    },
  });
  
  revalidatePath("/staff/manage/admin/custom-qr-list");
  return result;
};
