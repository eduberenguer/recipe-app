import { Recipe } from "@/types/recipes";
import { UserInteractionsAction } from "./userInteractionsActions";
import { UserInteractionsTypes } from "./userInteractionsTypes";

type userInteractionsState = {
  favouritesRecipesId: string[];
  favouritesRecipes: Recipe[];
};

export function userInteractionsReducer(
  state: userInteractionsState,
  action: UserInteractionsAction
): userInteractionsState {
  switch (action.type) {
    case UserInteractionsTypes.RETRIEVE_FAVOURITES:
      return {
        ...state,
        favouritesRecipes: action.payload,
      };
    case UserInteractionsTypes.ADD_RECIPE_FAVOURITE:
      return {
        ...state,
        favouritesRecipes: [...state.favouritesRecipes, action.payload],
        favouritesRecipesId: [...state.favouritesRecipesId, action.payload.id],
      };
    case UserInteractionsTypes.REMOVE_RECIPE_FAVOURITE:
      return {
        ...state,
        favouritesRecipes: state.favouritesRecipes.filter(
          (recipe) => recipe.id !== action.payload
        ),
        favouritesRecipesId: state.favouritesRecipesId.filter(
          (id) => id !== action.payload
        ),
      };
    default:
      return state;
  }
}

export const initialUserInteractionsState: userInteractionsState = {
  favouritesRecipesId: [],
  favouritesRecipes: [],
};
