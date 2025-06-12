export const UserInteractionsTypes = {
  RETRIEVE_FAVOURITES: "RETRIEVE_FAVOURITES",
  ADD_RECIPE_FAVOURITE: "ADD_RECIPE_FAVOURITES",
  REMOVE_RECIPE_FAVOURITE: "REMOVE_RECIPE_FAVOURITE",
} as const;

export type UserInteractionsTypes =
  (typeof UserInteractionsTypes)[keyof typeof UserInteractionsTypes];
