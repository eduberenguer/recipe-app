"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  toggleLikeCommentRecipeApi,
} from "@/lib/api/userInteractions";
import { getUserLikedCommentIds } from "@/server/userInteractions";
import { userInteractionKeys } from "@/lib/queryKeys";
import {
  AddRecipeRating,
  CommentsRecipe,
  NewCommentRecipe,
  ToogleLikeCommentRecipe,
} from "@/types/userInteractions";

export function useFavouritesQuery(userId: string | undefined) {
  return useQuery({
    queryKey: userInteractionKeys.favourites(userId ?? ""),
    queryFn: () => retrieveFavouritesApi(userId ?? ""),
    enabled: Boolean(userId),
  });
}

export function useAddFavouriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, recipeId }: { userId: string; recipeId: string }) =>
      addFavouriteRecipeApi({ userId, recipeId }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: userInteractionKeys.favourites(variables.userId),
      });
    },
  });
}

export function useRemoveFavouriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, recipeId }: { userId: string; recipeId: string }) =>
      removeRecipeApi({ userId, recipeId }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: userInteractionKeys.favourites(variables.userId),
      });
    },
  });
}

export function useRecipeRatingsQuery(recipeId: string | undefined) {
  return useQuery({
    queryKey: userInteractionKeys.ratings(recipeId ?? ""),
    queryFn: () => retrieveRecipeRatingsApi(recipeId ?? ""),
    enabled: Boolean(recipeId),
  });
}

export function useCheckUserHasRatedQuery(
  userId: string | undefined,
  recipeId: string | undefined,
) {
  return useQuery({
    queryKey: userInteractionKeys.hasRated(userId ?? "", recipeId ?? ""),
    queryFn: async () => {
      const response = await checkUserHasRatedApi(userId ?? "", recipeId ?? "");
      return response.alreadyRated as boolean;
    },
    enabled: Boolean(userId) && Boolean(recipeId),
  });
}

export function useAddRecipeRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addRecipeRating: AddRecipeRating) =>
      addRecipeRatingApi(addRecipeRating),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: userInteractionKeys.ratings(variables.recipeId),
      });
      queryClient.invalidateQueries({
        queryKey: userInteractionKeys.hasRated(
          variables.userId,
          variables.recipeId,
        ),
      });
    },
  });
}

export function useCommentsQuery(userId: string, recipeId: string | undefined) {
  return useQuery({
    queryKey: userInteractionKeys.comments(recipeId ?? ""),
    queryFn: async () => {
      const [allComments, likedIds] = await Promise.all([
        retrieveCommentsRecipeApi(recipeId ?? ""),
        getUserLikedCommentIds(userId ?? ""),
      ]);

      return (allComments ?? []).map((comment: CommentsRecipe) => ({
        ...comment,
        userHasLiked: likedIds.includes(comment.id),
      }));
    },
    enabled: Boolean(recipeId),
  });
}

export function useCreateCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCommentRecipe: NewCommentRecipe) =>
      createCommentRecipeApi(newCommentRecipe),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: userInteractionKeys.comments(variables.recipeId),
      });
      queryClient.invalidateQueries({
        queryKey: userInteractionKeys.commentCount(variables.recipeId),
      });
    },
  });
}

export function useToggleCommentLikeMutation(recipeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (toggleLikeCommentRecipe: ToogleLikeCommentRecipe) =>
      toggleLikeCommentRecipeApi(toggleLikeCommentRecipe),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userInteractionKeys.comments(recipeId),
      });
    },
  });
}

export function useCommentCountQuery(recipeId: string | undefined) {
  return useQuery({
    queryKey: userInteractionKeys.commentCount(recipeId ?? ""),
    queryFn: () => retrieveCommentCountByRecipeIdApi(recipeId ?? ""),
    enabled: Boolean(recipeId),
    initialData: 0,
  });
}
