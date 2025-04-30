export type ToggleFavouriteRecipe = {
  userId: string;
  recipeId: string;
};

export type AddRecipeRating = {
  userId: string;
  recipeId: string;
  rating: number;
};

export type Message = {
  id: string;
  content: string;
  from: string;
};
