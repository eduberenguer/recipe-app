import { Recipe } from "@/types/recipes";
import { UserInteractionsTypes } from "./userInteractionsTypes";

export type UserInteractionsAction =
  | {
      type: typeof UserInteractionsTypes.RETRIEVE_FAVOURITES;
      payload: Recipe[];
    }
  | {
      type: typeof UserInteractionsTypes.ADD_RECIPE_FAVOURITE;
      payload: Recipe;
    }
  | {
      type: typeof UserInteractionsTypes.REMOVE_RECIPE_FAVOURITE;
      payload: string;
    };
