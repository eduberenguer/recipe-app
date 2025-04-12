import { Recipe } from "@/types";
import { UserInteractionsAction } from "./userInteractionsActions";
import { UserInteractionsTypes } from "./userInteractionsTypes";

type userInteractionsState = {
  favourites: string[];
  favouritesList: Recipe[];
};

export function userInteractionsReducer(
  state: userInteractionsState,
  action: UserInteractionsAction
): userInteractionsState {
  switch (action.type) {
    case UserInteractionsTypes.SET_INITIAL_FAVOURITES:
      return {
        ...state,
        favourites: action.payload,
      };
    case UserInteractionsTypes.ADD_RECIPE_FAVOURITE:
      return {
        ...state,
        favourites: [...state.favourites, action.payload],
      };
    case UserInteractionsTypes.SET_FAVOURITES_LIST:
      return {
        ...state,
        favouritesList: action.payload,
      };
    default:
      return state;
  }
}

export const initialUserInteractionsState: userInteractionsState = {
  favourites: [],
  favouritesList: [],
};
