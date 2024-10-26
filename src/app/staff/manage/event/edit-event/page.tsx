import { redirect } from "next/navigation";

export default function EditEventPage() {
  redirect("/staff/manage/event");
  return null;
}
