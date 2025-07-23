"use server";

import { db } from "@/server/db";

export const updateCustomQR = async (
  id: string,
  description: string,
  forward_to_url: string,
  organization_id: string,
) => {
  return db.custom_qr_code.update({
    where: {
      id,
      organization_id, // Ensure user can only update QRs from their org
    },
    data: {
      description,
      forward_to_url,
    },
  });
};
