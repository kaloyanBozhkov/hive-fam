import { useCallback, useEffect, useState } from "react";

export const useStreamedText = ({
  endpoint,
  onStreamTextFinished,
  onError,
}: {
  endpoint: string;
  onStreamTextFinished?: (fullText: string) => void;
  onError?: (errorMsg: string) => void;
}) => {
  const [streamedText, setStreamedText] = useState("");
  const [isStreamingText, setIsStreamingText] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const onResetStreamedText = useCallback(() => {
    setStreamedText("");
    setFinished(false);
    setIsStreamingText(false);
  }, []);
  const streamResponse = useCallback(
    async ({ bodyJSON }: { bodyJSON?: string }) => {
      setStreamedText("");
      setFinished(false);
      setIsStreamingText(true);
      if (!bodyJSON) return;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: bodyJSON,
      });

      if (!response.ok) {
        onError?.("There was an error with the response. Please try again.");
        setIsStreamingText(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("ReadableStream not supported");
      }

      const read = (): Promise<void> =>
        reader.read().then(async ({ done, value }) => {
          // Decode and process chunk
          const chunk = decoder.decode(value, { stream: true });
          setStreamedText((prev) => prev + chunk);

          if (done) {
            reader.releaseLock();
            setFinished(true);
            setIsStreamingText(false);
            return;
          }

          // Read the next chunk
          return read();
        });

      if (reader) await read();
    },
    [endpoint, onError],
  );

  useEffect(() => {
    if (!onStreamTextFinished || !isFinished) return;
    onStreamTextFinished?.(streamedText);
  }, [onStreamTextFinished, isFinished, streamedText]);

  return {
    streamResponse,
    isStreamingText,
    isFinished,
    streamedText,
    onResetStreamedText,
  };
};
