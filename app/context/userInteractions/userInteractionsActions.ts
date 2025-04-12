import { Recipe } from "@/types";
import { UserInteractionsTypes } from "./userInteractionsTypes";

export type UserInteractionsAction =
  | {
      type: typeof UserInteractionsTypes.ADD_RECIPE_FAVOURITE;
      payload: string;
    }
  | {
      type: typeof UserInteractionsTypes.SET_INITIAL_FAVOURITES;
      payload: string[];
    }
  | {
      type: typeof UserInteractionsTypes.SET_FAVOURITES_LIST;
      payload: Recipe[];
    };
