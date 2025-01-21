import { db } from "@/server/db";
import { redirect, RedirectType } from "next/navigation";
import { headers } from "next/headers";

export default async function VisitTreeLinkPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  let to = "/links";

  try {
    if (!id) redirect("/links");
    const headersList = await headers();
    const ip_address = headersList.get("x-forwarded-for") ?? "";
    const user_agent = headersList.get("user-agent") ?? "";
    const referrer = headersList.get("referer") ?? "";
    await db.link_tree_visit.create({
      data: {
        link_tree_id: id,
        ip_address,
        user_agent,
        referrer,
      },
    });

    const { url } = await db.link_tree.findUniqueOrThrow({
      where: { id },
      select: { url: true },
    });
    to = url;
  } catch (error) {
    console.log(JSON.stringify(error));
  }

  redirect(to, RedirectType.replace);
}
