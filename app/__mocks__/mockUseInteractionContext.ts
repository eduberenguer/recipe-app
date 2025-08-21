import { UserInteractionsContextType } from "../context/context";

export const mockUserInteractionContext: UserInteractionsContextType = {
  favouritesRecipesId: [],
  favouritesRecipes: [],
  retrieveFavouritesList: jest.fn(),
  addFavouriteRecipe: jest.fn(),
  removeFavouriteRecipe: jest.fn(),
  dispatch: jest.fn(),
  sendMessage: jest.fn(),
  retrieveRecipeRatings: jest.fn(),
  addRecipeRating: jest.fn(),
  checkUserHasRated: jest.fn(),
  sendMessageAi: jest.fn(),
  aiRecipe: null,
  setAiRecipe: jest.fn(),
  retrieveCommentsRecipe: jest.fn(),
  createNewCommentRecipe: jest.fn(),
  toggleLikeCommentRecipe: jest.fn(),
  retrieveCommentCountByRecipeId: jest.fn(),
};
