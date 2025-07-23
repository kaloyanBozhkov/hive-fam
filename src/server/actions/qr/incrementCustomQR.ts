"use server";

import { db } from "@/server/db";

export const incrementCustomQR = async (id: string) => {
  return db.custom_qr_code.update({
    where: { id },
    data: {
      visit_count: { increment: 1 },
      last_visited_at: new Date(),
    },
  });
};
