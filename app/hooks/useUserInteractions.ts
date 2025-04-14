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

    const result = await addFavouriteRecipeApi(newAddFavourite);

    let retrieveRecipe;

    if (result) {
      retrieveRecipe = await contextRecipes?.retrieveRecipe(recipeId);
    }

    if (!retrieveRecipe) {
      console.log("Recipe not found");
      return false;
    }

    dispatch({
      type: UserInteractionsTypes.ADD_RECIPE_FAVOURITE,
      payload: retrieveRecipe,
    });
  }

  async function removeFavouriteRecipe(userId: string, recipeId: string) {
    const newRemoveFavourite: ToggleFavouriteRecipe = {
      userId,
      recipeId,
    };

    await addRemoveRecipeApi(newRemoveFavourite);

    dispatch({
      type: UserInteractionsTypes.REMOVE_RECIPE_FAVOURITE,
      payload: recipeId,
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
