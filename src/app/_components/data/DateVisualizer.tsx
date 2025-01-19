"use client";

import { type FC, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  YAxis,
  CartesianGrid,
} from "recharts";
import useResizeObserver from "../../hooks/useResizeObserver";
import { Input } from "../shadcn/Input.shadcn";
import { Card, CardHeader, CardTitle } from "../shadcn/Card.shadcn";

export const DateVisualizer: FC<{
  timestamps: string[];
}> = ({ timestamps }) => {
  const [periodMinutes, setPeriodMinutes] = useState(10);
  const batchedTickets = groupAndCountTimestamps(timestamps, periodMinutes);
  const chartRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(chartRef);

  const parseMinutes = (value: string): number => {
    const trimmedValue = value.trim();
    let minutes = 0;

    // Check for "m" or "minutes" in the input
    if (trimmedValue.endsWith("m")) {
      minutes = parseInt(trimmedValue.slice(0, -1), 10);
    } else if (trimmedValue.endsWith("minutes")) {
      minutes = parseInt(trimmedValue.slice(0, -8), 10);
    } else {
      minutes = parseInt(trimmedValue, 10);
    }

    return isNaN(minutes) ? 0 : Math.max(minutes, 1); // Ensure at least 1 minute
  };

  if (batchedTickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <p className="text-lg font-normal">
              Event must be over for these metric to be shown
            </p>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%" }}>
      <label
        htmlFor="periodMinutes"
        style={{ marginBottom: "5px", display: "block" }}
      >
        Group in minutes:
      </label>
      <Input
        className="max-w-[300px]"
        id="periodMinutes"
        type="number"
        value={periodMinutes}
        onChange={(e) => setPeriodMinutes(parseMinutes(e.target.value))}
        style={{ marginBottom: "10px" }}
      />
      <LineChart
        width={dimensions.width}
        height={dimensions.height}
        data={batchedTickets.map((d) => ({
          y: d.count,
          x: `${d.start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} - ${d.end.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`, // X-axis: time range
        }))}
        margin={{ top: 20, right: 10, left: 10, bottom: 200 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="x" // X-axis key
          angle={-45} // Rotate labels for better readability
          textAnchor="end"
          interval={0} // Ensure all labels are shown
          label={{
            value: "",
            position: "insideBottom",
            offset: -10,
          }}
        />
        <YAxis
          label={{
            value: "Ticket Scans",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip />
        <Line type="linear" dataKey="y" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};
type GroupedTimestamps = {
  count: number;
  start: Date;
  end: Date;
};

function groupAndCountTimestamps(
  timestamps: string[],
  periodMinutes: number,
): GroupedTimestamps[] {
  if (timestamps.length === 0) return [];

  const periodMs = periodMinutes * 60 * 1000; // Convert minutes to milliseconds
  const paddingMs = periodMinutes * 60 * 1000; // Convert padding to milliseconds

  const sortedTimestamps = timestamps
    .map((ts) => new Date(ts))
    .sort((a, b) => a.getTime() - b.getTime());

  const groups: GroupedTimestamps[] = [];
  let currentGroup: GroupedTimestamps = {
    count: 1,
    start: sortedTimestamps[0]!,
    end: sortedTimestamps[0]!,
  };

  for (let i = 1; i < sortedTimestamps.length; i++) {
    const currentTimestamp = sortedTimestamps[i]!;

    if (currentTimestamp.getTime() - currentGroup.start.getTime() <= periodMs) {
      currentGroup.count += 1;
      currentGroup.end = currentTimestamp; // Update the end timestamp of the group
    } else {
      groups.push(currentGroup);

      // Add padding groups for every periodMinutes until the current timestamp
      let paddingStart = new Date(currentGroup.end.getTime() + paddingMs);
      while (paddingStart.getTime() + periodMs <= currentTimestamp.getTime()) {
        const paddedEnd = new Date(paddingStart.getTime() + periodMs);
        groups.push({
          count: 0,
          start: paddingStart,
          end: paddedEnd,
        });
        paddingStart = paddedEnd; // Move to the next padding start
      }

      currentGroup = {
        count: 1,
        start: currentTimestamp,
        end: currentTimestamp,
      };
    }
  }

  groups.push(currentGroup); // Add the last group
  return groups;
}
