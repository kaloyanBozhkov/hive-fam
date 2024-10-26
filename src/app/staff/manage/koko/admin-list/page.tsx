import Stack from "@/app/_components/layouts/Stack.layout";
import { AdminTable } from "./table";
import { db } from "@/server/db";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";
import { Role } from "@prisma/client";

const getAdmins = async () => {
  const admins = await db.staff.findMany({
    where: {
      role: Role.ADMIN,
    },
    include: {
      organization: {
        select: {
          name: true,
        },
      },
    },
  });
  return admins;
};

export default async function AdminList() {
  const data = await getAdmins();
  return (
    <Stack className="gap-4">
      <Group className="align-between w-full justify-between">
        <h2 className="text-xl font-semibold">Admin List</h2>
        <Button asChild>
          <Link href="/staff/manage/koko/add-admin">Add</Link>
        </Button>
      </Group>
      <AdminTable data={data} />
    </Stack>
  );
}
