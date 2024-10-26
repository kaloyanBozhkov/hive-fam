import Stack from "@/app/_components/layouts/Stack.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app//_components/shadcn/Card.shadcn";
import LoginForm from "@/app//_components/organisms/forms/Login.form";
import { signIn } from "@/server/actions/auth";

export default async function Staff() {
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
