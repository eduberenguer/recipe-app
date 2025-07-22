import { mockRecipesContext } from "@/app/__mocks__/mockRecipesContext";
import { RecipesContext } from "@/app/context/context";
import { useRecipes } from "../useRecipe";
import { act, renderHook } from "@testing-library/react";
import {
  createNewRecipesApi,
  deleteRecipeApi,
  retrieveAllRecipesApi,
  retrieveRecipeByIdApi,
  retrieveRecipesByFilterNameApi,
  retrieveRecipesByUserIdApi,
} from "@/lib/api/recipes";

jest.mock("@/lib/api/recipes", () => ({
  createNewRecipesApi: jest
    .fn()
    .mockResolvedValue({ id: "1", title: "Test Recipe" }),
  retrieveAllRecipesApi: jest.fn().mockResolvedValue([
    { id: "1", title: "Test Recipe" },
    { id: "2", title: "Test Recipe 2" },
  ]),
  retrieveRecipeByIdApi: jest
    .fn()
    .mockResolvedValue({ id: "1", title: "Test Recipe" }),
  deleteRecipeApi: jest.fn().mockResolvedValue(true),
  retrieveRecipesByFilterNameApi: jest
    .fn()
    .mockResolvedValue([{ id: "1", title: "Test Recipe" }]),
  retrieveRecipesByUserIdApi: jest
    .fn()
    .mockResolvedValue([{ id: "1", title: "Test Recipe" }]),
  retrieveRecipeIngredientsApi: jest.fn().mockResolvedValue([]),
}));

describe("useRecipes test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecipesContext.Provider value={mockRecipesContext}>
      {children}
    </RecipesContext.Provider>
  );

  it("should create a new recipe", async () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    await act(async () => {
      const recipeData = new FormData();
      recipeData.append("title", "Test Recipe");
      await result.current.createRecipe(recipeData);
    });

    expect(createNewRecipesApi).toHaveBeenCalled();
    expect(result.current.stateAllRecipes.length).toBe(1);
    expect(result.current.stateAllRecipes[0].title).toBe("Test Recipe");
  });

  it("should return all recipes", async () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    await act(async () => {
      await result.current.retrieveRecipesList();
    });

    expect(retrieveAllRecipesApi).toHaveBeenCalled();
    expect(result.current.stateAllRecipes.length).toBe(2);
    expect(result.current.stateAllRecipes[1].title).toBe("Test Recipe 2");
  });

  it("should delete recipe", async () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    await act(async () => {
      await result.current.deleteRecipe("1");
    });

    expect(deleteRecipeApi).toHaveBeenCalled();
    expect(result.current.stateAllRecipes.length).toBe(0);
  });

  it("should retrieve recipe", async () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    await act(async () => {
      await result.current.retrieveRecipe("1");
    });

    expect(retrieveRecipeByIdApi).toHaveBeenCalledWith("1");
  });

  it("should retrieve recipe by name", async () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    await act(async () => {
      await result.current.retrieveRecipesByFilterName("Pasta");
    });

    expect(retrieveRecipesByFilterNameApi).toHaveBeenCalled();
    expect(result.current.stateAllRecipes[0].title).toBe("Test Recipe");
  });

  it("should retrieve recipe by id", async () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    await act(async () => {
      const recipeData = new FormData();
      recipeData.append("title", "Test Recipe");
      await result.current.createRecipe(recipeData);
      await result.current.retrieveRecipesByUserId("user123");
    });

    expect(retrieveRecipesByUserIdApi).toHaveBeenCalled();
    expect(result.current.stateAllRecipes.length).toBe(1);
    expect(result.current.stateAllRecipes[0].title).toBe("Test Recipe");
  });
});
