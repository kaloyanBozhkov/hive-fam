import { redirect } from "next/navigation";
import { setCookie } from "@/server/actions/org";
import { type NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await setCookie(id);
  return redirect("/");
}
