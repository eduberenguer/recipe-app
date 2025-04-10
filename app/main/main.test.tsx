import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Main from "./page";
import { AuthContext, RecipesContext } from "../context/context";
import { Unity } from "@/types";
import checkOwnerRecipe from "../utils/check.owner.recipe";

jest.mock("../utils/check.owner.recipe", () => jest.fn());

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props;
    return <img src={src || ""} alt={alt || ""} {...rest} />;
  },
}));

describe("Main component", () => {
  const mockDeleteRecipe = jest.fn();
  const mockRetrieveRecipesList = jest.fn();

  const mockAuthContext = {
    user: { id: "user123" },
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };

  const mockRecipesContext = {
    stateAllRecipes: [
      {
        id: "recipe123",
        owner: "user123",
        title: "Test Recipe",
        servings: 4,
        ingredients: [
          {
            name: "potatoes",
            quantity: 123,
            unity: "gr" as Unity,
          },
        ],
        photo: "test-photo.jpg",
        description: "This is a test recipe description.",
      },
      {
        id: "recipe456",
        owner: "user123",
        title: "Test Recipe 2",
        servings: 2,
        ingredients: [
          {
            name: "tomates",
            quantity: 12,
            unity: "gr" as Unity,
          },
        ],
        photo: "test-photo.jpg",
        description: "This is a other test recipe description.",
      },
    ],
    stateRecipe: {},
    createRecipe: jest.fn(),
    retrieveRecipesList: mockRetrieveRecipesList,
    deleteRecipe: mockDeleteRecipe,
    retrieveRecipe: jest.fn(),
    retrieveRecipesByFilterName: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Main is render", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RecipesContext.Provider value={mockRecipesContext}>
          <Main />
        </RecipesContext.Provider>
      </AuthContext.Provider>
    );

    const titlePage = screen.getByText("Recipes Collection");

    expect(titlePage).toBeInTheDocument();
  });

  it("should call retrieveRecipesList on mount", async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RecipesContext.Provider value={mockRecipesContext}>
          <Main />
        </RecipesContext.Provider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(mockRetrieveRecipesList).toHaveBeenCalled();
    });
  });

  it("should render all recipes from the map", () => {
    (checkOwnerRecipe as jest.Mock).mockImplementation(
      (userId, ownerId) => userId === ownerId
    );

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RecipesContext.Provider value={mockRecipesContext}>
          <Main />
        </RecipesContext.Provider>
      </AuthContext.Provider>
    );

    const deleteButton = screen.getAllByRole("button", { name: /x/i });
    expect(deleteButton[0]).toBeInTheDocument();

    fireEvent.click(deleteButton[0]);
    expect(mockDeleteRecipe).toHaveBeenCalledWith("recipe123");
  });

  it("should not render delete button when user is not the owner", () => {
    (checkOwnerRecipe as jest.Mock).mockImplementation(
      (userId, ownerId) => userId !== ownerId
    );

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RecipesContext.Provider value={mockRecipesContext}>
          <Main />
        </RecipesContext.Provider>
      </AuthContext.Provider>
    );

    const deleteButtons = screen.queryAllByRole("button", { name: /x/i });
    expect(deleteButtons).toHaveLength(0);
  });

  it("should no recipes available", () => {
    (checkOwnerRecipe as jest.Mock).mockReturnValue(false);
    mockRecipesContext.stateAllRecipes = [];

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RecipesContext.Provider value={mockRecipesContext}>
          <Main />
        </RecipesContext.Provider>
      </AuthContext.Provider>
    );

    const loadingText = screen.getByText("No recipes available");

    expect(loadingText).toBeInTheDocument();
  });
});
