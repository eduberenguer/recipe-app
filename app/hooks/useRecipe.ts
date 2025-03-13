import {
  createNewRecipesApi,
  deleteRecipeApi,
  retrieveAllRecipesApi,
} from "@/lib/api/recipes";
import { Recipe } from "@/types";
import { useState } from "react";

export function useRecipes() {
  const [stateRecipes, setStateRecipes] = useState<Recipe[]>([]);

  async function createRecipe(recipe: FormData) {
    const data = await createNewRecipesApi(recipe);

    return data;
  }

  async function retrieveRecipesList() {
    const data = await retrieveAllRecipesApi();

    setStateRecipes(data);
  }

  async function deleteRecipeById(recipeId: string) {
    const result = await deleteRecipeApi(recipeId);

    if (result) {
      const newRecipes = stateRecipes.filter(
        (recipe) => recipe.id !== recipeId
      );

      setStateRecipes(newRecipes);
    }
  }

  return {
    stateRecipes,
    createRecipe,
    retrieveRecipesList,
    deleteRecipeById,
  };
}
