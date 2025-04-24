import { RecipeWithRating } from "@/types/recipes";

export const mockUserInteractionContext = {
  favouritesRecipesId: [] as string[],
  favouritesRecipes: [] as RecipeWithRating[],
  retrieveFavouritesList: jest.fn(),
  addFavouriteRecipe: jest.fn(),
  removeFavouriteRecipe: jest.fn(),
  retrieveRecipeRatings: jest.fn(),
  addRecipeRating: jest.fn(),
  checkUserHasRated: jest.fn(),
  dispatch: jest.fn(),
};
