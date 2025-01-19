import { redirect } from "next/navigation";

export default function EventMetricsPage() {
  redirect("/staff/manage/event");
  return null;
}
