"use client";
import {
  addFavouriteRecipeApi,
  addRemoveRecipeApi,
  retrieveFavouritesApi,
} from "@/lib/api/userInteractions";
import { useContext, useReducer } from "react";
import { userInteractionsReducer } from "../context/userInteractions/userInteractionsReducer";
import { UserInteractionsTypes } from "../context/userInteractions/userInteractionsTypes";
import { Recipe } from "@/types/recipes/index";
import { ToggleFavouriteRecipe } from "@/types/userInteractions/index";
import { RecipesContext } from "../context/context";

export function useUserInteractions() {
  const contextRecipes = useContext(RecipesContext);
  const [state, dispatch] = useReducer(userInteractionsReducer, {
    favouritesRecipesId: <string[]>[],
    favouritesRecipes: <Recipe[]>[],
  });

  async function retrieveFavouritesList(userId: string) {
    const data: Recipe[] = await retrieveFavouritesApi(userId);

    dispatch({
      type: UserInteractionsTypes.RETRIEVE_FAVOURITES,
      payload: data,
    });

    return data;
  }

  async function addFavouriteRecipe(userId: string, recipeId: string) {
    const newAddFavourite: ToggleFavouriteRecipe = {
      userId,
      recipeId,
    };

    await addFavouriteRecipeApi(newAddFavourite);

    const recipe = contextRecipes?.stateAllRecipes.find(
      (recipe) => recipe.id === recipeId
    );

    if (!recipe) {
      console.error(`Recipe with ID ${recipeId} not found in stateAllRecipes`);
      return;
    }

    dispatch({
      type: UserInteractionsTypes.ADD_RECIPE_FAVOURITE,
      payload: recipe,
    });
  }

  async function removeFavouriteRecipe(userId: string, recipeId: string) {
    const newRemoveFavourite: ToggleFavouriteRecipe = {
      userId,
      recipeId,
    };

    const result = await addRemoveRecipeApi(newRemoveFavourite);

    dispatch({
      type: UserInteractionsTypes.REMOVE_RECIPE_FAVOURITE,
      payload: result,
    });
  }

  return {
    favouritesRecipesId: state.favouritesRecipesId,
    favouritesRecipes: state.favouritesRecipes,
    retrieveFavouritesList,
    addFavouriteRecipe,
    removeFavouriteRecipe,
    dispatch,
  };
}
