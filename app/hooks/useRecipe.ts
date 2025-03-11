import { createNewRecipesApi } from "@/lib/api/recipes";

export function useRecipes() {
  async function createRecipe(recipe: FormData) {
    const data = await createNewRecipesApi(recipe);

    return data;
  }

  return {
    createRecipe,
  };
}
