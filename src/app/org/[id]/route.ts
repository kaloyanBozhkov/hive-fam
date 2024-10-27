import { redirect } from "next/navigation";
import { setCookie } from "@/server/actions/org";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  await setCookie(id);
  return redirect("/");
}
