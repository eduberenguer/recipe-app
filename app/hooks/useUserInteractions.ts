"use client";
import { useContext, useReducer, useState } from "react";
import {
  addFavouriteRecipeApi,
  addRecipeRatingApi,
  checkUserHasRatedApi,
  createCommentRecipeApi,
  removeRecipeApi,
  retrieveCommentCountByRecipeIdApi,
  retrieveCommentsRecipeApi,
  retrieveFavouritesApi,
  retrieveRecipeRatingsApi,
  sendMessageAiApi,
  sendMessageApi,
  toggleLikeCommentRecipeApi,
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
  CommentsRecipe,
  NewCommentRecipe,
  ToggleFavouriteRecipe,
  ToogleLikeCommentRecipe,
} from "@/types/userInteractions";
import { RecipesContext, RecipesContextType } from "../context/context";
import { AuthContext, AuthContextType } from "../context/context";
import { useEffect } from "react";
import { fetchPexelsImageUrl } from "../utils/pexelsImageUrl";
import { getUserLikedCommentIds } from "@/server/userInteractions";

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

  async function retrieveCommentsRecipe(
    userId: string,
    recipeId: string
  ): Promise<CommentsRecipe[]> {
    const allComments = await retrieveCommentsRecipeApi(recipeId);
    const likedIds = await getUserLikedCommentIds(userId);

    const withLikeFlags =
      allComments?.map((comment: CommentsRecipe) => ({
        ...comment,
        userHasLiked: likedIds.includes(comment.id),
      })) || [];

    return withLikeFlags;
  }

  async function createNewCommentRecipe(
    PartialNewCommentRecipe: Partial<NewCommentRecipe>
  ): Promise<{ success: boolean; error?: string }> {
    const newCommentRecipe: NewCommentRecipe = {
      content: PartialNewCommentRecipe.content!,
      userId: PartialNewCommentRecipe.userId!,
      recipeId: PartialNewCommentRecipe.recipeId!,
      commentLikes: 0,
    };

    const result = await createCommentRecipeApi(newCommentRecipe);

    return result;
  }

  async function toggleLikeCommentRecipe(
    toggleLikeCommentRecipe: ToogleLikeCommentRecipe
  ): Promise<{ success: boolean; error?: string }> {
    const result = await toggleLikeCommentRecipeApi(toggleLikeCommentRecipe);

    return result;
  }

  async function retrieveCommentCountByRecipeId(recipeId: string) {
    const totalComments: number = await retrieveCommentCountByRecipeIdApi(
      recipeId
    );

    return totalComments;
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
    setAiRecipe,
    retrieveCommentsRecipe,
    createNewCommentRecipe,
    toggleLikeCommentRecipe,
    retrieveCommentCountByRecipeId,
  };
}
