"use server";

import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export const resetCustomQRVisits = async (id: string, organization_id: string) => {
  const result = await db.custom_qr_code.update({
    where: {
      id,
      organization_id, // Ensure user can only reset QRs from their org
    },
    data: {
      visit_count: 0,
      last_visited_at: null,
    },
  });
  
  revalidatePath("/staff/manage/admin/custom-qr-list");
  return result;
}; 