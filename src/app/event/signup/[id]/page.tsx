import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import { RapBattleParticipantSignUp } from "@/app/_components/organisms/forms/specific/RapBattleParticipantSignUp";

const getEvent = async (id: string) => {
  const { poster_media, ...event } = await db.event.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      venue: true,
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

  return {
    poster_media: poster_media.map((pm) => ({
      bucket_path: pm.media.bucket_path,
      type: pm.media.media_type,
    })),
    ...event,
  };
};

const addParticipant = async (data: {
  event_id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  country: string;
  custom_payload: string;
}) => {
  await db.event_contestant.create({
    data: {
      event_id: data.event_id,
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      country: data.country,
      custom_payload: data.custom_payload,
    },
  });
};

export default async function SignupEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
      <Stack className="mx-auto min-h-[400px] w-full gap-4">
        <RapBattleParticipantSignUp
          event={event}
          onSignUp={async (data) => {
            "use server";
            try {
              await addParticipant({
                ...data,
                event_id: event.id,
                custom_payload: JSON.stringify(data.custom_payload),
              });
              return "success";
            } catch (err) {
              return "failed";
            }
          }}
        />
        <Button variant="outline">
          <Link href="/">Back To Home</Link>
        </Button>
      </Stack>
    </>
  );
}
