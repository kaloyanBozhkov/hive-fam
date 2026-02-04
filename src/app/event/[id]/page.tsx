import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import FullScreenEvent from "@/app/_components/organisms/FullScreenEvent.organism";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import { isPastEvent } from "@/utils/specific";
import { calcualteTicketPrice } from "@/utils/pricing";
import assert from "assert";
import { REVALIDATE } from "@/server/config";

export const revalidate = REVALIDATE.EVENT_PAGE;

const getEvent = async (id: string) => {
  const { poster_media, ticket_types, sold_tickets, organization, ...event } =
    await db.event.findFirstOrThrow({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        organization: {
          select: {
            tax_percentage: true,
            tax_calculation_type: true,
          },
        },
        venue: true,
        ticket_types: {
          orderBy: {
            price: "asc",
          },
        },
        sold_tickets: {
          select: {
            ticket_type_id: true,
          },
        },
        poster_media: {
          select: {
            order: true,
            media: {
              select: {
                bucket_path: true,
                media_type: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

  const getSoldTicketsOfType = (
    soldTickets: { ticket_type_id: string | null }[],
    ticketTypeId: string,
  ) => {
    return soldTickets.filter((st) => st.ticket_type_id === ticketTypeId)
      .length;
  };

  assert(event, "Event not found");
  assert(organization, "Event organization not found");

  return {
    poster_media: poster_media.map((pm) => ({
      bucket_path: pm.media.bucket_path,
      type: pm.media.media_type,
    })),
    ticket_types: ticket_types.map((tt) => ({
      ...tt,
      price: calcualteTicketPrice(
        tt.price,
        organization.tax_percentage,
        organization.tax_calculation_type,
      ),
      is_sold_out:
        tt.available_tickets_of_type <=
        getSoldTicketsOfType(sold_tickets, tt.id),
    })),
    ...event,
  };
};

export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ as: "view" }>;
}) {
  const { id } = await params;
  const { as } = await searchParams;

  let event: Awaited<ReturnType<typeof getEvent>>;

  try {
    event = await getEvent(id);
  } catch (err) {
    console.warn(err);
    redirect("/");
    return;
  }

  if (!event) redirect("/");

  return (
    <>
      <Stack className="m-auto min-h-[400px] w-full max-w-[500px] gap-4">
        <FullScreenEvent
          event={event}
          isPast={isPastEvent(event)}
          isView={as === "view"}
        />
        <Button variant="outline">
          <Link href="/">Back To Home</Link>
        </Button>
      </Stack>
    </>
  );
}
