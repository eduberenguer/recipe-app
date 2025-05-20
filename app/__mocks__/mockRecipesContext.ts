import { Unity } from "@/types/recipes";

export const mockRecipesContext = {
  stateAllRecipes: [] as Array<{
    id: string;
    owner: string;
    title: string;
    servings: number;
    ingredients: Array<{ name: string; quantity: number; unity: Unity }>;
    photo: string;
    favouritesCounter: number;
    description: string;
    views: number;
  }>,
  stateRecipe: {},
  stateUserRecipes: [],
  createRecipe: jest.fn(),
  retrieveRecipesList: jest.fn(),
  deleteRecipe: jest.fn(),
  retrieveRecipe: jest.fn(),
  retrieveRecipesByFilterName: jest.fn(),
  retrieveRecipesByUserId: jest.fn(),
  clearStateRecipe: jest.fn(),
};
