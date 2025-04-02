import { Recipe } from "@/types";
import { RecipeActionTypes } from "./recipeActionTypes";

export type RecipesAction =
  | { type: typeof RecipeActionTypes.SET_RECIPES; payload: Recipe[] }
  | { type: typeof RecipeActionTypes.ADD_RECIPE; payload: Recipe }
  | { type: typeof RecipeActionTypes.DELETE_RECIPE; payload: string }
  | { type: typeof RecipeActionTypes.RETRIEVE_RECIPE; payload: Recipe }
  | {
      type: typeof RecipeActionTypes.FILTER_RECIPES_BY_NAME;
      payload: Recipe[];
    };
