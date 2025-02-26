"use client";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import SignUpParticipant, { ParticipantData } from "../user/SignUpParticipant";
import { event as Eventt, MediaType, venue as Venuee } from "@prisma/client";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/_components/shadcn/Card.shadcn";
import Stack from "@/app/_components/layouts/Stack.layout";
import { Edit, Mic2 } from "lucide-react";
import { FormLabel } from "@/app/_components/shadcn/Form.shadcn";
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
import { Textarea } from "@/app/_components/shadcn/Textarea.shadcn";
import { useToast } from "@/app/hooks/shadcn/useToast.shadcn";

type Event = Eventt & {
  venue: Venuee;
  poster_media: {
    bucket_path: string;
    type: MediaType;
  }[];
};

export const RapBattleParticipantSignUp = ({
  event,
  onSignUp,
}: {
  event: Event;
  onSignUp: (data: ParticipantData) => Promise<"success" | "failed">;
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    window.location.href.includes("RapBattle") ? "Rap Battle" : "Free Style",
  );
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);
  const [isErrorSignup, setIsErrorSignup] = useState<boolean>(false);
  const [active, setActive] = useState(0);
  const [optionalText, setOptionalText] = useState("");
  const { toast } = useToast();
  const customPayload = useMemo(() => {
    return {
      event_id: event.id,
      selected_option: selectedOption,
    };
  }, [event.id, selectedOption]);

  const handleSignUp = (data: ParticipantData) => {
    onSignUp({
      ...data,
      custom_payload: {
        ...(data.custom_payload as Record<string, string>),
        special_requests: optionalText,
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

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
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

  useEffect(() => {
    if (window.location.href.includes("RapBattle")) {
      setSelectedOption("Rap Battle");
    }
  }, []);

  const RapBattleNotes = (
    <Stack className="gap-y-4">
      {!isSignedUp && (
        <Stack className="mb-4 gap-6">
          <hr />
          <Stack className="gap-2">
            <p>Special Requests (optional):</p>
            <Textarea
              placeholder="If you want to request songs for one or all rounds, you can provide website links pointing to youtube videos, or any other requests in here."
              value={optionalText}
              onChange={(e) => setOptionalText(e.target.value)}
            />
          </Stack>
          <hr />
        </Stack>
      )}
      <RapBattleRulesList />
    </Stack>
  );

  if (isSignedUp) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="pt-0">Well done!</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack className="gap-y-4">
            <p>
              {`You've successfully signed up! We'll get in touch if there's
              anything.`}
            </p>
            <p>
              See you on the {format(event.date, "MMMM d, yyyy HH:mm")}!<br />
              {event.venue.name} - {event.venue.street_addr} {event.venue.city}
            </p>
            {selectedOption === "Rap Battle" && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h2>
                      Here are the rules again, just in case you need them.
                    </h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">{RapBattleNotes}</CardContent>
              </Card>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const RapType = (
    <Stack className="gap-y-4">
      <FormLabel>Select The Battle You Want To Participate In:</FormLabel>
      <div className="flex gap-4 -sm:flex-col -sm:justify-stretch">
        <Card
          onClick={() => handleOptionSelect("Free Style")}
          className={`cursor-pointer transition-transform duration-300 ${selectedOption === "Free Style" ? "border-2 border-primary" : "hover:bg-gray-100"}`}
        >
          <CardHeader>
            <CardTitle>Free Style</CardTitle>
            <CardDescription>
              Unleash your creativity in freestyle mode.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Mic2 />
          </CardContent>
        </Card>
        <Card
          onClick={() => handleOptionSelect("Rap Battle")}
          className={`cursor-pointer transition-transform duration-300 ${selectedOption === "Rap Battle" ? "border-2 border-primary" : "hover:bg-gray-100"}`}
        >
          <CardHeader>
            <CardTitle>Rap Battle</CardTitle>
            <CardDescription>
              Write and plan your rap performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Edit />
          </CardContent>
        </Card>
      </div>
    </Stack>
  );

  const FreeStyleNotes = (
    <Stack className="gap-y-4">
      <h1>What you can expect from the Freestyle Battle:</h1>
      <p>
        You will compete against 12 other participants.
        <br />
        <br />
        The winner takes 500 BGN.
        <br />
        <br />
      </p>
      {Judges}
    </Stack>
  );

  return (
    <Card className="w-full">
      <div className="flex flex-row justify-start gap-4 py-6 align-top md:p-8 -sm:px-2">
        <Stack className="w-[500px] gap-y-4 -md:hidden">
          <EventInfoCard
            eventName={event.title}
            eventDate={event.date}
            eventEndDate={event.end_date}
            eventLocation={event.venue.street_addr}
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
            <CardTitle>Let&apos;s get you signed up!</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack className="gap-y-4">
              <SignUpParticipant
                onSignUp={handleSignUp}
                customPayload={customPayload}
              >
                {RapType}
                <hr />
                {selectedOption === "Free Style" && FreeStyleNotes}
                {selectedOption === "Rap Battle" && RapBattleNotes}
                <hr />
              </SignUpParticipant>
            </Stack>
          </CardContent>
        </Stack>
      </div>
    </Card>
  );
};

export const Judges = (
  <>
    <p>Our judges will be:</p>
    <ul className="list-disc pl-5">
      <li>
        <p className="notranslate">
          Homelesz (
          <a
            href="https://www.instagram.com/homelesz/"
            className="text-blue-500"
          >
            @homelesz
          </a>
          )
        </p>
      </li>
      <li>
        <p className="notranslate">
          L!R! (
          <a
            href="https://www.instagram.com/lirina4biri/"
            className="text-blue-500"
          >
            @lirina4biri
          </a>
          )
        </p>
      </li>
      <li>
        <p className="notranslate">
          Иван Алексиев (
          <a
            href="https://www.instagram.com/vantka.vantka/"
            className="text-blue-500"
          >
            @vantka.vantka
          </a>
          )
        </p>
      </li>
      <li>
        <p>The crowd</p>
      </li>
    </ul>
  </>
);

export const RapBattleRulesList = () => {
  return (
    <>
      <h1>You must prepare verses on these topics:</h1>
      <Stack className="gap-y-1">
        <span className="font-semibold">Topic for Round 1:</span>
        <p>{`"Rise & Grind" – A story of ambition, struggle, and success.`}</p>
        <p>Duration: 1 minute</p>
      </Stack>
      <Stack className="gap-y-1">
        <span className="font-semibold">Topic for Round 2:</span>
        <p>{`"Government & Corruption" – The reality of the Bulgarian government and its corruption.`}</p>
        <p>Duration: 1 minute</p>
      </Stack>
      <Stack className="gap-y-1">
        <span className="font-semibold">Topic for Round 3:</span>
        <p>
          {`"Bulgaria's Pulse" – Represent your city, culture, and the hustle of
          the streets.`}
        </p>
        <p>Duration: 1:30 minutes</p>
      </Stack>
      <Stack className="gap-y-1">
        <span className="font-semibold">Topic for Round 4:</span>
        <p>
          {`"Betrayal & Loyalty" – A deep dive into trust, friendships, and
          backstabbing.`}
        </p>
        <p>Duration: 2 minutes</p>
      </Stack>
      <Stack className="gap-y-1">
        <span className="font-semibold">Topic for Round 5:</span>
        <p>
          {`"Dreams vs. Reality" – The contrast between aspirations and the
          struggles to achieve them.`}
        </p>
        <p>Duration: 1 minutes</p>
      </Stack>
      <p>
        You will compete against 10 participants in total.
        <br />
        Winner takes 500 BGN.
      </p>
      {Judges}
    </>
  );
};
