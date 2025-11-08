"use client";
import React, { Fragment, useEffect, useState } from "react";
import SignUpParticipant, { ParticipantData } from "../user/SignUpParticipant";
import { event as Eventt, MediaType, venue as Venuee } from "@prisma/client";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/_components/shadcn/Card.shadcn";
import Stack from "@/app/_components/layouts/Stack.layout";
import { EventInfoCard } from "@/app/_components/molecules/EventInfoCard.molecule";
import { S3Service } from "@/utils/s3/service";
import {
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/app/_components/shadcn/Carousel.shadcn";
import { Carousel } from "@/app/_components/shadcn/Carousel.shadcn";
import SlideDots from "@/app/_components/atoms/SlideDots.atom";
import { useToast } from "@/app/hooks/shadcn/useToast.shadcn";

type Event = Eventt & {
  venue: Venuee;
  poster_media: {
    bucket_path: string;
    type: MediaType;
  }[];
};

type EventContestantSignUpProps = {
  event: Event;
  onSignUp: (data: ParticipantData) => Promise<"success" | "failed">;
  successMessage?: string;
};

export const EventContestantSignUp = ({
  event,
  onSignUp,
  successMessage = "",
}: EventContestantSignUpProps) => {
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);
  const [isErrorSignup, setIsErrorSignup] = useState<boolean>(false);
  const [active, setActive] = useState(0);
  const { toast } = useToast();

  const handleSignUp = (data: ParticipantData) => {
    onSignUp({
      ...data,
      custom_payload: {
        event_id: event.id,
        ...(data.custom_payload as Record<string, string>),
      },
    })
      .then((result) => {
        if (result === "success") {
          setIsSignedUp(true);
        } else {
          setIsSignedUp(false);
          setIsErrorSignup(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsErrorSignup(true);
      });
  };

  useEffect(() => {
    if (isErrorSignup) {
      toast({
        title: "Could not sign you up",
        description:
          "Either you are already signed up with this email, or there was an error.",
      });
      setIsErrorSignup(false);
    }
  }, [isErrorSignup, toast]);

  if (isSignedUp) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="pt-0">
            You submitted your details sucessfully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Stack className="gap-y-4">
            <p>{successMessage}</p>
            <p>We will reach out to you soon.</p>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="flex flex-row justify-start gap-4 py-6 align-top md:p-8 -sm:px-2">
        <Stack className="w-[500px] gap-y-4 -md:hidden">
          <EventInfoCard
            className="flex-col items-start"
            eventName={event.title}
            eventDate={event.date}
            eventEndDate={event.end_date}
            eventLocation={event.venue.street_addr}
            eventTimeZone={event.time_zone}
          />
          {event.poster_media.length > 0 && (
            <Stack className="relative gap-3">
              <Carousel
                onSlideChanged={setActive}
                currentSlide={active}
                opts={{ duration: 50, loop: true }}
                className="w-full overflow-hidden rounded-md"
              >
                <CarouselContent className="h-full w-full">
                  {event.poster_media.map((media, index) => {
                    const url = S3Service.getFileUrlFromFullPath(
                      media.bucket_path,
                    );
                    return (
                      <CarouselItem key={index} className="h-full">
                        {media.type === MediaType.IMAGE ? (
                          <img
                            src={url}
                            className="h-auto min-h-[150px] w-full bg-loading-img transition-all"
                          />
                        ) : media.type === MediaType.VIDEO ? (
                          <video
                            className="h-auto min-h-[150px] w-full bg-loading-img transition-all"
                            autoPlay
                            loop
                            muted
                            controls
                          >
                            <source src={url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                {event.poster_media.length > 1 && (
                  <Fragment key="carousel-controls">
                    <CarouselPrevious className="absolute left-[20px] z-10 -xs:hidden" />
                    <CarouselNext className="absolute right-[20px] z-10 -xs:hidden" />
                  </Fragment>
                )}
              </Carousel>
              {event.poster_media.length > 1 && (
                <SlideDots
                  count={event.poster_media.length}
                  active={active}
                  onClick={setActive}
                  modifier="black"
                />
              )}
            </Stack>
          )}
        </Stack>
        <Stack>
          <CardHeader>
            <CardTitle>
              Fill in these fields and we&apos;ll get in touch with you for next
              steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Stack className="gap-y-4">
              <SignUpParticipant
                onSignUp={handleSignUp}
                customPayload={{ event_id: event.id }}
              />
            </Stack>
          </CardContent>
        </Stack>
      </div>
    </Card>
  );
};
