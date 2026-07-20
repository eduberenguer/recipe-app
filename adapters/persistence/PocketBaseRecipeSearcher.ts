import {
  RecipeSearcher,
  RecipeSearchResult,
} from "@/core/ports/RecipeSearcher";
import { retrieveRecipesByIngredients } from "@/server/recipes";

export class PocketBaseRecipeSearcher implements RecipeSearcher {
  async searchByIngredients(
    ingredients: string[],
  ): Promise<RecipeSearchResult[]> {
    const recipes = await retrieveRecipesByIngredients(ingredients);

    return recipes.map((recipe) => ({
      title: recipe.title,
      ingredients: recipe.ingredients,
      allergens: recipe.allergens,
      difficulty: recipe.difficulty,
      duration: recipe.duration,
    }));
  }
}
