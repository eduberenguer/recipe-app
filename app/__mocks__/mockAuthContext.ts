export const mockAuthContext = {
  user: { id: "user123", name: "John" },
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  stateUserRecipes: [],
  retrieveRecipesByUserId: jest.fn(),
  clearStateRecipe: jest.fn(),
};
