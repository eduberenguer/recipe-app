"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNewRecipesApi,
  deleteRecipeApi,
  retrieveAllRecipesApi,
  retrieveRecipeByIdApi,
  retrieveRecipeIngredientsApi,
  retrieveRecipesByFilterNameApi,
  retrieveRecipesByIngredientsApi,
  retrieveRecipesByUserIdApi,
  toggleVisibleRecipeApi,
} from "@/lib/api/recipes";
import { recipeKeys, RecipesFilters } from "@/lib/queryKeys";

export function useRecipesQuery(filters: RecipesFilters = {}) {
  const { name, ingredients } = filters;

  return useQuery({
    queryKey: recipeKeys.list(filters),
    queryFn: () => {
      if (name) return retrieveRecipesByFilterNameApi(name);
      if (ingredients && ingredients.length > 0) {
        return retrieveRecipesByIngredientsApi(ingredients);
      }
      return retrieveAllRecipesApi();
    },
  });
}

export function useRecipeQuery(recipeId: string | undefined) {
  return useQuery({
    queryKey: recipeKeys.detail(recipeId ?? ""),
    queryFn: () => retrieveRecipeByIdApi(recipeId ?? ""),
    enabled: Boolean(recipeId),
  });
}

export function useUserRecipesQuery(userId: string | undefined) {
  return useQuery({
    queryKey: recipeKeys.byUser(userId ?? ""),
    queryFn: () => retrieveRecipesByUserIdApi(userId ?? ""),
    enabled: Boolean(userId),
  });
}

export function useRecipeIngredientsQuery() {
  return useQuery({
    queryKey: recipeKeys.ingredients(),
    queryFn: retrieveRecipeIngredientsApi,
  });
}

export function useCreateRecipeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipe: FormData) => createNewRecipesApi(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export function useDeleteRecipeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: string) => deleteRecipeApi(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export function useToggleVisibleRecipeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      newIsVisible,
    }: {
      recipeId: string;
      newIsVisible: boolean;
    }) => toggleVisibleRecipeApi(recipeId, newIsVisible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}
