import { Recipe } from "@/types/recipes";

export const mockUserInteractionContext = {
  favouritesRecipesId: [] as string[],
  favouritesRecipes: [] as Recipe[],
  retrieveFavouritesList: jest.fn(),
  addFavouriteRecipe: jest.fn(),
  removeFavouriteRecipe: jest.fn(),
  dispatch: jest.fn(),
};
