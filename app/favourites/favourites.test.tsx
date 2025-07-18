import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../context/context";
import Favourites from "./page";
import { mockRecipeWithIdv1 } from "../__mocks__/recipe.mock";
import { mockRecipesContext } from "../__mocks__/mockRecipesContext";
import { mockUserInteractionContext } from "../__mocks__/mockUseInteractionContext";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props;
    return <img src={src || ""} alt={alt || ""} {...rest} />;
  },
}));

describe("Favourites component", () => {
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
          <UserInteractionsContext.Provider value={mockUserInteractionContext}>
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
        mockUserInteractionContext.retrieveFavouritesList
      ).toHaveBeenCalled();
    });
  });

  it("should call retrieveFavouritesList and render title after loading", async () => {
    customRender();

    const title = await screen.findByText("My favourites recipes");

    expect(title).toBeInTheDocument();
    expect(
      mockUserInteractionContext.retrieveFavouritesList
    ).toHaveBeenCalled();
  });

  it("should call toggleFavourite", async () => {
    const mockToggleFavourite = jest.fn();
    mockUserInteractionContext.favouritesRecipes = [mockRecipeWithIdv1];
    mockUserInteractionContext.addFavouriteRecipe = mockToggleFavourite;
    mockUserInteractionContext.removeFavouriteRecipe = mockToggleFavourite;

    customRender();

    await screen.findByText("My favourites recipes");

    const favouriteButton = screen.getByRole("button", {
      name: "Toggle favourite",
    });

    fireEvent.click(favouriteButton);

    await waitFor(() => {
      expect(mockToggleFavourite).toHaveBeenCalled();
    });
  });
});
