"use server";

import OpenAI from "openai";
import { AIChatCompletionMessages, AIResponseFormat } from "./common";
import { env } from "@/env";

interface CreateOpenRouterChatCompletionProps {
  model?: string;
  messages: AIChatCompletionMessages[];
  userUuid?: string;
  responseFormat?: AIResponseFormat;
  temperature?: number | null;
}

export const createOpenRouterChatCompletion = async ({
  model = "x-ai/grok-3-beta",
  messages,
  userUuid,
  responseFormat,
  temperature,
}: CreateOpenRouterChatCompletionProps) => {
  const result = await getOpenRouterInstance().chat.completions.create({
    model,
    messages,
    user: userUuid,
    response_format: responseFormat,
    temperature,
  });

  return JSON.parse(result.choices[0]?.message.content || "{}");
};

let openRouterInstance: OpenAI | null = null;
const getOpenRouterInstance = (): OpenAI => {
  if (openRouterInstance === null) {
    openRouterInstance = new OpenAI({
      apiKey: env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }

  return openRouterInstance;
};
