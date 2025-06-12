import {
  createNewRecipesApi,
  deleteRecipeApi,
  retrieveAllRecipesApi,
  retrieveRecipeByIdApi,
  retrieveRecipesByFilterNameApi,
  retrieveRecipesByUserIdApi,
  toggleVisibleRecipeApi,
} from "@/lib/api/recipes";
import { useReducer } from "react";
import {
  recipesReducer,
  RecipesState,
} from "../context/recipes/recipesReducer";
import { RecipeActionTypes } from "../context/recipes/recipeActionTypes";
import { Recipe } from "@/types/recipes";

export function useRecipes() {
  const initialRecipesState: RecipesState = {
    allRecipes: [],
    selectedRecipe: null,
    userRecipes: [],
  };

  const [state, dispatch] = useReducer(recipesReducer, initialRecipesState);

  async function createRecipe(recipe: FormData): Promise<Recipe> {
    const data = await createNewRecipesApi(recipe);

    if (data) {
      dispatch({ type: RecipeActionTypes.ADD_RECIPE, payload: data });
    }

    return data;
  }

  async function retrieveRecipesList(): Promise<Recipe[]> {
    const data = await retrieveAllRecipesApi();

    if (data) {
      dispatch({ type: RecipeActionTypes.SET_RECIPES, payload: data });
    }

    return data;
  }

  async function toggleVisibleRecipe(
    recipeId: string,
    newIsVisible: boolean
  ): Promise<void> {
    const result = await toggleVisibleRecipeApi(recipeId, newIsVisible);

    if (result) {
      dispatch({
        type: RecipeActionTypes.UPDATE_RECIPE,
        payload: { id: recipeId, updates: { isVisible: newIsVisible } },
      });
    }
  }

  async function deleteRecipe(recipeId: string): Promise<void> {
    const result = await deleteRecipeApi(recipeId);

    if (result) {
      dispatch({ type: RecipeActionTypes.DELETE_RECIPE, payload: result });
    }
  }

  async function retrieveRecipe(recipeId: string): Promise<Recipe> {
    const result = await retrieveRecipeByIdApi(recipeId);

    if (result) {
      dispatch({ type: RecipeActionTypes.RETRIEVE_RECIPE, payload: result });
    }

    return result;
  }

  async function clearStateRecipe(): Promise<void> {
    dispatch({ type: RecipeActionTypes.CLEAR_RECIPE });
  }

  async function retrieveRecipesByFilterName(filter: string): Promise<void> {
    const result = await retrieveRecipesByFilterNameApi(filter);

    if (result) {
      dispatch({
        type: RecipeActionTypes.FILTER_RECIPES_BY_NAME,
        payload: result,
      });
    }
  }

  async function retrieveRecipesByUserId(filter: string): Promise<Recipe[]> {
    const result = await retrieveRecipesByUserIdApi(filter);

    if (result) {
      dispatch({
        type: RecipeActionTypes.SET_USER_RECIPES,
        payload: result,
      });
    }

    return result;
  }

  return {
    stateAllRecipes: state.allRecipes,
    stateRecipe: state.selectedRecipe,
    stateUserRecipes: state.userRecipes,
    createRecipe,
    retrieveRecipesList,
    toggleVisibleRecipe,
    deleteRecipe,
    retrieveRecipe,
    retrieveRecipesByFilterName,
    retrieveRecipesByUserId,
    clearStateRecipe,
  };
}
