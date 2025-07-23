"use server";

import { db } from "@/server/db";
import { formatCustomQRUrl } from "./formatCustomQRUrl";

export const getAllCustomQRs = async (organization_id: string) => {
  const customQRs = await db.custom_qr_code.findMany({
    where: {
      organization_id,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return customQRs.map((customQR) => ({
    ...customQR,
    qr_contents: formatCustomQRUrl(customQR.id, organization_id),
  }));
};
