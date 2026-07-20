import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { AIRecipeAssistant } from "@/core/ports/AIRecipeAssistant";
import { RecipeSearcher } from "@/core/ports/RecipeSearcher";
import { GeneratedRecipe } from "@/core/domain/generatedRecipe";
import { systemMessage } from "./openAiSystemPrompt";

const SEARCH_EXISTING_RECIPES_TOOL = "search_existing_recipes";

export class OpenAIRecipeAssistant implements AIRecipeAssistant {
  private readonly client: OpenAI;
  private readonly tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: SEARCH_EXISTING_RECIPES_TOOL,
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

  constructor(private readonly recipeSearcher: RecipeSearcher) {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateRecipe(userMessage: string): Promise<GeneratedRecipe> {
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemMessage },
      {
        role: "user",
        content: `Ingredients and servings from the user: ${userMessage}`,
      },
    ];

    const firstResponse = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages,
      tools: this.tools,
      tool_choice: "auto",
    });

    const responseMessage = firstResponse.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (!toolCalls || toolCalls.length === 0) {
      return JSON.parse(responseMessage.content ?? "{}") as GeneratedRecipe;
    }

    messages.push(responseMessage);

    for (const toolCall of toolCalls) {
      if (toolCall.type !== "function") continue;
      const result = await this.runTool(
        toolCall.function.name,
        toolCall.function.arguments,
      );
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }

    const finalResponse = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages,
    });

    return JSON.parse(
      finalResponse.choices[0].message.content ?? "{}",
    ) as GeneratedRecipe;
  }

  private async runTool(name: string, args: string): Promise<unknown> {
    if (name === SEARCH_EXISTING_RECIPES_TOOL) {
      const { ingredients } = JSON.parse(args) as { ingredients: string[] };
      return this.recipeSearcher.searchByIngredients(ingredients);
    }
    throw new Error(`Unknown tool: ${name}`);
  }
}
