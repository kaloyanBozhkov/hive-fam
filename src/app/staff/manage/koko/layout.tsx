import Group from "@/app/_components/layouts/Group.layout";
import Stack from "@/app/_components/layouts/Stack.layout";
import { GoBack } from "@/app/_components/molecules/specific/GoBack.molecule";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/shadcn/Card.shadcn";

export default function KokoLayout({
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
              <p>Koko&apos;s area</p>
              <GoBack />
            </Group>
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </Stack>
  );
}
