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

export const formatDateToTimezone = (date: Date, timeZone?: string | null) => {
  const formatter = getDisplayDateFormatter(timeZone);
  const parsed = new Date(formatter.format(date));
  return isNaN(parsed.getTime()) ? date : parsed;
};
