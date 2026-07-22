import { Recipe } from "@/types/recipes";

export const mockRecipesContext = {
  stateAllRecipes: [] as Recipe[],
  stateRecipe: {},
  stateUserRecipes: [],
  createRecipe: jest.fn(),
  retrieveRecipesList: jest.fn(),
  deleteRecipe: jest.fn(),
  retrieveRecipe: jest.fn(),
  retrieveRecipesByFilterName: jest.fn(),
  retrieveRecipesByUserId: jest.fn(),
  clearStateRecipe: jest.fn(),
  toggleVisibleRecipe: jest.fn(),
  retrieveRecipeIngredients: jest.fn(),
  retrieveRecipesByIngredients: jest.fn(),
};
