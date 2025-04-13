import { redirect } from "next/navigation";

export default function EventMetricsPage() {
  redirect("/staff/manage/event/event-list");
  return null;
}
