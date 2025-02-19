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
}: {
  onChange: (value: string) => void;
  defaultValue?: string;
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
  if (!events.length) return <p>No events found</p>;

  // TODO clear state & initial state
  return (
    <Select onChange={onChange} defaultValue={defaultValue}>
      <SelectTrigger disabled={isPending}>
        <SelectValue placeholder="Select an event" />
      </SelectTrigger>
      <SelectContent>
        {events.map((event) => (
          <SelectItem key={event.id} value={event.id}>
            {event.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
