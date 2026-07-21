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
import { retrieveFavourites } from "@/server/userInteractions";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props;
    return <img src={src || ""} alt={alt || ""} {...rest} />;
  },
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/server/userInteractions", () => ({
  retrieveFavourites: jest.fn(),
}));

describe("Favourites component", () => {
  const mockAuthContext = {
    user: { id: "user123", name: "Test User" },
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };

  const mockCookie = (
    authUser: { id: string; name: string } | null = {
      id: "user123",
      name: "Test User",
    },
  ) => {
    const { cookies } = jest.requireMock("next/headers");
    (cookies as jest.Mock).mockResolvedValue({
      get: () => (authUser ? { value: JSON.stringify(authUser) } : undefined),
    });
  };

  const customRender = async () => {
    const ui = await Favourites();

    return render(
      <RecipesContext.Provider value={mockRecipesContext}>
        <AuthContext.Provider value={mockAuthContext}>
          <UserInteractionsContext.Provider value={mockUserInteractionContext}>
            {ui}
          </UserInteractionsContext.Provider>
        </AuthContext.Provider>
      </RecipesContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookie();
    (retrieveFavourites as jest.Mock).mockResolvedValue([]);
  });

  it("should read the userId from the authUser cookie and call retrieveFavourites", async () => {
    await customRender();

    expect(retrieveFavourites).toHaveBeenCalledWith("user123");
  });

  it("should render the title and the favourite recipes", async () => {
    (retrieveFavourites as jest.Mock).mockResolvedValue([mockRecipeWithIdv1]);

    await customRender();

    expect(screen.getByText("My favourites recipes")).toBeInTheDocument();
    expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
  });

  it("should render 'No recipes available' when there is no authUser cookie", async () => {
    mockCookie(null);

    await customRender();

    expect(retrieveFavourites).not.toHaveBeenCalled();
    expect(screen.getByText("No recipes available")).toBeInTheDocument();
  });

  it("should call removeFavouriteRecipe when toggling a favourite", async () => {
    (retrieveFavourites as jest.Mock).mockResolvedValue([mockRecipeWithIdv1]);

    await customRender();

    const favouriteButton = screen.getByRole("button", {
      name: "Toggle favourite",
    });

    fireEvent.click(favouriteButton);

    await waitFor(() => {
      expect(
        mockUserInteractionContext.removeFavouriteRecipe,
      ).toHaveBeenCalledWith("user123", mockRecipeWithIdv1.id);
    });
  });
});
