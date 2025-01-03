"use client";
import Group from "@/app/_components/layouts/Group.layout";
import Stack from "@/app/_components/layouts/Stack.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/shadcn/Card.shadcn";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function KokoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Stack className="min-h-[400px] gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Group className="align-between w-full justify-between">
              <p>Koko&apos;s area</p>
              {pathname !== "/staff/manage/koko" ? (
                <Button
                  onClick={() =>
                    pathname
                      ? router.push(pathname.split("/").slice(0, -1).join("/"))
                      : router.back()
                  }
                >
                  Go back
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/staff/manage">Back to management</Link>
                </Button>
              )}
            </Group>
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </Stack>
  );
}
