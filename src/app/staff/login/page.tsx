import Stack from "@/app/_components/layouts/Stack.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app//_components/shadcn/Card.shadcn";
import { redirect } from "next/navigation";
import LoginForm from "@/app//_components/organisms/forms/Login.form";
import { signIn } from "@/server/auth/server-actions";
import { isAuthed } from "@/server/auth/isStaff";

export default async function Staff() {
  if (isAuthed()) redirect("/staff/manage");

  return (
    <Stack className="min-h-[400px] gap-4">
      <Card className="m-auto w-[clamp(200px,90vw,600px)]">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm onLogin={signIn} />
        </CardContent>
      </Card>
    </Stack>
  );
}
