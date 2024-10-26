import Stack from "@/app/_components/layouts/Stack.layout";
import { StaffList } from "./table";
import { db } from "@/server/db";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { Role } from "@prisma/client";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";

const getStaff = async () => {
  const user = await getJWTUser();
  const staff = await db.staff.findMany({
    where: {
      organization_id: user.organization_id,
      role: {
        not: Role.KOKO,
      },
    },
  });
  return staff;
};

export default async function StaffListPage() {
  const data = await getStaff();
  return (
    <Stack className="gap-4">
      <Group className="align-between w-full justify-between">
        <h2 className="text-xl font-semibold">Staff List</h2>
        <Button asChild>
          <Link href="/staff/manage/admin/add-staff">Add staff</Link>
        </Button>
      </Group>
      <StaffList data={data} />
    </Stack>
  );
}
