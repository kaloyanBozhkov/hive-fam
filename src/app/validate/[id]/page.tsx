import Stack from "@/app/_components/layouts/Stack.layout";
import InfoLineCard from "@/app/_components/molecules/InfoLineCard";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { db } from "@/server/db";
import { format } from "date-fns";
import { redirect } from "next/navigation";

const validateTicket = async (ticketId: string) => {
  let ticket = await db.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  if (!ticket) return redirect("/");

  const user = await getJWTUser();
  if (!user.isStaff) return redirect(`/event/${ticket.event.id}`);

  const alreadyScanned = ticket.scanned;

  if (!ticket.scanned)
    ticket = await db.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        scanned: true,
        scanned_at: new Date(),
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

  return {
    ...ticket,
    alreadyScanned,
  };
};

export default async function ValidateTicket({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await (params as unknown as Promise<{ id: string }>);
  const ticket = await validateTicket(id);
  return (
    <Stack className="min-h-[400px] gap-4">
      <InfoLineCard title="Ticket" label="Validated" />
      <InfoLineCard
        title="Already Scanned"
        label={ticket.alreadyScanned ? "Yes" : "No"}
      />
      {ticket.alreadyScanned && (
        <InfoLineCard
          title="Validated At"
          label={ticket.scanned_at ? format(ticket.scanned_at, "PPpp") : ""}
        />
      )}
      <InfoLineCard title="Event" label={ticket.event.title} />
    </Stack>
  );
}
