import Stack from "@/app/_components/layouts/Stack.layout";
import { OrgTable } from "./table";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";
import { getAllOrgs } from "@/server/actions/org";

export default async function OrgList() {
  const data = await getAllOrgs();
  return (
    <Stack className="gap-4">
      <Group className="align-between w-full justify-between">
        <h2 className="text-xl font-semibold">Organization List</h2>
        <Button asChild>
          <Link href="/staff/manage/koko/add-org">Add</Link>
        </Button>
      </Group>
      <OrgTable data={data} />
    </Stack>
  );
}
