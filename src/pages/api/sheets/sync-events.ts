import { type NextRequest, NextResponse } from "next/server";
import type { NextFetchEvent } from "next/server";
import { z } from "zod";
import {
  fetchPostJSON,
  getBaseUrl,
  getCoverImgFileNameFromEventTitle,
} from "@/utils/common";
import EVENTS from "@/automated/events.json";

const SyncEventsSchema = z.object({
  secret: z.string().optional(),
  events: z.array(
    z.object({
      date: z.string(),
      time: z.string(),
      title: z.string(),
      description: z.string(),
      location: z.string(),
      cover: z.string(),
      link: z.string(),
      price: z.string(),
      venue: z.string(),
      drivePhotos: z.string(),
    }),
  ),
});

export const config = {
  runtime: "edge",
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
    maxDuration: 10,
  },
};

type SyncCurrenciesPayload = (typeof SyncEventsSchema)["_output"];

export default async function syncEventsServerless(
  req: NextRequest,
  event: NextFetchEvent,
) {
  const oops = () =>
    NextResponse.json(
      { error: "Something went wrong" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  if (req.method !== "POST" || !req.body) return oops();

  try {
    const input = await req.body.getReader().read(),
      decoder = new TextDecoder(),
      string = decoder.decode(input.value),
      payload = JSON.parse(string) as SyncCurrenciesPayload,
      { secret, events } = SyncEventsSchema.parse(payload);

    if (!secret || secret !== process.env.SENSITIVE_CRUD_SECRET) return oops();

    event.waitUntil(
      (async () => {
        try {
          const eventsPolished = events.map(({ cover, ...rest }) => ({
            ...rest,
            cover: cover.trim(),
          }));

          const resp = await fetchPostJSON<{ success: boolean }>(
            `${getBaseUrl()}/api/github/update-file`,
            {
              filePath: "src/automated/events.json",
              contents: JSON.stringify(eventsPolished),
              secret: process.env.SENSITIVE_CRUD_SECRET,
            },
          );

          if (!("success" in resp)) {
            console.error({
              statusCode: 500,
              message: "Could not update events JSON file properly",
            });

            // @TODO add emailing
            // return await fetchPostJSON(`${getBaseUrl(false)}/api/email/issue`, {
            //   secret: process.env.SENSITIVE_CRUD_SECRET,
            //   msg: "Could not update JSON file properly",
            //   summary: "Update file Issue",
            // });
            return;
          }

          console.log("Starting to save cover images");

          const existingEventCoverImgUrls = EVENTS.map(({ cover }) => cover);

          // get only new events' images
          const eventsWithNewCovers = events.filter(
            // rm
            ({ cover }) => true || !existingEventCoverImgUrls.includes(cover),
          );

          if (eventsWithNewCovers.length > 0) {
            const coverImagesToSave = eventsWithNewCovers.reduce(
              (acc, { cover, title }) => ({
                ...acc,
                [getCoverImgFileNameFromEventTitle(title)]: cover,
              }),
              {},
            );

            const resp = await fetchPostJSON<{ success: boolean }>(
              `${getBaseUrl()}/api/github/update-images`,
              {
                imgUrls: coverImagesToSave,
                secret: process.env.SENSITIVE_CRUD_SECRET,
              },
            );

            if (!("success" in resp)) {
              console.error({
                statusCode: 500,
                message: "Could not update event covers JSON properly",
              });

              return;
            }

            console.log("Saved cover images to disk, gonna commit");
          } else {
            console.log(
              "No covers to update as no new events or no updated covers",
            );
          }

          console.log("sync-events serverless completed successfully");
        } catch (err) {
          console.error("sync-currencies serverless operation failed", err);
          await fetchPostJSON(`${getBaseUrl(false)}/api/email/issue`, {
            secret: process.env.SENSITIVE_CRUD_SECRET,
            msg: "Could not update events JSON file properly",
            summary: "Events Sync Issue",
          });
        }
      })(),
    );

    return NextResponse.json(
      {
        status: "started",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error("sync-events serverless", err);
    oops();
  }
}
