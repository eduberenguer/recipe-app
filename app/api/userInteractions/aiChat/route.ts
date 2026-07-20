// app/api/ai-chat/route.ts
import { NextResponse } from "next/server";
import { OpenAIRecipeAssistant } from "@/adapters/ai/OpenAIRecipeAssistant";
import { PocketBaseRecipeSearcher } from "@/adapters/persistence/PocketBaseRecipeSearcher";
import { AIRecipeAssistant } from "@/core/ports/AIRecipeAssistant";
import { RecipeSearcher } from "@/core/ports/RecipeSearcher";

export async function POST(req: Request): Promise<Response> {
  const { content } = await req.json();

  try {
    const recipeSearcher: RecipeSearcher = new PocketBaseRecipeSearcher();
    const assistant: AIRecipeAssistant = new OpenAIRecipeAssistant(
      recipeSearcher,
    );

    const recipe = await assistant.generateRecipe(content);

    return NextResponse.json({ message: recipe });
  } catch (err) {
    console.error("AI recipe assistant error:", err);
    return NextResponse.json(
      { error: "Error querying the AI" },
      { status: 500 },
    );
  }
}
