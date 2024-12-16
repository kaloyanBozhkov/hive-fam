import Stack from "@/app/_components/layouts/Stack.layout";
import { LinkList } from "./table";
import { db } from "@/server/db";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { Role } from "@prisma/client";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";

const getLinks = async () => {
  const user = await getJWTUser();
  if (!([Role.ADMIN, Role.KOKO] as Role[]).includes(user.role))
    throw Error("Unauthorized");

  const links = await db.link.findMany({
    where: {
      organizationId: user.organization_id,
    },
  });
  return links;
};

export default async function LinkListPage() {
  const data = await getLinks();
  return (
    <Stack className="gap-4">
      <Group className="align-between w-full justify-between">
        <h2 className="text-xl font-semibold">Organization Links</h2>
        <Button asChild>
          <Link href="/staff/manage/admin/add-link">Add Link</Link>
        </Button>
      </Group>
      <LinkList data={data} />
    </Stack>
  );
}
