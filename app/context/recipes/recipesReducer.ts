import { Recipe } from "@/types/recipes";
import { RecipesAction } from "./recipeActions";
import { RecipeActionTypes } from "./recipeActionTypes";

type RecipesState = {
  allRecipes: Recipe[];
  selectedRecipe: Partial<Recipe> | null;
  userRecipes: Recipe[];
};

export function recipesReducer(
  state: RecipesState,
  action: RecipesAction
): RecipesState {
  switch (action.type) {
    case RecipeActionTypes.SET_RECIPES:
      return { ...state, allRecipes: action.payload };
    case RecipeActionTypes.SET_USER_RECIPES:
      return { ...state, userRecipes: action.payload };
    case RecipeActionTypes.ADD_RECIPE:
      return { ...state, allRecipes: [...state.allRecipes, action.payload] };
    case RecipeActionTypes.DELETE_RECIPE:
      return {
        ...state,
        allRecipes: state.allRecipes.filter((recipe) => {
          return recipe.id !== action.payload;
        }),
        userRecipes: state.userRecipes?.filter(
          (recipe) => recipe.id !== action.payload
        ),
      };
    case RecipeActionTypes.RETRIEVE_RECIPE:
      return {
        ...state,
        selectedRecipe: { ...action.payload },
        allRecipes: [],
      };
    case RecipeActionTypes.FILTER_RECIPES_BY_NAME:
      return {
        ...state,
        allRecipes: action.payload,
      };
    case RecipeActionTypes.CLEAR_RECIPE:
      return {
        ...state,
        selectedRecipe: null,
      };

    default:
      return state;
  }
}

export const initialRecipesState: RecipesState = {
  allRecipes: [],
  selectedRecipe: {},
  userRecipes: [],
};
