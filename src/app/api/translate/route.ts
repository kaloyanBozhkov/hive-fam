import { env } from "@/env";
import { AIChatCompletionMessages } from "@/server/ai/llm/common";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { text, previousEntries, specialWordsJoined } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Invalid text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create OpenRouter instance
    const openRouter = new OpenAI({
      apiKey: env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    // Prepare messages for the chat completion
    const messages: AIChatCompletionMessages[] = [
      {
        role: "system",
        content: `You are a Bulgarian to English translator. Translate the Bulgarian text to English, maintaining the original meaning and nuance. 
        The text you're translating is subtitles of a standup comedy dating show where up to 4 people are talking on stage.
        The venue name is Hashtag and the city is Varna. Our show is called "Na Slqpo" or ""На Сляпо" which translates to "Blind Date".
        ${specialWordsJoined ? `Special words/names to consider: ${specialWordsJoined}` : ""}
        Current conversation for context: ${previousEntries ? previousEntries.join("") : ""}${text}
        Text to translate: ${text}
        Respond with ONLY the translated text in the shape of: string
        No explanations or additional content. Translate only the "text to translate" part, not all the conversation. 
        Keep in mind bulgarian sayings and idioms.`,
      },
    ];

    // Create a streaming chat completion
    const stream = await openRouter.chat.completions.create({
      model: "x-ai/grok-3-beta", // Default model, can be made configurable
      messages,
      stream: true,
      temperature: 0.1, // Low temperature for more consistent translations
    });

    // Set up a stream response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred during translation",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
