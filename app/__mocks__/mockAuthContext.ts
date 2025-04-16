export const mockAuthContext = {
  user: { id: "user123" },
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  stateUserRecipes: [],
  retrieveRecipesByUserId: jest.fn(),
  clearStateRecipe: jest.fn(),
};
