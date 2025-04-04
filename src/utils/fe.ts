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
