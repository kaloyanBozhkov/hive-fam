"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "../_components/shadcn/Card.shadcn";
import { exitCode } from "process";
import { twMerge } from "tailwind-merge";

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
  start(): void;
  stop(): void;
  abort(): void;
  onerror: (event: SpeechRecognitionEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface TranscriptEntry {
  original: string;
  translated: string;
  timestamp: number;
}

export default function TranslatorPage() {
  const [isListening, setIsListening] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const finalTranscriptRef = useRef("");
  const lastProcessedLengthRef = useRef(0);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    recognition.lang = "bg-BG"; // Bulgarian language
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Get the transcript from all results
      const fullTranscript = Array.from(event.results)
        .map((result, i) => {
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

        // Detect if we have enough content to translate (e.g., a sentence or pause)
        // Process translation after a pause or when there's enough new content
        if (processingTimeoutRef.current) {
          clearTimeout(processingTimeoutRef.current);
        }

        processingTimeoutRef.current = setTimeout(() => {
          if (
            finalTranscriptRef.current &&
            finalTranscriptRef.current.length > lastProcessedLengthRef.current
          ) {
            const textToTranslate = finalTranscriptRef.current.substring(
              lastProcessedLengthRef.current,
            );

            // If there's meaningful new content, translate it
            if (textToTranslate.trim().length > 0) {
              void (async () => {
                // const translated = await translateText(textToTranslate);

                // Add the new entry to our list
                setEntries((prev) => [
                  ...prev,
                  {
                    original: textToTranslate,
                    translated: textToTranslate,
                    timestamp: Date.now(),
                  },
                ]);

                // Update our processed point
                lastProcessedLengthRef.current =
                  finalTranscriptRef.current.length;
              })();
            }
          }
        }, 0); // Wait for X seconds of silence before processing
      } else {
        // For interim results, just show the current state
        setCurrentText(fullTranscript);
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
  }, []);

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

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Bulgarian to English Translator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mx-auto py-6">
          {error && (
            <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

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
                  ...(entries.length > 4
                    ? [
                        index === 0 && "opacity-40",
                        index === 1 && "opacity-50",
                        index === 2 && "opacity-60",
                        index === 3 && "opacity-80",
                        index === 4 && "opacity-100",
                      ]
                    : []),
                )}
              >
                <div className="mb-4 text-[50px]  font-bold">
                  <p className="leading-[50px]">{entry.translated}</p>
                </div>
              </div>
            ))}

            {!entries.length && (
              <div className="text-gray-500">
                Speak in Bulgarian to see translation...
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
