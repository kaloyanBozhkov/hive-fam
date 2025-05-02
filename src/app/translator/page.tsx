"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "../_components/shadcn/Card.shadcn";
import { twMerge } from "tailwind-merge";
import Group from "../_components/layouts/Group.layout";
import { useStreamedText } from "../_hooks/useStreamedText";

// Type definitions for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  grammars?: SpeechGrammarList;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: (event: SpeechRecognitionEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

interface SpeechGrammarList {
  addFromString(grammar: string, weight?: number): void;
  length: number;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechGrammarList: new () => SpeechGrammarList;
    webkitSpeechGrammarList: new () => SpeechGrammarList;
  }
}

interface TranscriptEntry {
  original: string;
  translated: string;
  timestamp: number;
}

const WORD_TRANSLATION_THRESHOLD = 60;
const SILENCE_DETECTION_TIMEOUT = 1000;

export default function TranslatorPage() {
  const [isListening, setIsListening] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savedWords, setSavedWords] = useState<string>(
    getSpecialWords().join(","),
  );
  const [delay, setDelay] = useState(getDelay());
  const [expandedSettings, setExpandedSettings] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const finalTranscriptRef = useRef("");
  const lastProcessedLengthRef = useRef(0);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimestampRef = useRef(Date.now());
  const specialWordsRef = useRef<HTMLInputElement>(null);
  const delayRef = useRef<HTMLInputElement>(null);
  const wordThresholdRef = useRef<HTMLInputElement>(null);
  const [wordThreshold, setWordThreshold] = useState(getWordThreshold());
  const [pendingTranslationText, setPendingTranslationText] = useState<
    string | null
  >(null);
  const { streamResponse, isStreamingText, streamedText, onResetStreamedText } =
    useStreamedText({
      endpoint: "/api/translate",
      onStreamTextFinished: (fullText) => {
        if (pendingTranslationText) {
          // Add the new entry to our list
          setEntries((prev) => [
            ...prev,
            {
              original: pendingTranslationText,
              translated: fullText,
              timestamp: Date.now(),
            },
          ]);
          setPendingTranslationText(null);
        }
      },
      onError: (error) => {
        setError(error);
        setPendingTranslationText(null);
      },
    });

  const translateText = async (text: string): Promise<string> => {
    try {
      if (!text.trim()) {
        return text; // Return original text if it's empty or just whitespace
      }

      setPendingTranslationText(text);
      onResetStreamedText();
      await streamResponse({
        bodyJSON: JSON.stringify({
          text,
          specialWordsJoined: savedWords,
          previousEntries: entries.slice(-3).map((entry) => entry.original),
        }),
      });
      return streamedText; // Return the current streamed text, which will be updated as the stream progresses
    } catch (error) {
      console.error(
        "Translation error:",
        error instanceof Error ? error.message : String(error),
      );
      return text; // Return original text if translation fails
    }
  };

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries, currentText]);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    // Initialize speech recognition
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    // Setup speech grammar list if supported
    if ("SpeechGrammarList" in window || "webkitSpeechGrammarList" in window) {
      const SpeechGrammarListAPI =
        window.SpeechGrammarList || window.webkitSpeechGrammarList;
      const grammarList = new SpeechGrammarListAPI();

      // Only add names if the participant field has content
      if (savedWords.trim()) {
        // Create a grammar string with the participant names
        // Format: #JSGF V1.0; grammar names; public <names> = name1 | name2 | name3 ;
        const names = savedWords
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean);
        if (names.length > 0) {
          const grammar = `#JSGF V1.0; grammar names; public <names> = ${names.join(" | ")} ;`;
          grammarList.addFromString(grammar, 1);
          recognition.grammars = grammarList;
        }
      }
    }

    recognition.lang = "bg-BG"; // Bulgarian language
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Update the last time we heard speech
      lastSpeechTimestampRef.current = Date.now();

      console.log(event.results);
      // Get the transcript from all results
      const fullTranscript = Array.from(event.results)
        .map((result) => {
          if (!result || result.length === 0) return "";
          return result[0]?.transcript ?? "";
        })
        .join(" ")
        .trim();

      // Check if this is an interim or final result
      const isFinal = event.results[event.results.length - 1]?.isFinal ?? false;

      if (isFinal) {
        // Append to our final transcript
        finalTranscriptRef.current = fullTranscript;
        finalTranscriptRef.current = finalTranscriptRef.current.trim();

        // Only keep showing the most recent part as current text
        setCurrentText("");

        // Process the new content immediately
        void processNewContent().catch(console.error);
      } else {
        // For interim results, show the current state
        setCurrentText(fullTranscript);

        // Clear any existing timeout
        if (processingTimeoutRef.current) {
          clearTimeout(processingTimeoutRef.current);
        }

        // Check if we've exceeded the word limit
        const wordCount =
          fullTranscript.split(/\s+/).length - lastProcessedLengthRef.current;
        if (wordCount > wordThreshold) {
          // Process immediately if we exceed word threshold
          void processNewContent(fullTranscript).catch(console.error);
        } else {
          // Set a new timeout to process the content after a silence period
          processingTimeoutRef.current = setTimeout(() => {
            // If we've reached here, there's been a pause in speech
            if (fullTranscript.length > lastProcessedLengthRef.current) {
              void processNewContent(fullTranscript).catch(console.error);
            }
          }, delay);
        }
      }
    };

    // Extract the processing logic into a separate function
    const processNewContent = async (currentTranscript?: string) => {
      const transcriptToUse = currentTranscript ?? finalTranscriptRef.current;

      if (
        transcriptToUse &&
        transcriptToUse.length > lastProcessedLengthRef.current
      ) {
        const textToTranslate = transcriptToUse.substring(
          lastProcessedLengthRef.current,
        );

        // If there's meaningful new content, translate it
        if (textToTranslate.trim().length > 0) {
          // Update our processed point
          lastProcessedLengthRef.current = transcriptToUse.length;

          // Initiate the streaming translation
          await translateText(textToTranslate);

          // The new entry will be added when the streaming is finished in onStreamTextFinished
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionEvent) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [savedWords]);

  const toggleListening = () => {
    if (isListening) {
      return;
    } else {
      try {
        // Reset processing state when starting a new session
        if (!isListening) {
          setCurrentText("");
        }

        recognitionRef.current?.start();
      } catch (err) {
        // Sometimes start() might throw if recognition is already started
        console.error(err);
      }
    }
    setIsListening(!isListening);
  };

  const clearTranscript = () => {
    setEntries([]);
    setCurrentText("");

    finalTranscriptRef.current = "";
    lastProcessedLengthRef.current = 0;
  };

  useEffect(() => {
    if (specialWordsRef.current) {
      specialWordsRef.current.value = savedWords;
    }

    if (delayRef.current) {
      delayRef.current.value = delay.toString();
    }

    if (wordThresholdRef.current) {
      wordThresholdRef.current.value = wordThreshold.toString();
    }
  }, [savedWords, delay, wordThreshold]);

  // Display the streamed text as it comes in
  useEffect(() => {
    if (pendingTranslationText && isStreamingText && streamedText) {
      // Show the streamed text as it's coming in as the current text
      setCurrentText(streamedText);
    }
  }, [streamedText, isStreamingText, pendingTranslationText]);

  return (
    <>
      <Card className="">
        <CardHeader>
          <Group className="w-full justify-between">
            <CardTitle>
              Bulgarian to English Translator{" "}
              <span className="text-sm text-gray-500">(beta)</span>
            </CardTitle>
            <div className="mb-6 flex gap-4">
              <Button
                onClick={toggleListening}
                className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
              >
                {isListening ? "Stop Listening" : "Start Listening"}
              </Button>

              <Button
                onClick={clearTranscript}
                variant="outline"
                className="hidden"
              >
                Clear All
              </Button>
            </div>
          </Group>
        </CardHeader>
        <CardContent>
          <div className="mx-auto">
            {error && (
              <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            <div
              ref={containerRef}
              className="flex h-[450px] flex-col overflow-y-auto"
            >
              {/* get last 10 entries and map those */}
              {/* // make 100% opacity first, 80% semilast and so on  */}

              {entries.slice(-4).map((entry, index) => (
                <div
                  key={entry.timestamp + index}
                  className={twMerge(
                    "mb-8",
                    // reverse the opacity
                    index === 0 && "opacity-40",
                    index === 1 && "opacity-50",
                    index === 2 && "opacity-60",
                    index === 3 && "opacity-80",
                  )}
                >
                  <div className="mb-4 text-[50px]  font-bold">
                    <p className="notranslate leading-[50px]">
                      {entry.translated}
                    </p>
                  </div>
                </div>
              ))}

              {isStreamingText && pendingTranslationText && (
                <div className="mb-8">
                  <div className="mb-4 text-[50px] font-bold">
                    <p className="notranslate leading-[50px]">
                      {streamedText || "..."}
                    </p>
                  </div>
                </div>
              )}

              {!entries.length && !isStreamingText && (
                <div className="text-gray-500">
                  Speak in Bulgarian to see translation...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card
        className={twMerge(
          "mt-4",
          expandedSettings ? "opacity-100" : "opacity-10",
        )}
      >
        <CardHeader>
          <Group className="justify-between">
            <CardTitle>Settings</CardTitle>
            <Button
              onClick={() => setExpandedSettings(!expandedSettings)}
              variant="outline"
            >
              {expandedSettings ? "Collapse" : "Expand"}
            </Button>
          </Group>
        </CardHeader>
        <CardContent className={expandedSettings ? "block" : "hidden"}>
          <div className="mb-4">
            <label
              htmlFor="savedWords"
              className="mb-2 block text-sm font-medium"
            >
              Special words, (comma-separated):
            </label>
            <Group className="justify-between gap-2">
              <input
                ref={specialWordsRef}
                id="savedWords"
                type="text"
                placeholder="E.g., Иван, Мария, Георги, Петър"
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                disabled={isListening}
              />
              <Button
                onClick={() => {
                  if (!specialWordsRef.current) return;
                  setSpecialWords(
                    specialWordsRef.current.value
                      .split(",")
                      .map((t) => t.trim()),
                  );
                  setSavedWords(specialWordsRef.current.value);
                }}
              >
                Save
              </Button>
            </Group>
          </div>
          <div className="mb-4">
            <label htmlFor="delay" className="mb-2 block text-sm font-medium">
              Delay:
            </label>
            <Group className="justify-between gap-2">
              <input
                ref={delayRef}
                id="delay"
                type="number"
                placeholder="E.g., 1000"
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                disabled={isListening}
              />
              <Button
                onClick={() => {
                  if (!delayRef.current) return;
                  setDelayLS(Number(delayRef.current.value));
                  setDelay(Number(delayRef.current.value));
                }}
              >
                Save
              </Button>
            </Group>
          </div>
          <div className="mb-4">
            <label htmlFor="delay" className="mb-2 block text-sm font-medium">
              Word threshold:
            </label>
            <Group className="justify-between gap-2">
              <input
                ref={wordThresholdRef}
                id="wordThreshold"
                type="number"
                placeholder="E.g., 1000"
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                disabled={isListening}
              />
              <Button
                onClick={() => {
                  if (!wordThresholdRef.current) return;
                  setWordThresholdLS(Number(wordThresholdRef.current.value));
                  setWordThreshold(Number(wordThresholdRef.current.value));
                }}
              >
                Save
              </Button>
            </Group>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

const getSpecialWords = () => {
  if (typeof window === "undefined") return [];
  const specialWords = localStorage.getItem("specialWords");
  return specialWords ? (JSON.parse(specialWords) as string[]) : [];
};

const setSpecialWords = (words: string[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("specialWords", JSON.stringify(words));
};

const setDelayLS = (delay: number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("delay", JSON.stringify(delay));
};

const getDelay = () => {
  if (typeof window === "undefined") return SILENCE_DETECTION_TIMEOUT;
  const delay = localStorage.getItem("delay");
  return delay ? (JSON.parse(delay) as number) : SILENCE_DETECTION_TIMEOUT;
};

const setWordThresholdLS = (wordThreshold: number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("wordThreshold", JSON.stringify(wordThreshold));
};

const getWordThreshold = () => {
  if (typeof window === "undefined") return WORD_TRANSLATION_THRESHOLD;
  const wordThreshold = localStorage.getItem("wordThreshold");
  return wordThreshold
    ? (JSON.parse(wordThreshold) as number)
    : WORD_TRANSLATION_THRESHOLD;
};
