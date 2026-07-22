export type RecipesFilters = {
  name?: string;
  ingredients?: string[];
};

export const recipeKeys = {
  all: ["recipes"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  list: (filters: RecipesFilters) => [...recipeKeys.lists(), filters] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
  detail: (recipeId: string) => [...recipeKeys.details(), recipeId] as const,
  byUser: (userId: string) => [...recipeKeys.all, "byUser", userId] as const,
  ingredients: () => [...recipeKeys.all, "ingredients"] as const,
};

export const userInteractionKeys = {
  favourites: (userId: string) => ["favourites", userId] as const,
  ratings: (recipeId: string) => ["ratings", recipeId] as const,
  hasRated: (userId: string, recipeId: string) =>
    ["hasRated", userId, recipeId] as const,
  comments: (recipeId: string) => ["comments", recipeId] as const,
  commentCount: (recipeId: string) => ["commentCount", recipeId] as const,
};
