import {
  createNewRecipesApi,
  deleteRecipeApi,
  retrieveAllRecipesApi,
  retrieveRecipeByIdApi,
  retrieveRecipesByFilterNameApi,
} from "@/lib/api/recipes";
import { useReducer } from "react";
import { recipesReducer } from "../context/recipes/recipesReducer";
import { RecipeActionTypes } from "../context/recipes/recipeActionTypes";

export function useRecipes() {
  const [state, dispatch] = useReducer(recipesReducer, {
    allRecipes: [],
    selectedRecipe: {},
  });

  async function createRecipe(recipe: FormData) {
    const data = await createNewRecipesApi(recipe);

    if (data) {
      dispatch({ type: RecipeActionTypes.ADD_RECIPE, payload: data });
    }

    return data;
  }

  async function retrieveRecipesList() {
    const data = await retrieveAllRecipesApi();

    if (data) {
      dispatch({ type: RecipeActionTypes.SET_RECIPES, payload: data });
    }

    return data;
  }

  async function deleteRecipe(recipeId: string) {
    const result = await deleteRecipeApi(recipeId);

    if (result) {
      dispatch({ type: RecipeActionTypes.DELETE_RECIPE, payload: result });
    }
  }

  async function retrieveRecipe(recipeId: string) {
    const result = await retrieveRecipeByIdApi(recipeId);

    if (result) {
      dispatch({ type: RecipeActionTypes.RETRIEVE_RECIPE, payload: result });
    }
  }

  async function retrieveRecipesByFilterName(filter: string) {
    const result = await retrieveRecipesByFilterNameApi(filter);

    if (result) {
      dispatch({
        type: RecipeActionTypes.FILTER_RECIPES_BY_NAME,
        payload: result,
      });
    }
  }

  return {
    stateAllRecipes: state.allRecipes,
    stateRecipe: state.selectedRecipe,
    createRecipe,
    retrieveRecipesList,
    deleteRecipe,
    retrieveRecipe,
    retrieveRecipesByFilterName,
  };
}
