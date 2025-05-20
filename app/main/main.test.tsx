import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Main from "./page";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../context/context";
import checkOwnerRecipe from "../utils/checkOwnerRecipe";
import { mockUserInteractionContext } from "../__mocks__/mockUseInteractionContext";
import { mockRecipesContext } from "../__mocks__/mockRecipesContext";
import { mockAuthContext } from "../__mocks__/mockAuthContext";
import { mockRecipeWithIdv2 } from "../__mocks__/recipe.mock";

jest.mock("../utils/checkOwnerRecipe", () => jest.fn());

jest.mock("next/image", () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }
  ) => {
    const { src, alt, fill, ...rest } = props;
    return <img src={src || ""} alt={alt || ""} {...rest} />;
  },
}));

describe("Main component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockRecipesContext.stateAllRecipes =
      mockRecipeWithIdv2 as typeof mockRecipesContext.stateAllRecipes;
  });

  const customRender = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <RecipesContext.Provider value={mockRecipesContext}>
          <UserInteractionsContext.Provider value={mockUserInteractionContext}>
            <Main />
          </UserInteractionsContext.Provider>
        </RecipesContext.Provider>
      </AuthContext.Provider>
    );
  };

  it("main is render", () => {
    customRender();

    const titlePage = screen.getByText("🍽️ Recipes Collection");

    expect(titlePage).toBeInTheDocument();
  });

  it("should call retrieveRecipesList on mount", async () => {
    const mockRetrieveRecipesList = jest.fn();
    mockRecipesContext.retrieveRecipesList = mockRetrieveRecipesList;

    customRender();

    await waitFor(() => {
      expect(mockRetrieveRecipesList).toHaveBeenCalled();
    });
  });

  it("should render all recipes from the map", () => {
    (checkOwnerRecipe as jest.Mock).mockReturnValue(true);
    const mockDeleteRecipe = jest.fn();
    mockRecipesContext.deleteRecipe = mockDeleteRecipe;

    customRender();

    const recipeImage = screen.getByAltText("Test Recipe");

    expect(recipeImage).toHaveAttribute(
      "src",
      "undefined/recipe123/undefined/recipe123/test-photo.jpg"
    );
    expect(screen.getByAltText("Test Recipe")).toBeInTheDocument();
    expect(screen.getByAltText("Test Recipe 2")).toBeInTheDocument();

    const deleteButton = screen.getAllByRole("button", { name: /x/i });
    expect(deleteButton[0]).toBeInTheDocument();

    fireEvent.click(deleteButton[0]);
    expect(mockDeleteRecipe).toHaveBeenCalledWith("recipe123");
  });

  it("should not render delete button when user is not the owner", () => {
    (checkOwnerRecipe as jest.Mock).mockReturnValue(false);

    customRender();

    const deleteButtons = screen.queryAllByRole("button", { name: /x/i });
    expect(deleteButtons).toHaveLength(0);
  });

  it("should no recipes available", () => {
    (checkOwnerRecipe as jest.Mock).mockReturnValue(false);
    mockRecipesContext.stateAllRecipes = [];

    customRender();

    const loadingText = screen.getByText("No recipes available");

    expect(loadingText).toBeInTheDocument();
  });

  it("shoud work toggleFavourite", async () => {
    const mockToggleFavourite = jest.fn();
    mockUserInteractionContext.addFavouriteRecipe = mockToggleFavourite;
    mockUserInteractionContext.removeFavouriteRecipe = mockToggleFavourite;

    (checkOwnerRecipe as jest.Mock).mockReturnValue(true);

    customRender();

    const buttonToggleFavourite = await screen.getAllByRole("button", {
      name: "Toggle favourite",
    });

    fireEvent.click(buttonToggleFavourite[0]);

    await waitFor(() => {
      expect(mockToggleFavourite).toHaveBeenCalled();
    });
  });
});
