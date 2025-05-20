export const mockUserInteractionContext = {
  favouritesRecipesId: [],
  favouritesRecipes: [],
  retrieveFavouritesList: jest.fn(),
  addFavouriteRecipe: jest.fn(),
  removeFavouriteRecipe: jest.fn(),
  isRecipeFavourite: jest.fn(),
  dispatch: jest.fn(),
  sendMessage: jest.fn(),
  retrieveRecipeRatings: jest.fn(),
  addRecipeRating: jest.fn(),
  checkUserHasRated: jest.fn(),
};
