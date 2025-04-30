import { db } from "@/server/db";
import { redirect } from "next/navigation";
import ChatInterface from "@/app/_components/organisms/chat/ChatInterface";
import { isRoleManagerOrAbove } from "@/server/auth/roleGates";
import { getUserRole } from "@/server/auth/getJWTUser";
import Stack from "@/app/_components/layouts/Stack.layout";
import {
  Card,
  CardHeader,
  CardFooter,
} from "@/app/_components/shadcn/Card.shadcn";
import Group from "@/app/_components/layouts/Group.layout";

const getEventWithChatRoom = async (eventId: string) => {
  const event = await db.event.findFirstOrThrow({
    where: {
      id: eventId,
      deleted_at: null,
    },
    include: {
      chat_messages: {
        where: {
          is_deleted: false,
        },
        orderBy: {
          created_at: "asc",
        },
      },
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
  }

  const isActive = isEventActive(event);
  const canApproveMessages = await new Promise<boolean>((res) => {
    try {
      void getUserRole().then((userRole) => {
        if (userRole) {
          isRoleManagerOrAbove(userRole);
          res(true);
        } else {
          res(false);
        }
      });
    } catch (err) {
      res(false);
    }
  });

  return (
    <Stack className="w-full gap-4">
      <Card className="w-full bg-white">
        <CardHeader>
          <Stack className="items-start">
            {!isActive && (
              <p className="text-sm text-amber-600">Event not active yet.</p>
            )}
            <h1 className="text-xl font-bold">{event.title}</h1>
          </Stack>
        </CardHeader>
      </Card>
      <ChatInterface
        eventId={eventId}
        initialMessages={event.chat_messages}
        canApproveMessages={canApproveMessages}
      />
    </Stack>
  );
}
