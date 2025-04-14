"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/shadcn/Select.shadcn";
import { getEventData } from "@/server/actions/manager/getEventData";

export const SelectEvent = ({
  onChange,
  defaultValue,
  extraItemsPrepend,
  extraItemsAppend,
}: {
  onChange: (value: string) => void;
  defaultValue?: string;
  extraItemsPrepend?: {
    label: string;
    value: string;
  }[];
  extraItemsAppend?: {
    label: string;
    value: string;
  }[];
}) => {
  const [isPending, startTransition] = useTransition();
  const [events, setEvents] = useState<
    Awaited<ReturnType<typeof getEventData>>
  >([]);

  useEffect(() => {
    startTransition(async () => {
      const data = await getEventData();
      setEvents(data);
    });
  }, []);

  if (isPending) return <p>Loading..</p>;
  if (!events?.length) return <p>No events found</p>;

  // TODO clear state & initial state
  return (
    <Select onChange={onChange} defaultValue={defaultValue}>
      <SelectTrigger disabled={isPending}>
        <SelectValue placeholder="Select an event" />
      </SelectTrigger>
      <SelectContent>
        {extraItemsPrepend?.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
        {events.map((event) => (
          <SelectItem key={event.id} value={event.id}>
            {event.title}
          </SelectItem>
        ))}
        {extraItemsAppend?.map((item) => (
          <SelectItem key={item.label} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
