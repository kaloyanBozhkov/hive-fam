import { LogoutBtnClient } from "@/app/_components/client/LogoutBtn.client";
import Group from "@/app/_components/layouts/Group.layout";
import Stack from "@/app/_components/layouts/Stack.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/shadcn/Card.shadcn";
import { AUTH_COOKIE_NAME } from "@/server/auth/constants";
import { isAuthed } from "@/server/auth/isStaff";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Manage() {
  if (!isAuthed()) redirect("/staff/login");

  return (
    <Stack className="min-h-[400px] gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle>
            <Group className="align-between w-full justify-between">
              <p>Welcome, {cookies().get(AUTH_COOKIE_NAME)?.value}</p>
              <LogoutBtnClient />
            </Group>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p></p>
        </CardContent>
      </Card>
    </Stack>
  );
}
