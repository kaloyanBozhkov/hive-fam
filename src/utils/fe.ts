export const handleVideoVisibility = (video: HTMLVideoElement) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          void video.play();
        } else {
          void video.pause();
        }
      });
    },
    { threshold: 0.5 },
  );

  observer.observe(video);
  return () => observer.disconnect();
};

export const getDisplayDateFormatter = (timeZone?: string | null) => {
  const format = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  return format;
};

export const UTCToLocalDate = (date: Date) => {
  return new Date(new Date(date).getTime() - date.getTimezoneOffset() * 60000);
};

export const formatDateToTimezoneString = (
  date: Date,
  timeZone?: string | null,
) => {
  const formatter = getDisplayDateFormatter(timeZone);
  return formatter.format(date);
};

export const formatDateToTimezone = (date: Date, timeZone?: string | null) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const dateParts: Record<string, number> = {};

  parts.forEach(({ type, value }) => {
    if (type !== "literal") {
      dateParts[type] = parseInt(value, 10);
    }
  });

  return new Date(
    dateParts.year ?? 0,
    (dateParts.month ?? 0) - 1, // Month is 0-based in Date constructor
    dateParts.day ?? 0,
    dateParts.hour ?? 0,
    dateParts.minute ?? 0,
  );
};
