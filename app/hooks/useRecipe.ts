import {
  createNewRecipesApi,
  deleteRecipeApi,
  retrieveAllRecipesApi,
  retrieveRecipeByIdApi,
} from "@/lib/api/recipes";
import { Recipe } from "@/types";
import { useState } from "react";

export function useRecipes() {
  const [stateAllRecipes, setStateAllRecipes] = useState<Recipe[]>([]);
  const [stateRecipe, setstateRecipe] = useState<Recipe | null>(null);

  async function createRecipe(recipe: FormData) {
    const data = await createNewRecipesApi(recipe);

    return data;
  }

  async function retrieveRecipesList() {
    const data = await retrieveAllRecipesApi();

    setStateAllRecipes(data);
    setstateRecipe(null);
  }

  async function deleteRecipe(recipeId: string) {
    const result = await deleteRecipeApi(recipeId);

    if (result) {
      const newRecipes = stateAllRecipes.filter(
        (recipe) => recipe.id !== recipeId
      );

      setStateAllRecipes(newRecipes);
    }
  }

  async function retrieveRecipe(recipeId: string) {
    const result = await retrieveRecipeByIdApi(recipeId);
    setstateRecipe(result);
  }

  return {
    stateAllRecipes,
    stateRecipe,
    createRecipe,
    retrieveRecipesList,
    deleteRecipe,
    retrieveRecipe,
  };
}
