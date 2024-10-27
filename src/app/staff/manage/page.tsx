import { LogoutBtnClient } from "@/app/_components/client/LogoutBtn.client";
import Group from "@/app/_components/layouts/Group.layout";
import Stack from "@/app/_components/layouts/Stack.layout";
import LabelCard from "@/app/_components/molecules/LabelCard.molecule";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/shadcn/Card.shadcn";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { Role } from "@prisma/client";
import Link from "next/link";

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
          <Stack className="w-full gap-4 sm:max-w-[300px]">
            {user.role === Role.KOKO && (
              <Button asChild>
                <Link href="/staff/manage/koko">Koko&apos;s dashboard</Link>
              </Button>
            )}
            {([Role.ADMIN, Role.KOKO] as Role[]).includes(user.role) && (
              <>
                <Button asChild>
                  <Link href="/staff/manage/admin">Admin dashboard</Link>
                </Button>
              </>
            )}
            {([Role.ADMIN, Role.KOKO, Role.EVENT_MANAGER] as Role[]).includes(
              user.role,
            ) && (
              <>
                <Button asChild>
                  <Link href="/staff/manage/event">Manage Events</Link>
                </Button>
              </>
            )}
            <Button asChild>
              <Link href="/staff/manage/scan">Scan Ticket</Link>
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
