import Stack from "@/app/_components/layouts/Stack.layout";
import { EventParticipantsTable } from "./table";
import { db } from "@/server/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Link2 } from "lucide-react";

const deleteParticipant = async (id: string) => {
  "use server";

  await db.event_contestant.delete({
    where: { id },
  });
};

const approveParticipant = async (id: string, approved: boolean) => {
  "use server";

  await db.event_contestant.update({
    where: { id },
    data: {
      approved,
    },
  });
};

export default async function EventParticipantsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const event = await db.event.findUnique({
    where: { id, deleted_at: null },
    include: {
      contestants: {
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const refresh = async () => {
    "use server";
    revalidatePath(`/staff/manage/event/event-participants/${id}`);
  };

  return (
    <Stack className="container mx-auto gap-2 py-10">
      <h1 className="text-2xl font-bold">Event Participants</h1>
      <p>
        To start collecting participants for an event you must go to{" "}
        <Link
          href="/staff/manage/admin/banner-list"
          target="_blank"
          className="text-blue-500"
        >
          <Link2 className="inline-block" size={14} /> Banner List
        </Link>{" "}
        and setup a sign up <b>Action Participants for Event</b>.
      </p>
      <EventParticipantsTable
        data={event.contestants}
        deleteParticipant={deleteParticipant}
        approveParticipant={approveParticipant}
        onRefresh={refresh}
      />
    </Stack>
  );
}
