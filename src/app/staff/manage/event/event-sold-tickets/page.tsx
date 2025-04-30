import { redirect } from "next/navigation";

export default function EventSoldTicketsPage() {
  redirect("/staff/manage/event/event-list");
  return null;
}
