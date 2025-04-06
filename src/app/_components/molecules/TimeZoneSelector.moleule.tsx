// use Intl.supportedValuesOf('timeZone') and useMemo to create a list of timezones

// use the Select.shadcn.tsx compoennet in /sr/capp/_components/shadcn to create a dropdown of the timezones

// set the default value to the user's timezone

// must handle onChange and accept current value as a prop, also className to customize

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/Select.shadcn";

const TimeZoneSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const timezones = useMemo(() => Intl.supportedValuesOf("timeZone"), []);
  return (
    <Select
      defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}
      value={value}
      onChange={onChange}
    >
      <SelectTrigger>
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent isSearchable>
        {timezones.map((timezone) => (
          <SelectItem key={timezone} value={timezone}>
            {timezone}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeZoneSelector;
