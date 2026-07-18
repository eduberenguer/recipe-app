// app/api/ai-chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { systemMessage } from "./promptAi";
import { retrieveRecipesByIngredients } from "@/server/recipes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_existing_recipes",
      description:
        "Searches the real recipe database for an existing visible recipe that uses the given ingredients. Always use this before generating a new recipe from scratch.",
      parameters: {
        type: "object",
        properties: {
          ingredients: {
            type: "array",
            items: { type: "string" },
            description:
              "List of ingredients to search for, lowercase and without quantities.",
          },
        },
        required: ["ingredients"],
      },
    },
  },
];

async function runTool(name: string, args: string): Promise<unknown> {
  if (name === "search_existing_recipes") {
    const { ingredients } = JSON.parse(args) as { ingredients: string[] };
    const recipes = await retrieveRecipesByIngredients(ingredients);
    return recipes.map((r) => ({
      title: r.title,
      ingredients: r.ingredients,
      allergens: r.allergens,
      difficulty: r.difficulty,
      duration: r.duration,
    }));
  }
  throw new Error(`Unknown tool: ${name}`);
}

export async function POST(req: Request): Promise<Response> {
  const { content } = await req.json();

  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: `Ingredients and servings from the user: ${content}`,
      },
    ];

    const firstResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages,
      tools,
      tool_choice: "auto",
    });

    const responseMessage = firstResponse.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (!toolCalls || toolCalls.length === 0) {
      return NextResponse.json({ message: responseMessage.content });
    }

    messages.push(responseMessage);

    for (const toolCall of toolCalls) {
      if (toolCall.type !== "function") continue;
      const result = await runTool(
        toolCall.function.name,
        toolCall.function.arguments,
      );
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }

    const finalResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages,
    });

    return NextResponse.json({
      message: finalResponse.choices[0].message.content,
    });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json(
      { error: "Error querying the AI" },
      { status: 500 },
    );
  }
}
