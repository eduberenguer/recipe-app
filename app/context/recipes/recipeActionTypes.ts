export const RecipeActionTypes = {
  SET_RECIPES: "SET_RECIPES",
  ADD_RECIPE: "ADD_RECIPE",
  UPDATE_RECIPE: "UPDATE_RECIPE",
  DELETE_RECIPE: "DELETE_RECIPE",
  RETRIEVE_RECIPE: "RETRIEVE_RECIPE",
  FILTER_RECIPES_BY_NAME: "FILTER_RECIPES_BY_NAME",
  SET_USER_RECIPES: "SET_USER_RECIPES",
  CLEAR_RECIPE: "CLEAR_RECIPE",
} as const;

export type RecipeActionType =
  (typeof RecipeActionTypes)[keyof typeof RecipeActionTypes];
