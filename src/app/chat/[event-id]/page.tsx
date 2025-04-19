import { db } from "@/server/db";
import { redirect } from "next/navigation";

const getEventWithChatRoom = async (eventId: string) => {
  const event = await db.event.findFirstOrThrow({
    where: {
      id: eventId,
      deleted_at: null,
    },
    include: {
      chat_messages: true,
    },
  });

  return event;
};

const isEventActive = (
  event: Awaited<ReturnType<typeof getEventWithChatRoom>>,
) => {
  const now = new Date();
  const endDate =
    event.end_date ?? new Date(event.date.getTime() + 12 * 60 * 60 * 1000); // +12 hours if no end date

  return now >= event.date && now <= endDate;
};

export default async function EventChatPage({
  params,
}: {
  params: Promise<{ "event-id": string }>;
}) {
  const { "event-id": eventId } = await params;

  let event;
  try {
    event = await getEventWithChatRoom(eventId);
  } catch (err) {
    console.warn(err);
    redirect("/");
    return;
  }

  if (!isEventActive(event)) {
    redirect("/");
    return;
  }
}
