import { GeneratedRecipe } from "@/core/domain/generatedRecipe";

export interface AIRecipeAssistant {
  generateRecipe(userMessage: string): Promise<GeneratedRecipe>;
}
