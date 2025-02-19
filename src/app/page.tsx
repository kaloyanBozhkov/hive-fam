import Stack from "@/app/_components/layouts/Stack.layout";

import EventsList from "@/app/_components/organisms/EventsList.organism";
import LandingBanner from "@/app/_components/molecules/LandingBanner.molecule";
import { db } from "@/server/db";
import { getOrgId } from "@/server/actions/org";
import { BannerWrapper } from "./_components/templates/BannerWrapper.template";

const getEvents = async (orgId: string) => {
  const events = await db.event.findMany({
    include: {
      venue: true,
      ticket_types: {
        orderBy: {
          created_at: "asc",
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
    where: {
      is_published: true,
      organization_id: orgId,
    },
  });

  const getSoldTicketsOfType = (
    soldTickets: { ticket_type_id: string | null }[],
    ticketTypeId: string,
  ) => {
    return soldTickets.filter((st) => st.ticket_type_id === ticketTypeId)
      .length;
  };

  return events.map(
    ({ poster_media, ticket_types, sold_tickets, ...event }) => ({
      ...event,
      poster_media: poster_media.map((pm) => ({
        bucket_path: pm.media.bucket_path,
        type: pm.media.media_type,
      })),
      ticket_types: ticket_types.map((tt) => ({
        ...tt,
        is_sold_out:
          tt.available_tickets_of_type <=
          getSoldTicketsOfType(sold_tickets, tt.id),
      })),
    }),
  );
};

export default async function Home() {
  const orgId = await getOrgId();
  const events = await getEvents(orgId);

  return (
    <>
      <BannerWrapper>
        <LandingBanner />
      </BannerWrapper>
      <Stack className="mt-2 min-h-[400px] gap-4 px-[10px]">
        <EventsList events={events} />
      </Stack>
    </>
  );
}
