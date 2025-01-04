import { LogoutBtnClient } from "@/app/_components/client/LogoutBtn.client";
import Group from "@/app/_components/layouts/Group.layout";
import Stack from "@/app/_components/layouts/Stack.layout";
import { StaffNav } from "@/app/_components/organisms/StaffNav.organism";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/shadcn/Card.shadcn";
import { getJWTUser } from "@/server/auth/getJWTUser";

export default async function Manage() {
  const user = await getJWTUser();
  return (
    <Stack className="min-h-[400px] gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle>
            <Group className="align-between w-full justify-between">
              <Stack className="gap-2">
                <p className="text-xl">Welcome, {user.name}</p>
                <p className="text-sm">
                  Role: <b>{user.role}</b>
                </p>
              </Stack>
              <Group>
                <LogoutBtnClient />
              </Group>
            </Group>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StaffNav userRole={user.role} variant="default" />
        </CardContent>
      </Card>
    </Stack>
  );
}
