import Stack from "@/app/_components/layouts/Stack.layout";
import { LinkList } from "./table";
import { db } from "@/server/db";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";
import { isAdminOrAbove } from "@/server/auth/roleGates";

const getLinks = async () => {
  const user = await isAdminOrAbove();

  const links = await db.link.findMany({
    where: {
      organization_id: user.organization_id,
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
