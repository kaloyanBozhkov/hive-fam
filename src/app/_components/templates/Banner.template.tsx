import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Stack from "../layouts/Stack.layout";
import { Button } from "../shadcn/Button.shadcn";
import RichTextReader from "../molecules/lexical/RichTextReader";
import Link from "next/link";
import Group from "../layouts/Group.layout";

const Banner = ({
  title,
  body,
  subtitle,
  content,
  className = "",
  actionParticipantsForEventId,
  actionParticipantsForEventButtonText,
  secondaryActionButtonText,
}: {
  title: ReactNode;
  body?: ReactNode;
  content?: string;
  subtitle: ReactNode;
  className?: string;
  actionParticipantsForEventId?: string;
  actionParticipantsForEventButtonText?: string;
  secondaryActionButtonText?: string;
}) => {
  console.log(title, subtitle);
  return (
    <div
      className={twMerge(
        "grid-page z-10 h-full w-full bg-[rgb(0,0,0,0.5)] px-[26px] py-[20px] md:px-[46px] lg:px-0 -sm:!grid-rows-[unset] -sm:items-center",
        className,
      )}
    >
      {Boolean(title ?? subtitle) && (
        <div className="my-[20px] hidden h-[1px] w-full bg-white md:block" />
      )}
      <div className="grid grid-cols-1 sm:auto-rows-min sm:items-start md:grid-cols-3 -sm:m-auto">
        {subtitle && (
          <p className="font-regular p-text notranslate text-white">
            {subtitle}
          </p>
        )}
        <Stack className="col-span-2 gap-[24px]">
          <h1 className="h1-0 notranslate font-bold capitalize text-white">
            {title}
          </h1>
          {body && (
            <p className="p-text notranslate font-light text-white">{body}</p>
          )}
          {content && (
            <RichTextReader
              content={content}
              className="p-text notranslate font-light text-white"
            />
          )}
          {actionParticipantsForEventId && (
            <Group className="gap-4 -sm:flex-col">
              {actionParticipantsForEventId && (
                <Button
                  variant="secondary"
                  className="px-10 font-bold sm:w-fit"
                  asChild
                >
                  <Link href={`/event/signup/${actionParticipantsForEventId}`}>
                    {actionParticipantsForEventButtonText}
                  </Link>
                </Button>
              )}
              {secondaryActionButtonText && (
                <Button
                  variant="secondary"
                  className="px-10 font-bold sm:w-fit"
                  asChild
                >
                  <Link href={`/event/${actionParticipantsForEventId}`}>
                    {secondaryActionButtonText}
                  </Link>
                </Button>
              )}
            </Group>
          )}
        </Stack>
      </div>
    </div>
  );
};

export default Banner;
