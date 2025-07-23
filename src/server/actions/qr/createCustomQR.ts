"use server";

import { db } from "@/server/db";

export const createCustomQR = async (
  description: string,
  forward_to_url: string,
  organization_id: string,
) => {
  return db.custom_qr_code.create({
    data: {
      description,
      forward_to_url,
      organization_id,
    },
  });
};
