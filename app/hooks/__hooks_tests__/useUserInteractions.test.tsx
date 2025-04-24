import { act, renderHook } from "@testing-library/react";
import { mockRecipesContext } from "@/app/__mocks__/mockRecipesContext";

import { RecipesContext, UserInteractionsContext } from "@/app/context/context";
import { useUserInteractions } from "../useUserInteractions";
import { mockUserInteractionContext } from "@/app/__mocks__/mockUseInteractionContext";
import { mockRecipeWithIdv1 } from "@/app/__mocks__/recipe.mock";
import {
  addFavouriteRecipeApi,
  retrieveFavouritesApi,
  removeRecipeApi,
  retrieveRecipeRatingsApi,
  addRecipeRatingApi,
  checkUserHasRatedApi,
} from "@/lib/api/userInteractions";
import { mockAddRecipeRating } from "@/app/__mocks__/mockAddRecipeRating";

jest.mock("@/lib/api/userInteractions", () => ({
  addFavouriteRecipeApi: jest.fn().mockResolvedValue(true),
  retrieveFavouritesApi: jest.fn(),
  removeRecipeApi: jest.fn().mockResolvedValue(undefined),
  retrieveRecipeRatingsApi: jest.fn().mockResolvedValue({
    average: 4.5,
    count: 10,
  }),
  addRecipeRatingApi: jest.fn().mockResolvedValue({
    average: 4.5,
    count: 10,
  }),
  checkUserHasRatedApi: jest.fn().mockResolvedValue({ alreadyRated: true }),
}));

describe("UseUserInteractions test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecipesContext.Provider value={mockRecipesContext}>
      <UserInteractionsContext.Provider value={mockUserInteractionContext}>
        {children}
      </UserInteractionsContext.Provider>{" "}
    </RecipesContext.Provider>
  );

  it("UseUserInteractions is render", async () => {
    (retrieveFavouritesApi as jest.Mock).mockResolvedValue([
      mockRecipeWithIdv1,
    ]);

    const { result } = renderHook(() => useUserInteractions(), {
      wrapper,
    });

    await act(async () => {
      await result.current.retrieveFavouritesList("user123");
    });

    expect(retrieveFavouritesApi).toHaveBeenCalledWith("user123");
    expect(result.current.favouritesRecipes.length).toBe(1);
    expect(result.current.favouritesRecipes[0].id).toBe("recipe123");
  });

  it("addFavourite work is render", async () => {
    mockRecipesContext.retrieveRecipe = jest
      .fn()
      .mockResolvedValue(mockRecipeWithIdv1);

    const { result } = renderHook(() => useUserInteractions(), {
      wrapper,
    });

    await act(async () => {
      await result.current.addFavouriteRecipe("user123", "recipe123");
    });

    expect(addFavouriteRecipeApi).toHaveBeenCalledWith({
      recipeId: "recipe123",
      userId: "user123",
    });

    expect(mockRecipesContext.retrieveRecipe).toHaveBeenCalledWith("recipe123");
    expect(result.current.favouritesRecipes.length).toBe(1);
    expect(result.current.favouritesRecipes[0].id).toBe("recipe123");
  });

  it("addFavourite return recipe not found", async () => {
    mockRecipesContext.retrieveRecipe = jest.fn().mockResolvedValue(false);

    const { result } = renderHook(() => useUserInteractions(), {
      wrapper,
    });

    await act(async () => {
      await result.current.addFavouriteRecipe("user123", "recipe-not-found");
    });

    expect(addFavouriteRecipeApi).toHaveBeenCalledWith({
      recipeId: "recipe-not-found",
      userId: "user123",
    });
  });

  it("removeRecipe is call", async () => {
    mockUserInteractionContext.favouritesRecipes = [mockRecipeWithIdv1];
    mockUserInteractionContext.favouritesRecipesId = [mockRecipeWithIdv1.id];

    const { result } = renderHook(() => useUserInteractions(), {
      wrapper,
    });

    await act(async () => {
      await result.current.removeFavouriteRecipe("user123", "recipe456");
    });

    expect(removeRecipeApi).toHaveBeenCalledWith({
      recipeId: "recipe456",
      userId: "user123",
    });
  });

  it("retrieve recipe rating is call", async () => {
    mockUserInteractionContext.retrieveRecipeRatings = jest
      .fn()
      .mockResolvedValue({
        average: 4.5,
        count: 10,
      });

    const { result } = renderHook(() => useUserInteractions(), {
      wrapper,
    });

    await act(async () => {
      await result.current.retrieveRecipeRatings("recipe456");
    });

    expect(retrieveRecipeRatingsApi).toHaveBeenCalledWith("recipe456");
  });

  it("add recipe rating is call and return true", async () => {
    mockUserInteractionContext.addRecipeRating = jest
      .fn()
      .mockResolvedValue(true);

    const { result } = renderHook(() => useUserInteractions(), {
      wrapper,
    });

    await act(async () => {
      await result.current.addRecipeRating(mockAddRecipeRating);
    });

    expect(addRecipeRatingApi).toHaveBeenCalledWith(mockAddRecipeRating);
  });

  it("check user rated is call", async () => {
    mockUserInteractionContext.checkUserHasRated = jest
      .fn()
      .mockResolvedValue(true);

    const { result } = renderHook(() => useUserInteractions(), {
      wrapper,
    });

    await act(async () => {
      await result.current.checkUserHasRated("user123", "recipe123");
    });

    expect(checkUserHasRatedApi).toHaveBeenCalledWith("user123", "recipe123");
  });
});
