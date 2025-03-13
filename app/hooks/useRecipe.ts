import { createNewRecipesApi, retrieveAllRecipes } from "@/lib/api/recipes";
import { useState } from "react";

export function useRecipes() {
  const [stateRecipes, setStateRecipes] = useState([]);

  async function createRecipe(recipe: FormData) {
    const data = await createNewRecipesApi(recipe);

    return data;
  }

  async function retrieveRecipesList() {
    const data = await retrieveAllRecipes();

    setStateRecipes(data);
  }

  return {
    stateRecipes,
    createRecipe,
    retrieveRecipesList,
  };
}
