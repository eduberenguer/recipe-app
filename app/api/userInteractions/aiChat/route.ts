// app/api/ai-chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { systemMessage } from "./promptAi";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
  const { content } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `Ingredients and servings from the user: ${content}`,
        },
      ],
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("OpenAI error:", err);
    return new NextResponse("Error al consultar la IA", { status: 500 });
  }
}
