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

export default function ValidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack className="min-h-[400px] gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Group className="align-between w-full justify-between">
              <p>Ticket Validation</p>
              <Button asChild>
                <Link href="/staff/manage">To management</Link>
              </Button>
            </Group>
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </Stack>
  );
}
