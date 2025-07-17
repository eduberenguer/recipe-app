"use client";
import { useContext, useReducer, useState } from "react";
import {
  addFavouriteRecipeApi,
  addRecipeRatingApi,
  checkUserHasRatedApi,
  removeRecipeApi,
  retrieveFavouritesApi,
  retrieveRecipeRatingsApi,
  sendMessageAiApi,
  sendMessageApi,
} from "@/lib/api/userInteractions";
import {
  userInteractionsReducer,
  userInteractionsState,
} from "../context/userInteractions/userInteractionsReducer";
import { UserInteractionsTypes } from "../context/userInteractions/userInteractionsTypes";
import {
  Recipe,
  RecipeChefAI,
  RecipeRating,
  RecipeWithRating,
} from "@/types/recipes";
import {
  AddRecipeRating,
  BaseMessage,
  ToggleFavouriteRecipe,
} from "@/types/userInteractions";
import { RecipesContext, RecipesContextType } from "../context/context";
import { AuthContext, AuthContextType } from "../context/context";
import { useEffect } from "react";
import { fetchPexelsImageUrl } from "../utils/pexelsImageUrl";

export function useUserInteractions() {
  const initialUserInteractionsState: userInteractionsState = {
    favouritesRecipesId: [],
    favouritesRecipes: [],
  };

  const contextRecipes = useContext<RecipesContextType | null>(RecipesContext);
  const contextAuth = useContext<AuthContextType | null>(AuthContext);
  const [state, dispatch] = useReducer(
    userInteractionsReducer,
    initialUserInteractionsState
  );
  const [aiRecipe, setAiRecipe] = useState<RecipeChefAI | null>(null);

  async function retrieveFavouritesList(userId: string): Promise<Recipe[]> {
    const data: RecipeWithRating[] = await retrieveFavouritesApi(userId);

    dispatch({
      type: UserInteractionsTypes.RETRIEVE_FAVOURITES,
      payload: data,
    });

    return data;
  }

  async function addFavouriteRecipe(
    userId: string,
    recipeId: string
  ): Promise<Recipe | false> {
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

    return retrieveRecipe;
  }

  async function removeFavouriteRecipe(
    userId: string,
    recipeId: string
  ): Promise<ToggleFavouriteRecipe> {
    const newRemoveFavourite: ToggleFavouriteRecipe = {
      userId,
      recipeId,
    };

    await removeRecipeApi(newRemoveFavourite);

    dispatch({
      type: UserInteractionsTypes.REMOVE_RECIPE_FAVOURITE,
      payload: recipeId,
    });

    return newRemoveFavourite;
  }

  async function retrieveRecipeRatings(
    recipeId: string
  ): Promise<RecipeRating> {
    const data = await retrieveRecipeRatingsApi(recipeId);

    return {
      average: data.average,
      count: data.count,
    };
  }

  async function addRecipeRating(
    addRecipeRating: AddRecipeRating
  ): Promise<boolean> {
    await addRecipeRatingApi(addRecipeRating);

    return true;
  }

  async function checkUserHasRated(
    userId: string,
    recipeId: string
  ): Promise<boolean> {
    const response = await checkUserHasRatedApi(userId, recipeId);

    return response.alreadyRated;
  }

  async function sendMessage(
    fromUserId: string,
    toUserId: string,
    content: string
  ): Promise<BaseMessage> {
    const sendMessage = await sendMessageApi(fromUserId, toUserId, content);

    return sendMessage;
  }

  async function sendMessageAi(content: string): Promise<void> {
    const sendMessage = await sendMessageAiApi(content);
    const aiRecipe =
      typeof sendMessage === "string" ? JSON.parse(sendMessage) : sendMessage;

    let photoUrl = aiRecipe.photo;
    if (
      !photoUrl ||
      typeof photoUrl !== "string" ||
      !photoUrl.startsWith("http")
    ) {
      const firstIngredient = aiRecipe.ingredients?.[0]?.name || "food";
      photoUrl = await fetchPexelsImageUrl(firstIngredient);
    }

    aiRecipe.photo =
      photoUrl || "https://via.placeholder.com/320x240?text=No+Image";

    setAiRecipe(aiRecipe);
  }

  useEffect(() => {
    if (contextAuth?.user?.id) {
      retrieveFavouritesList(contextAuth.user.id);
    }
  }, [contextAuth?.user?.id]);

  return {
    favouritesRecipesId: state.favouritesRecipesId,
    favouritesRecipes: state.favouritesRecipes,
    retrieveFavouritesList,
    addFavouriteRecipe,
    removeFavouriteRecipe,
    dispatch,
    retrieveRecipeRatings,
    addRecipeRating,
    checkUserHasRated,
    sendMessage,
    sendMessageAi,
    aiRecipe,
  };
}
