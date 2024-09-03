import { isAuthed } from "@/server/auth/isStaff";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  if (isAuthed()) redirect("/staff/manage");
  redirect("/staff/login");
}
