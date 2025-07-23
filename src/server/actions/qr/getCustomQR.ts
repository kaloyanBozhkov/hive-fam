"use server";

import { db } from "@/server/db";

export const getCustomQR = async (id: string) => {
  return db.custom_qr_code.findUnique({
    where: {
      id,
    },
  });
};
