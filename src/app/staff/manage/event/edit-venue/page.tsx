import { redirect } from "next/navigation";

export default function EditVenuePage() {
  redirect("/staff/manage/event");
  return null;
}
