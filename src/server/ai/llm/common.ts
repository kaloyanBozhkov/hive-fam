import type OpenAI from "openai";

export type AIChatCompletionMessages =
  | OpenAI.ChatCompletionSystemMessageParam
  | OpenAI.ChatCompletionUserMessageParam
  | OpenAI.ChatCompletionAssistantMessageParam;

export type AIResponseFormat =
  | OpenAI.ResponseFormatJSONObject
  | OpenAI.ResponseFormatJSONSchema
  | OpenAI.ResponseFormatText;
