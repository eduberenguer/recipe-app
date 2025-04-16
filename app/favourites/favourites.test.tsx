import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../context/context";
import Favourites from "./page";
import { mockRecipeWithId } from "../__mocks__/recipe.mock";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props;
    return <img src={src || ""} alt={alt || ""} {...rest} />;
  },
}));

describe("Favourites component", () => {
  const mockRetrieveFavouritesList = {
    favouritesRecipesId: [],
    favouritesRecipes: [mockRecipeWithId],
    retrieveFavouritesList: jest.fn(),
    addFavouriteRecipe: jest.fn(),
    removeFavouriteRecipe: jest.fn(),
    dispatch: jest.fn(),
  };

  const mockRecipesContext = {
    stateAllRecipes: [],
    stateRecipe: null,
    stateUserRecipes: [],
    createRecipe: jest.fn(),
    updateRecipe: jest.fn(),
    deleteRecipe: jest.fn(),
    fetchAllRecipes: jest.fn(),
    fetchUserRecipes: jest.fn(),
    fetchRecipeById: jest.fn(),
    clearStateRecipe: jest.fn(),
    retrieveRecipesList: jest.fn(),
    retrieveRecipe: jest.fn(),
    retrieveRecipesByFilterName: jest.fn(),
    retrieveRecipesByUserId: jest.fn(),
  };

  const customRender = (user = { id: "user123", name: "Test User" }) => {
    const mockAuthContext = {
      user,
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    };

    return render(
      <RecipesContext.Provider value={mockRecipesContext}>
        <AuthContext.Provider value={mockAuthContext}>
          <UserInteractionsContext.Provider value={mockRetrieveFavouritesList}>
            <Favourites />
          </UserInteractionsContext.Provider>
        </AuthContext.Provider>
      </RecipesContext.Provider>
    );
  };

  it("should call retrieveFavouritesList on mount", async () => {
    customRender();

    await waitFor(() => {
      expect(
        mockRetrieveFavouritesList.retrieveFavouritesList
      ).toHaveBeenCalled();
    });
  });

  it("should call retrieveFavouritesList and render title after loading", async () => {
    customRender();

    expect(screen.getByText("Loading favourites...")).toBeInTheDocument();

    const title = await screen.findByText("My favourites recipes");

    expect(title).toBeInTheDocument();
    expect(
      mockRetrieveFavouritesList.retrieveFavouritesList
    ).toHaveBeenCalled();
  });

  it("should call toggleFavourite", async () => {
    const mockToggleFavourite = jest.fn();
    mockRetrieveFavouritesList.favouritesRecipes = [mockRecipeWithId];
    mockRetrieveFavouritesList.addFavouriteRecipe = mockToggleFavourite;
    mockRetrieveFavouritesList.removeFavouriteRecipe = mockToggleFavourite;

    customRender();

    await screen.findByText("My favourites recipes");

    const favouriteButton = screen.getByRole("paragraph", {
      name: "Toggle favourite",
    });

    fireEvent.click(favouriteButton);

    await waitFor(() => {
      expect(mockToggleFavourite).toHaveBeenCalled();
    });
  });
});
