"use server";

import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export async function resetMetrics(id: string) {
  await db.link_tree.update({
    where: { id },
    data: {
      last_reset_at: new Date(),
    },
  });
  revalidatePath("/staff/manage/admin/link-tree-list");
}
